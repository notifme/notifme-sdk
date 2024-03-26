"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _logger = _interopRequireDefault(require("../logger"));
var _mailgun = _interopRequireDefault(require("./mailgun"));
var _mandrill = _interopRequireDefault(require("./mandrill"));
var _notificationCatcher = _interopRequireDefault(require("./notificationCatcher"));
var _sendgrid = _interopRequireDefault(require("./sendgrid"));
var _ses = _interopRequireDefault(require("./ses"));
var _sendmail = _interopRequireDefault(require("./sendmail"));
var _smtp = _interopRequireDefault(require("./smtp"));
var _sparkpost = _interopRequireDefault(require("./sparkpost"));
var _excluded = ["type"];
// Types

function factory(_ref) {
  var type = _ref.type,
    config = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  switch (type) {
    // Development
    case 'logger':
      return new _logger["default"](config, 'email');
    case 'notificationcatcher':
      return new _notificationCatcher["default"]('email');

    // Custom
    case 'custom':
      return config;

    // Protocols
    case 'sendmail':
      return new _sendmail["default"](config);
    case 'smtp':
      return new _smtp["default"](config);

    // Providers
    case 'mailgun':
      return new _mailgun["default"](config);
    case 'mandrill':
      return new _mandrill["default"](config);
    case 'sendgrid':
      return new _sendgrid["default"](config);
    case 'ses':
      return new _ses["default"](config);
    case 'sparkpost':
      return new _sparkpost["default"](config);
    default:
      throw new Error("Unknown email provider \"".concat(type, "\"."));
  }
}