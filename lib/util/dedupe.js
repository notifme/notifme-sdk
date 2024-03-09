"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = dedupe;
function dedupe(array) {
  return array.filter(function (element, position) {
    return array.indexOf(element) === position;
  });
}