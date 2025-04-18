cordova.define("cordova/plugin_list", function (require, exports, module) {
  module.exports = [
    {
      file: "plugins/cordova-clipboard-api/www/clipboard.js",
      id: "cordova-clipboard-api.Clipboard",
      pluginId: "cordova-clipboard-api",
      clobbers: ["window.plugins.clipboard"],
    },
    {
      file: "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
      id: "cordova-plugin-app-version.AppVersionPlugin",
      pluginId: "cordova-plugin-app-version",
      clobbers: ["window.plugins.getAppVersion"],
    },
    {
      file: "plugins/cordova-plugin-app-version/src/browser/AppVersionProxy.js",
      id: "cordova-plugin-app-version.AppVersionProxy",
      pluginId: "cordova-plugin-app-version",
      runs: true,
    },
    {
      file: "plugins/cordova-plugin-device/www/device.js",
      id: "cordova-plugin-device.device",
      pluginId: "cordova-plugin-device",
      clobbers: ["window.plugins.device"],
    },
    {
      file: "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
      id: "cordova-plugin-device.DeviceProxy",
      pluginId: "cordova-plugin-device",
      runs: true,
    },
    {
      file: "plugins/cordova-plugin-fingerprint-aio/www/Fingerprint.js",
      id: "cordova-plugin-fingerprint-aio.Fingerprint",
      pluginId: "cordova-plugin-fingerprint-aio",
      clobbers: ["window.plugins.Fingerprint"],
    },
    {
      file: "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      id: "cordova-plugin-inappbrowser.inappbrowser",
      pluginId: "cordova-plugin-inappbrowser",
      clobbers: ["window.plugins.InAppBrowser"],
    },
    {
      file: "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
      id: "cordova-plugin-inappbrowser.InAppBrowserProxy",
      pluginId: "cordova-plugin-inappbrowser",
      runs: true,
    },
    {
      file: "plugins/cordova-plugin-qrscanner/www/www.min.js",
      id: "cordova-plugin-qrscanner.QRScanner",
      pluginId: "cordova-plugin-qrscanner",
      clobbers: ["window.plugins.QRScanner"],
    },
    {
      file: "plugins/cordova-plugin-qrscanner/src/browser/plugin.min.js",
      id: "cordova-plugin-qrscanner.QRScannerProxy",
      pluginId: "cordova-plugin-qrscanner",
      runs: true,
    },
    {
      file: "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
      id: "cordova-plugin-screen-orientation.screenorientation",
      pluginId: "cordova-plugin-screen-orientation",
      clobbers: ["window.plugins.screenorientation"],
    },
    {
      file: "plugins/cordova-plugin-x-toast/www/Toast.js",
      id: "cordova-plugin-x-toast.Toast",
      pluginId: "cordova-plugin-x-toast",
      clobbers: ["window.plugins.toast"],
    },
    {
      file: "plugins/es6-promise-plugin/www/promise.js",
      id: "es6-promise-plugin.Promise",
      pluginId: "es6-promise-plugin",
      runs: true,
    },
    {
      file: "plugins/ionic-plugin-keyboard/www/browser/keyboard.js",
      id: "ionic-plugin-keyboard.keyboard",
      pluginId: "ionic-plugin-keyboard",
      clobbers: ["window.plugins.Keyboard"],
      runs: true,
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/index.js",
      id: "onesignal-cordova-plugin.OneSignalPlugin",
      pluginId: "onesignal-cordova-plugin",
      clobbers: ["window.plugins.OneSignal"],
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/NotificationReceivedEvent.js",
      id: "onesignal-cordova-plugin.NotificationReceivedEvent",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/OSNotification.js",
      id: "onesignal-cordova-plugin.OSNotification",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/UserNamespace.js",
      id: "onesignal-cordova-plugin.UserNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/PushSubscriptionNamespace.js",
      id: "onesignal-cordova-plugin.PushSubscriptionNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/DebugNamespace.js",
      id: "onesignal-cordova-plugin.DebugNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/InAppMessagesNamespace.js",
      id: "onesignal-cordova-plugin.InAppMessagesNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/SessionNamespace.js",
      id: "onesignal-cordova-plugin.SessionNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/LocationNamespace.js",
      id: "onesignal-cordova-plugin.LocationNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/NotificationsNamespace.js",
      id: "onesignal-cordova-plugin.NotificationsNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
    {
      file: "plugins/onesignal-cordova-plugin/dist/LiveActivitiesNamespace.js",
      id: "onesignal-cordova-plugin.LiveActivitiesNamespace",
      pluginId: "onesignal-cordova-plugin",
    },
  ];
  module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-clipboard-api": "1.3.0",
      "cordova-plugin-app-version": "0.1.14",
      "cordova-plugin-device": "2.1.0",
      "cordova-plugin-fingerprint-aio": "5.0.1",
      "cordova-plugin-inappbrowser": "5.0.0",
      "cordova-plugin-qrscanner": "3.0.1",
      "cordova-plugin-screen-orientation": "3.0.3",
      "cordova-plugin-x-toast": "2.7.3",
      "cordova-support-android-plugin": "2.0.4",
      "es6-promise-plugin": "4.2.2",
      "ionic-plugin-keyboard": "2.2.1",
      "onesignal-cordova-plugin": "5.0.2",
    };
  // BOTTOM OF METADATA
});
