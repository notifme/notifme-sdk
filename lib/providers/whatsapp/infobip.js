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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _excluded = ["from", "to", "type", "messageId", "text", "mediaUrl", "templateName", "templateData"];
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var WhatsappInfobipProvider = exports["default"] = /*#__PURE__*/function () {
  function WhatsappInfobipProvider(_ref) {
    var baseUrl = _ref.baseUrl,
      apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, WhatsappInfobipProvider);
    (0, _defineProperty2["default"])(this, "id", 'whatsapp-infobip-provider');
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  return (0, _createClass2["default"])(WhatsappInfobipProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, type, messageId, text, mediaUrl, templateName, templateData, rest, payload, response, responseBody, _ref3, _ref4, message, error, _message;
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
              _ref2 = _context.t0;
              from = _ref2.from;
              to = _ref2.to;
              type = _ref2.type;
              messageId = _ref2.messageId;
              text = _ref2.text;
              mediaUrl = _ref2.mediaUrl;
              templateName = _ref2.templateName;
              templateData = _ref2.templateData;
              rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
              // Construct the payload
              payload = _objectSpread({
                from: (from || '').replace('+', ''),
                to: (to || '').replace('+', ''),
                messageId: messageId,
                content: {
                  text: text,
                  mediaUrl: mediaUrl,
                  templateName: templateName,
                  templateData: templateData
                }
              }, rest);
              _context.next = 20;
              return (0, _request["default"])("".concat(this.baseUrl, "/whatsapp/1/message/").concat(type), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "App ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(type === 'template' ? [payload] : payload)
              });
            case 20:
              response = _context.sent;
              _context.next = 23;
              return response.json();
            case 23:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 29;
                break;
              }
              // Handle the potential array or single object response
              _ref3 = (0, _isArray["default"])(responseBody.messages) ? responseBody.messages : [responseBody], _ref4 = (0, _slicedToArray2["default"])(_ref3, 1), message = _ref4[0];
              return _context.abrupt("return", message.messageId);
            case 29:
              if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                _context.next = 35;
                break;
              }
              error = responseBody.requestError.serviceException;
              _message = (0, _keys["default"])(error).map(function (key) {
                return "".concat(key, ": ").concat(error[key]);
              }).join(', ');
              throw new Error(_message);
            case 35:
              throw new Error((0, _stringify["default"])(responseBody));
            case 36:
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