import React, {Component, PropTypes} from "react";
import TextareaAutosize from 'react-textarea-autosize';

class TextareaWidget extends Component {
  static defaultProps = {
    autofocus: false
  };

  constructor(props) {
    super(props);
    const {value} = props;
    this.state = { value: value };
  }

  onChange() {
    const {onChange} = this.props;
    return (event) => {
        const value = event.target.value.length === 0 && this.props.required  ? null : event.target.value;
        this.setState({ value: value });
    };
  }

  onBlur() {
    const {onChange} = this.props;
    return (event) => {
      const value = event.target.value.length === 0 && this.props.required  ? null : event.target.value;
      this.setState({ value: value }, () => { 
          onChange(value)
      });
    };
  }

  render() {
    const {
      schema,
      id,
      placeholder,
      disabled,
      readonly,
      autofocus,
      ariaDescribedBy,
      onChange
    } = this.props;    
    const {
      value
    } = this.state;
    return (
      <TextareaAutosize
        id={id}
        className="form-control"
        value={value ? value : ""}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        aria-describedby={ariaDescribedBy}
        onChange={this.onChange()}
        onBlur={this.onBlur()}/>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func,
  };
}

export default TextareaWidget;