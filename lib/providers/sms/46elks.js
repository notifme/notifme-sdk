'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _request = require('../../util/request');

var _request2 = _interopRequireDefault(_request);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var Sms46elksProvider = function () {
  function Sms46elksProvider(_ref) {
    var apiUsername = _ref.apiUsername,
        apiPassword = _ref.apiPassword;
    (0, _classCallCheck3.default)(this, Sms46elksProvider);
    this.id = 'sms-46elks-provider';

    this.apiKey = Buffer.from(apiUsername + ':' + apiPassword).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */


  (0, _createClass3.default)(Sms46elksProvider, [{
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
                return (0, _request2.default)('https://api.46elks.com/a1/sms', {
                  method: 'POST',
                  headers: {
                    Authorization: 'Basic ' + this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: _querystring2.default.stringify({
                    from: from,
                    to: to,
                    message: text
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
                return _context.abrupt('return', responseBody.id);

              case 21:
                _context.t1 = Error;
                _context.next = 24;
                return response.text();

              case 24:
                _context.t2 = _context.sent;
                throw new _context.t1(_context.t2);

              case 26:
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
  return Sms46elksProvider;
}();

exports.default = Sms46elksProvider;