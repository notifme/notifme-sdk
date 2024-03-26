"use strict";

var _Reflect$construct = require("@babel/runtime-corejs2/core-js/reflect/construct");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));
var _notificationCatcherProvider = _interopRequireDefault(require("../notificationCatcherProvider"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
// Types
var VoiceNotificationCatcherProvider = exports["default"] = /*#__PURE__*/function (_NotificationCatcherP) {
  (0, _inherits2["default"])(VoiceNotificationCatcherProvider, _NotificationCatcherP);
  function VoiceNotificationCatcherProvider() {
    (0, _classCallCheck2["default"])(this, VoiceNotificationCatcherProvider);
    return _callSuper(this, VoiceNotificationCatcherProvider, arguments);
  }
  (0, _createClass2["default"])(VoiceNotificationCatcherProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, to, from, url;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!request.customize) {
                _context.next = 6;
                break;
              }
              _context.next = 3;
              return request.customize(this.id, request);
            case 3:
              _context.t0 = _context.sent;
              _context.next = 7;
              break;
            case 6:
              _context.t0 = request;
            case 7:
              _ref = _context.t0;
              to = _ref.to;
              from = _ref.from;
              url = _ref.url;
              return _context.abrupt("return", this.sendToCatcher({
                to: "".concat(to, "@voice"),
                from: from,
                subject: "".concat(to, "@voice"),
                text: url,
                headers: {
                  'X-type': 'voice',
                  'X-to': "[voice] ".concat(to)
                }
              }));
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }]);
  return VoiceNotificationCatcherProvider;
}(_notificationCatcherProvider["default"]);