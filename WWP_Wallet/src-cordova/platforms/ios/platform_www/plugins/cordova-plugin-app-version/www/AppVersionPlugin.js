var encodeData = '';
var decodeData = null;
var bgColor = '#FF0000';

cordova.define('cordova-plugin-app-version.AppVersionPlugin', function (require, exports, module) {
	/*jslint indent: 2 */
	/*global window, jQuery, angular, cordova */
	'use strict';

	// Returns a jQuery or AngularJS deferred object, or pass a success and fail callbacks if you don't want to use jQuery or AngularJS
	var getPromisedCordovaExec = function (command, success, fail) {
		var toReturn, deferred, injector, $q;
		if (success === undefined) {
			if (window.jQuery) {
				deferred = jQuery.Deferred();
				success = deferred.resolve;
				fail = deferred.reject;
				toReturn = deferred;
			} else if (window.angular) {
				injector = angular.injector(['ng']);
				$q = injector.get('$q');
				deferred = $q.defer();
				success = deferred.resolve;
				fail = deferred.reject;
				toReturn = deferred.promise;
			} else if (window.when && window.when.promise) {
				deferred = when.defer();
				success = deferred.resolve;
				fail = deferred.reject;
				toReturn = deferred.promise;
			} else if (window.Promise) {
				toReturn = new Promise(function (c, e) {
					success = c;
					fail = e;
				});
			} else if (window.WinJS && window.WinJS.Promise) {
				toReturn = new WinJS.Promise(function (c, e) {
					success = c;
					fail = e;
				});
			} else {
				return console.error(
					'AppVersion either needs a success callback, or jQuery/AngularJS/Promise/WinJS.Promise defined for using promises'
				);
			}
		}
		// 5th param is NOT optional. must be at least empty array
		if (command == 'encodeString') {
			cordova.exec(success, fail, 'AppVersion', command, [encodeData]);
		} else if (command == 'decodeString') {
			cordova.exec(success, fail, 'AppVersion', command, [decodeData]);
		} else if (command == 'setBgColor') {
			cordova.exec(success, fail, 'AppVersion', command, [bgColor]);
		} else {
			cordova.exec(success, fail, 'AppVersion', command, []);
		}

		return toReturn;
	};

	var getAppVersion = function (success, fail) {
		return getPromisedCordovaExec('getVersionNumber', success, fail);
	};

	getAppVersion.getAppName = function (success, fail) {
		return getPromisedCordovaExec('getAppName', success, fail);
	};

	getAppVersion.getPackageName = function (success, fail) {
		return getPromisedCordovaExec('getPackageName', success, fail);
	};

	getAppVersion.getTimeZone = function (success, fail) {
		return getPromisedCordovaExec('getTimeZone', success, fail);
	};

	getAppVersion.getVersionCode = function (success, fail) {
		return getPromisedCordovaExec('getVersionCode', success, fail);
	};

	getAppVersion.setBgColor = function (success, fail) {
		return getPromisedCordovaExec('setBgColor', success, fail);
	};

	getAppVersion.encodeString = function (success, fail) {
		return getPromisedCordovaExec('encodeString', success, fail);
	};

	getAppVersion.decodeString = function (success, fail) {
		return getPromisedCordovaExec('decodeString', success, fail);
	};

	getAppVersion.install = function () {
		if (!window.plugins) {
			window.plugins = {};
		}

		window.plugins.appVersion = new getAppVersion();
		return window.plugins.appVersion;
	};

	cordova.addConstructor(getAppVersion.install);

	module.exports = getAppVersion;
});
