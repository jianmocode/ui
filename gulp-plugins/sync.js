/*jslint node: true */
'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs-extra');
var crc = require('crc');
var path = require('path');
var PLUGIN_NAME = 'remote-sync';

var dirSync = function(src, dst, options) {
	
	options = options || {};
	options['nodelete'] = options['nodelete'] || false;
	var stor = options.stor || {};
	var func = function(callback) {
		let that =this;
		
		if ( !src || !dst ) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, '参数错误'));
			callback();
			return;
		}

		var resp = {
			created:0,
			removed:0,
			updated:0,
			notchange:0,
			error:0
		}

		stor.eachRemove( src, dst, function( src, dst, op, error=null ){
			resp[op]++;
			var printSummaryType = typeof options.printSummary;
			if ( printSummaryType === 'boolean' && options.printSummary === true && op != 'notchange' ) {

				gutil.log( '同步:' + dst  + ',  操作:' + op );

			} else if ( printSummaryType === 'function' ) {
				options.printSummary( src, dst, op, error, resp );

			}

			if  (error !== null ) {
				gutil.log( error );
			}
		});

		stor.eachUpdate( src, dst, function( src, dst, op, error=null ){ // 更新
			resp[op]++;
			var printSummaryType = typeof options.printSummary;
				if ( printSummaryType === 'boolean' && options.printSummary === true && op != 'notchange' ) {
					gutil.log( '同步 ' + dst  + ' 操作:' + op );

					// gutil.log( '文件同步: ' + resp.created + ' 个文件被创建, ' + resp.updated + ' 个文件被更新, ' + resp.removed + ' 个文件被删除, ' + resp.notchange + ' 个文件未改变' );
				} else if ( printSummaryType === 'function' ) {
					options.printSummary( src, dst, op, error, resp );
				}

				if  (error !== null ) {
					gutil.log( error );
				}
		});


		that.resume();
		callback();
		// callback();

	};

	return through.obj(
		function( file, enc, callback ) {
			this.push( file );
			callback();
		},
		func
	);
};


module.exports = dirSync;