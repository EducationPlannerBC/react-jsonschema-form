import React, {PropTypes} from "react";

import BaseInput from "./EPBCBaseInput";


function ColorWidget(props) {
  return <BaseInput type="color" {...props}/>;
}

if (process.env.NODE_ENV !== "production") {
  ColorWidget.propTypes = {
    value: PropTypes.string,
    ariaDescribedByFields: PropTypes.string
  };
}

export default ColorWidget;
