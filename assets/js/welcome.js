/* Welcome/"loading" screen code */

jQuery(function () {


	var launchApp = function (callback) {
		if (!bootloader.isReady) {
			$btn.text('Please wait...');
		}
		bootloader.ready(function () {
			$.isFunction(callback) && callback();
			bootloader.initLazy();
		});
	};
	var $welcome = $('<div/>').appendTo('body'),
		$btn = $('<button class="start-btn btn" disabled="disabled">Launch App</button>').appendTo($welcome)
		.click(launchApp);
	$welcome.append(
		'<h2>What Is It?</h2>' +
		'<p>' +
		'This screen is cached by <a href="http://www.html5rocks.com/en/tutorials/appcache/beginner/">HTML5 cache manifest</a>, ' +
		'which gives you the power of running your app when there\'s no available internet connection. ' +
		'While you see this welcome message, other application assets are being loaded in the background. ' +
		'This lets you display this kind of initial welcome/"loading" light-weight screen very quickly while loading heavier assets in the background. ' +
		'</p>' +

		'<h2>How Does it Work?</h2>' +
		'<p>' +
		'When starting the node.js server or running <code>"node updateResourcesVer"</code> cache manifest file and versioned resources index are refreshed with the hashes of your files contents. <br />' +
		'Cache manifest mechanism will reload it\'s assets when it detects any change in its text (including the assets hash which created automatically obviously) <br />' +
		'My bootloader.js code loads only new or changed files (comparing the hash of each file\'s content) and stores it in the browser\'s <a href="http://www.html5rocks.com/en/features/storage">localStorage</a> for further loading of the app.<br />' +
		'</p>' +

		'<h2>How to Get Start?</h2>' +
		'<ul>' +
			'<li>Edit cache.manifest.template (<em>DO NOT manually edit</em> the cache.manifest file since it will be overridden on each server start!)</li>' +
			'<li>Edit the resources array in updateResourcesVer.js (<em>DO NOT manually edit</em> resources.json file since it will be overridden on each server start!)</li>' +
			'<li>Run <code>node app.js</code> (web server) or <code>node updateResourcesVer</code> to refresh cache manifest and versioned resources files</li>' +
			'<li>For a deeper dive, take a look also at <code>updateResourcesVer.js</code>, <code>resourcesVersioner.js</code>, <code>assets/js/bootloader.js</code> and <code>assets/js/welcome.js</code></li>' +
		'</ul>');

	bootloader.ready(function () {
		$btn.text('Ready! Launch App').prop('disabled', false);
	});

});


