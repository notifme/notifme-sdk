"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/slicedToArray"));
var _logger = _interopRequireDefault(require("../../util/logger"));
// Types
var strategyProvidersNoFallback = function strategyProvidersNoFallback(_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
    provider = _ref2[0];
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
      var id;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return provider.send(request);
          case 3:
            id = _context.sent;
            return _context.abrupt("return", {
              providerId: provider.id,
              id: id
            });
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            _logger["default"].warn(provider.id, _context.t0);
            _context.t0.providerId = provider.id;
            throw _context.t0;
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 7]]);
    }));
    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
};
var _default = exports["default"] = strategyProvidersNoFallback;