'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logger = function () {
  function Logger() {
    (0, _classCallCheck3.default)(this, Logger);

    this.innerLogger = _winston2.default.createLogger();
    this.configure({
      transports: [new _winston2.default.transports.Console({ colorize: true })]
    });
  }

  (0, _createClass3.default)(Logger, [{
    key: 'configure',
    value: function configure(options) {
      this.innerLogger.configure(options);
    }
  }, {
    key: 'mute',
    value: function mute() {
      this.configure({ transports: [] });
    }
  }, {
    key: 'log',
    value: function log(level, info, extra) {
      this.innerLogger.log(level, info, extra);
    }
  }, {
    key: 'error',
    value: function error(info, extra) {
      this.log('error', info, extra);
    }
  }, {
    key: 'warn',
    value: function warn(info, extra) {
      this.log('warn', info, extra);
    }
  }, {
    key: 'info',
    value: function info(_info, extra) {
      this.log('info', _info, extra);
    }
  }]);
  return Logger;
}();

exports.default = new Logger();