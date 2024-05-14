"use strict";

var _Object$keys2 = require("@babel/runtime-corejs2/core-js/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs2/core-js/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CHANNELS = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _notificationCatcherProvider = _interopRequireDefault(require("./providers/notificationCatcherProvider"));
var _sender = _interopRequireDefault(require("./sender"));
var _dedupe = _interopRequireDefault(require("./util/dedupe"));
var _logger = _interopRequireDefault(require("./util/logger"));
var _providers = _interopRequireDefault(require("./providers"));
var _providers2 = _interopRequireDefault(require("./strategies/providers"));
var _excluded = ["channels"];
/* global $Keys */
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types

var CHANNELS = exports.CHANNELS = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  voice: 'voice',
  webpush: 'webpush',
  slack: 'slack',
  whatsapp: 'whatsapp'
};

// Defaults to fallback
var NotifmeSdk = exports["default"] = /*#__PURE__*/function () {
  function NotifmeSdk(options) {
    (0, _classCallCheck2["default"])(this, NotifmeSdk);
    (0, _defineProperty2["default"])(this, "logger", _logger["default"]);
    var mergedOptions = this.mergeWithDefaultConfig(options);
    var providers = (0, _providers["default"])(mergedOptions.channels);
    var strategies = (0, _providers2["default"])(mergedOptions.channels);
    this.sender = new _sender["default"]((0, _dedupe["default"])([].concat((0, _toConsumableArray2["default"])((0, _keys["default"])(CHANNELS)), (0, _toConsumableArray2["default"])((0, _keys["default"])(providers)))), providers, strategies);
  }
  return (0, _createClass2["default"])(NotifmeSdk, [{
    key: "mergeWithDefaultConfig",
    value: function mergeWithDefaultConfig(_ref) {
      var channels = _ref.channels,
        rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
      return _objectSpread(_objectSpread({
        useNotificationCatcher: false
      }, rest), {}, {
        channels: rest.useNotificationCatcher ? _notificationCatcherProvider["default"].getConfig((0, _keys["default"])(CHANNELS)) : _objectSpread(_objectSpread({}, channels), {}, {
          email: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.email : null),
          push: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.push : null),
          sms: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.sms : null),
          voice: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.voice : null),
          webpush: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.webpush : null),
          slack: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.slack : null),
          whatsapp: _objectSpread({
            providers: [],
            multiProviderStrategy: 'fallback'
          }, channels ? channels.whatsapp : null)
        })
      });
    }
  }, {
    key: "send",
    value: function send(request) {
      return this.sender.send(request);
    }
  }]);
}();