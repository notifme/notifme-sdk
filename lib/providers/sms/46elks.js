"use strict";

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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _querystring = _interopRequireDefault(require("querystring"));
// Types
var Sms46elksProvider = exports["default"] = /*#__PURE__*/function () {
  function Sms46elksProvider(_ref) {
    var apiUsername = _ref.apiUsername,
      apiPassword = _ref.apiPassword;
    (0, _classCallCheck2["default"])(this, Sms46elksProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-46elks-provider');
    this.apiKey = Buffer.from("".concat(apiUsername, ":").concat(apiPassword)).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  return (0, _createClass2["default"])(Sms46elksProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, text, response, responseBody;
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
              return (0, _request["default"])('https://api.46elks.com/a1/sms', {
                method: 'POST',
                headers: {
                  Authorization: "Basic ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: _querystring["default"].stringify({
                  from: from,
                  to: to,
                  message: text
                })
              });
            case 13:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 21;
                break;
              }
              _context.next = 17;
              return response.json();
            case 17:
              responseBody = _context.sent;
              return _context.abrupt("return", responseBody.id);
            case 21:
              _context.t1 = Error;
              _context.next = 24;
              return response.text();
            case 24:
              _context.t2 = _context.sent;
              throw new _context.t1(_context.t2);
            case 26:
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