'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

// types
var EmailMandrillProvider = function () {
  function EmailMandrillProvider(config) {
    (0, _classCallCheck3.default)(this, EmailMandrillProvider);
    this.id = 'email-mandrill-provider';

    this.apiKey = config.apiKey;
  }

  (0, _createClass3.default)(EmailMandrillProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, response, responseBody, message;

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
                userId = _ref2.userId;
                from = _ref2.from;
                replyTo = _ref2.replyTo;
                subject = _ref2.subject;
                html = _ref2.html;
                text = _ref2.text;
                headers = _ref2.headers;
                to = _ref2.to;
                cc = _ref2.cc;
                bcc = _ref2.bcc;
                attachments = _ref2.attachments;
                _context.next = 22;
                return (0, _request2.default)('https://mandrillapp.com/api/1.0/messages/send.json', {
                  method: 'POST',
                  headers: {
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
                    'Content-Type': 'application/json'
                  },
                  body: (0, _stringify2.default)({
                    key: this.apiKey,
                    message: (0, _extends3.default)({
                      from_email: from,
                      to: [{ email: to, type: 'to' }].concat((0, _toConsumableArray3.default)(cc && cc.length ? cc.map(function (email) {
                        return { email: email, type: 'cc' };
                      }) : []), (0, _toConsumableArray3.default)(bcc && bcc.length ? bcc.map(function (email) {
                        return { email: email, type: 'bcc' };
                      }) : [])),
                      subject: subject,
                      text: text,
                      html: html,
                      headers: (0, _extends3.default)({}, replyTo ? { 'Reply-To': replyTo } : null, headers)
                    }, attachments && attachments.length ? {
                      attachments: attachments.map(function (_ref3) {
                        var contentType = _ref3.contentType,
                            filename = _ref3.filename,
                            content = _ref3.content;

                        return {
                          type: contentType,
                          name: filename,
                          content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                        };
                      })
                    } : null, {
                      metadata: {
                        id: id,
                        userId: userId
                      }
                    }),
                    async: false
                  })
                });

              case 22:
                response = _context.sent;
                _context.next = 25;
                return response.json();

              case 25:
                responseBody = _context.sent;

                if (!(response.ok && responseBody.length > 0)) {
                  _context.next = 30;
                  break;
                }

                return _context.abrupt('return', responseBody[0]._id);

              case 30:
                message = (0, _keys2.default)(responseBody).map(function (key) {
                  return key + ': ' + responseBody[key];
                }).join(', ');
                throw new Error(response.status + ' - ' + message);

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
  return EmailMandrillProvider;
}();

exports.default = EmailMandrillProvider;