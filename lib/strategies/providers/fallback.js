"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _logger = _interopRequireDefault(require("../../util/logger"));
// Types
function recursiveTry(_x, _x2) {
  return _recursiveTry.apply(this, arguments);
}
function _recursiveTry() {
  _recursiveTry = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(providers, request) {
    var _providers, current, others, id;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _providers = (0, _toArray2["default"])(providers), current = _providers[0], others = _providers.slice(1);
          _context.prev = 1;
          _context.next = 4;
          return current.send(request);
        case 4:
          id = _context.sent;
          return _context.abrupt("return", {
            providerId: current.id,
            id: id
          });
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          _logger["default"].warn(current.id, _context.t0);
          if (!(others.length === 0)) {
            _context.next = 14;
            break;
          }
          // no more provider to try
          _context.t0.providerId = current.id;
          throw _context.t0;
        case 14:
          return _context.abrupt("return", recursiveTry(others, request));
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 8]]);
  }));
  return _recursiveTry.apply(this, arguments);
}
var strategyProvidersFallback = function strategyProvidersFallback(providers) {
  return function (request) {
    return recursiveTry(providers, request);
  };
};
var _default = exports["default"] = strategyProvidersFallback;