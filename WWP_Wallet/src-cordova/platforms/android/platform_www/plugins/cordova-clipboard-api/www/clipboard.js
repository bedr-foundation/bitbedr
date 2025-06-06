cordova.define("cordova-clipboard-api.Clipboard", function(require, exports, module) {
var cordova = require('cordova');

/**
 * Clipboard plugin for Cordova
 * 
 * @constructor
 */
function Clipboard () {}

/**
 * Sets the clipboard content
 *
 * @param {String}   text      The content to copy to the clipboard
 * @param {Function} onSuccess The function to call in case of success (takes the copied text as argument)
 * @param {Function} onFail    The function to call in case of error
 */
Clipboard.prototype.copy = function (text, onSuccess, onFail) {
    if (typeof text === "undefined" || text === null) text = "";
	cordova.exec(onSuccess, onFail, "Clipboard", "copy", [text]);
};

/**
 * Gets the clipboard content
 *
 * @param {Function} onSuccess The function to call in case of success
 * @param {Function} onFail    The function to call in case of error
 */
Clipboard.prototype.paste = function (onSuccess, onFail) {
	cordova.exec(onSuccess, onFail, "Clipboard", "paste", []);
};

/**
 * Clear the clipboard content
 *
 * @param {Function} onSuccess The function to call in case of success
 * @param {Function} onFail    The function to call in case of error
 */
Clipboard.prototype.clear = function (onSuccess, onFail) {
	cordova.exec(onSuccess, onFail, "Clipboard", "clear", []);
};

// Register the plugin
var clipboard = new Clipboard();
module.exports = clipboard;

});
