import React, {PropTypes} from "react";

import BaseInput from "./BaseInput";

function TextWidget(props) {
  return <BaseInput {...props}/>;
}

if (process.env.NODE_ENV !== "production") {
  TextWidget.propTypes = {
    value: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    maxLength: PropTypes.number,
    ariaDescribedBy: PropTypes.string,
  };
}

export default TextWidget;
