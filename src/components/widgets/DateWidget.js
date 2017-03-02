import React, {PropTypes} from "react";
import BaseInput from "./EPBCBaseInput";

function DateWidget(props) {
  const {onChange} = props;
  return (
    <BaseInput
      type="date"
      {...props}
      onChange={(value) => onChange(value || undefined)}/>
  );
}

if (process.env.NODE_ENV !== "production") {
  DateWidget.propTypes = {
    value: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };
}

export default DateWidget;
