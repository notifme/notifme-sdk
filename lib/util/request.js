'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _httpsProxyAgent = require('https-proxy-agent');

var _httpsProxyAgent2 = _interopRequireDefault(_httpsProxyAgent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = (0, _objectWithoutProperties3.default)(_ref, []);

  if (!options.agent && process.env.NOTIFME_HTTP_PROXY) {
    options.agent = new _httpsProxyAgent2.default(process.env.NOTIFME_HTTP_PROXY);
  }

  return (0, _nodeFetch2.default)(url, options);
};