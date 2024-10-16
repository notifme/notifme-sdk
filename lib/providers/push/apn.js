"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _nodePushnotifications = _interopRequireDefault(require("node-pushnotifications"));
var _excluded = ["registrationToken"];
// Types
var PushApnProvider = exports["default"] = /*#__PURE__*/function () {
  function PushApnProvider(config) {
    (0, _classCallCheck2["default"])(this, PushApnProvider);
    (0, _defineProperty2["default"])(this, "id", 'push-apn-provider');
    this.transporter = new _nodePushnotifications["default"]({
      apn: config
    });
  }
  return (0, _createClass2["default"])(PushApnProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, registrationToken, rest, result;
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
              registrationToken = _ref.registrationToken;
              rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
              _context.next = 12;
              return this.transporter.send([registrationToken], rest);
            case 12:
              result = _context.sent;
              if (!(result[0].failure > 0)) {
                _context.next = 17;
                break;
              }
              throw new Error(result[0].message[0].error);
            case 17:
              return _context.abrupt("return", result[0].message[0].messageId);
            case 18:
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