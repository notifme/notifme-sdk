"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _email = _interopRequireDefault(require("./email"));
var _push = _interopRequireDefault(require("./push"));
var _sms = _interopRequireDefault(require("./sms"));
var _voice = _interopRequireDefault(require("./voice"));
var _webpush = _interopRequireDefault(require("./webpush"));
var _slack = _interopRequireDefault(require("./slack"));
var _whatsapp = _interopRequireDefault(require("./whatsapp"));
// Types
function factory(channels) {
  return (0, _keys["default"])(channels).reduce(function (acc, key) {
    acc[key] = channels[key].providers.map(function (config) {
      switch (key) {
        case 'email':
          return (0, _email["default"])(config);
        case 'sms':
          return (0, _sms["default"])(config);
        case 'voice':
          return (0, _voice["default"])(config);
        case 'push':
          return (0, _push["default"])(config);
        case 'webpush':
          return (0, _webpush["default"])(config);
        case 'slack':
          return (0, _slack["default"])(config);
        case 'whatsapp':
          return (0, _whatsapp["default"])(config);
        default:
          return config;
      }
    });
    return acc;
  }, {});
}