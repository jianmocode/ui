
let fs = require('fs-extra');
let path = require('path');
let crc = require('crc');
let request = require('request');
let gutil = require('gulp-util');
let ts = 0;

class Base {
	constructor( options )  {
		options = options || {};
		options['ignore'] = options['ignore'] || /^\./;
		options['cache'] =  options['cache'] || path.resolve(__dirname, '../../.cache');
		this.options = options;

	}

	needUpdate( src, dst ) {
		var s = crc.crc32(fs.readFileSync(src)).toString(16);
		var d = crc.crc32(fs.readFileSync(dst)).toString(16);
		return s !== d;
	};


	/**
	 * 向 API 地址发送 POST 请求
	 * @param  {[type]} api     [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	post (  api,  options ) {
		
		let that = this;
		options = options || {};
		options['type'] = options['type'] || 'json'
		options['datatype'] = options['datatype'] || 'form'

		var _data = options['data'] || {};
		var _query = options['query'] || {};

		if ( typeof options['query'] == 'object' )  delete options['query'];
		if ( typeof options['data'] == 'object' )  delete options['data'];

		return new Promise(function( resolve, reject ) {


			var opt = Object.assign(options, {url:api, formData:_data});

			
			request.post( opt, function callback( err, httpResponse, body ) {

				httpResponse = httpResponse || {};

				if ( that.options['debug'] === true ) {
					gutil.log( '========== DEBUG HTTP RESPONSE CODE: ' , httpResponse.statusCode ,  "==============");
					gutil.log( '========== DEBUG HTTP RESPONSE BODY:  ==================\n' , body, "\n===================================================================");
				}

				if ( err  || httpResponse.statusCode !== 200) {
					if ( err == null ) {
						reject({
							code:httpResponse.statusCode, 
							message:'返回值错误', 
							extra:{statusCode:httpResponse.statusCode, body:body}
						});
						return;
					}
					reject( err );
				}

				if ( options['type'] == 'json' && body !== null ) {
					try {
						var parsedData = JSON.parse(body);
						if ( typeof parsedData['code'] != 'undefined' && typeof parsedData['message'] != 'undefined' ) {
							reject({
								code: parsedData['code'], 
								message:parsedData['message'], 
								extra:{statusCode:httpResponse.statusCode, body:body}
							});
							return;
						}

						resolve( parsedData );
					} catch (e) {
						e.message = 'JSON Parse Error ' + e.message;
						reject( e );
					}
				} else {
					resolve(parsedData);
				}
			});

		});
	}

	fileGetContent( file ) {

		return new Promise( function(resolve, reject ) {
			fs.readFile(file, 'binary', function(err, fileData ) {
				if ( err ) { 
					reject(err);
					return;
				}
				resolve({data: fileData, mime:mime.lookup(file), name:path.basename(file)});
			});
		})
	}


	isIgnored( dir, file, ignore = null ) {
		let that = this;
		if ( ignore === null ) {
			ignore = that.options.ignore;
		}

		if ( ignore ) {
			if ( Array.isArray( ignore ) ) {
				return ignore.some( function( filter ) {
					return that.isIgnored(dir, file, filter);
				});
			} else {
				var t = typeof ignore;
				if ( t === 'function' ) {
					return ignore( dir, file );
				} else if ( t === 'string' ) {
					return ignore === file;
				} else {
					var matches = ignore.exec( file ); // regular expression
					matches = matches || false;
					// console.log( file, ignore , matches,  matches && matches.length > 0);
					return matches && matches.length > 0;
				}
			}
		}
		return false;
	};

	eachUpdate(src, dst, callback=function(){} ) {
		let that = this;
		let leaves = fs.readdirSync( src );
		leaves.forEach( function( leaf ) {
			if ( that.isIgnored(  src, leaf ) ) {
				return;
			}

			let leafSrc = path.join( src, leaf );
			let leafDst = path.join( dst, leaf );
			let cacheSrc = path.join( that.options['cache'] , leafDst );
			let existsCache = fs.existsSync( cacheSrc );
			let statSrc = fs.statSync( leafSrc );

			if ( statSrc.isFile() ) {

				if ( !existsCache ) {
					
					that.remoteUpload(  leafSrc, leafDst )

						.then( function( resp ) {
							
							fs.copySync( leafSrc, cacheSrc, { force: true } ); // 创建文件
							callback(leafSrc, leafDst, 'created' );
						})
						.catch(function(error) {
							callback(leafSrc, leafDst, 'error', error );
						});

				} else {
					
					let statCache = fs.statSync( cacheSrc );

					if ( statCache.isDirectory() ) {  // 原为文件夹, 删除原文件夹
						
						that.remoteDelete( leafDst )

							.then(function(){
								fs.removeSync( cacheSrc );		
							})
							.catch(function(error) {
								callback(leafSrc, leafDst, 'error', error );
							});

					} else if ( statCache.isFile() ) {   // 原来为文件
						if ( that.needUpdate( leafSrc, cacheSrc ) ) {  // 检查是否需要更新
							
							that.remoteUpload(  leafSrc, leafDst )

								.then( function( resp ) {

									fs.copySync( leafSrc, cacheSrc, { force: true } );   // 更新文件
									callback(leafSrc, leafDst, 'updated' );
								})
								.catch(function(error) {
									callback(leafSrc, leafDst, 'error', error );
								});
							
						} else {
							callback(leafSrc, leafDst, 'notchange' );
						}
					}
				}

			} else if ( statSrc.isDirectory() ) {
				if ( !existsCache ) {
					fs.mkdirsSync( cacheSrc );
				}

				setTimeout(function(){
					that.eachUpdate( leafSrc,  leafDst, callback );
				},ts);

			}
		});
	};

	eachRemove(src, dst, callback=function(){} ) {
		let that = this;
		let cacheSrc =  path.join( that.options['cache'] , dst );
		let existsCache = fs.existsSync( cacheSrc );
		if ( !existsCache ) {
			return;
		}

		let leaves = fs.readdirSync( cacheSrc);
		leaves.forEach( function( leaf ) {
			if ( that.isIgnored(  src, leaf ) ) {
				return;
			}

			let leafSrc = path.join( src, leaf );
			let leafDst = path.join( dst, leaf );
			let cacheSrc = path.join( that.options['cache'] , leafDst );
			let existsCache = fs.existsSync( cacheSrc );

			if ( !fs.existsSync( leafSrc ) ) {
				
				that.remoteDelete( leafDst ) // exists in dst but not src - remove it

					.then(function(){
						fs.removeSync( cacheSrc ); 	
						callback(leafSrc, leafDst, 'removed' );
					})
					.catch(function(error) {
						callback(leafSrc, leafDst, 'error', error );
					});

			} else {
				let statSrc = fs.statSync( leafSrc );
				let statCache = fs.statSync( cacheSrc );
				if ( statSrc.isFile() !== statCache.isFile() || statSrc.isDirectory() !== statCache.isDirectory() ) {
					fs.removeSync( leafDst ); // make sure they are the same type, else remove it
					that.remoteDelete( leafDst ) // exists in dst but not src - remove it

						.then(function(){
							fs.removeSync( cacheSrc ); 	
						})

						.catch(function(error) {
							callback(leafSrc, leafDst, 'error', error );
						});

				} else if ( statCache.isDirectory() ) {
					

					setTimeout(function(){
						that.eachRemove(  leafSrc, leafDst, callback );
					},ts);
				}
			}
		});
	};

	remoteUpload( src, dst ) {
		return new Promise(function(resolve, reject){
			resolve(true);
		});
	}

	remoteDelete( src, dst ) {
		return new Promise(function(resolve, reject){
			resolve(true);
		});
	}
}

module.exports = Base