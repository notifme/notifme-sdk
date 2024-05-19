"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEmailString = void 0;
var parseEmailString = exports.parseEmailString = function parseEmailString(emailString) {
  var match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/);
  if (!match) {
    return {
      name: '',
      email: emailString.trim()
    };
  }
  return {
    name: match[1] ? match[1].trim() : '',
    email: match[2] ? match[2].trim() : emailString.trim()
  };
};