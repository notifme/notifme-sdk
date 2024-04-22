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
var WhatsappInfobipProvider = exports["default"] = /*#__PURE__*/function () {
  function WhatsappInfobipProvider(_ref) {
    var baseUrl = _ref.baseUrl,
      apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, WhatsappInfobipProvider);
    (0, _defineProperty2["default"])(this, "id", 'whatsapp-infobip-provider');
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  return (0, _createClass2["default"])(WhatsappInfobipProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, content, messageId, callbackData, notifyUrl, response, responseBody, message, error, _error, _message;
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
              content = _ref2.content;
              messageId = _ref2.messageId;
              callbackData = _ref2.callbackData;
              notifyUrl = _ref2.notifyUrl;
              _context.next = 16;
              return (0, _request["default"])(this.baseUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "App ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  from: from,
                  to: to,
                  content: content,
                  messageId: messageId,
                  callbackData: callbackData,
                  notifyUrl: notifyUrl,
                  urlOptions: {
                    shortenUrl: false,
                    trackClicks: false
                  }
                })
              });
            case 16:
              response = _context.sent;
              _context.next = 19;
              return response.json();
            case 19:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 30;
                break;
              }
              message = responseBody.messages[0];
              if (!(message.status.groupId === 1)) {
                _context.next = 26;
                break;
              }
              return _context.abrupt("return", message.messageId);
            case 26:
              error = message.status;
              throw new Error((0, _keys["default"])(error).map(function (key) {
                return "".concat(key, ": ").concat(error[key]);
              }).join(', '));
            case 28:
              _context.next = 37;
              break;
            case 30:
              if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                _context.next = 36;
                break;
              }
              _error = responseBody.requestError.serviceException;
              _message = (0, _keys["default"])(_error).map(function (key) {
                return "".concat(key, ": ").concat(_error[key]);
              }).join(', ');
              throw new Error(_message);
            case 36:
              throw new Error((0, _stringify["default"])(responseBody));
            case 37:
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
}();