import React, { Component, PropTypes } from "react";

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
    const {onChange} = this.props;
    return (event) => {
      const value = event.target.value;
      this.setState({ value: value }, () => {
        onChange(value);
      });
    };
  }

  // onKeyPress() {
  //   const {onChange} = this.props;
  //   return (event) => {
  //     // If the enter key was pressed, process as a blur event...
  //     if (event.which === 13) {
  //       const value = event.target.value;
  //       this.setState({ value: value }, () => {
  //         onChange(value);
  //       });
  //     };
  //   }
  // }

  render() {
    // Note: since React 15.2.0 we can't forward unknown element attributes, so we
    // exclude the "options" and "schema" ones here.
    const {
      required,
      readonly,
      autofocus,
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
    const maxLength = schema.maxLength ? schema.maxLength : null;
    return (
      <input
        {...inputProps}
        className="form-control"
        readOnly={readonly}
        autoFocus={autofocus}
        aria-describedby={ariaDescribedBy}
        maxLength={maxLength}
        value={value == null ? "" : value}
        onChange={this.onChange()}
        onBlur={this.onBlur()} />
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
  };
}

export default BaseInput;