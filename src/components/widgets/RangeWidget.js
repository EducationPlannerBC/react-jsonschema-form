import React, {PropTypes} from "react";
import {rangeSpec} from "../../utils";
import BaseInput from "./BaseInput";

function RangeWidget(props) {
  const {schema, value} = props;
  return (
    <div className="field-range-wrapper">
      <BaseInput
        type="range"
        {...props}
        {...rangeSpec(schema)}/>
      <span className="range-view">{value}</span>
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  RangeWidget.propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    ariaDescribedBy: PropTypes.string,
  };
}

export default RangeWidget;
