/*!
 *
 * WebApp Bootloader
 * =======================================================================================
 *
 * Static assets loading and storing in localStorage with cache manifest preloading for offline use and efficient assets versioning.
 * ---------------------------------------------------------------------------------------------------------------------------------
 *
 * Copyright 2012, Eyal Weiss
 * This may be freely distributed under the MIT license.
 * 
 * Tested on WebKit
 * 
 * Dependencies:
 * -------------
 * jQuery
 * Node.js (for building versioned cache manifest and versioned resources index files)
 * 
 */

(function () {
	function ajax(B, A, P) {
		this.bindFunction = function (E, D) {
			return function () {
				return E.apply(D, [D])
			};
		};
		this.stateChange = function (D) {
			if (this.request.readyState == 4) {
				this.callbackFunction(this.request.responseText, P)
			}
		};
		this.getRequest = function () {
			if (window.ActiveXObject) {
				return new ActiveXObject("Microsoft.XMLHTTP")
			} else {
				if (window.XMLHttpRequest) {
					return new XMLHttpRequest()
				}
			}
			return false;
		};
		this.postBody = (arguments[2] || "");
		this.callbackFunction = A;
		B += '?_' + new Date().getTime();
		this.url = B;
		this.request = this.getRequest();
		if (this.request) {
			var C = this.request;
			C.onreadystatechange = this.bindFunction(this.stateChange, this);
			C.open("GET", B, true)
			C.send(this.postBody)
		}
	}

	var baseUrl = '';

	var _log = (window.location.search.toLowerCase().search('debug') == -1) ? function () {
	} : function (msg) {
		console.log(msg);
	};

	var bootloader = window.bootloader = { isReady: false, callbacks: [] },
		manifestUrl = document.getElementsByTagName('html')[0].attributes['load-resources'].value,
		lazyScripts = [],
		deviceInfo = getDeviceData();

	if (window.location.search.toLowerCase().search('clearcache') > -1) {
		localStorage.clear();
		_log('localStorage was cleared');
	}

	bootloader.ready = function (callback) {
		if ($.isFunction(callback)) {
			if (bootloader.isReady) {
				callback();
			} else {
				bootloader.callbacks.push(callback);
			}
		}
	};

	var storedManifest = localStorage['bootloader.manifest'];
	storedManifest = storedManifest ? JSON.parse(storedManifest) : { resources: [] };
	var cachedItemsIndex = {},
		i = 0, len = storedManifest.resources.length, r;
	for (i; i < len; i++) {
		r = storedManifest.resources[i];
		cachedItemsIndex[r.url] = r.ver;
	}

	$(document.body).addClass('loading-resources');
	getResourcesUrls(function (res) {
		var total = res.length;
		var loadResource = function () {
			if (res.length) {
				var resource = res.shift(),
					ver = resource.ver,
					ifIs = resource.ifIs,
					ifIsNot = resource.ifIsNot;
				if (ifIs && !isMatching(ifIs) || ifIsNot && isMatching(ifIsNot)) {
					_log('skipped: resource ' + resource.url);
					loadResource();
					return; //skip
				}
				var isModified = hasModified(resource);
				getFileContent(isModified, resource, function (content, resource) {
					injectResource(resource, content);
					loadResource();
				}, resource);
			} else if (!bootloader.isReady) {
				isModified && storeResource('CachedVersion', ver);
				_log('Completed loading resources.');
				clearUnusedResources();
				bootloader.initLazy = function () {
					if (lazyScripts.length) {
						var s;
						while (s = lazyScripts.shift()) {
							document.body.appendChild(s);
							//_log('lazy-loaded resource');
						}
					}
					$(document.body).removeClass('preloaded');
				};
				$(document.body).removeClass('loading-resources');
				bootloader.isReady = true;
				var c;
				while (c = bootloader.callbacks.pop()) {
					c();
				}
			}
		};
		loadResource();
	});

	function isMatching(devices) {
		var d;
		while (d = devices.pop()) {
			if (deviceInfo.indexOf(d) !== -1) {
				return true;
			}
		}
		return false;
	}

	function getResourcesUrls(callback) {
		var online = navigator.onLine && (window.location.search.toLowerCase().search('offline') == -1);
		var handle = function (data) {
			try {
				var manifest = JSON.parse(data || '{}');
				callback(manifest.resources || []);
			} catch (err) {
				throw err;
			}
		};
		if (online) {
			_log('Online mode, downloading manifest file.');
			ajax(baseUrl + manifestUrl + '?_' + new Date().getTime(), function (data) {
				localStorage['bootloader.manifest'] = data;
				handle(data);
			});
		} else {
			_log('Offline mode, trying to read stored manifest.');
			handle(localStorage['bootloader.manifest']);
		}
	}

	function injectResource(resource, content) {
		if (resource.type == 'js') {
			_log('injecting script ' + resource.url);
			var script = document.createElement("script");
			script.innerHTML = content;
			script.async = resource.async;
			if (resource.lazy) {
				lazyScripts.push(script);
			} else {
				document.body.appendChild(script);
			}
		} else if (resource.type == 'css') {

			_log('injecting style ' + resource.url);
			var style = document.createElement('style'),
				rules = document.createTextNode(content);
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = rules.nodeValue;
			} else {
				style.appendChild(rules);
			}
			document.head.appendChild(style);
		}
	}

	function storeResource(url, content) {
		localStorage.setItem('bootloader[' + url + ']', content);
		//_log('stored resource ' + url);
	}

	function clearUnusedResources() {
		var k;
		for (k in cachedItemsIndex) {
			if (cachedItemsIndex.hasOwnProperty(k)) {
				localStorage.removeItem('bootloader[' + k + ']');
			}
		}
		// _log('Removed unused cached resources.');
	}

	function getFileContent(forceFresh, resource, callback, param, disableCache) {
		var content;
		delete cachedItemsIndex[resource.url];
		if (!forceFresh) {
			content = localStorage.getItem('bootloader[' + resource.url + ']');
		}
		if (content) {
			//_log('loaded from storage: resource ' + resource.url);
			callback(content, param);
		} else {
			ajax(baseUrl + resource.url, function (content, resource) {
				_log('downloaded: resource ' + resource.url);
				callback(content, param);
				storeResource(resource.url, content);
			}, resource);
		}
	}

	function hasModified(resource) {
		var cachedVer = cachedItemsIndex[resource.url];
		(cachedVer === resource.ver) && _log('resource not modified: ' + resource.url);
		return (resource.ver !== cachedVer);
	}

	function getDeviceData() {
		var agent = navigator.userAgent.toLowerCase(),
			otherBrowser = (agent.indexOf("series60") != -1) || (agent.indexOf("symbian") != -1) || (agent.indexOf("windows ce") != -1) || (agent.indexOf("blackberry") != -1),
			mobile = typeof orientation != 'undefined',
			touchy = 'ontouchstart' in document.documentElement,
			iOS = (navigator.platform.indexOf("iPhone") != -1) ||
				(navigator.platform.indexOf("iPad") != -1),
			android = (agent.indexOf("android") != -1) || (!iOS && !otherBrowser && touchy && mobile),
			desktop = !android && !iOS && !otherBrowser && !touchy && !mobile;
		var ret = [];
		iOS && ret.push('iOS');
		android && ret.push('android');
		mobile && ret.push('mobile');
		touchy && ret.push('touchy');
		desktop && ret.push('desktop');
		return ret;
	}
})();