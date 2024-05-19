"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _crypto = _interopRequireDefault(require("crypto"));
var _request = _interopRequireDefault(require("../../util/request"));
// Types
var EmailMailerSendProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailMailerSendProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailMailerSendProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-mailersend-provider');
    this.apiKey = config.apiKey;
  }
  return (0, _createClass2["default"])(EmailMailerSendProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _this = this;
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, generatedId, parsedFrom, parsedTo, data, response, responseHeaders, messageId, responseBody, _responseBody$errors, firstError, message;
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
              generatedId = id || _crypto["default"].randomBytes(16).toString('hex');
              parsedFrom = this.parseEmailString(from);
              parsedTo = this.parseEmailString(to);
              data = {
                from: {
                  email: parsedFrom.email,
                  name: parsedFrom.name
                },
                to: [{
                  email: parsedTo.email,
                  name: parsedTo.name
                }],
                subject: subject,
                html: html,
                text: text,
                reply_to: replyTo ? [{
                  email: replyTo
                }] : undefined,
                cc: cc && cc.length ? cc.map(function (email) {
                  return _this.parseEmailString(email);
                }) : undefined,
                bcc: bcc && bcc.length ? bcc.map(function (email) {
                  return _this.parseEmailString(email);
                }) : undefined,
                attachments: attachments && attachments.length > 0 ? attachments.map(function (_ref2) {
                  var contentType = _ref2.contentType,
                    filename = _ref2.filename,
                    content = _ref2.content;
                  return {
                    type: contentType,
                    filename: filename,
                    content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                  };
                }) : undefined,
                headers: headers,
                custom_args: {
                  id: generatedId,
                  userId: userId
                }
              };
              _context.next = 26;
              return (0, _request["default"])('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                  Authorization: "Bearer ".concat(this.apiKey),
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(data)
              });
            case 26:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 35;
                break;
              }
              responseHeaders = response.headers;
              messageId = responseHeaders.get('x-message-id');
              if (messageId) {
                _context.next = 32;
                break;
              }
              throw new Error('Failed to send email: No ID returned in response.');
            case 32:
              return _context.abrupt("return", messageId);
            case 35:
              _context.next = 37;
              return response.json();
            case 37:
              responseBody = _context.sent;
              _responseBody$errors = (0, _slicedToArray2["default"])(responseBody.errors, 1), firstError = _responseBody$errors[0];
              message = (0, _keys["default"])(firstError).map(function (key) {
                return "".concat(key, ": ").concat(firstError[key]);
              }).join(', ');
              throw new Error("".concat(response.status, " - ").concat(message));
            case 41:
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
  }, {
    key: "parseEmailString",
    value: function parseEmailString(emailString) {
      var match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/);
      return {
        name: match[1] ? match[1].trim() : '',
        email: match[2] ? match[2].trim() : emailString.trim()
      };
    }
  }]);
}();