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

var _ErrorList = require("./ErrorList");

var _ErrorList2 = _interopRequireDefault(_ErrorList);

var _utils = require("../utils");

var _validate = require("../validate");

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.onChange = function (formData) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { validate: false };

      var mustValidate = !_this.props.noValidate && (_this.props.liveValidate || options.validate);
      var isSubmitQueued = _this.state.status === "submitQueued";
      var state = { formData: formData };
      if (mustValidate) {
        var _this$validate = _this.validate(formData),
            errors = _this$validate.errors,
            errorSchema = _this$validate.errorSchema;

        state = _extends({}, state, { errors: errors, errorSchema: errorSchema });
      }
      (0, _utils.setState)(_this, state, function () {
        if (_this.props.onChange) {
          _this.props.onChange(_this.state);
        }
      });
      // If we have a submit queued up, in the event that we had just previously entered the onSubmit handler,
      // but had to first blur a text-based input, that supports form submission upon pressing enter, in order
      // to trigger any field validation to execute
      if (isSubmitQueued) {
        _this.onSubmit();
      }
    };

    _this.onBlur = function () {
      if (_this.props.onBlur) {
        var _this$props;

        (_this$props = _this.props).onBlur.apply(_this$props, arguments);
      }
    };

    _this.onFocus = function () {
      if (_this.props.onFocus) {
        var _this$props2;

        (_this$props2 = _this.props).onFocus.apply(_this$props2, arguments);
      }
    };

    _this.onSubmit = function (event) {
      if (event) {
        event.preventDefault();
      }
      var lastActiveField = _this.state.activeField;

      var activeField = document.activeElement;
      // If a text-based input, that supports form submission upon pressing enter, is currently focused, then
      // programmatically blur it to trigger field validation, prior to continuing with full form submission...
      if (activeField && activeField.nodeName.toLowerCase() === "input" && ["text", "password"].includes(activeField.type)) {
        // Save reference to the activeField on state, so that we can set focus back to it when we re-enter
        // onSubmit in a moment
        _this.setState({ activeField: activeField, status: "submitQueued" }, function () {
          activeField.blur();
          // In case there doesn't happen to be an onBlur handler for the text-based input that we just
          // blurred (NOTE: there really should be, since this is the convention we're used throughout
          // the EPBC UI), then fallback to relying on a timeout-based method (i.e. within 1 second) for
          // re-entering onSubmit...
          setTimeout(function () {
            // Only try submitting the form from here, if we have not already submitted the form
            // via onChange at the top, after blurring the text-based input...
            if (_this.state.status === "submitQueued") {
              _this.onSubmit();
            }
          }, 1000);
        });
        return;
      }
      // If we had to blur an active field to trigger validation on the original submit attempt, then set
      // focus back to it, then carry on with submitting the form...
      if (lastActiveField) {
        lastActiveField.focus();
      }
      // Remove the reference to the active field, since there's no longer any use for it
      _this.setState({ activeField: null, status: "submitted" });

      if (!_this.props.noValidate) {
        // Trigger any validation of custom fields/widgets that are subscribed
        if (_this.props.formContext && _this.props.formContext.validationHandlers) {
          _this.props.formContext.validationHandlers.forEach(function (validateHandler) {
            validateHandler();
          });
        }
        // Convert any default, initial values corresponding to the 'Not Specified' option to null before
        // before running validation
        // (NOTE: We're directly modifying the formData on state, but we know what we're doing here)
        (0, _utils.nullifyEmptyRequiredFields)(_this.props.schema, _this.props.uiSchema, _this.state.formData);

        var _this$validate2 = _this.validate(_this.state.formData, false, true),
            errors = _this$validate2.errors,
            errorSchema = _this$validate2.errorSchema;

        if (Object.keys(errors).length > 0) {
          (0, _utils.setState)(_this, { errors: errors, errorSchema: errorSchema }, function () {
            // If we just updated the formData on state, such that it is no longer equivalent to the formData
            // on props, emit the updated state up through onChange, so that we can get the two back in sync...
            // (NOTE: If we don't do this, then we may end up overwriting the new formData that we just modified
            // modified on state with the formData on props after getStateFromProps executes from
            // componentWillReceiveProps)
            if (_this.props.onChange && !(0, _utils.deepEquals)(_this.props.formData, _this.state.formData)) {
              _this.props.onChange(_this.state);
            }
            if (_this.props.onError) {
              _this.props.onError(errors);
            } else {
              console.error("Form validation failed", errors);
            }
          });
          return;
        } else {
          if (_this.props.onSubmit) {
            _this.props.onSubmit(_extends({}, _this.state, { status: "submitted" }));
          }
          _this.setState({ status: "initial", errors: [], errorSchema: {} });
        }
      } else {
        if (_this.props.onSubmit) {
          _this.props.onSubmit(_extends({}, _this.state, { status: "submitted" }));
        }
        _this.setState({ status: "initial", errors: [], errorSchema: {} });
      }
    };

    _this.state = _this.getStateFromProps(props, true);
    return _this;
  }

  _createClass(Form, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }, {
    key: "getStateFromProps",
    value: function getStateFromProps(props, initialize) {
      var state = this.state || {};
      var schema = "schema" in props ? props.schema : this.props.schema;
      var uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
      var edit = typeof props.formData !== "undefined";
      var liveValidate = props.liveValidate || this.props.liveValidate;
      var mustValidate = edit && !props.noValidate && liveValidate;
      var definitions = schema.definitions;

      var formData = (0, _utils.getDefaultFormState)(schema, props.formData, definitions, initialize);
      var retrievedSchema = (0, _utils.retrieveSchema)(schema, definitions, formData);

      var _ref = mustValidate ? this.validate(formData, schema) : {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {}
      },
          errors = _ref.errors,
          errorSchema = _ref.errorSchema;

      var idSchema = (0, _utils.toIdSchema)(retrievedSchema, uiSchema["ui:rootFieldId"], definitions, formData);
      return {
        schema: schema,
        uiSchema: uiSchema,
        idSchema: idSchema,
        formData: formData,
        edit: edit,
        errors: errors,
        errorSchema: errorSchema,
        activeField: state.activeField
      };
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _utils.shouldRender)(this, nextProps, nextState);
    }
  }, {
    key: "validate",
    value: function validate(formData, schema, isSubmit) {
      var _props = this.props,
          validate = _props.validate,
          transformErrors = _props.transformErrors;

      return (0, _validate2.default)(formData, schema || this.props.schema, validate, transformErrors, !!isSubmit);
    }
  }, {
    key: "renderErrors",
    value: function renderErrors() {
      var _state = this.state,
          errors = _state.errors,
          errorSchema = _state.errorSchema,
          schema = _state.schema,
          uiSchema = _state.uiSchema;
      var _props2 = this.props,
          ErrorList = _props2.ErrorList,
          showErrorList = _props2.showErrorList,
          formContext = _props2.formContext;


      if (errors.length && showErrorList != false) {
        return _react2.default.createElement(ErrorList, {
          errors: errors,
          errorSchema: errorSchema,
          schema: schema,
          uiSchema: uiSchema,
          formContext: formContext
        });
      }
      return null;
    }
  }, {
    key: "getRegistry",
    value: function getRegistry() {
      // For BC, accept passed SchemaField and TitleField props and pass them to
      // the "fields" registry one.
      var _getDefaultRegistry = (0, _utils.getDefaultRegistry)(),
          fields = _getDefaultRegistry.fields,
          widgets = _getDefaultRegistry.widgets;

      return {
        fields: _extends({}, fields, this.props.fields),
        widgets: _extends({}, widgets, this.props.widgets),
        ArrayFieldTemplate: this.props.ArrayFieldTemplate,
        ObjectFieldTemplate: this.props.ObjectFieldTemplate,
        FieldTemplate: this.props.FieldTemplate,
        definitions: this.props.schema.definitions || {},
        formContext: this.props.formContext || {}
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          children = _props3.children,
          safeRenderCompletion = _props3.safeRenderCompletion,
          id = _props3.id,
          className = _props3.className,
          name = _props3.name,
          method = _props3.method,
          target = _props3.target,
          action = _props3.action,
          autocomplete = _props3.autocomplete,
          enctype = _props3.enctype,
          acceptcharset = _props3.acceptcharset,
          noHtml5Validate = _props3.noHtml5Validate;
      var _state2 = this.state,
          schema = _state2.schema,
          uiSchema = _state2.uiSchema,
          formData = _state2.formData,
          errorSchema = _state2.errorSchema,
          idSchema = _state2.idSchema;

      var registry = this.getRegistry();
      var _SchemaField = registry.fields.SchemaField;

      return _react2.default.createElement(
        "form",
        {
          className: className ? className : "rjsf",
          id: id,
          name: name,
          method: method,
          target: target,
          action: action,
          autoComplete: autocomplete,
          encType: enctype,
          acceptCharset: acceptcharset,
          noValidate: noHtml5Validate,
          onSubmit: this.onSubmit },
        this.renderErrors(),
        _react2.default.createElement(_SchemaField, {
          schema: schema,
          uiSchema: uiSchema,
          errorSchema: errorSchema,
          idSchema: idSchema,
          formData: formData,
          onChange: this.onChange,
          onBlur: this.onBlur,
          onFocus: this.onFocus,
          registry: registry,
          safeRenderCompletion: safeRenderCompletion
        }),
        children ? children : _react2.default.createElement(
          "p",
          null,
          _react2.default.createElement(
            "button",
            { type: "submit", className: "btn btn-info" },
            "Submit"
          )
        )
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.defaultProps = {
  uiSchema: {},
  noValidate: false,
  liveValidate: false,
  safeRenderCompletion: false,
  noHtml5Validate: false,
  ErrorList: _ErrorList2.default
};
exports.default = Form;


if (process.env.NODE_ENV !== "production") {
  Form.propTypes = {
    schema: _propTypes2.default.object.isRequired,
    uiSchema: _propTypes2.default.object,
    formData: _propTypes2.default.any,
    widgets: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object])),
    fields: _propTypes2.default.objectOf(_propTypes2.default.func),
    ArrayFieldTemplate: _propTypes2.default.func,
    ObjectFieldTemplate: _propTypes2.default.func,
    FieldTemplate: _propTypes2.default.func,
    ErrorList: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    onError: _propTypes2.default.func,
    showErrorList: _propTypes2.default.bool,
    onSubmit: _propTypes2.default.func,
    id: _propTypes2.default.string,
    className: _propTypes2.default.string,
    name: _propTypes2.default.string,
    method: _propTypes2.default.string,
    target: _propTypes2.default.string,
    action: _propTypes2.default.string,
    autocomplete: _propTypes2.default.string,
    enctype: _propTypes2.default.string,
    acceptcharset: _propTypes2.default.string,
    noValidate: _propTypes2.default.bool,
    noHtml5Validate: _propTypes2.default.bool,
    liveValidate: _propTypes2.default.bool,
    validate: _propTypes2.default.func,
    transformErrors: _propTypes2.default.func,
    safeRenderCompletion: _propTypes2.default.bool,
    formContext: _propTypes2.default.object
  };
}