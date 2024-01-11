'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fallback = require('./fallback');

var _fallback2 = _interopRequireDefault(_fallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// "statefull" strategy


var strategyProvidersFallback = function strategyProvidersFallback(providers) {
  var rotatedProviders = rotate(providers, false);
  return function (request) {
    return (0, _fallback2.default)(rotate(rotatedProviders, true))(request);
  };
};

// /!\ not equivalent to (providers) => strategyFallback(rotate(providers)) because of memoization

exports.default = strategyProvidersFallback;