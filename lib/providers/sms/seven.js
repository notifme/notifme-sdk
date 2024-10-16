"use strict";

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
// Types
var SmsSevenProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsSevenProvider(_ref) {
    var apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, SmsSevenProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-seven-provider');
    this.apiKey = apiKey;
  }

  /*
   * Note: 'nature' is not supported.
   */
  return (0, _createClass2["default"])(SmsSevenProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, text, to, type, ttl, messageClass, params, response, _yield$response$json, messages, message;
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
              text = _ref2.text;
              to = _ref2.to;
              type = _ref2.type;
              ttl = _ref2.ttl;
              messageClass = _ref2.messageClass;
              params = {
                flash: messageClass === 0 ? 1 : 0,
                from: from,
                text: text,
                to: to,
                ttl: ttl,
                unicode: type === 'unicode' ? 1 : 0
              };
              _context.next = 17;
              return (0, _request["default"])('https://gateway.seven.io/api/sms', {
                body: (0, _stringify["default"])(params),
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  SentWith: 'Notifme',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
                  'X-Api-Key': this.apiKey
                },
                method: 'POST'
              });
            case 17:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 27;
                break;
              }
              _context.next = 21;
              return response.json();
            case 21:
              _yield$response$json = _context.sent;
              messages = _yield$response$json.messages;
              message = messages[0];
              return _context.abrupt("return", message.id);
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