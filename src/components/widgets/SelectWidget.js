import React, { PropTypes } from "react";

import { asNumber } from "../../utils";


/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({type, items}, value) {
  if (type === "array" && items && ["number", "integer"].includes(items.type)) {
    // If no selections have been made, return null...
    if (value.length === 0) {
      return null;
    }
    return value.map(asNumber);
  } else if (type === "boolean") {
    // If no selection has been made, return null...
    if (value === "") {
      return null;
    }
    return value === "true";
  } else if (["number", "integer"].includes(type)) {
    // If no selection has been made, return null...
    if (value === 0) {
      return null;
    }
    return asNumber(value);
  }
  // If no selection has been made, return null...
  if (value === "") {
    return null;
  }
  return value;
}

function SelectWidget({
  schema,
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  multiple,
  autofocus,
  ariaDescribedBy,
  onChange,
  onBlur
}) {
  const {enumOptions} = options;
  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      value={value == null ? "" : value}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      aria-describedby={ariaDescribedBy}
      onChange={(event) => {
        let newValue;
        if (multiple) {
          newValue = [].filter.call(
            event.target.options, o => o.selected).map(o => o.value);
        } else {
          newValue = event.target.value;
        }
        onChange(processValue(schema, newValue));
      } }
      onBlur={onBlur ? onBlur : (event) => {
        let newValue;
        if (multiple) {
          newValue = [].filter.call(
            event.target.options, o => o.selected).map(o => o.value);
        } else {
          newValue = event.target.value;
        }
        onChange(processValue(schema, newValue));
      } }>{
        enumOptions.map(({value, label}, i) => {
          return <option key={i} value={value == null ? "" : value}>{label}</option>;
        })
      }</select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };
}

export default SelectWidget;
