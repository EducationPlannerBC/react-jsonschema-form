import React from "react";
import PropTypes from "prop-types";

function DisplayWidget(props) {
  const {id, value, schema} = props;

  return value ? <p id={id} className="form-control-static">{value}</p> : null;
}

export default DisplayWidget;