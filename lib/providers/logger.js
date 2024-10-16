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
var _logger = _interopRequireDefault(require("../util/logger"));
// Types
var LoggerProvider = exports["default"] = /*#__PURE__*/function () {
  function LoggerProvider(config, channel) {
    (0, _classCallCheck2["default"])(this, LoggerProvider);
    this.id = "".concat(channel, "-logger-provider");
    this.channel = channel;
  }
  return (0, _createClass2["default"])(LoggerProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _logger["default"].info("[".concat(this.channel.toUpperCase(), "] Sent by \"").concat(this.id, "\":"));
              _logger["default"].info(request);
              return _context.abrupt("return", "id-".concat(Math.round(Math.random() * 1000000000)));
            case 3:
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