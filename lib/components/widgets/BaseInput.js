"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

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

      var _props = this.props,
          onBlur = _props.onBlur,
          onChange = _props.onChange,
          options = _props.options,
          inputProps = _objectWithoutProperties(_props, ["onBlur", "onChange", "options"]);

      return function (event) {
        var value = event.target.value.trim();

        value = value === "" ? options.emptyValue : value;

        _this3.setState({ value: value }, function () {
          onBlur && onBlur(inputProps.id, value || null);
          onChange && onChange(value || null);
        });
      };
    }
  }, {
    key: "render",
    value: function render() {
      // Note: since React 15.2.0 we can't forward unknown element attributes, so we
      // exclude the "options" and "schema" ones here.
      var _props2 = this.props,
          required = _props2.required,
          readonly = _props2.readonly,
          disabled = _props2.disabled,
          autofocus = _props2.autofocus,
          onBlur = _props2.onBlur,
          onFocus = _props2.onFocus,
          ariaDescribedBy = _props2.ariaDescribedBy,
          onChange = _props2.onChange,
          options = _props2.options,
          schema = _props2.schema,
          formContext = _props2.formContext,
          registry = _props2.registry,
          inputProps = _objectWithoutProperties(_props2, ["required", "readonly", "disabled", "autofocus", "onBlur", "onFocus", "ariaDescribedBy", "onChange", "options", "schema", "formContext", "registry"]);

      var value = this.state.value;


      inputProps.type = options.inputType || inputProps.type || "text";

      var maxLength = schema.maxLength ? schema.maxLength : null;
      return _react2.default.createElement("input", _extends({}, inputProps, {
        className: "form-control",
        readOnly: readonly,
        disabled: disabled,
        autoFocus: autofocus,
        "aria-describedby": ariaDescribedBy,
        maxLength: maxLength,
        value: value == null ? "" : value,
        onChange: this.onChange(),
        onBlur: this.onBlur(),
        onFocus: onFocus && function (event) {
          return onFocus(inputProps.id, event.target.value);
        }
      }));
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
    id: _propTypes2.default.string.isRequired,
    placeholder: _propTypes2.default.string,
    value: _propTypes2.default.any,
    required: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    autofocus: _propTypes2.default.bool,
    ariaDescribedBy: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    onFocus: _propTypes2.default.func
  };
}

exports.default = BaseInput;