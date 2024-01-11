'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
var SmsPlivoProvider = function () {
  function SmsPlivoProvider(_ref) {
    var authId = _ref.authId,
        authToken = _ref.authToken;
    (0, _classCallCheck3.default)(this, SmsPlivoProvider);
    this.id = 'sms-plivo-provider';

    this.authId = authId;
    this.apiKey = Buffer.from(authId + ':' + authToken).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */


  (0, _createClass3.default)(SmsPlivoProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref3, from, to, text, response, responseBody;

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
                from = _ref3.from;
                to = _ref3.to;
                text = _ref3.text;
                _context.next = 13;
                return (0, _request2.default)('https://api.plivo.com/v1/Account/' + this.authId + '/Message/', {
                  method: 'POST',
                  headers: {
                    Authorization: 'Basic ' + this.apiKey,
                    'Content-Type': 'application/json',
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)({
                    src: from,
                    dst: to,
                    text: text
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
                return _context.abrupt('return', responseBody.message_uuid[0]);

              case 21:
                _context.t1 = Error;

                if (!(response.status === 401)) {
                  _context.next = 28;
                  break;
                }

                _context.next = 25;
                return response.text();

              case 25:
                _context.t2 = _context.sent;
                _context.next = 31;
                break;

              case 28:
                _context.next = 30;
                return response.json();

              case 30:
                _context.t2 = _context.sent.error;

              case 31:
                _context.t3 = _context.t2;
                throw new _context.t1(_context.t3);

              case 33:
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
  return SmsPlivoProvider;
}();

exports.default = SmsPlivoProvider;