let through = require('through2');
let gutil = require('gulp-util');
let fs = require('fs-extra');
let path = require('path');


let Base = require('./base');

class Minapages extends Base {

	constructor( options )  {
		options = options || {};
		super( options );
		this.api = this.options['server'] + '/_a/mina/dev/storage';
	}

	remoteUpload( src, dst ) {
		
		let postData = {
			filecontent:{
				value:fs.createReadStream(src),
				options:{
					filename:path.basename(src),
				}
			},
			name: dst.replace(/\\/g, '/'),
            op:'upload',
            instance: this.options['instance'],
			appid: this.options['appid'],
			secret: this.options['secret']
		};

		let headers = { 
			"Content-Type":'multipart/form-data',
			"Accept":"application/json"
		};
		return this.post(  this.api, {data:postData, headers:headers});
	}



	remoteDelete( dst ) {
		let postData = {
			name: dst.replace(/\\/g, '/'),
            op:'delete',
            instance: this.options['instance'],
			appid: this.options['appid'],
			secret: this.options['secret']
		};

		let headers = { 
				"Content-Type":'multipart/form-data',
				"Accept":"application/json"
			};
			
		return this.post(  this.api, {data:postData, headers:headers});
	}
}

module.exports = Minapages