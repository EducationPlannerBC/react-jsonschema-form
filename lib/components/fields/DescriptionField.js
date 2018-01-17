"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRenderHtml = require("react-render-html");

var _reactRenderHtml2 = _interopRequireDefault(_reactRenderHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DescriptionField(props) {
  var id = props.id,
      description = props.description,
      isScrollable = props.isScrollable;

  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement("div", null);
  }
  if (typeof description === "string") {
    var descriptionStyle = null;
    if (isScrollable && description.length > 800) {
      descriptionStyle = {
        maxHeight: "12em",
        overflowY: "scroll",
        border: "solid 1px #aaaaaa",
        padding: "10px"
      };
    }
    return _react2.default.createElement(
      "div",
      { id: id, className: "field-description" + (descriptionStyle ? " field-description--scrollable" : ""), style: descriptionStyle },
      (0, _reactRenderHtml2.default)(description)
    );
  } else {
    return _react2.default.createElement(
      "div",
      { id: id, className: "field-description" },
      description
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  DescriptionField.propTypes = {
    id: _propTypes2.default.string,
    description: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
    isScrollable: _propTypes2.default.bool
  };
}

exports.default = DescriptionField;