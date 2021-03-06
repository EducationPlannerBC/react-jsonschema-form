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

function BooleanField(props) {
  var schema = props.schema,
      name = props.name,
      uiSchema = props.uiSchema,
      idSchema = props.idSchema,
      formData = props.formData,
      registry = props.registry,
      required = props.required,
      disabled = props.disabled,
      readonly = props.readonly,
      autofocus = props.autofocus,
      ariaDescribedBy = props.ariaDescribedBy,
      _onChange = props.onChange;
  var title = schema.title;
  var widgets = registry.widgets,
      formContext = registry.formContext;

  var _getUiOptions = (0, _utils.getUiOptions)(uiSchema),
      _getUiOptions$widget = _getUiOptions.widget,
      widget = _getUiOptions$widget === undefined ? "radio" : _getUiOptions$widget,
      options = _objectWithoutProperties(_getUiOptions, ["widget"]);

  var Widget = (0, _utils.getWidget)(schema, widget, widgets);

  var enumOptions = void 0;

  // If an options-based widget is to be used (i.e. radio or select)...
  if (widget === "radio" || widget === "select") {
    /**
     * It is expected that if enumNames are defined, they are provided in the following order
     * (i.e. the enum value order is fixed for a particular widget type)
     * 
     * radio: 
     * ======
     * enumNames: {
     *  "true option label",
     *  "false option label",
     *  "optional 'Not Specified' label"
     * }
     * 
     * select: 
     * =======
     * enumNames: {
     *  "optional 'Not Specified' label"
     *  "true option label",
     *  "false option label"
     * }
     * 
     */
    enumOptions = (0, _utils.optionsList)({
      enum: !schema.enumNames || schema.enumNames.length === 2 ? [true, false] : widget === "radio" ? [true, false, ""] : ["", true, false],
      enumNames: schema.enumNames || ["Yes", "No"]
    });
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
    onChange: function onChange(value) {
      return _onChange(typeof value !== "boolean" ? null : value);
    },
    label: title === undefined ? name : title
    // Ensure we resolve the consent field to a boolean value, since it is truly expecting
    // a boolean formData type (i.e. versus the other boolean widgets that support a 
    // Not Specified option that is represented by the empty string)
    , value: (0, _utils.defaultFieldValue)(widget === "consent" ? !!formData : formData, schema),
    required: required,
    disabled: disabled,
    readonly: readonly,
    registry: registry,
    formContext: formContext,
    autofocus: autofocus,
    ariaDescribedBy: ariaDescribedBy });
}

if (process.env.NODE_ENV !== "production") {
  BooleanField.propTypes = {
    schema: _react.PropTypes.object.isRequired,
    uiSchema: _react.PropTypes.object,
    idSchema: _react.PropTypes.object,
    onChange: _react.PropTypes.func.isRequired,
    formData: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.string]),
    required: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    readonly: _react.PropTypes.bool,
    autofocus: _react.PropTypes.bool,
    ariaDescribedBy: _react.PropTypes.string,
    registry: _react.PropTypes.shape({
      widgets: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object])).isRequired,
      fields: _react.PropTypes.objectOf(_react.PropTypes.func).isRequired,
      definitions: _react.PropTypes.object.isRequired,
      formContext: _react.PropTypes.object.isRequired
    })
  };
}

BooleanField.defaultProps = {
  uiSchema: {},
  registry: (0, _utils.getDefaultRegistry)(),
  disabled: false,
  readonly: false,
  autofocus: false
};

exports.default = BooleanField;