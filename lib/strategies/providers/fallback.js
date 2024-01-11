'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Types
var recursiveTry = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(providers, request) {
    var _providers, current, others, _id;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _providers = (0, _toArray3.default)(providers), current = _providers[0], others = _providers.slice(1);
            _context.prev = 1;
            _context.next = 4;
            return current.send(request);

          case 4:
            _id = _context.sent;
            return _context.abrupt('return', { providerId: current.id, id: _id });

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);

            _logger2.default.warn(current.id, _context.t0);

            if (!(others.length === 0)) {
              _context.next = 14;
              break;
            }

            // no more provider to try
            _context.t0.providerId = current.id;
            throw _context.t0;

          case 14:
            return _context.abrupt('return', recursiveTry(others, request));

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 8]]);
  }));

  return function recursiveTry(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _logger = require('../../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var strategyProvidersFallback = function strategyProvidersFallback(providers) {
  return function (request) {
    return recursiveTry(providers, request);
  };
};

exports.default = strategyProvidersFallback;