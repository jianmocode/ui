let through = require('through2');
let gutil = require('gulp-util');
let fs = require('fs-extra');
let path = require('path');
let request = require('request');

let Base = require('./base');

class Qcloud extends Base {

	constructor( options )  {
		options = options || {};
		super( options );
	}

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



module.exports = Qcloud