'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

// types
var EmailMailgunProvider = function () {
  function EmailMailgunProvider(config) {
    (0, _classCallCheck3.default)(this, EmailMailgunProvider);
    this.id = 'email-mailgun-provider';

    this.apiKeyBase64 = Buffer.from('api:' + config.apiKey).toString('base64');
    this.domainName = config.domainName;
    this.host = config.host || 'api.mailgun.net';
    this.version = config.version || 'v3';
  }

  (0, _createClass3.default)(EmailMailgunProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _ref2, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, form, response, responseBody;

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
                form = new _formData2.default();

                form.append('from', from);
                form.append('to', to);
                form.append('subject', subject);
                if (text) form.append('text', text);
                if (html) form.append('html', html);
                if (replyTo) form.append('h:Reply-To', replyTo);
                if (cc && cc.length > 0) cc.forEach(function (email) {
                  return form.append('cc', email);
                });
                if (bcc && bcc.length > 0) bcc.forEach(function (email) {
                  return form.append('bcc', email);
                });
                if (attachments && attachments.length > 0) {
                  attachments.forEach(function (_ref3) {
                    var contentType = _ref3.contentType,
                        filename = _ref3.filename,
                        content = _ref3.content;

                    form.append('attachment', content, { filename: filename, contentType: contentType });
                  });
                }
                if (headers) (0, _keys2.default)(headers).forEach(function (header) {
                  return form.append('h:' + header, headers[header]);
                });
                if (id) form.append('v:Notification-Id', id);
                if (userId) form.append('v:User-Id', userId);

                _context.next = 35;
                return (0, _request2.default)('https://' + this.host + '/' + this.version + '/' + this.domainName + '/messages', {
                  method: 'POST',
                  headers: {
                    Authorization: 'Basic ' + this.apiKeyBase64,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: form
                });

              case 35:
                response = _context.sent;
                _context.next = 38;
                return response.json();

              case 38:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 43;
                  break;
                }

                return _context.abrupt('return', responseBody.id);

              case 43:
                throw new Error(response.status + ' - ' + responseBody.message);

              case 44:
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
  return EmailMailgunProvider;
}();

exports.default = EmailMailgunProvider;