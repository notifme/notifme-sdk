"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEmailString = void 0;
var parseEmailString = exports.parseEmailString = function parseEmailString(emailString) {
  // Regular expression to match the name and email parts
  var match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/);

  // If no match, return the email string as the email without a name
  if (!match) {
    return {
      email: emailString.trim()
    };
  }

  // Extract and trim the name and email parts
  var name = match[1] ? match[1].trim() : '';
  var email = match[2] ? match[2].trim() : emailString.trim();

  // Return the object conditionally including the name
  if (name) {
    return {
      name: name,
      email: email
    };
  } else {
    return {
      email: email
    };
  }
};