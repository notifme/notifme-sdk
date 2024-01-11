'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = factory;

var _fallback = require('./fallback');

var _fallback2 = _interopRequireDefault(_fallback);

var _noFallback = require('./no-fallback');

var _noFallback2 = _interopRequireDefault(_noFallback);

var _roundrobin = require('./roundrobin');

var _roundrobin2 = _interopRequireDefault(_roundrobin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var providerStrategies = {
  fallback: _fallback2.default,
  'no-fallback': _noFallback2.default,
  roundrobin: _roundrobin2.default
};


var strategies = (0, _keys2.default)(providerStrategies);

function factory(channels) {
  return (0, _keys2.default)(channels).reduce(function (acc, key) {
    var optionStrategy = channels[key].multiProviderStrategy;
    if (typeof optionStrategy === 'function') {
      acc[key] = optionStrategy;
    } else if (strategies.includes(optionStrategy)) {
      acc[key] = providerStrategies[optionStrategy];
    } else {
      throw new Error('"' + optionStrategy + '" is not a valid strategy. Strategy must be a function or ' + strategies.join('|') + '.');
    }
    return acc;
  }, {});
}