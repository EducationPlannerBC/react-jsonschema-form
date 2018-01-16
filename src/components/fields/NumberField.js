import React from "react";
import PropTypes from "prop-types";

import { asNumber } from "../../utils";

function NumberField(props) {
  const { StringField } = props.registry.fields;
  return (
    <StringField
      {...props}
      onChange={value => props.onChange(value == null ? null : asNumber(value))}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  NumberField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    required: PropTypes.bool,
    formContext: PropTypes.object.isRequired,
  };
}

NumberField.defaultProps = {
  uiSchema: {},
};

export default NumberField;
