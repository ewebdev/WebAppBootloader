/* Updating resources versions index file */

var ResourcesVersioner = require('./resourcesVersioner.js');

/* edit "resources" array to include your webapp's static assets
 - use "ifIsNot: []" and "ifIs: []" for conditioned loading
 - use "defer: true" to init (inject resources to page) only after calling bootloader.activate()
 otherwise, assets will be injected immediately
*/
var resources = [
	{
		"type": "css",
		"url": "css/sencha-touch.css",
		"defer": true
	},
	{
		"type": "css",
		"url": "css/app.css",
		"defer": true
	},
	{
		"type": "js",
		"url": "js/dependencies/sencha-touch.js",
		"defer": true
	},
	{
		"type": "js",
		"url": "js/dependencies/highcharts.js",
		"defer": true,
		"ifIsNot": ["android"]
	},
	{
		"type": "js",
		"url": "js/dependencies/highcharts.android.js",
		"defer": true,
		"ifIs": ["android"]
	},
	{
		"type": "js",
		"url": "js/app/index.js",
		"defer": true
	}
];


var resourcesVersioner = new ResourcesVersioner({
	baseDir: './assets/',
	files: resources,
	dest: 'resources.json',
	manifestSrc: '../cache.manifest.template',
	manifestDest: 'cache.manifest'
}).write(function (err, data, options) {
	if (err) {
		console.log(err);
	} else {
		console.log('Success: Resources versions index file and cache manifest file were updated.');
	}
});
