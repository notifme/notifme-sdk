"use strict";

var _Object$keys2 = require("@babel/runtime-corejs2/core-js/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs2/core-js/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _crypto = _interopRequireDefault(require("crypto"));
var _request = _interopRequireDefault(require("../../util/request"));
var _parseEmailString = require("../../util/parseEmailString");
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
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
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, messageId, generatedId, parsedFrom, parsedTo, data, response, responseHeaders, _messageId, responseBody, firstError, message;
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
              messageId = _ref.messageId;
              generatedId = id || _crypto["default"].randomBytes(16).toString('hex');
              parsedFrom = (0, _parseEmailString.parseEmailString)(from);
              parsedTo = (0, _parseEmailString.parseEmailString)(to);
              data = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
                from: _objectSpread({
                  email: parsedFrom.email
                }, parsedFrom.name ? {
                  name: parsedFrom.name
                } : {}),
                to: [_objectSpread({
                  email: parsedTo.email
                }, parsedTo.name ? {
                  name: parsedTo.name
                } : {})],
                subject: subject,
                html: html,
                text: text
              }, replyTo ? {
                reply_to: [{
                  email: replyTo
                }]
              } : {}), cc && cc.length ? {
                cc: cc.map(function (email) {
                  var parsed = (0, _parseEmailString.parseEmailString)(email);
                  return _objectSpread({
                    email: parsed.email
                  }, parsed.name ? {
                    name: parsed.name
                  } : {});
                })
              } : {}), bcc && bcc.length ? {
                bcc: bcc.map(function (email) {
                  var parsed = (0, _parseEmailString.parseEmailString)(email);
                  return _objectSpread({
                    email: parsed.email
                  }, parsed.name ? {
                    name: parsed.name
                  } : {});
                })
              } : {}), attachments && attachments.length ? {
                attachments: attachments.map(function (_ref2) {
                  var contentType = _ref2.contentType,
                    filename = _ref2.filename,
                    content = _ref2.content;
                  return {
                    type: contentType,
                    filename: filename,
                    content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                  };
                })
              } : {}), {}, {
                headers: headers,
                custom_args: {
                  id: generatedId,
                  userId: userId
                }
              }, messageId ? {
                message_id: messageId
              } : {});
              _context.next = 27;
              return (0, _request["default"])('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                  Authorization: "Bearer ".concat(this.apiKey),
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(data)
              });
            case 27:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 36;
                break;
              }
              responseHeaders = response.headers;
              _messageId = responseHeaders.get('x-message-id');
              if (_messageId) {
                _context.next = 33;
                break;
              }
              throw new Error('Failed to send email: No ID returned in response.');
            case 33:
              return _context.abrupt("return", _messageId);
            case 36:
              _context.next = 38;
              return response.json();
            case 38:
              responseBody = _context.sent;
              firstError = (0, _isArray["default"])(responseBody.errors) ? responseBody.errors[0] : null;
              if (!firstError) {
                _context.next = 45;
                break;
              }
              message = (0, _keys["default"])(firstError).map(function (key) {
                return "".concat(key, ": ").concat(firstError[key]);
              }).join(', ');
              throw new Error("".concat(response.status, " - ").concat(message));
            case 45:
              throw new Error("".concat(response.status, " - Unknown error"));
            case 46:
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