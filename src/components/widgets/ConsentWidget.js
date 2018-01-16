import React from "react";
import PropTypes from "prop-types";

function ConsentWidget(props) {
  const {
  schema,
  id,
  value,
  disabled,
  readonly,
  label,
  autofocus,
  ariaDescribedBy,
  onChange,
  } = props;

  return (
    <div className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
      <label>
        <input type="checkbox"
          id={id}
          checked={value}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          aria-describedby={ariaDescribedBy}
          onChange={(event) => onChange(event.target.checked || null)}/>
        <span>{label}</span>
      </label>
    </div>
  );
}

ConsentWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  ConsentWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func,
  };
}

export default ConsentWidget;
