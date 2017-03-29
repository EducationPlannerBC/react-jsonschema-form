"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseInput = function (_Component) {
  _inherits(BaseInput, _Component);

  function BaseInput(props) {
    _classCallCheck(this, BaseInput);

    var _this = _possibleConstructorReturn(this, (BaseInput.__proto__ || Object.getPrototypeOf(BaseInput)).call(this, props));

    var value = props.value;

    _this.state = { value: value };
    return _this;
  }

  _createClass(BaseInput, [{
    key: "onChange",
    value: function onChange() {
      var _this2 = this;

      return function (event) {
        var value = event.target.value;
        _this2.setState({ value: value });
      };
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      var _this3 = this;

      var onChange = this.props.onChange;

      return function (event) {
        var value = event.target.value;
        _this3.setState({ value: value }, function () {
          onChange(value);
        });
      };
    }

    // onKeyPress() {
    //   const {onChange} = this.props;
    //   return (event) => {
    //     // If the enter key was pressed, process as a blur event...
    //     if (event.which === 13) {
    //       const value = event.target.value;
    //       this.setState({ value: value }, () => {
    //         onChange(value);
    //       });
    //     };
    //   }
    // }

  }, {
    key: "render",
    value: function render() {
      // Note: since React 15.2.0 we can't forward unknown element attributes, so we
      // exclude the "options" and "schema" ones here.
      var _props = this.props,
          required = _props.required,
          readonly = _props.readonly,
          autofocus = _props.autofocus,
          ariaDescribedBy = _props.ariaDescribedBy,
          onChange = _props.onChange,
          options = _props.options,
          schema = _props.schema,
          formContext = _props.formContext,
          registry = _props.registry,
          inputProps = _objectWithoutProperties(_props, ["required", "readonly", "autofocus", "ariaDescribedBy", "onChange", "options", "schema", "formContext", "registry"]);

      var value = this.state.value;

      var maxLength = schema.maxLength ? schema.maxLength : null;
      return _react2.default.createElement("input", _extends({}, inputProps, {
        className: "form-control",
        readOnly: readonly,
        autoFocus: autofocus,
        "aria-describedby": ariaDescribedBy,
        maxLength: maxLength,
        value: value == null ? "" : value,
        onChange: this.onChange(),
        onBlur: this.onBlur() }));
    }
  }]);

  return BaseInput;
}(_react.Component);

BaseInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};


if (process.env.NODE_ENV !== "production") {
  BaseInput.propTypes = {
    id: _react.PropTypes.string.isRequired,
    placeholder: _react.PropTypes.string,
    value: _react.PropTypes.any,
    required: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    readonly: _react.PropTypes.bool,
    autofocus: _react.PropTypes.bool,
    ariaDescribedBy: _react.PropTypes.string,
    onChange: _react.PropTypes.func
  };
}

exports.default = BaseInput;