cordova.define("cordova/plugin_list", function (require, exports, module) {
  module.exports = [
    {
      id: "cordova-clipboard-api.Clipboard",
      file: "plugins/cordova-clipboard-api/www/clipboard.js",
      pluginId: "cordova-clipboard-api",
      clobbers: ["window.plugins.clipboard"],
    },
    {
      id: "cordova-plugin-app-version.AppVersionPlugin",
      file: "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
      pluginId: "cordova-plugin-app-version",
      clobbers: ["window.plugins.getAppVersion"],
    },
    {
      id: "cordova-plugin-device.device",
      file: "plugins/cordova-plugin-device/www/device.js",
      pluginId: "cordova-plugin-device",
      clobbers: ["window.plugins.device"],
    },
    {
      id: "cordova-plugin-fingerprint-aio.Fingerprint",
      file: "plugins/cordova-plugin-fingerprint-aio/www/Fingerprint.js",
      pluginId: "cordova-plugin-fingerprint-aio",
      clobbers: ["window.plugins.Fingerprint"],
    },
    {
      id: "cordova-plugin-googleplus.GooglePlus",
      file: "plugins/cordova-plugin-googleplus/www/GooglePlus.js",
      pluginId: "cordova-plugin-googleplus",
      clobbers: ["window.plugins.googleplus"],
    },
    {
      id: "cordova-plugin-inappbrowser.inappbrowser",
      file: "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      pluginId: "cordova-plugin-inappbrowser",
      clobbers: ["window.plugins.InAppBrowser"],
    },
    {
      id: "cordova-plugin-qrscanner.QRScanner",
      file: "plugins/cordova-plugin-qrscanner/www/www.min.js",
      pluginId: "cordova-plugin-qrscanner",
      clobbers: ["window.plugins.QRScanner"],
    },
    {
      id: "es6-promise-plugin.Promise",
      file: "plugins/es6-promise-plugin/www/promise.js",
      pluginId: "es6-promise-plugin",
      runs: true,
    },
    {
      id: "cordova-plugin-screen-orientation.screenorientation",
      file: "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
      pluginId: "cordova-plugin-screen-orientation",
      clobbers: ["window.plugins.screenorientation"],
    },
    {
      id: "cordova-plugin-x-toast.Toast",
      file: "plugins/cordova-plugin-x-toast/www/Toast.js",
      pluginId: "cordova-plugin-x-toast",
      clobbers: ["window.plugins.toast"],
    },
    {
      id: "ionic-plugin-keyboard.keyboard",
      file: "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
      pluginId: "ionic-plugin-keyboard",
      clobbers: ["window.plugins.Keyboard"],
      runs: true,
    },
    {
      id: "onesignal-cordova-plugin.OneSignalPlugin",
      file: "plugins/onesignal-cordova-plugin/dist/index.js",
      pluginId: "onesignal-cordova-plugin",
      clobbers: ["window.plugins.OneSignal"],
    },
    {
      id: "onesignal-cordova-plugin.NotificationReceivedEvent",
      file: "plugins/onesignal-cordova-plugin/dist/NotificationReceivedEvent.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.OSNotification",
      file: "plugins/onesignal-cordova-plugin/dist/OSNotification.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.UserNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/UserNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.PushSubscriptionNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/PushSubscriptionNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.DebugNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/DebugNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.InAppMessagesNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/InAppMessagesNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.SessionNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/SessionNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.LocationNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/LocationNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.NotificationsNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/NotificationsNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      id: "onesignal-cordova-plugin.LiveActivitiesNamespace",
      file: "plugins/onesignal-cordova-plugin/dist/LiveActivitiesNamespace.js",
      pluginId: "onesignal-cordova-plugin",
    },
  ];
  module.exports.metadata = {
    "cordova-clipboard-api": "1.3.0",
    "cordova-plugin-app-version": "0.1.14",
    "cordova-plugin-device": "2.1.0",
    "cordova-plugin-fingerprint-aio": "5.0.1",
    "cordova-plugin-googleplus": "8.5.2",
    "cordova-plugin-inappbrowser": "5.0.0",
    "cordova-plugin-qrscanner": "3.0.1",
    "es6-promise-plugin": "4.2.2",
    "cordova-plugin-screen-orientation": "3.0.3",
    "cordova-plugin-x-toast": "2.7.3",
    "cordova-support-android-plugin": "2.0.4",
    "ionic-plugin-keyboard": "2.2.1",
    "onesignal-cordova-plugin": "5.2.1",
  };
});
