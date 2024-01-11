'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _notificationCatcherProvider = require('../notificationCatcherProvider');

var _notificationCatcherProvider2 = _interopRequireDefault(_notificationCatcherProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SlackCatcherProvider = function (_NotificationCatcherP) {
  (0, _inherits3.default)(SlackCatcherProvider, _NotificationCatcherP);

  function SlackCatcherProvider() {
    (0, _classCallCheck3.default)(this, SlackCatcherProvider);
    return (0, _possibleConstructorReturn3.default)(this, (SlackCatcherProvider.__proto__ || (0, _getPrototypeOf2.default)(SlackCatcherProvider)).apply(this, arguments));
  }

  (0, _createClass3.default)(SlackCatcherProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, text;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
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
                text = _ref2.text;

                this.sendToCatcher({
                  to: 'public.channel@slack',
                  from: '-',
                  subject: '' + text.substring(0, 20) + (text.length > 20 ? '...' : ''),
                  text: text,
                  headers: {
                    'X-type': 'slack',
                    'X-to': '[slack public channel]'
                  }
                });
                return _context.abrupt('return', '');

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return SlackCatcherProvider;
}(_notificationCatcherProvider2.default);

exports.default = SlackCatcherProvider;