"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _formData = _interopRequireDefault(require("form-data"));
// types
var EmailMailgunProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailMailgunProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailMailgunProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-mailgun-provider');
    this.apiKeyBase64 = Buffer.from("api:".concat(config.apiKey)).toString('base64');
    this.domainName = config.domainName;
    this.host = config.host || 'api.mailgun.net';
    this.version = config.version || 'v3';
  }
  return (0, _createClass2["default"])(EmailMailgunProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, form, response, responseBody;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
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
              _ref = _context.t0;
              id = _ref.id;
              userId = _ref.userId;
              from = _ref.from;
              replyTo = _ref.replyTo;
              subject = _ref.subject;
              html = _ref.html;
              text = _ref.text;
              headers = _ref.headers;
              to = _ref.to;
              cc = _ref.cc;
              bcc = _ref.bcc;
              attachments = _ref.attachments;
              form = new _formData["default"]();
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
                attachments.forEach(function (_ref2) {
                  var contentType = _ref2.contentType,
                    filename = _ref2.filename,
                    content = _ref2.content;
                  form.append('attachment', content, {
                    filename: filename,
                    contentType: contentType
                  });
                });
              }
              if (headers) (0, _keys["default"])(headers).forEach(function (header) {
                return form.append("h:".concat(header), headers[header]);
              });
              if (id) form.append('v:Notification-Id', id);
              if (userId) form.append('v:User-Id', userId);
              _context.next = 35;
              return (0, _request["default"])("https://".concat(this.host, "/").concat(this.version, "/").concat(this.domainName, "/messages"), {
                method: 'POST',
                headers: {
                  Authorization: "Basic ".concat(this.apiKeyBase64),
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
              return _context.abrupt("return", responseBody.id);
            case 43:
              throw new Error("".concat(response.status, " - ").concat(responseBody.message));
            case 44:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }]);
}();