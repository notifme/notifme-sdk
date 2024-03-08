"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _fallback = _interopRequireDefault(require("./fallback"));
var _noFallback = _interopRequireDefault(require("./no-fallback"));
var _roundrobin = _interopRequireDefault(require("./roundrobin"));
// Types
var providerStrategies = {
  fallback: _fallback["default"],
  'no-fallback': _noFallback["default"],
  roundrobin: _roundrobin["default"]
};
var strategies = (0, _keys["default"])(providerStrategies);
function factory(channels) {
  return (0, _keys["default"])(channels).reduce(function (acc, key) {
    var optionStrategy = channels[key].multiProviderStrategy;
    if (typeof optionStrategy === 'function') {
      acc[key] = optionStrategy;
    } else if (strategies.includes(optionStrategy)) {
      acc[key] = providerStrategies[optionStrategy];
    } else {
      throw new Error("\"".concat(optionStrategy, "\" is not a valid strategy. Strategy must be a function or ").concat(strategies.join('|'), "."));
    }
    return acc;
  }, {});
}