"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _winston = _interopRequireDefault(require("winston"));
var Logger = /*#__PURE__*/function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
    this.innerLogger = _winston["default"].createLogger();
    this.configure({
      transports: [new _winston["default"].transports.Console({
        colorize: true
      })]
    });
  }
  return (0, _createClass2["default"])(Logger, [{
    key: "configure",
    value: function configure(options) {
      this.innerLogger.configure(options);
    }
  }, {
    key: "mute",
    value: function mute() {
      this.configure({
        transports: []
      });
    }
  }, {
    key: "log",
    value: function log(level, info, extra) {
      this.innerLogger.log(level, info, extra);
    }
  }, {
    key: "error",
    value: function error(info, extra) {
      this.log('error', info, extra);
    }
  }, {
    key: "warn",
    value: function warn(info, extra) {
      this.log('warn', info, extra);
    }
  }, {
    key: "info",
    value: function info(_info, extra) {
      this.log('info', _info, extra);
    }
  }]);
}();
var _default = exports["default"] = new Logger();