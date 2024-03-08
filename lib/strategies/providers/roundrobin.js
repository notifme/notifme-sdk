"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _fallback = _interopRequireDefault(require("./fallback"));
// "statefull" strategy
// Types
function rotate(arr, forward) {
  // /!\ mute array, the mutation is "the state"
  if (forward) {
    arr.push(arr.shift());
  } else {
    arr.unshift(arr.pop());
  }
  return arr;
}
var strategyProvidersFallback = function strategyProvidersFallback(providers) {
  var rotatedProviders = rotate(providers, false);
  return function (request) {
    return (0, _fallback["default"])(rotate(rotatedProviders, true))(request);
  };
};

// /!\ not equivalent to (providers) => strategyFallback(rotate(providers)) because of memoization
var _default = exports["default"] = strategyProvidersFallback;