"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTextareaAutosize = require("react-textarea-autosize");

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextareaWidget = function (_Component) {
  _inherits(TextareaWidget, _Component);

  function TextareaWidget(props) {
    _classCallCheck(this, TextareaWidget);

    var _this = _possibleConstructorReturn(this, (TextareaWidget.__proto__ || Object.getPrototypeOf(TextareaWidget)).call(this, props));

    var value = props.value;

    _this.state = { value: value };
    return _this;
  }

  _createClass(TextareaWidget, [{
    key: "onChange",
    value: function onChange() {
      var _this2 = this;

      var onChange = this.props.onChange;

      return function (event) {
        var value = event.target.value.length === 0 && _this2.props.required ? null : event.target.value;
        _this2.setState({ value: value });
      };
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      var _this3 = this;

      var onChange = this.props.onChange;

      return function (event) {
        var value = event.target.value.length === 0 && _this3.props.required ? null : event.target.value;
        _this3.setState({ value: value }, function () {
          onChange(value);
        });
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          schema = _props.schema,
          id = _props.id,
          placeholder = _props.placeholder,
          disabled = _props.disabled,
          readonly = _props.readonly,
          autofocus = _props.autofocus,
          ariaDescribedBy = _props.ariaDescribedBy,
          onChange = _props.onChange;
      var value = this.state.value;

      return _react2.default.createElement(_reactTextareaAutosize2.default, {
        id: id,
        className: "form-control",
        value: value ? value : "",
        placeholder: placeholder,
        disabled: disabled,
        readOnly: readonly,
        autoFocus: autofocus,
        "aria-describedby": ariaDescribedBy,
        onChange: this.onChange(),
        onBlur: this.onBlur() });
    }
  }]);

  return TextareaWidget;
}(_react.Component);

TextareaWidget.defaultProps = {
  autofocus: false
};


if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: _react.PropTypes.object.isRequired,
    id: _react.PropTypes.string.isRequired,
    placeholder: _react.PropTypes.string,
    value: _react.PropTypes.string,
    required: _react.PropTypes.bool,
    autofocus: _react.PropTypes.bool,
    ariaDescribedBy: _react.PropTypes.string,
    onChange: _react.PropTypes.func
  };
}

exports.default = TextareaWidget;