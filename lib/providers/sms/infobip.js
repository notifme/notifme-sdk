"use strict";

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
// Types
var SmsInfobipProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsInfobipProvider(_ref) {
    var username = _ref.username,
      password = _ref.password;
    (0, _classCallCheck2["default"])(this, SmsInfobipProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-infobip-provider');
    this.apiKey = Buffer.from("".concat(username, ":").concat(password)).toString('base64');
  }

  /*
   * Note: 'nature', 'messageClass', 'type', 'ttl' are not supported.
   */
  return (0, _createClass2["default"])(SmsInfobipProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, text, response, responseBody, message, error, _error, _message;
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
              from = _ref2.from;
              to = _ref2.to;
              text = _ref2.text;
              _context.next = 13;
              return (0, _request["default"])('https://api.infobip.com/sms/1/text/single', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Basic ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  from: from,
                  to: to,
                  text: text
                })
              });
            case 13:
              response = _context.sent;
              _context.next = 16;
              return response.json();
            case 16:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 27;
                break;
              }
              message = responseBody.messages[0];
              if (!(message.status.groupId === 1)) {
                _context.next = 23;
                break;
              }
              return _context.abrupt("return", message.messageId);
            case 23:
              error = message.status;
              throw new Error((0, _keys["default"])(error).map(function (key) {
                return "".concat(key, ": ").concat(error[key]);
              }).join(', '));
            case 25:
              _context.next = 34;
              break;
            case 27:
              if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                _context.next = 33;
                break;
              }
              _error = responseBody.requestError.serviceException;
              _message = (0, _keys["default"])(_error).map(function (key) {
                return "".concat(key, ": ").concat(_error[key]);
              }).join(', ');
              throw new Error(_message);
            case 33:
              throw new Error((0, _stringify["default"])(responseBody));
            case 34:
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