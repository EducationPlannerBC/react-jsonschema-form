"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function StringField(props) {
  var schema = props.schema,
      name = props.name,
      uiSchema = props.uiSchema,
      idSchema = props.idSchema,
      formData = props.formData,
      required = props.required,
      disabled = props.disabled,
      readonly = props.readonly,
      autofocus = props.autofocus,
      ariaDescribedBy = props.ariaDescribedBy,
      _onChange = props.onChange,
      onBlur = props.onBlur,
      onFocus = props.onFocus,
      _props$registry = props.registry,
      registry = _props$registry === undefined ? (0, _utils.getDefaultRegistry)() : _props$registry;
  var title = schema.title,
      format = schema.format;
  var widgets = registry.widgets,
      formContext = registry.formContext;

  var enumOptions = (0, _utils.isSelect)(schema) && (0, _utils.optionsList)(schema);
  var defaultWidget = format || (enumOptions ? "select" : "text");

  var _getUiOptions = (0, _utils.getUiOptions)(uiSchema),
      _getUiOptions$widget = _getUiOptions.widget,
      widget = _getUiOptions$widget === undefined ? defaultWidget : _getUiOptions$widget,
      _getUiOptions$placeho = _getUiOptions.placeholder,
      placeholder = _getUiOptions$placeho === undefined ? "" : _getUiOptions$placeho,
      options = _objectWithoutProperties(_getUiOptions, ["widget", "placeholder"]);

  var Widget = (0, _utils.getWidget)(schema, widget, widgets);

  // If this field consists of one or more options to be selected...
  if (enumOptions) {
    // If this list of options does not yet have a default option, add one...
    if (enumOptions.findIndex(function (eo) {
      return eo.value === "";
    }) === -1) {
      // If this is a radio button group, then add the not specified option at the end...
      if (widget === "radio") {
        enumOptions.push((0, _utils.getDefaultOption)());
      }
      // Otherwise, add the not specified option at the beginning (i.e. select)...
      else {
          enumOptions.unshift((0, _utils.getDefaultOption)("Select " + title + "..."));
        }
    }
  }

  return _react2.default.createElement(Widget, {
    options: _extends({}, options, { enumOptions: enumOptions }),
    schema: schema,
    id: idSchema && idSchema.$id,
    label: title === undefined ? name : title,
    value: formData,
    onChange: function onChange(value) {
      return _onChange(value == null || value === "" ? null : value);
    },
    onBlur: onBlur,
    onFocus: onFocus,
    required: required,
    disabled: disabled,
    readonly: readonly,
    formContext: formContext,
    autofocus: autofocus,
    ariaDescribedBy: ariaDescribedBy,
    registry: registry,
    placeholder: placeholder });
}

if (process.env.NODE_ENV !== "production") {
  StringField.propTypes = {
    schema: _propTypes2.default.object.isRequired,
    uiSchema: _propTypes2.default.object.isRequired,
    idSchema: _propTypes2.default.object,
    onChange: _propTypes2.default.func.isRequired,
    onBlur: _propTypes2.default.func,
    onFocus: _propTypes2.default.func,
    formData: _propTypes2.default.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    registry: _propTypes2.default.shape({
      widgets: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object])).isRequired,
      fields: _propTypes2.default.objectOf(_propTypes2.default.func).isRequired,
      definitions: _propTypes2.default.object.isRequired,
      formContext: _propTypes2.default.object.isRequired
    }),
    formContext: _propTypes2.default.object.isRequired,
    required: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    autofocus: _propTypes2.default.bool,
    ariaDescribedBy: _propTypes2.default.string
  };
}

StringField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false
};

exports.default = StringField;