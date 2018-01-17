"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DisplayWidget(props) {
  var id = props.id,
      value = props.value,
      schema = props.schema;


  return value ? _react2.default.createElement(
    "p",
    { id: id, className: "form-control-static" },
    value
  ) : null;
}

exports.default = DisplayWidget;