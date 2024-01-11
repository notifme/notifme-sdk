'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = factory;

var _adm = require('./adm');

var _adm2 = _interopRequireDefault(_adm);

var _apn = require('./apn');

var _apn2 = _interopRequireDefault(_apn);

var _fcm = require('./fcm');

var _fcm2 = _interopRequireDefault(_fcm);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _notificationCatcher = require('./notificationCatcher');

var _notificationCatcher2 = _interopRequireDefault(_notificationCatcher);

var _wns = require('./wns');

var _wns2 = _interopRequireDefault(_wns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
function factory(_ref) {
  var type = _ref.type,
      config = (0, _objectWithoutProperties3.default)(_ref, ['type']);

  switch (type) {
    // Development
    case 'logger':
      return new _logger2.default(config, 'push');

    case 'notificationcatcher':
      return new _notificationCatcher2.default('push');

    // Custom
    case 'custom':
      return config;

    // Providers
    case 'adm':
      return new _adm2.default(config);

    case 'apn':
      return new _apn2.default(config);

    case 'fcm':
      return new _fcm2.default(config);

    case 'wns':
      return new _wns2.default(config);

    default:
      throw new Error('Unknown push provider "' + type + '".');
  }
}