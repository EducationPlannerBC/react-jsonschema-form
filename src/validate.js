import toPath from "lodash.topath";
import get from "lodash.get";
import {validate as jsonValidate} from "jsonschema";

import Ajv from "ajv";
const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: true,
});
// add custom formats
ajv.addFormat(
  "data-url",
  /^data:([a-z]+\/[a-z0-9-+.]+)?;name=(.*);base64,(.*)$/
);
ajv.addFormat(
  "color",
  /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/
);

import { isObject, mergeObjects } from "./utils";

function toErrorSchema(errors) {
  // Transforms a ajv validation errors list:
  // [
  //   {property: ".level1.level2[2].level3", message: "err a"},
  //   {property: ".level1.level2[2].level3", message: "err b"},
  //   {property: ".level1.level2[4].level3", message: "err b"},
  // ]
  // Into an error tree:
  // {
  //   level1: {
  //     level2: {
  //       2: {level3: {errors: ["err a", "err b"]}},
  //       4: {level3: {errors: ["err b"]}},
  //     }
  //   }
  // };
  if (!errors.length) {
    return {};
  }
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property);
    let parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        parent[segment] = {};
      }
      parent = parent[segment];
    }
    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message);
    } else {
      parent.__errors = [message];
    }
    return errorSchema;
  }, {});
}

export function toErrorList(errorSchema, fieldName = "root") {
  // XXX: We should transform fieldName as a full field path string.
  let errorList = [];
  if ("__errors" in errorSchema) {
    errorList = errorList.concat(
      errorSchema.__errors.map(stack => {
        return {
          stack: `${fieldName}: ${stack}`,
        };
      })
    );
  }
  return Object.keys(errorSchema).reduce((acc, key) => {
    if (key !== "__errors") {
      acc = acc.concat(toErrorList(errorSchema[key], key));
    }
    return acc;
  }, errorList);
}

function createErrorHandler(formData) {
  const handler = {
    // We store the list of errors for this node in a property named __errors
    // to avoid name collision with a possible sub schema field named
    // "errors" (see `utils.toErrorSchema`).
    __errors: [],
    addError(message) {
      this.__errors.push(message);
    },
  };
  if (isObject(formData)) {
    return Object.keys(formData).reduce((acc, key) => {
      return { ...acc, [key]: createErrorHandler(formData[key]) };
    }, handler);
  }
  if (Array.isArray(formData)) {
    return formData.reduce((acc, value, key) => {
      return { ...acc, [key]: createErrorHandler(value) };
    }, handler);
  }
  return handler;
}

function unwrapErrorHandler(errorHandler) {
  return Object.keys(errorHandler).reduce((acc, key) => {
    if (key === "addError") {
      return acc;
    } else if (key === "__errors") {
      return { ...acc, [key]: errorHandler[key] };
    }
    return { ...acc, [key]: unwrapErrorHandler(errorHandler[key]) };
  }, {});
}



/**
 * Transforming the error output from ajv to format used by jsonschema.
 * At some point, components should be updated to support ajv.
 */
function transformAjvErrors(errors = []) {
  if (errors === null) {
    return [];
  }

  return errors.map(e => {
    const { dataPath, keyword, message, params } = e;
    let property = `${dataPath}`;

    // put data in expected format
    return {
      name: keyword,
      property,
      message,
      params, // specific to ajv
      stack: `${property} ${message}`.trim(),
    };
  });
}

function comparisonConditionIsSatisfied(validatingPropertyValue, comparisonPropertyValue, conditionType) {
  if (typeof validatingPropertyValue !== typeof comparisonPropertyValue) {
    return false;
  }
  // If this is a string, and it hasn't yet been specified, defer display of an error
  // message until a value has been provided...
  if (typeof validatingPropertyValue === "string" && validatingPropertyValue.length === 0) {
    return false;
  }

  switch (conditionType) {
    case "equal":
      return validatingPropertyValue !== comparisonPropertyValue;
    case "not-equal":
      return validatingPropertyValue === comparisonPropertyValue;
    case "greater-than":
      return validatingPropertyValue <= comparisonPropertyValue;
    case "greater-than-equal":
      return validatingPropertyValue < comparisonPropertyValue;
    case "less-than":
      return validatingPropertyValue >= comparisonPropertyValue;
    case "less-than-equal":
      return validatingPropertyValue > comparisonPropertyValue;
    default:
      return false;
  }
}

function formatJsonValidateResult(jsonValidateResult){
  const {instance, errors, schema} = jsonValidateResult;
  const formData = instance;

  const extValidationErrors = [];

  const evaluateExtendedValidations = (schema, formData, formDataPath) => {
    // If form data exists here but the schema does not, then we have conditionally
    // removed part of the schema due to dependencies, so ext validation do not apply...
    if (!schema) {
      return;
    }
    if (Array.isArray(formData)) {
      for (let i = 0; i < formData.length; i++) {
        evaluateExtendedValidations(schema.items, formData[i] + "[" + i + "]");
      }
    }
    else if (formData && typeof formData === "object") {
      const keys = Object.keys(formData);
      const extValidations = schema["ext:validations"];
      if (extValidations) {
        const extValidationKeys = Object.keys(extValidations);
        for (let i = 0; i < extValidationKeys.length; i++) {
          const validatingPropertyName = extValidationKeys[i];
          const validatingPropertyValue = formData[validatingPropertyName];
          const comparisonCondition = extValidations[validatingPropertyName].condition;
          // If we are validating this property against a value...
          if (extValidations[validatingPropertyName].value) {
            const comparisonValue = extValidations[validatingPropertyName].value;
            if (comparisonConditionIsSatisfied(validatingPropertyValue, comparisonValue, comparisonCondition)) {
              const newExtValidationError = {};
              const validationMessage = extValidations[validatingPropertyName].message ? extValidations[validatingPropertyName].message
                : validatingPropertyName + " must be " + comparisonCondition + " to " + comparisonValue;
              newExtValidationError.argument = comparisonValue;
              newExtValidationError.instance = validatingPropertyValue;
              newExtValidationError.message = validationMessage;
              newExtValidationError.name = "ext:validations:" + comparisonCondition;
              newExtValidationError.property = formDataPath + "." + validatingPropertyName;
              newExtValidationError.schema = schema.properties[validatingPropertyName];
              newExtValidationError.stack = schema.properties[validatingPropertyName].title + ": " + validationMessage + ".";

              extValidationErrors.push(newExtValidationError);
            }
          }
          // Otherwise, we must be validating this property against another
          // property...
          else {
            const validatingPropertyValue = formData[validatingPropertyName];
            const comparisonPropertyName = extValidations[validatingPropertyName].prop;
            const comparisonPropertyValue = formData[comparisonPropertyName];
            if (comparisonConditionIsSatisfied(validatingPropertyValue, comparisonPropertyValue, comparisonCondition)) {
              const newExtValidationError = {};
              const validationMessage = extValidations[validatingPropertyName].message ? extValidations[validatingPropertyName].message
                : validatingPropertyName + " must be " + comparisonCondition + " to " + comparisonPropertyName + " (" + comparisonPropertyValue + ")";
              newExtValidationError.argument = comparisonPropertyName + " (" + comparisonPropertyValue + ")";
              newExtValidationError.instance = validatingPropertyValue;
              newExtValidationError.message = validationMessage;
              newExtValidationError.name = "ext:validations:" + comparisonCondition;
              newExtValidationError.property = formDataPath + "." + validatingPropertyName;
              newExtValidationError.schema = schema.properties[validatingPropertyName];
              newExtValidationError.stack = schema.properties[validatingPropertyName].title + ": " + validationMessage + ".";

              extValidationErrors.push(newExtValidationError);
            }
          }
        }
      }
      for (let i = 0; i < keys.length; i++) {
        const formDataPropertyName = keys[i];
        const formDataPropertyValue = formData[formDataPropertyName];
        // If this property is an object, the recursively call evaluateExtendedValidations...
        if (typeof formDataPropertyValue === "object" && schema.properties) {
          evaluateExtendedValidations(schema.properties[formDataPropertyName], formData[formDataPropertyName], formDataPath + "." + formDataPropertyName);
        }
      }
    }
  }

  // Evaluate extended validations (if present) if this form is bound to an object...
  if (formData && typeof formData === "object") {
    evaluateExtendedValidations(schema, formData, "instance");
  }

  const getPropNameAndParentSchema = (error) => {
    const propPath = toPath(error.property);
    // The prop name is at the end of the path
    const propName = propPath.pop();
    // Note that we're getting the path to the parent schema by popping the
    // property off the end of the path
    const propParentPath = propPath;
    // If the path starts with instance, then remove it, since we're beginning
    // from the root schema...
    if (propParentPath[0] === "instance") {
      propParentPath.shift();
    }
    const propParentSchema = propParentPath.reduce((parent, prop) => {
      if (parent.type === "array") {
        return parent.items;
      }
      return parent.properties[prop];
    }, schema);
    return { propName, propParentSchema };
  };

  const newErrors = errors.filter((error) => {
    // If this is a minLength, enum or type validation error and the value is null,
    // suppress the error since it will be conveyed as a required field error
    // instead...
    if (["minLength", "enum"].indexOf(error.name) > -1 && !error["instance"]) {
      const { propName, propParentSchema } = getPropNameAndParentSchema(error);

      return false;
    }
    // Otherwise, if this is a type validation error and the value is null,
    // suppress the error if it is for an optional field...
    else if(error.name === "type" && error.schema.type !== "boolean" && !error["instance"]) {
      const { propName, propParentSchema } = getPropNameAndParentSchema(error);
      // If the field is not required, ignore the type error and allow the value to be null...
      if (!(propParentSchema.required && propParentSchema.required.indexOf(propName) > -1)) {
        return false;
      }
    }
    // Otherwise, if this is a type validation error for a boolean field...
    else if(error.name === "type" && error.schema.type === "boolean" && !error["instance"]) {
      const { propName, propParentSchema } = getPropNameAndParentSchema(error);
      // If the field is not required, ignore the type error and allow the value to be null...
      if (!(propParentSchema.required && propParentSchema.required.indexOf(propName) > -1)) {
        return false;
      }
      else {
        const propPath = toPath(error.property);
        if (propPath[0] === "instance") {
          propPath.shift();
        }
        const propValue = get(formData, propPath);
        // If the type error is for a required field currently set to the empty string,
        // then suppress the error since this corresponds to the initialized (Not Specified)
        // option, otherwise we do want to show it if it is null (i.e. the user has interacted
        // with the field)
        if (propValue === "") {
          return false;
        }
      }
    }
    return true;
  }).map((error) => {
    // If this is a type error for a required field with value set to null,
    // then re-frame it as a 'Field is required' error
    if(error.name === "type"){
      const { propName, propParentSchema } = getPropNameAndParentSchema(error);
      if (propParentSchema.required && propParentSchema.required.indexOf(propName) > -1) {
        error.name = "required";
        error.message = error.schema.title + " is required";
      }
    }
    // Otherwise, if this is a required property error for an object, then
    // re-frame the validation error as a 'Field is required'
    // error for the specified property...
    else if (error.name === "required" && error.schema.properties[error.argument]) {
      error.property += "." + error.argument;
      error.message = error.schema.properties[error.argument].title + " is required";
      error.schema = error.schema.properties[error.argument];
    }
    // If custom validation messages are defined for this property,
    // and a custom validation message exists for this particular
    // validation error, then set it in place of the default
    // validation message coming out of the jsonschema validator...
    if (error.schema.errors && error.schema.errors[error.name]) {
      error.message = error.schema.errors[error.name];
    }
    // Otherwise, for the default validation message coming out of the
    // jsonschema validator, capitalize the first letter and add a period
    // at the end for nicer formatting...
    else {
      error.message = error.message.charAt(0).toUpperCase() + error.message.slice(1) + ".";
    }
    // Format error stack message to format: "[Prop Title]: Error Message"
    error.stack = error.schema.title + ": " + error.message;
    return error;
  });
  return Object.assign({}, jsonValidateResult, {
    errors: newErrors.concat(extValidationErrors)
  });
}


/**
 * This function processes the formData with a user `validate` contributed
 * function, which receives the form data and an `errorHandler` object that
 * will be used to add custom validation errors for each field.
 */
export default function validateFormData(
  formData,
  schema,
  customValidate,
  transformErrors
  , isSubmit
) {
  ajv.validate(schema, formData);

  let errors = transformAjvErrors(ajv.errors);

  if (typeof transformErrors === "function") {
    errors = transformErrors(errors);
  }

  errors = Object.assign({}, errors, formatJsonValidateResult(jsonValidate(formData, schema)));

  const errorSchema = toErrorSchema(errors);

  if (typeof customValidate !== "function") {
    return { errors, errorSchema };
  }

  const errorHandler = customValidate(formData, createErrorHandler(formData), isSubmit);
  const userErrorSchema = unwrapErrorHandler(errorHandler);
  const newErrorSchema = mergeObjects(errorSchema, userErrorSchema, true);
  // XXX: The errors list produced is not fully compliant with the format
  // exposed by the jsonschema lib, which contains full field paths and other
  // properties.
  const newErrors = toErrorList(newErrorSchema);

  return { errors: newErrors, errorSchema: newErrorSchema };
}
