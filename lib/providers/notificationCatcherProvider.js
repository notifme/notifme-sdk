'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _smtp = require('./email/smtp');

var _smtp2 = _interopRequireDefault(_smtp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var NotificationCatcherProvider = function () {
  (0, _createClass3.default)(NotificationCatcherProvider, null, [{
    key: 'getConfig',
    value: function getConfig(channels) {
      return channels.reduce(function (config, channel) {
        return (0, _extends4.default)({}, config, (0, _defineProperty3.default)({}, channel, {
          providers: [{ type: 'notificationcatcher' }],
          multiProviderStrategy: 'no-fallback'
        }));
      }, {});
    }
  }]);

  function NotificationCatcherProvider(channel) {
    (0, _classCallCheck3.default)(this, NotificationCatcherProvider);

    this.id = channel + '-notificationcatcher-provider';

    var options = process.env.NOTIFME_CATCHER_OPTIONS || {
      port: 1025,
      ignoreTLS: true
    };

    this.provider = new _smtp2.default(options);
  }

  (0, _createClass3.default)(NotificationCatcherProvider, [{
    key: 'sendToCatcher',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.provider.send(request));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sendToCatcher(_x) {
        return _ref.apply(this, arguments);
      }

      return sendToCatcher;
    }()
  }]);
  return NotificationCatcherProvider;
}();

exports.default = NotificationCatcherProvider;