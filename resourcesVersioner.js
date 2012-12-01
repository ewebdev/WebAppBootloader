/*!
 * Versioned cache manifest and versioned resources index files builder
 * ====================================================================
 * WebApp Bootloader
 * =================
 * Copyright 2012, Eyal Weiss
 * This may be freely distributed under the MIT license.
 */

var fs = require('fs'),
	crypto = require('crypto');

var writeManifest = function (baseDir, src, dest, callback) {
	fs.readFile(baseDir + src, function (err, data) {
		var template = data.toString();

		var filesStartIdx = template.indexOf('#{versioned.resources_list:') + 27;
		var filesStr = template.substr(filesStartIdx);
		var filesEndIdx = filesStr.indexOf('#}');
		filesStr = filesStr.substr(0, filesEndIdx);
		var files = filesStr.trim().split('\n').map(function(s){ return s.trim(); });

		template = template.substring(0, filesStartIdx - 27) + filesStr.trim() + template.substring(filesStartIdx + filesEndIdx + 2);

		var concatFiles = function(files, callback, str){
			str = str || '';
			var resource = files.shift();
			if (resource) {
				fs.readFile(baseDir + '/' + resource, function (err, data) {
					if (err) {
						console.log('Error during reading file ' + resource, err);
					} else {
					}
					str += baseDir + '/' + resource + '=[' + (data || '') + '];';
					concatFiles(files, callback, str);
				});
			} else {
				callback(str);
			}
		};

		concatFiles(files, function(data){
			var hash = crypto.createHash('md5').update(data.toString()).digest("hex");
			var manifestStr = template.replace(/{versioned.hash}/g, hash);
			fs.writeFile(baseDir + '/' + dest, manifestStr, function (err) {
				callback && callback(err, manifestStr, hash);
			});
		});

	});
};

var versionResources = function (baseDir, dest, files, result, callback) {
	var resource = files.shift();
	result = result || [];

	if (resource) {
		fs.readFile(baseDir + '/' + resource.url, function (err, data) {
			if (err) {
				console.log('Error during reading file ' + resource.url, err);
				resource.ver = '';
			} else {
				var hash = crypto.createHash('md5').update(data.toString()).digest("hex");
				resource.ver = hash;
			}
			result.push(resource);
			versionResources(baseDir, dest, files, result, callback);
		});
	} else {
		var resData = {resources: result};
		fs.writeFile(baseDir + '/' + dest, JSON.stringify(resData), function (err) {
			callback && callback(err, resData);
		});
	}
};


/*
 options argument:
 {
	 files: {...},
	 baseDir: './assets',
	 dest: 'resources.json',
	 manifestSrc: '../cache.manifest.template',
	 manifestDest: 'cache.manifest'
 }
*/
module.exports = function (options) {

	this.write = function (callback) {
		writeManifest(options.baseDir, options.manifestSrc, options.manifestDest, function(err1, manifestStr){
			versionResources(options.baseDir, options.dest, options.files, [], function(err2, resData){
				callback && callback(err1 || err2, manifestStr, resData);
			});
		});
	};
};
