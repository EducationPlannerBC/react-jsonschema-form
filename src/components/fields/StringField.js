import React from "react";
import PropTypes from "prop-types";

import {
  defaultFieldValue,
  getWidget,
  getUiOptions,
  isSelect,
  optionsList,
  getDefaultOption,
  getDefaultRegistry,
} from "../../utils";

function StringField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    autofocus,
    ariaDescribedBy,
    onChange,
    onBlur,
    onFocus,
    registry = getDefaultRegistry(),
  } = props;
  const {title, format} = schema;
  const {widgets, formContext} = registry;
  let enumOptions = isSelect(schema) && optionsList(schema);
  const defaultWidget = format || (enumOptions ? "select" : "text");
  const { widget = defaultWidget, placeholder = "", ...options } = getUiOptions(
    uiSchema
  );
  const Widget = getWidget(schema, widget, widgets);

  // If this field consists of one or more options to be selected...
  if (enumOptions) {
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
    options={{...options, enumOptions}}
    schema={schema}
    id={idSchema && idSchema.$id}
    label={title === undefined ? name : title}
    value={formData}
    onChange={(value) => onChange((value == null || value === "") ? null : value)}
    onBlur={onBlur}
    onFocus={onFocus}
    required={required}
    disabled={disabled}
    readonly={readonly}
    formContext={formContext}
    autofocus={autofocus}
    ariaDescribedBy={ariaDescribedBy}
    registry={registry}
    placeholder={placeholder}/>;
}

if (process.env.NODE_ENV !== "production") {
  StringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string
  };
}

StringField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default StringField;
