"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _gcm = _interopRequireDefault(require("./gcm"));
var _logger = _interopRequireDefault(require("../logger"));
var _notificationCatcher = _interopRequireDefault(require("./notificationCatcher"));
var _excluded = ["type"];
// Types

function factory(_ref) {
  var type = _ref.type,
    config = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  switch (type) {
    // Development
    case 'logger':
      return new _logger["default"](config, 'webpush');
    case 'notificationcatcher':
      return new _notificationCatcher["default"]('webpush');

    // Custom
    case 'custom':
      return config;

    // Providers
    case 'gcm':
      return new _gcm["default"](config);
    default:
      throw new Error("Unknown webpush provider \"".concat(type, "\"."));
  }
}