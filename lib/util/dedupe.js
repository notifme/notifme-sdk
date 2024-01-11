"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dedupe;
function dedupe(array) {
  return array.filter(function (element, position) {
    return array.indexOf(element) === position;
  });
}