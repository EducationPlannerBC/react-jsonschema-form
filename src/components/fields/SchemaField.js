import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

import {
  isMultiSelect,
  retrieveSchema,
  getDefaultRegistry,
  getUiOptions,
  isFilesArray,
  deepEquals,
  getSchemaType,
} from "../../utils";
import UnsupportedField from "./UnsupportedField";

const OPTIONAL_FIELD_SYMBOL = "(Optional)";
const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
};

function getFieldComponent(schema, uiSchema, idSchema, fields) {
  const field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }

  const componentName = COMPONENT_TYPES[getSchemaType(schema)];
  return componentName in fields
    ? fields[componentName]
    : () => {
        return (
          <UnsupportedField
            schema={schema}
            idSchema={idSchema}
            reason={`Unknown field type ${schema.type}`}
          />
        );
      };
}

function Label(props) {
  const {label, required, id} = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <label className="control-label" htmlFor={id}>
      {label}{required ? null : <i> {OPTIONAL_FIELD_SYMBOL}</i>}
    </label>
  );
}

function Help(props) {
  const {fieldId, help} = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  if (typeof help === "string") {
    return <div id={fieldId + "-help"} className="help-block">{renderHTML(help)}</div>;
  }
  return <div id={fieldId + "-help"} className="help-block">{help}</div>;
}

function ErrorList(props) {

  const {fieldId, errors = []} = props;
  if (errors.length === 0) {
    return <div />;
  }
  else if (errors.length === 1) {
    return (
      <div id={fieldId + "-error"} className="text-danger">
        {renderHTML("<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>&nbsp;" + errors[0])}
      </div>
    );
  }
  return (
    <div id={fieldId + "-error"} className="text-danger">
      <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;The following errors exist:
      <ul className="error-detail bs-callout bs-callout-info">{
        errors.map((error, index) => {
          return <li className="text-danger" key={index}>{renderHTML(error)}</li>;
        })
      }</ul>
    </div>
  );
}

function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    displayDescription
  } = props;
  if (hidden) {
    return children;
  }

  return (
    <div className={classNames}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayDescription && description ? description : null}
      {children}
      {errors}
      {help}
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  DefaultTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.element,
    rawErrors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.element,
    rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    displayDescription: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object,
  };
}

DefaultTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
  displayDescription: true,
};

function SchemaFieldRender(props) {
  const {
    uiSchema,
    formData,
    errorSchema,
    idSchema,
    name,
    required,
    registry = getDefaultRegistry(),
  } = props;
  const {
    definitions,
    fields,
    formContext,
    FieldTemplate = DefaultTemplate,
  } = registry;
  const schema = retrieveSchema(props.schema, definitions, formData);
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const { DescriptionField } = fields;
  const disabled = Boolean(props.disabled || uiSchema["ui:disabled"]);
  const readonly = Boolean(props.readonly || uiSchema["ui:readonly"]);
  const autofocus = Boolean(props.autofocus || uiSchema["ui:autofocus"]);

  // Build-out the aria-described-by attribute for accessibility, depending on whether or
  // not errors and/or help is displayed
  let ariaDescribedByFields = [];
  if (errors && errors.length > 0) {
    ariaDescribedByFields.push(idSchema.$id + "-error");
  }
  if (help) {
    ariaDescribedByFields.push(idSchema.$id + "-help");
  }
  const ariaDescribedBy = ariaDescribedByFields.length ? ariaDescribedByFields.join(" ") : null;

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }

  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions;
  let displayDescription = true;
  if (schema.type === "array") {
    displayLabel =
      isMultiSelect(schema, definitions) ||
      isFilesArray(schema, uiSchema, definitions);
    displayDescription = isMultiSelect(schema, definitions) || isFilesArray(schema, uiSchema, definitions);
  }
  else if (schema.type === "object") {
    displayLabel = false;
    displayDescription = false;
  }
  // Suppress display of fields labels for checkbox and consent widgets, since they are
  // already included within the checkbox label...
  else if (schema.type === "boolean" && (uiSchema["ui:widget"] === "checkbox")) {
    displayLabel = false;
    displayDescription = false;
  }
  else if (schema.type === "boolean" && (uiSchema["ui:widget"] === "consent")) {
    displayLabel = false;
    displayDescription = true;
  }
  else if (uiSchema["ui:field"]) {
    displayLabel = false;
    displayDescription = false;
  }
  else if (uiSchema["ui:hideLabel"]) {
    displayLabel = false;
    displayDescription = false;
  }

  const { __errors, ...fieldErrorSchema } = errorSchema;

  // See #439: uiSchema: Don't pass consumed class names to child components
  const field = (
    <FieldComponent
      {...props}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      ariaDescribedBy={ariaDescribedBy}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
    />
  );

  const { type } = schema;
  const id = idSchema.$id;
  const label =
    uiSchema["ui:title"] || props.schema.title || schema.title || name;
  const description =
    uiSchema["ui:description"] ||
    props.schema.description ||
    schema.description;
  const errors = __errors;
  const help = uiSchema["ui:help"];
  const hidden = uiSchema["ui:widget"] === "hidden";

  const classNames = [
    "form-group",
    "field",
    `field-${type}`,
    errors && errors.length > 0 ? "field-error has-error has-danger" : "",
    uiSchema.classNames,
  ]
    .join(" ")
    .trim();

  const descriptionField = <DescriptionField id={id + "__description"}
      description={description}
      formContext={formContext}
      isScrollable={uiSchema["ui:widget"] === "consent"} />;

  const fieldProps = {
    description: descriptionField,
    rawDescription: description,
    help: <Help fieldId={id} help={help} />,
    rawHelp: typeof help === "string" ? help : undefined,
    errors: <ErrorList fieldId={id} errors={errors} />,
    rawErrors: errors,
    id,
    label,
    hidden,
    required: schema.format === "display" || required,
    disabled,
    readonly,
    displayLabel,
    displayDescription,
    classNames,
    formContext,
    fields,
    schema,
    uiSchema,
  };

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>;
}

class SchemaField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if schemas are equal idSchemas will be equal as well,
    // so it is not necessary to compare
    return !deepEquals(
      { ...this.props, idSchema: undefined },
      { ...nextProps, idSchema: undefined }
    );
  }

  render() {
    return SchemaFieldRender(this.props);
  }
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      ArrayFieldTemplate: PropTypes.func,
      ObjectFieldTemplate: PropTypes.func,
      FieldTemplate: PropTypes.func,
      formContext: PropTypes.object.isRequired,
    }),
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string
  };
}

export default SchemaField;