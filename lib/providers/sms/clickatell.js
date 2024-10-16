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
var SmsClickatellProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsClickatellProvider(config) {
    (0, _classCallCheck2["default"])(this, SmsClickatellProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-clickatell-provider');
    // One-way integration API key
    this.apiKey = config.apiKey;
  }

  /*
   * Note: 'from', 'nature', 'messageClass' are not supported.
   */
  return (0, _createClass2["default"])(SmsClickatellProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, id, to, text, type, ttl, response, responseBody;
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
              id = _ref.id;
              to = _ref.to;
              text = _ref.text;
              type = _ref.type;
              ttl = _ref.ttl;
              _context.next = 15;
              return (0, _request["default"])('https://platform.clickatell.com/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: this.apiKey,
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(_objectSpread(_objectSpread({
                  // no `from` for one-way integrations
                  to: [to],
                  content: text,
                  charset: type === 'unicode' ? 'UCS2-BE' : 'UTF-8'
                }, ttl ? {
                  validityPeriod: ttl
                } : null), id ? {
                  clientMessageId: id
                } : null))
              });
            case 15:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 27;
                break;
              }
              _context.next = 19;
              return response.json();
            case 19:
              responseBody = _context.sent;
              if (!responseBody.error) {
                _context.next = 24;
                break;
              }
              throw new Error(responseBody.error);
            case 24:
              return _context.abrupt("return", responseBody.messages[0].apiMessageId);
            case 25:
              _context.next = 32;
              break;
            case 27:
              _context.t1 = Error;
              _context.next = 30;
              return response.text();
            case 30:
              _context.t2 = _context.sent;
              throw new _context.t1(_context.t2);
            case 32:
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