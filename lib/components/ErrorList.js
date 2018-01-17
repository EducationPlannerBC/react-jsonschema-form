"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ErrorList;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRenderHtml = require("react-render-html");

var _reactRenderHtml2 = _interopRequireDefault(_reactRenderHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ErrorList(props) {
  var errors = props.errors;

  return _react2.default.createElement(
    "div",
    { className: "panel panel-danger errors" },
    _react2.default.createElement(
      "div",
      { className: "panel-heading" },
      _react2.default.createElement(
        "h3",
        { className: "panel-title" },
        "Errors"
      )
    ),
    _react2.default.createElement(
      "ul",
      { className: "list-group" },
      errors.map(function (error, i) {
        return _react2.default.createElement(
          "li",
          { key: i, className: "list-group-item text-danger" },
          (0, _reactRenderHtml2.default)(error.stack)
        );
      })
    )
  );
}