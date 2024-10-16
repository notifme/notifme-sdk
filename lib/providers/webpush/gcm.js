"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _webPush = _interopRequireDefault(require("web-push"));
var _excluded = ["subscription"];
// Types
var WebpushGcmProvider = exports["default"] = /*#__PURE__*/function () {
  function WebpushGcmProvider(_ref) {
    var gcmAPIKey = _ref.gcmAPIKey,
      vapidDetails = _ref.vapidDetails,
      ttl = _ref.ttl,
      headers = _ref.headers;
    (0, _classCallCheck2["default"])(this, WebpushGcmProvider);
    (0, _defineProperty2["default"])(this, "id", 'webpush-gcm-provider');
    this.options = {
      TTL: ttl,
      headers: headers
    };
    if (gcmAPIKey) {
      _webPush["default"].setGCMAPIKey(gcmAPIKey);
    }
    if (vapidDetails) {
      var subject = vapidDetails.subject,
        publicKey = vapidDetails.publicKey,
        privateKey = vapidDetails.privateKey;
      _webPush["default"].setVapidDetails(subject, publicKey, privateKey);
    }
  }
  return (0, _createClass2["default"])(WebpushGcmProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, subscription, rest, result;
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
              subscription = _ref2.subscription;
              rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
              _context.next = 12;
              return _webPush["default"].sendNotification(subscription, (0, _stringify["default"])(rest), this.options);
            case 12:
              result = _context.sent;
              return _context.abrupt("return", result.headers.location);
            case 14:
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