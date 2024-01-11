'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmac = hmac;
exports.sha256 = sha256;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hmac(key, data, encoding) {
  return _crypto2.default.createHmac('sha256', key).update(typeof data === 'string' ? Buffer.from(data) : data).digest(encoding === 'buffer' ? undefined : encoding);
}
function sha256(data, encoding) {
  return _crypto2.default.createHash('sha256').update(typeof data === 'string' ? Buffer.from(data) : data).digest(encoding === 'buffer' ? undefined : encoding);
}