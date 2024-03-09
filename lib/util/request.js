"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectDestructuringEmpty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/extends"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _httpsProxyAgent = _interopRequireDefault(require("https-proxy-agent"));
var _default = exports["default"] = function _default(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    options = (0, _extends2["default"])({}, ((0, _objectDestructuringEmpty2["default"])(_ref), _ref));
  if (!options.agent && process.env.NOTIFME_HTTP_PROXY) {
    options.agent = new _httpsProxyAgent["default"](process.env.NOTIFME_HTTP_PROXY);
  }
  return (0, _nodeFetch["default"])(url, options);
};