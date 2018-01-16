import React from "react";
import PropTypes from "prop-types";

const OPTIONAL_FIELD_SYMBOL = " (Optional)";

function TitleField(props) {
  const {id, title, required} = props;
  // Do not include optional discriminator on section titles
  // const legend = required ? title : title + OPTIONAL_FIELD_SYMBOL;
  const legend = title;
  return <legend id={id}>{legend}</legend>;
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;