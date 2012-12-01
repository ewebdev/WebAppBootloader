var ResourcesVersioner = require('./resourcesVersioner.js');

// Updating resources versions index file

var resources = [
	{
		"type": "css",
		"url": "css/sencha-touch.css",
		"lazy": true
	},
	{
		"type": "css",
		"url": "css/app.css",
		"lazy": true
	},
	{
		"type": "js",
		"url": "js/dependencies/sencha-touch.js",
		"lazy": true
	},
	{
		"type": "js",
		"url": "js/dependencies/highcharts.js",
		"lazy": true,
		"ifIsNot": ["android"]
	},
	{
		"type": "js",
		"url": "js/dependencies/highcharts.android.js",
		"lazy": true,
		"ifIs": ["android"]
	},
	{
		"type": "js",
		"url": "js/app/index.js",
		"lazy": true
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
