import React from "react";
import PropTypes from "prop-types";
//import BaseInput from "./BaseInput";

function PasswordWidget(props) {
  const { BaseInput } = props.registry.widgets;

  return <BaseInput type="password" {...props}/>;
}

if (process.env.NODE_ENV !== "production") {
  PasswordWidget.propTypes = {
    value: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };
}

export default PasswordWidget;