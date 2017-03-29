import React, {PropTypes} from "react";

import BaseInput from "./BaseInput";


function fromJSONDate(jsonDate) {
  return jsonDate ? jsonDate.slice(0, 19) : "";
}

function toJSONDate(dateString) {
  if (dateString) {
    return new Date(dateString).toJSON();
  }
}

function DateTimeWidget(props) {
  const {value, ariaDescribedBy, onChange} = props;
  return (
    <BaseInput
      type="datetime-local"
      {...props}
      value={fromJSONDate(value)}
      ariaDescribedBy={ariaDescribedBy}
      onChange={(value) => onChange(toJSONDate(value))}/>
  );
}

if (process.env.NODE_ENV !== "production") {
  DateTimeWidget.propTypes = {
    value: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
    onChange: PropTypes.func,
  };
}

export default DateTimeWidget;
