"use strict";

var _Reflect$construct = require("@babel/runtime-corejs2/core-js/reflect/construct");
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
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));
var _notificationCatcherProvider = _interopRequireDefault(require("../notificationCatcherProvider"));
var _excluded = ["from", "to", "text"];
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
// Types
var WhatsappCatcherProvider = exports["default"] = /*#__PURE__*/function (_NotificationCatcherP) {
  function WhatsappCatcherProvider() {
    (0, _classCallCheck2["default"])(this, WhatsappCatcherProvider);
    return _callSuper(this, WhatsappCatcherProvider, arguments);
  }
  (0, _inherits2["default"])(WhatsappCatcherProvider, _NotificationCatcherP);
  return (0, _createClass2["default"])(WhatsappCatcherProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, from, to, text, rest;
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
              from = _ref.from;
              to = _ref.to;
              text = _ref.text;
              rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
              this.sendToCatcher({
                to: "".concat(to, "@whatsapp"),
                from: from,
                subject: text ? "".concat(text.substring(0, 20)).concat(text.length > 20 ? '...' : '') : '',
                text: (0, _stringify["default"])(_objectSpread({
                  text: text
                }, rest), null, 2),
                headers: {
                  'X-type': 'whatsapp',
                  'X-to': "[whatsapp] ".concat(to)
                }
              });
              return _context.abrupt("return", '');
            case 14:
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
}(_notificationCatcherProvider["default"]);