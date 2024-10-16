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
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// types
var EmailMandrillProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailMandrillProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailMandrillProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-mandrill-provider');
    this.apiKey = config.apiKey;
  }
  return (0, _createClass2["default"])(EmailMandrillProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, response, responseBody, message;
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
              _context.next = 22;
              return (0, _request["default"])('https://mandrillapp.com/api/1.0/messages/send.json', {
                method: 'POST',
                headers: {
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
                  'Content-Type': 'application/json'
                },
                body: (0, _stringify["default"])({
                  key: this.apiKey,
                  message: _objectSpread(_objectSpread({
                    from_email: from,
                    to: [{
                      email: to,
                      type: 'to'
                    }].concat((0, _toConsumableArray2["default"])(cc && cc.length ? cc.map(function (email) {
                      return {
                        email: email,
                        type: 'cc'
                      };
                    }) : []), (0, _toConsumableArray2["default"])(bcc && bcc.length ? bcc.map(function (email) {
                      return {
                        email: email,
                        type: 'bcc'
                      };
                    }) : [])),
                    subject: subject,
                    text: text,
                    html: html,
                    headers: _objectSpread(_objectSpread({}, replyTo ? {
                      'Reply-To': replyTo
                    } : null), headers)
                  }, attachments && attachments.length ? {
                    attachments: attachments.map(function (_ref2) {
                      var contentType = _ref2.contentType,
                        filename = _ref2.filename,
                        content = _ref2.content;
                      return {
                        type: contentType,
                        name: filename,
                        content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                      };
                    })
                  } : null), {}, {
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
              return _context.abrupt("return", responseBody[0]._id);
            case 30:
              message = (0, _keys["default"])(responseBody).map(function (key) {
                return "".concat(key, ": ").concat(responseBody[key]);
              }).join(', ');
              throw new Error("".concat(response.status, " - ").concat(message));
            case 32:
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