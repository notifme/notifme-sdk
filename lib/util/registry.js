"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Registry = function () {
  function Registry() {
    (0, _classCallCheck3.default)(this, Registry);
    this.map = {};
  }

  (0, _createClass3.default)(Registry, [{
    key: "getInstance",
    value: function getInstance(key, getValueIfUndefined) {
      if (!this.map[key]) {
        this.map[key] = getValueIfUndefined();
      }
      return this.map[key];
    }
  }]);
  return Registry;
}();

exports.default = new Registry();