'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
var EmailSparkPostProvider = function () {
  function EmailSparkPostProvider(config) {
    (0, _classCallCheck3.default)(this, EmailSparkPostProvider);
    this.id = 'email-sparkpost-provider';

    this.apiKey = config.apiKey;
  }

  (0, _createClass3.default)(EmailSparkPostProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, response, responseBody, _responseBody$errors, firstError, message;

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
                return (0, _request2.default)('https://api.sparkpost.com/api/v1/transmissions', {
                  method: 'POST',
                  headers: {
                    Authorization: this.apiKey,
                    'Content-Type': 'application/json',
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)({
                    options: {
                      transactional: true
                    },
                    content: {
                      from: from,
                      reply_to: replyTo,
                      subject: subject,
                      html: html,
                      text: text,
                      headers: (0, _extends3.default)({}, headers, cc && cc.length > 0 ? { CC: cc.join(',') } : null),
                      attachments: (attachments || []).map(function (_ref3) {
                        var contentType = _ref3.contentType,
                            filename = _ref3.filename,
                            content = _ref3.content;
                        return {
                          type: contentType,
                          name: filename,
                          data: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                        };
                      })
                    },
                    recipients: [{ address: { email: to } }].concat((0, _toConsumableArray3.default)((cc || []).map(function (email) {
                      return { address: { email: email, header_to: to } };
                    })), (0, _toConsumableArray3.default)((bcc || []).map(function (email) {
                      return { address: { email: email, header_to: to } };
                    }))),
                    metadata: { id: id, userId: userId }
                  })
                });

              case 22:
                response = _context.sent;
                _context.next = 25;
                return response.json();

              case 25:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 30;
                  break;
                }

                return _context.abrupt('return', responseBody.results.id);

              case 30:
                _responseBody$errors = (0, _slicedToArray3.default)(responseBody.errors, 1), firstError = _responseBody$errors[0];
                message = (0, _keys2.default)(firstError).map(function (key) {
                  return key + ': ' + firstError[key];
                }).join(', ');
                throw new Error(response.status + ' - ' + message);

              case 33:
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
  return EmailSparkPostProvider;
}();

exports.default = EmailSparkPostProvider;