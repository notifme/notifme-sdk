"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _adm = _interopRequireDefault(require("./adm"));
var _apn = _interopRequireDefault(require("./apn"));
var _fcm = _interopRequireDefault(require("./fcm"));
var _logger = _interopRequireDefault(require("../logger"));
var _notificationCatcher = _interopRequireDefault(require("./notificationCatcher"));
var _wns = _interopRequireDefault(require("./wns"));
var _excluded = ["type"];
// Types

function factory(_ref) {
  var type = _ref.type,
    config = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  switch (type) {
    // Development
    case 'logger':
      return new _logger["default"](config, 'push');
    case 'notificationcatcher':
      return new _notificationCatcher["default"]('push');

    // Custom
    case 'custom':
      return config;

    // Providers
    case 'adm':
      return new _adm["default"](config);
    case 'apn':
      return new _apn["default"](config);
    case 'fcm':
      return new _fcm["default"](config);
    case 'wns':
      return new _wns["default"](config);
    default:
      throw new Error("Unknown push provider \"".concat(type, "\"."));
  }
}