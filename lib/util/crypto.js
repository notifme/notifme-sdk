"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.hmac = hmac;
exports.sha256 = sha256;
var _crypto = _interopRequireDefault(require("crypto"));
function hmac(key, data, encoding) {
  return _crypto["default"].createHmac('sha256', key).update(typeof data === 'string' ? Buffer.from(data) : data).digest(encoding === 'buffer' ? undefined : encoding);
}
function sha256(data, encoding) {
  return _crypto["default"].createHash('sha256').update(typeof data === 'string' ? Buffer.from(data) : data).digest(encoding === 'buffer' ? undefined : encoding);
}