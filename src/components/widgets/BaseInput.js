import React, { Component } from "react";
import PropTypes from "prop-types";

class BaseInput extends Component {
  static defaultProps = {
    type: "text",
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
  };

  constructor(props) {
    super(props);
    const {value} = props;
    this.state = { value: value };
  }

  onChange() {
    return (event) => {
      const value = event.target.value;
      this.setState({ value: value });
    };
  }

  onBlur() {
    const {onBlur, onChange, options, ...inputProps} = this.props;
    return (event) => {
      let value = event.target.value.trim();

      value = value === "" ? options.emptyValue : value;

      this.setState({ value: value }, () => {
        (onBlur && onBlur(inputProps.id, value || null));
        (onChange && onChange(value || null));
      });
    };
  }


  render() {
    // Note: since React 15.2.0 we can't forward unknown element attributes, so we
    // exclude the "options" and "schema" ones here.
    const {
      required,
      readonly,
      disabled,
      autofocus,
      onBlur,
      onFocus,
      ariaDescribedBy,
      onChange,
      options,  // eslint-disable-line
      schema,   // eslint-disable-line
      formContext,  // eslint-disable-line
      registry,  // eslint-disable-line
      ...inputProps
    } = this.props;
    const {
      value
    } = this.state;

    inputProps.type = options.inputType || inputProps.type || "text";

    const maxLength = schema.maxLength ? schema.maxLength : null;
    return (
      <input
        {...inputProps}
        className="form-control"
        readOnly={readonly}
        disabled={disabled}
        autoFocus={autofocus}
        aria-describedby={ariaDescribedBy}
        maxLength={maxLength}
        value={value == null ? "" : value}
        onChange={this.onChange()}
        onBlur={this.onBlur()}
        onFocus={onFocus && (event => onFocus(inputProps.id, event.target.value))}
        />
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default BaseInput;