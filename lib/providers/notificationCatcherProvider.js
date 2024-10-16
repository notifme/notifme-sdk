"use strict";

var _Object$keys = require("@babel/runtime-corejs2/core-js/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs2/core-js/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _smtp = _interopRequireDefault(require("./email/smtp"));
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var NotificationCatcherProvider = exports["default"] = /*#__PURE__*/function () {
  function NotificationCatcherProvider(channel) {
    (0, _classCallCheck2["default"])(this, NotificationCatcherProvider);
    this.id = "".concat(channel, "-notificationcatcher-provider");
    var options = process.env.NOTIFME_CATCHER_OPTIONS || {
      port: 1025,
      ignoreTLS: true
    };
    this.provider = new _smtp["default"](options);
  }
  return (0, _createClass2["default"])(NotificationCatcherProvider, [{
    key: "sendToCatcher",
    value: function () {
      var _sendToCatcher = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.provider.send(request));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function sendToCatcher(_x) {
        return _sendToCatcher.apply(this, arguments);
      }
      return sendToCatcher;
    }()
  }], [{
    key: "getConfig",
    value: function getConfig(channels) {
      return channels.reduce(function (config, channel) {
        return _objectSpread(_objectSpread({}, config), {}, (0, _defineProperty2["default"])({}, channel, {
          providers: [{
            type: 'notificationcatcher'
          }],
          multiProviderStrategy: 'no-fallback'
        }));
      }, {});
    }
  }]);
}();