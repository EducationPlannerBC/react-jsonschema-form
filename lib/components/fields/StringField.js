"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

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
      registry = props.registry,
      _onChange = props.onChange;
  var title = schema.title,
      format = schema.format;
  var widgets = registry.widgets,
      formContext = registry.formContext;

  var enumOptions = Array.isArray(schema.enum) && (0, _utils.optionsList)(schema);
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
    value: (0, _utils.defaultFieldValue)(formData, schema),
    onChange: function onChange(value) {
      return _onChange(value == null ? null : value);
    },
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
    schema: _react.PropTypes.object.isRequired,
    uiSchema: _react.PropTypes.object.isRequired,
    idSchema: _react.PropTypes.object,
    onChange: _react.PropTypes.func.isRequired,
    formData: _react.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    registry: _react.PropTypes.shape({
      widgets: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object])).isRequired,
      fields: _react.PropTypes.objectOf(_react.PropTypes.func).isRequired,
      definitions: _react.PropTypes.object.isRequired,
      formContext: _react.PropTypes.object.isRequired
    }),
    formContext: _react.PropTypes.object.isRequired,
    required: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    readonly: _react.PropTypes.bool,
    autofocus: _react.PropTypes.bool,
    ariaDescribedBy: _react.PropTypes.string
  };
}

StringField.defaultProps = {
  uiSchema: {},
  registry: (0, _utils.getDefaultRegistry)(),
  disabled: false,
  readonly: false,
  autofocus: false
};

exports.default = StringField;