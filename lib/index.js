"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeFormData = exports.getUiOptions = undefined;

var _utils = require("./utils");

Object.defineProperty(exports, "getUiOptions", {
  enumerable: true,
  get: function get() {
    return _utils.getUiOptions;
  }
});
Object.defineProperty(exports, "initializeFormData", {
  enumerable: true,
  get: function get() {
    return _utils.initializeFormData;
  }
});

var _Form = require("./components/Form");

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Form2.default;