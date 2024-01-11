'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _nodePushnotifications = require('node-pushnotifications');

var _nodePushnotifications2 = _interopRequireDefault(_nodePushnotifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var PushWnsProvider = function () {
  function PushWnsProvider(config) {
    (0, _classCallCheck3.default)(this, PushWnsProvider);
    this.id = 'push-wns-provider';

    this.transporter = new _nodePushnotifications2.default({
      wns: (0, _extends3.default)({}, config, {
        client_id: config.clientId,
        client_secret: config.clientSecret
      })
    });
  }

  (0, _createClass3.default)(PushWnsProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, registrationToken, rest, result;

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
                registrationToken = _ref2.registrationToken;
                rest = (0, _objectWithoutProperties3.default)(_ref2, ['registrationToken']);
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
                return _context.abrupt('return', result[0].message[0].messageId);

              case 18:
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
  return PushWnsProvider;
}();

exports.default = PushWnsProvider;