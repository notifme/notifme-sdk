"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _logger = _interopRequireDefault(require("../logger"));
var _elks = _interopRequireDefault(require("./46elks"));
var _callr = _interopRequireDefault(require("./callr"));
var _clickatell = _interopRequireDefault(require("./clickatell"));
var _infobip = _interopRequireDefault(require("./infobip"));
var _nexmo = _interopRequireDefault(require("./nexmo"));
var _notificationCatcher = _interopRequireDefault(require("./notificationCatcher"));
var _ovh = _interopRequireDefault(require("./ovh"));
var _plivo = _interopRequireDefault(require("./plivo"));
var _twilio = _interopRequireDefault(require("./twilio"));
var _seven = _interopRequireDefault(require("./seven"));
var _excluded = ["type"]; // Types
function factory(_ref) {
  var type = _ref.type,
    config = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  switch (type) {
    // Development
    case 'logger':
      return new _logger["default"](config, 'sms');
    case 'notificationcatcher':
      return new _notificationCatcher["default"]('sms');

    // Custom
    case 'custom':
      return config;

    // Providers
    case '46elks':
      return new _elks["default"](config);
    case 'callr':
      return new _callr["default"](config);
    case 'clickatell':
      return new _clickatell["default"](config);
    case 'infobip':
      return new _infobip["default"](config);
    case 'nexmo':
      return new _nexmo["default"](config);
    case 'ovh':
      return new _ovh["default"](config);
    case 'plivo':
      return new _plivo["default"](config);
    case 'twilio':
      return new _twilio["default"](config);
    case 'seven':
      return new _seven["default"](config);
    default:
      throw new Error("Unknown sms provider \"".concat(type, "\"."));
  }
}