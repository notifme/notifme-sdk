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

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SmsTwilioProvider = function () {
  function SmsTwilioProvider(_ref) {
    var accountSid = _ref.accountSid,
        authToken = _ref.authToken;
    (0, _classCallCheck3.default)(this, SmsTwilioProvider);
    this.id = 'sms-twilio-provider';

    this.accountSid = accountSid;
    this.apiKey = Buffer.from(accountSid + ':' + authToken).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'messageClass' are not supported.
   */


  (0, _createClass3.default)(SmsTwilioProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref3, from, to, text, ttl, form, response, responseBody;

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
                ttl = _ref3.ttl;
                form = new _formData2.default();

                form.append('From', from);
                form.append('To', to);
                form.append('Body', text);
                if (ttl) form.append('ValidityPeriod', ttl);
                _context.next = 19;
                return (0, _request2.default)('https://api.twilio.com/2010-04-01/Accounts/' + this.accountSid + '/Messages.json', {
                  method: 'POST',
                  headers: {
                    Authorization: 'Basic ' + this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: form
                });

              case 19:
                response = _context.sent;
                _context.next = 22;
                return response.json();

              case 22:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 27;
                  break;
                }

                return _context.abrupt('return', responseBody.sid);

              case 27:
                throw new Error(response.status + ' - ' + responseBody.message);

              case 28:
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
  return SmsTwilioProvider;
}();

exports.default = SmsTwilioProvider;