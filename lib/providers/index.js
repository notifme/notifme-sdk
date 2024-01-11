'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = factory;

var _email = require('./email');

var _email2 = _interopRequireDefault(_email);

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

var _sms = require('./sms');

var _sms2 = _interopRequireDefault(_sms);

var _voice = require('./voice');

var _voice2 = _interopRequireDefault(_voice);

var _webpush = require('./webpush');

var _webpush2 = _interopRequireDefault(_webpush);

var _slack = require('./slack');

var _slack2 = _interopRequireDefault(_slack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
function factory(channels) {
  return (0, _keys2.default)(channels).reduce(function (acc, key) {
    acc[key] = channels[key].providers.map(function (config) {
      switch (key) {
        case 'email':
          return (0, _email2.default)(config);

        case 'sms':
          return (0, _sms2.default)(config);

        case 'voice':
          return (0, _voice2.default)(config);

        case 'push':
          return (0, _push2.default)(config);

        case 'webpush':
          return (0, _webpush2.default)(config);

        case 'slack':
          return (0, _slack2.default)(config);

        default:
          return config;
      }
    });

    return acc;
  }, {});
}