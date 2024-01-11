'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = factory;

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _mailgun = require('./mailgun');

var _mailgun2 = _interopRequireDefault(_mailgun);

var _mandrill = require('./mandrill');

var _mandrill2 = _interopRequireDefault(_mandrill);

var _notificationCatcher = require('./notificationCatcher');

var _notificationCatcher2 = _interopRequireDefault(_notificationCatcher);

var _sendgrid = require('./sendgrid');

var _sendgrid2 = _interopRequireDefault(_sendgrid);

var _ses = require('./ses');

var _ses2 = _interopRequireDefault(_ses);

var _sendmail = require('./sendmail');

var _sendmail2 = _interopRequireDefault(_sendmail);

var _smtp = require('./smtp');

var _smtp2 = _interopRequireDefault(_smtp);

var _sparkpost = require('./sparkpost');

var _sparkpost2 = _interopRequireDefault(_sparkpost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
function factory(_ref) {
  var type = _ref.type,
      config = (0, _objectWithoutProperties3.default)(_ref, ['type']);

  switch (type) {
    // Development
    case 'logger':
      return new _logger2.default(config, 'email');

    case 'notificationcatcher':
      return new _notificationCatcher2.default('email');

    // Custom
    case 'custom':
      return config;

    // Protocols
    case 'sendmail':
      return new _sendmail2.default(config);

    case 'smtp':
      return new _smtp2.default(config);

    // Providers
    case 'mailgun':
      return new _mailgun2.default(config);

    case 'mandrill':
      return new _mandrill2.default(config);

    case 'sendgrid':
      return new _sendgrid2.default(config);

    case 'ses':
      return new _ses2.default(config);

    case 'sparkpost':
      return new _sparkpost2.default(config);

    default:
      throw new Error('Unknown email provider "' + type + '".');
  }
}