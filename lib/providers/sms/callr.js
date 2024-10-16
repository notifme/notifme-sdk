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
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var SmsCallrProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsCallrProvider(_ref) {
    var login = _ref.login,
      password = _ref.password;
    (0, _classCallCheck2["default"])(this, SmsCallrProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-callr-provider');
    this.apiKey = Buffer.from("".concat(login, ":").concat(password)).toString('base64');
  }

  /*
   * Note: 'from', 'messageClass', 'ttl' are not supported.
   */
  return (0, _createClass2["default"])(SmsCallrProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, id, userId, from, to, text, type, nature, response, responseBody, error;
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
              _ref2 = _context.t0;
              id = _ref2.id;
              userId = _ref2.userId;
              from = _ref2.from;
              to = _ref2.to;
              text = _ref2.text;
              type = _ref2.type;
              nature = _ref2.nature;
              _context.next = 17;
              return (0, _request["default"])('https://api.callr.com/rest/v1.1/sms', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Basic ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  from: from,
                  to: to,
                  body: text,
                  options: _objectSpread({
                    force_encoding: type === 'unicode' ? 'UNICODE' : 'GSM',
                    nature: nature === 'marketing' ? 'MARKETING' : 'ALERTING'
                  }, userId || id ? {
                    user_data: userId || id
                  } : null)
                })
              });
            case 17:
              response = _context.sent;
              _context.next = 20;
              return response.json();
            case 20:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 25;
                break;
              }
              return _context.abrupt("return", responseBody.data);
            case 25:
              error = responseBody.data;
              throw new Error((0, _keys["default"])(error).map(function (key) {
                return "".concat(key, ": ").concat(error[key]);
              }).join(', '));
            case 27:
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