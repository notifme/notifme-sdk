'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _logger3 = require('./providers/logger');

var _logger4 = _interopRequireDefault(_logger3);

var _registry = require('./util/registry');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var Sender = function () {
  function Sender(channels, providers, strategies) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Sender);

    this.channels = channels;
    this.providers = providers;
    this.strategies = strategies;

    // note : we can do this memoization because we do not allow to add new provider
    this.senders = (0, _keys2.default)(strategies).reduce(function (acc, channel) {
      acc[channel] = _this.providers[channel].length > 0 ? strategies[channel](_this.providers[channel]) : function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
          var provider;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _logger2.default.warn('No provider registered for channel "' + channel + '". Using logger.');
                  provider = _registry2.default.getInstance(channel + '-logger-default', function () {
                    return new _logger4.default({}, channel);
                  });
                  _context.t0 = channel;
                  _context.t1 = provider.id;
                  _context.next = 6;
                  return provider.send(request);

                case 6:
                  _context.t2 = _context.sent;
                  return _context.abrupt('return', {
                    success: true,
                    channel: _context.t0,
                    providerId: _context.t1,
                    id: _context.t2
                  });

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();

      return acc;
    }, {});
  }

  (0, _createClass3.default)(Sender, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(request) {
        var resultsByChannel, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.sendOnEachChannel(request);

              case 2:
                resultsByChannel = _context2.sent;
                result = resultsByChannel.reduce(function (acc, _ref3) {
                  var success = _ref3.success,
                      channel = _ref3.channel,
                      providerId = _ref3.providerId,
                      rest = (0, _objectWithoutProperties3.default)(_ref3, ['success', 'channel', 'providerId']);
                  return (0, _extends5.default)({}, acc, {
                    channels: (0, _extends5.default)({}, acc.channels || null, (0, _defineProperty3.default)({}, channel, { id: rest.id, providerId: providerId }))
                  }, !success ? { status: 'error', errors: (0, _extends5.default)({}, acc.errors || null, (0, _defineProperty3.default)({}, channel, rest.error.message)) } : null);
                }, { status: 'success' });
                return _context2.abrupt('return', result);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function send(_x2) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'sendOnEachChannel',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(request) {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', _promise2.default.all((0, _keys2.default)(request).filter(function (channel) {
                  return _this2.channels.includes(channel);
                }).map(function () {
                  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(channel) {
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.prev = 0;
                            _context3.t0 = _extends5.default;
                            _context3.t1 = {
                              success: true,
                              channel: channel
                            };
                            _context3.next = 5;
                            return _this2.senders[channel]((0, _extends5.default)({}, request.metadata, request[channel]));

                          case 5:
                            _context3.t2 = _context3.sent;
                            return _context3.abrupt('return', (0, _context3.t0)(_context3.t1, _context3.t2));

                          case 9:
                            _context3.prev = 9;
                            _context3.t3 = _context3['catch'](0);
                            return _context3.abrupt('return', { channel: channel, success: false, error: _context3.t3, providerId: _context3.t3.providerId });

                          case 12:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this2, [[0, 9]]);
                  }));

                  return function (_x4) {
                    return _ref5.apply(this, arguments);
                  };
                }())));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function sendOnEachChannel(_x3) {
        return _ref4.apply(this, arguments);
      }

      return sendOnEachChannel;
    }()
  }]);
  return Sender;
}();

exports.default = Sender;