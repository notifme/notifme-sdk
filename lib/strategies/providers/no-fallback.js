'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _logger = require('../../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var strategyProvidersNoFallback = function strategyProvidersNoFallback(_ref) {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
      provider = _ref2[0];

  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
      var id;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return provider.send(request);

            case 3:
              id = _context.sent;
              return _context.abrupt('return', { providerId: provider.id, id: id });

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              _logger2.default.warn(provider.id, _context.t0);
              _context.t0.providerId = provider.id;
              throw _context.t0;

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 7]]);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
};
exports.default = strategyProvidersNoFallback;