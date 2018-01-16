import React from "react";
import PropTypes from "prop-types";

import {
  defaultFieldValue,
  getWidget,
  getUiOptions,
  optionsList,
  getDefaultOption,
  getDefaultRegistry
} from "../../utils";

function BooleanField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    registry = getDefaultRegistry(),
    required,
    disabled,
    readonly,
    autofocus,
    ariaDescribedBy,
    onChange
  } = props;
  const {title} = schema;
  const {widgets, formContext} = registry;
  const {widget = "radio", ...options} = getUiOptions(uiSchema);
  const Widget = getWidget(schema, widget, widgets);

  let enumOptions;

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
    enumOptions = optionsList({
      enum: (!schema.enumNames || schema.enumNames.length === 2) ? [true, false] : (widget === "radio" ? [true, false, ""] : ["", true, false]),
      enumNames: schema.enumNames || ["Yes", "No"]
    });
    // If this list of options does not yet have a default option, add one...
    if (enumOptions.findIndex(eo => eo.value === "") === -1) {
      // If this is a radio button group, then add the not specified option at the end...
      if (widget === "radio") {
        enumOptions.push(getDefaultOption());
      }
      // Otherwise, add the not specified option at the beginning (i.e. select)...
      else {
        enumOptions.unshift(getDefaultOption(`Select ${title}...`));
      }
    }
  }

  return <Widget
    options={{ ...options, enumOptions }}
    schema={schema}
    id={idSchema && idSchema.$id}
    onChange={(value) => onChange((typeof value !== "boolean") ? null : value)}
    label={title === undefined ? name : title}
    // Ensure we resolve the consent field to a boolean value, since it is truly expecting
    // a boolean formData type (i.e. versus the other boolean widgets that support a
    // Not Specified option that is represented by the empty string)
    value={defaultFieldValue(widget === "consent" ? !!formData : formData, schema)}
    required={required}
    disabled={disabled}
    readonly={readonly}
    registry={registry}
    formContext={formContext}
    autofocus={autofocus}
    ariaDescribedBy={ariaDescribedBy} />;
}

if (process.env.NODE_ENV !== "production") {
  BooleanField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    })
  };
}

BooleanField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default BooleanField;