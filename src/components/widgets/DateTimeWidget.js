import React, {PropTypes} from "react";

import BaseInput from "./EPBCBaseInput";


function fromJSONDate(jsonDate) {
  return jsonDate ? jsonDate.slice(0, 19) : "";
}

function toJSONDate(dateString) {
  if (dateString) {
    return new Date(dateString).toJSON();
  }
}

function DateTimeWidget(props) {
  const {value, ariaDescribedByFields, onChange} = props;
  return (
    <BaseInput
      type="datetime-local"
      {...props}
      value={fromJSONDate(value)}
      ariaDescribedByFields={ariaDescribedByFields}
      onChange={(value) => onChange(toJSONDate(value))}/>
  );
}

if (process.env.NODE_ENV !== "production") {
  DateTimeWidget.propTypes = {
    value: PropTypes.string,
    ariaDescribedByFields: PropTypes.arrayOf(PropTypes.string),
  };
}

export default DateTimeWidget;
