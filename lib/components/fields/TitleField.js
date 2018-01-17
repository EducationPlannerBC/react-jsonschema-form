"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPTIONAL_FIELD_SYMBOL = " (Optional)";

function TitleField(props) {
  var id = props.id,
      title = props.title,
      required = props.required;
  // Do not include optional discriminator on section titles
  // const legend = required ? title : title + OPTIONAL_FIELD_SYMBOL;

  var legend = title;
  return _react2.default.createElement(
    "legend",
    { id: id },
    legend
  );
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: _propTypes2.default.string,
    title: _propTypes2.default.string,
    required: _propTypes2.default.bool
  };
}

exports.default = TitleField;