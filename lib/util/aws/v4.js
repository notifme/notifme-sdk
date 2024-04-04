"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _crypto = require("../crypto");
var _v4_credentials = _interopRequireDefault(require("./v4_credentials"));
/* https://github.com/aws/aws-sdk-js/blob/master/lib/signers/v4.js */

/**
 * @api private
 */
var expiresHeader = 'presigned-expires';
var algorithm = 'AWS4-HMAC-SHA256';

/**
 * @api private
 */
var AWSSignersV4 = exports["default"] = /*#__PURE__*/function () {
  function AWSSignersV4(request, serviceName, options) {
    (0, _classCallCheck2["default"])(this, AWSSignersV4);
    (0, _defineProperty2["default"])(this, "unsignableHeaders", ['authorization', 'content-type', 'content-length', 'user-agent', expiresHeader, 'expect', 'x-amzn-trace-id']);
    this.request = request;
    this.serviceName = serviceName;
    options = options || {};
    this.signatureCache = typeof options.signatureCache === 'boolean' ? options.signatureCache : true;
    this.operation = options.operation;
  }
  return (0, _createClass2["default"])(AWSSignersV4, [{
    key: "addAuthorization",
    value: function addAuthorization(credentials, date) {
      var datetime = date.toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:-]|\.\d{3}/g, '');
      this.addHeaders(credentials, datetime);
      this.request.headers.Authorization = this.authorization(credentials, datetime);
    }
  }, {
    key: "addHeaders",
    value: function addHeaders(credentials, datetime) {
      this.request.headers['X-Amz-Date'] = datetime;
      if (credentials.sessionToken) {
        this.request.headers['x-amz-security-token'] = credentials.sessionToken;
      }
    }
  }, {
    key: "authorization",
    value: function authorization(credentials, datetime) {
      var parts = [];
      var credString = this.credentialString(datetime);
      parts.push(algorithm + ' Credential=' + credentials.accessKeyId + '/' + credString);
      parts.push('SignedHeaders=' + this.signedHeaders());
      parts.push('Signature=' + this.signature(credentials, datetime));
      return parts.join(', ');
    }
  }, {
    key: "signature",
    value: function signature(credentials, datetime) {
      var signingKey = _v4_credentials["default"].getSigningKey(credentials, datetime.substr(0, 8), this.request.region, this.serviceName, this.signatureCache);
      return (0, _crypto.hmac)(signingKey, this.stringToSign(datetime), 'hex');
    }
  }, {
    key: "stringToSign",
    value: function stringToSign(datetime) {
      var parts = [];
      parts.push(algorithm);
      parts.push(datetime);
      parts.push(this.credentialString(datetime));
      parts.push(this.hexEncodedHash(this.canonicalString()));
      return parts.join('\n');
    }
  }, {
    key: "canonicalString",
    value: function canonicalString() {
      var parts = [];
      var pathname = this.request.path;
      if (this.serviceName !== 's3') {
        var uriEscape = function uriEscape(string) {
          var output = encodeURIComponent(string);
          output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);
          // AWS percent-encodes some extra non-standard characters in a URI
          output = output.replace(/[*]/g, function (ch) {
            return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
          });
          return output;
        };
        pathname = pathname.split('/').map(uriEscape).join('/');
      }
      parts.push(this.request.method);
      parts.push(pathname);
      parts.push(this.request.search);
      parts.push(this.canonicalHeaders() + '\n');
      parts.push(this.signedHeaders());
      parts.push(this.hexEncodedBodyHash());
      return parts.join('\n');
    }
  }, {
    key: "canonicalHeaders",
    value: function canonicalHeaders() {
      var _this = this;
      var headers = [];
      (0, _keys["default"])(this.request.headers).forEach(function (key) {
        headers.push([key, _this.request.headers[key]]);
      });
      headers.sort(function (a, b) {
        return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
      });
      var parts = [];
      headers.forEach(function (item) {
        var key = item[0].toLowerCase();
        if (_this.isSignableHeader(key)) {
          var value = item[1];
          if (typeof value === 'undefined' || value === null || typeof value.toString !== 'function') {
            throw new Error('Header ' + key + ' contains invalid value');
          }
          parts.push(key + ':' + _this.canonicalHeaderValues(value.toString()));
        }
      });
      return parts.join('\n');
    }
  }, {
    key: "canonicalHeaderValues",
    value: function canonicalHeaderValues(values) {
      return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
    }
  }, {
    key: "signedHeaders",
    value: function signedHeaders() {
      var _this2 = this;
      var keys = [];
      (0, _keys["default"])(this.request.headers).forEach(function (key) {
        key = key.toLowerCase();
        if (_this2.isSignableHeader(key)) keys.push(key);
      });
      return keys.sort().join(';');
    }
  }, {
    key: "credentialString",
    value: function credentialString(datetime) {
      return _v4_credentials["default"].createScope(datetime.substr(0, 8), this.request.region, this.serviceName);
    }
  }, {
    key: "hexEncodedHash",
    value: function hexEncodedHash(string) {
      return (0, _crypto.sha256)(string, 'hex');
    }
  }, {
    key: "hexEncodedBodyHash",
    value: function hexEncodedBodyHash() {
      var request = this.request;
      if (request.headers['X-Amz-Content-Sha256']) {
        return request.headers['X-Amz-Content-Sha256'];
      } else {
        return this.hexEncodedHash(this.request.body || '');
      }
    }
  }, {
    key: "isSignableHeader",
    value: function isSignableHeader(key) {
      if (key.toLowerCase().indexOf('x-amz-') === 0) return true;
      return this.unsignableHeaders.indexOf(key) < 0;
    }
  }, {
    key: "isPresigned",
    value: function isPresigned() {
      return this.request.headers[expiresHeader];
    }
  }]);
}();