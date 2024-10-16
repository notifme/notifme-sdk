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
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var SmsNexmoProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsNexmoProvider(config) {
    (0, _classCallCheck2["default"])(this, SmsNexmoProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-nexmo-provider');
    this.credentials = {
      api_key: config.apiKey,
      api_secret: config.apiSecret
    };
  }

  /*
   * Note: 'nature' is not supported.
   */
  return (0, _createClass2["default"])(SmsNexmoProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, from, to, text, type, ttl, messageClass, response, responseBody, message;
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
              type = _ref.type;
              ttl = _ref.ttl;
              messageClass = _ref.messageClass;
              _context.next = 16;
              return (0, _request["default"])('https://rest.nexmo.com/sms/json', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(_objectSpread(_objectSpread({}, this.credentials), {}, {
                  from: from,
                  to: to,
                  text: text,
                  type: type,
                  ttl: ttl,
                  'message-class': messageClass
                }))
              });
            case 16:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 29;
                break;
              }
              _context.next = 20;
              return response.json();
            case 20:
              responseBody = _context.sent;
              message = responseBody.messages[0]; // Nexmo always returns 200 even for error
              if (!(message.status !== '0')) {
                _context.next = 26;
                break;
              }
              throw new Error("status: ".concat(message.status, ", error: ").concat(message['error-text']));
            case 26:
              return _context.abrupt("return", message['message-id']);
            case 27:
              _context.next = 30;
              break;
            case 29:
              throw new Error(response.status);
            case 30:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }())
  }]);
}();