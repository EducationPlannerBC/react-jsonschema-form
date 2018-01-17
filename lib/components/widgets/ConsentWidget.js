"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ConsentWidget(props) {
  var schema = props.schema,
      id = props.id,
      value = props.value,
      disabled = props.disabled,
      readonly = props.readonly,
      label = props.label,
      autofocus = props.autofocus,
      ariaDescribedBy = props.ariaDescribedBy,
      _onChange = props.onChange;


  return _react2.default.createElement(
    "div",
    { className: "checkbox " + (disabled || readonly ? "disabled" : "") },
    _react2.default.createElement(
      "label",
      null,
      _react2.default.createElement("input", { type: "checkbox",
        id: id,
        checked: value,
        disabled: disabled || readonly,
        autoFocus: autofocus,
        "aria-describedby": ariaDescribedBy,
        onChange: function onChange(event) {
          return _onChange(event.target.checked || null);
        } }),
      _react2.default.createElement(
        "span",
        null,
        label
      )
    )
  );
}

ConsentWidget.defaultProps = {
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  ConsentWidget.propTypes = {
    schema: _propTypes2.default.object.isRequired,
    id: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.bool,
    required: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    autofocus: _propTypes2.default.bool,
    ariaDescribedBy: _propTypes2.default.string,
    onChange: _propTypes2.default.func
  };
}

exports.default = ConsentWidget;