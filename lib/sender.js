"use strict";

var _Object$keys2 = require("@babel/runtime-corejs2/core-js/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs2/core-js/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _logger = _interopRequireDefault(require("./util/logger"));
var _logger2 = _interopRequireDefault(require("./providers/logger"));
var _registry = _interopRequireDefault(require("./util/registry"));
var _excluded = ["success", "channel", "providerId"];
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var Sender = exports["default"] = /*#__PURE__*/function () {
  function Sender(channels, providers, strategies) {
    var _this = this;
    (0, _classCallCheck2["default"])(this, Sender);
    this.channels = channels;
    this.providers = providers;
    this.strategies = strategies;

    // note : we can do this memoization because we do not allow to add new provider
    this.senders = (0, _keys["default"])(strategies).reduce(function (acc, channel) {
      acc[channel] = _this.providers[channel].length > 0 ? strategies[channel](_this.providers[channel]) : (/*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
          var provider;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _logger["default"].warn("No provider registered for channel \"".concat(channel, "\". Using logger."));
                provider = _registry["default"].getInstance("".concat(channel, "-logger-default"), function () {
                  return new _logger2["default"]({}, channel);
                });
                _context.t0 = channel;
                _context.t1 = provider.id;
                _context.next = 6;
                return provider.send(request);
              case 6:
                _context.t2 = _context.sent;
                return _context.abrupt("return", {
                  success: true,
                  channel: _context.t0,
                  providerId: _context.t1,
                  id: _context.t2
                });
              case 8:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      return acc;
    }, {});
  }
  return (0, _createClass2["default"])(Sender, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(request) {
        var resultsByChannel, result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.sendOnEachChannel(request);
            case 2:
              resultsByChannel = _context2.sent;
              result = resultsByChannel.reduce(function (acc, _ref2) {
                var success = _ref2.success,
                  channel = _ref2.channel,
                  providerId = _ref2.providerId,
                  rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
                return _objectSpread(_objectSpread({}, acc), {}, {
                  channels: _objectSpread(_objectSpread({}, acc.channels || null), {}, (0, _defineProperty2["default"])({}, channel, {
                    id: rest.id,
                    providerId: providerId
                  }))
                }, !success ? {
                  status: 'error',
                  errors: _objectSpread(_objectSpread({}, acc.errors || null), {}, (0, _defineProperty2["default"])({}, channel, rest.error.message))
                } : null);
              }, {
                status: 'success'
              });
              return _context2.abrupt("return", result);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function send(_x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "sendOnEachChannel",
    value: function () {
      var _sendOnEachChannel = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(request) {
        var _this2 = this;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", _promise["default"].all((0, _keys["default"])(request).filter(function (channel) {
                return _this2.channels.includes(channel);
              }).map(/*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(channel) {
                  return _regenerator["default"].wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.t0 = _objectSpread;
                        _context3.t1 = {
                          success: true,
                          channel: channel
                        };
                        _context3.next = 5;
                        return _this2.senders[channel](_objectSpread(_objectSpread({}, request.metadata), request[channel]));
                      case 5:
                        _context3.t2 = _context3.sent;
                        return _context3.abrupt("return", (0, _context3.t0)(_context3.t1, _context3.t2));
                      case 9:
                        _context3.prev = 9;
                        _context3.t3 = _context3["catch"](0);
                        return _context3.abrupt("return", {
                          channel: channel,
                          success: false,
                          error: _context3.t3,
                          providerId: _context3.t3.providerId
                        });
                      case 12:
                      case "end":
                        return _context3.stop();
                    }
                  }, _callee3, null, [[0, 9]]);
                }));
                return function (_x4) {
                  return _ref3.apply(this, arguments);
                };
              }())));
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function sendOnEachChannel(_x3) {
        return _sendOnEachChannel.apply(this, arguments);
      }
      return sendOnEachChannel;
    }()
  }]);
}();