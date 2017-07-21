import React, {Component, PropTypes} from "react";

import ErrorList from "./ErrorList";
import {
  getDefaultFormState,
  shouldRender,
  toIdSchema,
  setState,
  getDefaultRegistry,
  nullifyEmptyRequiredFields,
  deepEquals,
} from "../utils";
import validateFormData from "../validate";


export default class Form extends Component {
  static defaultProps = {
    uiSchema: {},
    noValidate: false,
    liveValidate: false,
    safeRenderCompletion: false,
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props, initialize) {
    const state = this.state || {};
    const schema = "schema" in props ? props.schema : this.props.schema;
    const uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
    const edit = typeof props.formData !== "undefined";
    const liveValidate = props.liveValidate || this.props.liveValidate;
    const mustValidate = edit && !props.noValidate && liveValidate;
    const {definitions} = schema;
    const formData = getDefaultFormState(schema, props.formData, definitions, initialize);
    const {errors, errorSchema} = mustValidate ?
      this.validate(formData, schema) : {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {}
      };
    const idSchema = toIdSchema(schema, uiSchema["ui:rootFieldId"], definitions);
    return {
      status: "initial",
      schema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema,
      activeField: state.activeField,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  validate(formData, schema, isSubmit) {
    const {validate} = this.props;
    return validateFormData(formData, schema || this.props.schema, validate, !!isSubmit);
  }

  renderErrors() {
    const {status, errors} = this.state;
    const {showErrorList} = this.props;

    if (status !== "editing" && errors.length && showErrorList != false) {
      return <ErrorList errors={errors} />;
    }
    return null;
  }

  onChange = (formData, options={validate: false}) => {
    const mustValidate = !this.props.noValidate && (this.props.liveValidate || options.validate);
    const isSubmitQueued = this.state.status === "submitQueued";
    let state = { status: "editing", formData };
    if (mustValidate) {
      const { errors, errorSchema } = this.validate(formData);
      state = { ...state, errors, errorSchema };
    }
    setState(this, state, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
      // If we have a submit queued up, in the event that we had just previously entered the onSubmit handler, 
      // but had to first blur a text-based input, that supports form submission upon pressing enter, in order
      // to trigger any field validation to execute 
      if (isSubmitQueued) {
        this.onSubmit();
      }
    });
  }

  onSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const { activeField: lastActiveField } = this.state;
    const activeField = document.activeElement;
    // If a text-based input, that supports form submission upon pressing enter, is currently focused, then
    // programmatically blur it to trigger field validation, prior to continuing with full form submission...
    if (activeField && activeField.nodeName.toLowerCase() === "input"
      && ["text", "password"].includes(activeField.type)
    ) {
      // Save reference to the activeField on state, so that we can set focus back to it when we re-enter
      // onSubmit in a moment
      this.setState({ activeField, status: "submitQueued" }, () => {
        activeField.blur();
        // In case there doesn't happen to be an onBlur handler for the text-based input that we just
        // blurred (NOTE: there really should be, since this is the convention we're used throughout
        // the EPBC UI), then fallback to relying on a timeout-based method (i.e. within 1 second) for
        // re-entering onSubmit...
        setTimeout(() => {
          // Only try submitting the form from here, if we have not already submitted the form 
          // via onChange at the top, after blurring the text-based input...
          if (this.state.status === "submitQueued") {
            this.onSubmit();
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
    this.setState({ activeField: null, status: "submitted" });

    if (!this.props.noValidate) {
      // Trigger any validation of custom fields/widgets that are subscribed
      if (this.props.formContext && this.props.formContext.validationHandlers) {
        this.props.formContext.validationHandlers.forEach((validateHandler) => {
          validateHandler();
        });
      }
      // Convert any default, initial values corresponding to the 'Not Specified' option to null before
      // before running validation
      // (NOTE: We're directly modifying the formData on state, but we know what we're doing here)
      nullifyEmptyRequiredFields(this.props.schema, this.props.uiSchema, this.state.formData);

      const { errors, errorSchema } = this.validate(this.state.formData, false, true);
      if (Object.keys(errors).length > 0) {
        setState(this, { errors, errorSchema }, () => {
          // If we just updated the formData on state, such that it is no longer equivalent to the formData
          // on props, emit the updated state up through onChange, so that we can get the two back in sync...
          // (NOTE: If we don't do this, then we may end up overwriting the new formData that we just modified
          // modified on state with the formData on props after getStateFromProps executes from 
          // componentWillReceiveProps)
          if (this.props.onChange && !deepEquals(this.props.formData, this.state.formData)) {
            this.props.onChange(this.state);
          }
          if (this.props.onError) {
            this.props.onError(errors);
          } else {
            console.error("Form validation failed", errors);
          }
        });
        return;
      }
      else {
        if (this.props.onSubmit) {
          this.props.onSubmit(this.state);
        }
        this.setState({ status: "initial", errors: [], errorSchema: {} });
      }
    }
    else {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state);
      }
      this.setState({ status: "initial", errors: [], errorSchema: {} });
    }
  }

  getRegistry() {
    // For BC, accept passed SchemaField and TitleField props and pass them to
    // the "fields" registry one.
    const {fields, widgets} = getDefaultRegistry();
    return {
      fields: {...fields, ...this.props.fields},
      widgets: {...widgets, ...this.props.widgets},
      FieldTemplate: this.props.FieldTemplate,
      definitions: this.props.schema.definitions || {},
      formContext: this.props.formContext || {},
    };
  }

  render() {
    const {
      children,
      safeRenderCompletion,
      id,
      className,
      name,
      method,
      target,
      action,
      autocomplete,
      enctype,
      acceptcharset
    } = this.props;

    const {schema, uiSchema, formData, errorSchema, idSchema} = this.state;
    const registry = this.getRegistry();
    const _SchemaField = registry.fields.SchemaField;

    return (
      <form className={className ? className : "rjsf"}
        id={id}
        name={name}
        method={method}
        target={target}
        action={action}
        autoComplete={autocomplete}
        encType={enctype}
        acceptCharset={acceptcharset}
        onSubmit={this.onSubmit}>
        {this.renderErrors()}
        <_SchemaField
          schema={schema}
          uiSchema={uiSchema}
          errorSchema={errorSchema}
          idSchema={idSchema}
          formData={formData}
          onChange={this.onChange}
          registry={registry}
          safeRenderCompletion={safeRenderCompletion}/>
        { children ? children :
          <p>
            <button type="submit" className="btn btn-info">Submit</button>
          </p> }
      </form>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  Form.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.any,
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])),
    fields: PropTypes.objectOf(PropTypes.func),
    FieldTemplate: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    showErrorList: PropTypes.bool,
    onSubmit: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    method: PropTypes.string,
    target: PropTypes.string,
    action: PropTypes.string,
    autocomplete: PropTypes.string,
    enctype: PropTypes.string,
    acceptcharset: PropTypes.string,
    noValidate: PropTypes.bool,
    liveValidate: PropTypes.bool,
    safeRenderCompletion: PropTypes.bool,
    formContext: PropTypes.object,
  };
}