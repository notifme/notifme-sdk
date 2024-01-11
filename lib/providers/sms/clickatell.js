'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
var SmsClickatellProvider = function () {
  function SmsClickatellProvider(config) {
    (0, _classCallCheck3.default)(this, SmsClickatellProvider);
    this.id = 'sms-clickatell-provider';

    // One-way integration API key
    this.apiKey = config.apiKey;
  }

  /*
   * Note: 'from', 'nature', 'messageClass' are not supported.
   */


  (0, _createClass3.default)(SmsClickatellProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, id, to, text, type, ttl, response, responseBody;

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
                id = _ref2.id;
                to = _ref2.to;
                text = _ref2.text;
                type = _ref2.type;
                ttl = _ref2.ttl;
                _context.next = 15;
                return (0, _request2.default)('https://platform.clickatell.com/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)((0, _extends3.default)({
                    // no `from` for one-way integrations
                    to: [to],
                    content: text,
                    charset: type === 'unicode' ? 'UCS2-BE' : 'UTF-8'
                  }, ttl ? { validityPeriod: ttl } : null, id ? { clientMessageId: id } : null))
                });

              case 15:
                response = _context.sent;

                if (!response.ok) {
                  _context.next = 27;
                  break;
                }

                _context.next = 19;
                return response.json();

              case 19:
                responseBody = _context.sent;

                if (!responseBody.error) {
                  _context.next = 24;
                  break;
                }

                throw new Error(responseBody.error);

              case 24:
                return _context.abrupt('return', responseBody.messages[0].apiMessageId);

              case 25:
                _context.next = 32;
                break;

              case 27:
                _context.t1 = Error;
                _context.next = 30;
                return response.text();

              case 30:
                _context.t2 = _context.sent;
                throw new _context.t1(_context.t2);

              case 32:
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
  return SmsClickatellProvider;
}();

exports.default = SmsClickatellProvider;