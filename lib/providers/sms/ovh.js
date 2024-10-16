"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _now = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/date/now"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _crypto = _interopRequireDefault(require("crypto"));
// Types
var SmsOvhProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsOvhProvider(_ref) {
    var appKey = _ref.appKey,
      appSecret = _ref.appSecret,
      consumerKey = _ref.consumerKey,
      account = _ref.account,
      host = _ref.host;
    (0, _classCallCheck2["default"])(this, SmsOvhProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-ovh-provider');
    this.credentials = {
      appKey: appKey,
      appSecret: appSecret,
      consumerKey: consumerKey,
      account: account,
      host: host
    };
  }
  return (0, _createClass2["default"])(SmsOvhProvider, [{
    key: "signRequest",
    value: function signRequest(httpMethod, url, body, timestamp) {
      var _this$credentials = this.credentials,
        appSecret = _this$credentials.appSecret,
        consumerKey = _this$credentials.consumerKey;
      var signature = [appSecret, consumerKey, httpMethod, url, body, timestamp];
      return '$1$' + _crypto["default"].createHash('sha1').update(signature.join('+')).digest('hex');
    }

    /*
     * Note: read this tutorial to create credentials on Ovh.com:
     * https://www.ovh.com/fr/g1639.envoyer_des_sms_avec_lapi_ovh_en_php
     */
  }, {
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _this$credentials2, appKey, consumerKey, account, host, timestamp, _ref2, from, to, text, type, ttl, messageClass, body, reqBody, url, response, responseBody;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this$credentials2 = this.credentials, appKey = _this$credentials2.appKey, consumerKey = _this$credentials2.consumerKey, account = _this$credentials2.account, host = _this$credentials2.host;
              timestamp = Math.round((0, _now["default"])() / 1000); // Documentation: https://api.ovh.com/console/#/sms/%7BserviceName%7D/jobs#POST
              if (!request.customize) {
                _context.next = 8;
                break;
              }
              _context.next = 5;
              return request.customize(this.id, request);
            case 5:
              _context.t0 = _context.sent;
              _context.next = 9;
              break;
            case 8:
              _context.t0 = request;
            case 9:
              _ref2 = _context.t0;
              from = _ref2.from;
              to = _ref2.to;
              text = _ref2.text;
              type = _ref2.type;
              ttl = _ref2.ttl;
              messageClass = _ref2.messageClass;
              body = (0, _stringify["default"])({
                sender: from,
                message: text,
                receivers: [to],
                charset: 'UTF-8',
                "class": messageClass === 0 ? 'flash' : messageClass === 1 ? 'phoneDisplay' : messageClass === 2 ? 'sim' : messageClass === 3 ? 'toolkit' : null,
                noStopClause: type === 'transactional',
                validityPeriod: ttl
              }); // Escape unicode
              reqBody = body.replace(/[\u0080-\uFFFF]/g, function (m) {
                return "\\u" + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
              });
              url = "https://".concat(host, "/1.0/sms/").concat(account, "/jobs/");
              _context.next = 21;
              return (0, _request["default"])(url, {
                method: 'POST',
                headers: {
                  'X-Ovh-Timestamp': timestamp,
                  'X-Ovh-Signature': this.signRequest('POST', url, reqBody, timestamp),
                  'X-Ovh-Consumer': consumerKey,
                  'X-Ovh-Application': appKey,
                  'Content-Length': reqBody.length,
                  'Content-Type': 'application/json charset=utf-8',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: body
              });
            case 21:
              response = _context.sent;
              _context.next = 24;
              return response.json();
            case 24:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 29;
                break;
              }
              return _context.abrupt("return", responseBody.ids[0]);
            case 29:
              throw new Error("".concat(response.status, " - ").concat(responseBody.message));
            case 30:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }())
  }]);
}();