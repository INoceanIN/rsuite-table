'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _domLib = require('dom-lib');

var toggleClass = function toggleClass(node, className, condition) {
  if (condition) {
    (0, _domLib.addClass)(node, className);
  } else {
    (0, _domLib.removeClass)(node, className);
  }
};

exports.default = toggleClass;