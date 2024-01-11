'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = factory;

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _elks = require('./46elks');

var _elks2 = _interopRequireDefault(_elks);

var _callr = require('./callr');

var _callr2 = _interopRequireDefault(_callr);

var _clickatell = require('./clickatell');

var _clickatell2 = _interopRequireDefault(_clickatell);

var _infobip = require('./infobip');

var _infobip2 = _interopRequireDefault(_infobip);

var _nexmo = require('./nexmo');

var _nexmo2 = _interopRequireDefault(_nexmo);

var _notificationCatcher = require('./notificationCatcher');

var _notificationCatcher2 = _interopRequireDefault(_notificationCatcher);

var _ovh = require('./ovh');

var _ovh2 = _interopRequireDefault(_ovh);

var _plivo = require('./plivo');

var _plivo2 = _interopRequireDefault(_plivo);

var _twilio = require('./twilio');

var _twilio2 = _interopRequireDefault(_twilio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
function factory(_ref) {
  var type = _ref.type,
      config = (0, _objectWithoutProperties3.default)(_ref, ['type']);

  switch (type) {
    // Development
    case 'logger':
      return new _logger2.default(config, 'sms');

    case 'notificationcatcher':
      return new _notificationCatcher2.default('sms');

    // Custom
    case 'custom':
      return config;

    // Providers
    case '46elks':
      return new _elks2.default(config);

    case 'callr':
      return new _callr2.default(config);

    case 'clickatell':
      return new _clickatell2.default(config);

    case 'infobip':
      return new _infobip2.default(config);

    case 'nexmo':
      return new _nexmo2.default(config);

    case 'ovh':
      return new _ovh2.default(config);

    case 'plivo':
      return new _plivo2.default(config);

    case 'twilio':
      return new _twilio2.default(config);

    default:
      throw new Error('Unknown sms provider "' + type + '".');
  }
}