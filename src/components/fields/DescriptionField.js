import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

function DescriptionField(props) {
  const {id, description, isScrollable} = props;
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div/>;
  }
  if (typeof description === "string") {
    let descriptionStyle = null;
    if (isScrollable && description.length > 800) {
      descriptionStyle = {
        maxHeight: "12em",
        overflowY: "scroll",
        border: "solid 1px #aaaaaa",
        padding: "10px"
      };
    }
    return <div id={id} className={"field-description" + (descriptionStyle ? " field-description--scrollable" : "")} style={descriptionStyle}>{renderHTML(description)}</div>;
  }
  else {
    return <div id={id} className="field-description">{description}</div>;
  }
}

if (process.env.NODE_ENV !== "production") {
  DescriptionField.propTypes = {
    id: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    isScrollable: PropTypes.bool
  };
}

export default DescriptionField;