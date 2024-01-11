'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _request = require('../../util/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SmsCallrProvider = function () {
  function SmsCallrProvider(_ref) {
    var login = _ref.login,
        password = _ref.password;
    (0, _classCallCheck3.default)(this, SmsCallrProvider);
    this.id = 'sms-callr-provider';

    this.apiKey = Buffer.from(login + ':' + password).toString('base64');
  }

  /*
   * Note: 'from', 'messageClass', 'ttl' are not supported.
   */


  (0, _createClass3.default)(SmsCallrProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref3, id, userId, from, to, text, type, nature, response, responseBody, error;

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
                _ref3 = _context.t0;
                id = _ref3.id;
                userId = _ref3.userId;
                from = _ref3.from;
                to = _ref3.to;
                text = _ref3.text;
                type = _ref3.type;
                nature = _ref3.nature;
                _context.next = 17;
                return (0, _request2.default)('https://api.callr.com/rest/v1.1/sms', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)({
                    from: from,
                    to: to,
                    body: text,
                    options: (0, _extends3.default)({
                      force_encoding: type === 'unicode' ? 'UNICODE' : 'GSM',
                      nature: nature === 'marketing' ? 'MARKETING' : 'ALERTING'
                    }, userId || id ? { user_data: userId || id } : null)
                  })
                });

              case 17:
                response = _context.sent;
                _context.next = 20;
                return response.json();

              case 20:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 25;
                  break;
                }

                return _context.abrupt('return', responseBody.data);

              case 25:
                error = responseBody.data;
                throw new Error((0, _keys2.default)(error).map(function (key) {
                  return key + ': ' + error[key];
                }).join(', '));

              case 27:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return SmsCallrProvider;
}();

exports.default = SmsCallrProvider;