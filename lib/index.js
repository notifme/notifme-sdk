'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANNELS = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _notificationCatcherProvider = require('./providers/notificationCatcherProvider');

var _notificationCatcherProvider2 = _interopRequireDefault(_notificationCatcherProvider);

var _sender = require('./sender');

var _sender2 = _interopRequireDefault(_sender);

var _dedupe = require('./util/dedupe');

var _dedupe2 = _interopRequireDefault(_dedupe);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _providers = require('./providers');

var _providers2 = _interopRequireDefault(_providers);

var _providers3 = require('./strategies/providers');

var _providers4 = _interopRequireDefault(_providers3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types

/* global $Keys */
var CHANNELS = exports.CHANNELS = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  voice: 'voice',
  webpush: 'webpush',
  slack: 'slack'
}; // Defaults to fallback

var NotifmeSdk = function () {
  function NotifmeSdk(options) {
    (0, _classCallCheck3.default)(this, NotifmeSdk);
    this.logger = _logger2.default;

    var mergedOptions = this.mergeWithDefaultConfig(options);
    var providers = (0, _providers2.default)(mergedOptions.channels);
    var strategies = (0, _providers4.default)(mergedOptions.channels);

    this.sender = new _sender2.default((0, _dedupe2.default)([].concat((0, _toConsumableArray3.default)((0, _keys2.default)(CHANNELS)), (0, _toConsumableArray3.default)((0, _keys2.default)(providers)))), providers, strategies);
  }

  (0, _createClass3.default)(NotifmeSdk, [{
    key: 'mergeWithDefaultConfig',
    value: function mergeWithDefaultConfig(_ref) {
      var channels = _ref.channels,
          rest = (0, _objectWithoutProperties3.default)(_ref, ['channels']);

      return (0, _extends3.default)({
        useNotificationCatcher: false
      }, rest, {
        channels: rest.useNotificationCatcher ? _notificationCatcherProvider2.default.getConfig((0, _keys2.default)(CHANNELS)) : (0, _extends3.default)({}, channels, {
          email: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.email : null),
          push: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.push : null),
          sms: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.sms : null),
          voice: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.voice : null),
          webpush: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.webpush : null),
          slack: (0, _extends3.default)({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.slack : null)
        })
      });
    }
  }, {
    key: 'send',
    value: function send(request) {
      return this.sender.send(request);
    }
  }]);
  return NotifmeSdk;
}();

exports.default = NotifmeSdk;