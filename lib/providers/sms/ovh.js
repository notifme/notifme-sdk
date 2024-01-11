'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SmsOvhProvider = function () {
  function SmsOvhProvider(_ref) {
    var appKey = _ref.appKey,
        appSecret = _ref.appSecret,
        consumerKey = _ref.consumerKey,
        account = _ref.account,
        host = _ref.host;
    (0, _classCallCheck3.default)(this, SmsOvhProvider);
    this.id = 'sms-ovh-provider';

    this.credentials = { appKey: appKey, appSecret: appSecret, consumerKey: consumerKey, account: account, host: host };
  }

  (0, _createClass3.default)(SmsOvhProvider, [{
    key: 'signRequest',
    value: function signRequest(httpMethod, url, body, timestamp) {
      var _credentials = this.credentials,
          appSecret = _credentials.appSecret,
          consumerKey = _credentials.consumerKey;

      var signature = [appSecret, consumerKey, httpMethod, url, body, timestamp];
      return '$1$' + _crypto2.default.createHash('sha1').update(signature.join('+')).digest('hex');
    }

    /*
     * Note: read this tutorial to create credentials on Ovh.com:
     * https://www.ovh.com/fr/g1639.envoyer_des_sms_avec_lapi_ovh_en_php
     */

  }, {
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var _credentials2, appKey, consumerKey, account, host, timestamp, _ref3, from, to, text, type, ttl, messageClass, body, reqBody, url, response, responseBody;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _credentials2 = this.credentials, appKey = _credentials2.appKey, consumerKey = _credentials2.consumerKey, account = _credentials2.account, host = _credentials2.host;
                timestamp = Math.round(Date.now() / 1000);

                // Documentation: https://api.ovh.com/console/#/sms/%7BserviceName%7D/jobs#POST

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
                _ref3 = _context.t0;
                from = _ref3.from;
                to = _ref3.to;
                text = _ref3.text;
                type = _ref3.type;
                ttl = _ref3.ttl;
                messageClass = _ref3.messageClass;
                body = (0, _stringify2.default)({
                  sender: from,
                  message: text,
                  receivers: [to],
                  charset: 'UTF-8',
                  class: messageClass === 0 ? 'flash' : messageClass === 1 ? 'phoneDisplay' : messageClass === 2 ? 'sim' : messageClass === 3 ? 'toolkit' : null,
                  noStopClause: type === 'transactional',
                  validityPeriod: ttl
                });

                // Escape unicode

                reqBody = body.replace(/[\u0080-\uFFFF]/g, function (m) {
                  return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
                });
                url = 'https://' + host + '/1.0/sms/' + account + '/jobs/';
                _context.next = 21;
                return (0, _request2.default)(url, {
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

                return _context.abrupt('return', responseBody.ids[0]);

              case 29:
                throw new Error(response.status + ' - ' + responseBody.message);

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return SmsOvhProvider;
}();

exports.default = SmsOvhProvider;