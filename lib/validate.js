"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.toErrorList = toErrorList;
exports.default = validateFormData;

var _lodash = require("lodash.topath");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("lodash.get");

var _lodash4 = _interopRequireDefault(_lodash3);

var _jsonschema = require("jsonschema");

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ajv = new _ajv2.default({
  errorDataPath: "property",
  allErrors: true
});
// add custom formats
ajv.addFormat("data-url", /^data:([a-z]+\/[a-z0-9-+.]+)?;name=(.*);base64,(.*)$/);
ajv.addFormat("color", /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/);

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
  return errors.reduce(function (errorSchema, error) {
    var property = error.property,
        message = error.message;

    var path = (0, _lodash2.default)(property);
    var parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = path.slice(0)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var segment = _step.value;

        if (!(segment in parent)) {
          parent[segment] = {};
        }
        parent = parent[segment];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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

function toErrorList(errorSchema) {
  var fieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "root";

  // XXX: We should transform fieldName as a full field path string.
  var errorList = [];
  if ("__errors" in errorSchema) {
    errorList = errorList.concat(errorSchema.__errors.map(function (stack) {
      return {
        stack: fieldName + ": " + stack
      };
    }));
  }
  return Object.keys(errorSchema).reduce(function (acc, key) {
    if (key !== "__errors") {
      acc = acc.concat(toErrorList(errorSchema[key], key));
    }
    return acc;
  }, errorList);
}

function createErrorHandler(formData) {
  var handler = {
    // We store the list of errors for this node in a property named __errors
    // to avoid name collision with a possible sub schema field named
    // "errors" (see `utils.toErrorSchema`).
    __errors: [],
    addError: function addError(message) {
      this.__errors.push(message);
    }
  };
  if ((0, _utils.isObject)(formData)) {
    return Object.keys(formData).reduce(function (acc, key) {
      return _extends({}, acc, _defineProperty({}, key, createErrorHandler(formData[key])));
    }, handler);
  }
  if (Array.isArray(formData)) {
    return formData.reduce(function (acc, value, key) {
      return _extends({}, acc, _defineProperty({}, key, createErrorHandler(value)));
    }, handler);
  }
  return handler;
}

function unwrapErrorHandler(errorHandler) {
  return Object.keys(errorHandler).reduce(function (acc, key) {
    if (key === "addError") {
      return acc;
    } else if (key === "__errors") {
      return _extends({}, acc, _defineProperty({}, key, errorHandler[key]));
    }
    return _extends({}, acc, _defineProperty({}, key, unwrapErrorHandler(errorHandler[key])));
  }, {});
}

/**
 * Transforming the error output from ajv to format used by jsonschema.
 * At some point, components should be updated to support ajv.
 */
function transformAjvErrors() {
  var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (errors === null) {
    return [];
  }

  return errors.map(function (e) {
    var dataPath = e.dataPath,
        keyword = e.keyword,
        message = e.message,
        params = e.params;

    var property = "" + dataPath;

    // put data in expected format
    return {
      name: keyword,
      property: property,
      message: message,
      params: params, // specific to ajv
      stack: (property + " " + message).trim()
    };
  });
}

function comparisonConditionIsSatisfied(validatingPropertyValue, comparisonPropertyValue, conditionType) {
  if ((typeof validatingPropertyValue === "undefined" ? "undefined" : _typeof(validatingPropertyValue)) !== (typeof comparisonPropertyValue === "undefined" ? "undefined" : _typeof(comparisonPropertyValue))) {
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

function formatJsonValidateResult(jsonValidateResult) {
  var instance = jsonValidateResult.instance,
      errors = jsonValidateResult.errors,
      schema = jsonValidateResult.schema;

  var formData = instance;

  var extValidationErrors = [];

  var evaluateExtendedValidations = function evaluateExtendedValidations(schema, formData, formDataPath) {
    // If form data exists here but the schema does not, then we have conditionally
    // removed part of the schema due to dependencies, so ext validation do not apply...
    if (!schema) {
      return;
    }
    if (Array.isArray(formData)) {
      for (var i = 0; i < formData.length; i++) {
        evaluateExtendedValidations(schema.items, formData[i] + "[" + i + "]");
      }
    } else if (formData && (typeof formData === "undefined" ? "undefined" : _typeof(formData)) === "object") {
      var keys = Object.keys(formData);
      var extValidations = schema["ext:validations"];
      if (extValidations) {
        var extValidationKeys = Object.keys(extValidations);
        for (var _i = 0; _i < extValidationKeys.length; _i++) {
          var validatingPropertyName = extValidationKeys[_i];
          var validatingPropertyValue = formData[validatingPropertyName];
          var comparisonCondition = extValidations[validatingPropertyName].condition;
          // If we are validating this property against a value...
          if (extValidations[validatingPropertyName].value) {
            var comparisonValue = extValidations[validatingPropertyName].value;
            if (comparisonConditionIsSatisfied(validatingPropertyValue, comparisonValue, comparisonCondition)) {
              var newExtValidationError = {};
              var validationMessage = extValidations[validatingPropertyName].message ? extValidations[validatingPropertyName].message : validatingPropertyName + " must be " + comparisonCondition + " to " + comparisonValue;
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
              var _validatingPropertyValue = formData[validatingPropertyName];
              var comparisonPropertyName = extValidations[validatingPropertyName].prop;
              var comparisonPropertyValue = formData[comparisonPropertyName];
              if (comparisonConditionIsSatisfied(_validatingPropertyValue, comparisonPropertyValue, comparisonCondition)) {
                var _newExtValidationError = {};
                var _validationMessage = extValidations[validatingPropertyName].message ? extValidations[validatingPropertyName].message : validatingPropertyName + " must be " + comparisonCondition + " to " + comparisonPropertyName + " (" + comparisonPropertyValue + ")";
                _newExtValidationError.argument = comparisonPropertyName + " (" + comparisonPropertyValue + ")";
                _newExtValidationError.instance = _validatingPropertyValue;
                _newExtValidationError.message = _validationMessage;
                _newExtValidationError.name = "ext:validations:" + comparisonCondition;
                _newExtValidationError.property = formDataPath + "." + validatingPropertyName;
                _newExtValidationError.schema = schema.properties[validatingPropertyName];
                _newExtValidationError.stack = schema.properties[validatingPropertyName].title + ": " + _validationMessage + ".";

                extValidationErrors.push(_newExtValidationError);
              }
            }
        }
      }
      for (var _i2 = 0; _i2 < keys.length; _i2++) {
        var formDataPropertyName = keys[_i2];
        var formDataPropertyValue = formData[formDataPropertyName];
        // If this property is an object, the recursively call evaluateExtendedValidations...
        if ((typeof formDataPropertyValue === "undefined" ? "undefined" : _typeof(formDataPropertyValue)) === "object" && schema.properties) {
          evaluateExtendedValidations(schema.properties[formDataPropertyName], formData[formDataPropertyName], formDataPath + "." + formDataPropertyName);
        }
      }
    }
  };

  // Evaluate extended validations (if present) if this form is bound to an object...
  if (formData && (typeof formData === "undefined" ? "undefined" : _typeof(formData)) === "object") {
    evaluateExtendedValidations(schema, formData, "instance");
  }

  var getPropNameAndParentSchema = function getPropNameAndParentSchema(error) {
    var propPath = (0, _lodash2.default)(error.property);
    // The prop name is at the end of the path
    var propName = propPath.pop();
    // Note that we're getting the path to the parent schema by popping the
    // property off the end of the path
    var propParentPath = propPath;
    // If the path starts with instance, then remove it, since we're beginning
    // from the root schema...
    if (propParentPath[0] === "instance") {
      propParentPath.shift();
    }
    var propParentSchema = propParentPath.reduce(function (parent, prop) {
      if (parent.type === "array") {
        return parent.items;
      }
      return parent.properties[prop];
    }, schema);
    return { propName: propName, propParentSchema: propParentSchema };
  };

  var newErrors = errors.filter(function (error) {
    // If this is a minLength, enum or type validation error and the value is null,
    // suppress the error since it will be conveyed as a required field error
    // instead...
    if (["minLength", "enum"].indexOf(error.name) > -1 && !error["instance"]) {
      var _getPropNameAndParent = getPropNameAndParentSchema(error),
          propName = _getPropNameAndParent.propName,
          propParentSchema = _getPropNameAndParent.propParentSchema;

      return false;
    }
    // Otherwise, if this is a type validation error and the value is null,
    // suppress the error if it is for an optional field...
    else if (error.name === "type" && error.schema.type !== "boolean" && !error["instance"]) {
        var _getPropNameAndParent2 = getPropNameAndParentSchema(error),
            _propName = _getPropNameAndParent2.propName,
            _propParentSchema = _getPropNameAndParent2.propParentSchema;
        // If the field is not required, ignore the type error and allow the value to be null...


        if (!(_propParentSchema.required && _propParentSchema.required.indexOf(_propName) > -1)) {
          return false;
        }
      }
      // Otherwise, if this is a type validation error for a boolean field...
      else if (error.name === "type" && error.schema.type === "boolean" && !error["instance"]) {
          var _getPropNameAndParent3 = getPropNameAndParentSchema(error),
              _propName2 = _getPropNameAndParent3.propName,
              _propParentSchema2 = _getPropNameAndParent3.propParentSchema;
          // If the field is not required, ignore the type error and allow the value to be null...


          if (!(_propParentSchema2.required && _propParentSchema2.required.indexOf(_propName2) > -1)) {
            return false;
          } else {
            var propPath = (0, _lodash2.default)(error.property);
            if (propPath[0] === "instance") {
              propPath.shift();
            }
            var propValue = (0, _lodash4.default)(formData, propPath);
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
  }).map(function (error) {
    // If this is a type error for a required field with value set to null,
    // then re-frame it as a 'Field is required' error
    if (error.name === "type") {
      var _getPropNameAndParent4 = getPropNameAndParentSchema(error),
          propName = _getPropNameAndParent4.propName,
          propParentSchema = _getPropNameAndParent4.propParentSchema;

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
function validateFormData(formData, schema, customValidate, transformErrors, isSubmit) {
  ajv.validate(schema, formData);

  var errors = transformAjvErrors(ajv.errors);

  if (typeof transformErrors === "function") {
    errors = transformErrors(errors);
  }

  errors = Object.assign({}, errors, formatJsonValidateResult((0, _jsonschema.validate)(formData, schema)));

  var errorSchema = toErrorSchema(errors);

  if (typeof customValidate !== "function") {
    return { errors: errors, errorSchema: errorSchema };
  }

  var errorHandler = customValidate(formData, createErrorHandler(formData), isSubmit);
  var userErrorSchema = unwrapErrorHandler(errorHandler);
  var newErrorSchema = (0, _utils.mergeObjects)(errorSchema, userErrorSchema, true);
  // XXX: The errors list produced is not fully compliant with the format
  // exposed by the jsonschema lib, which contains full field paths and other
  // properties.
  var newErrors = toErrorList(newErrorSchema);

  return { errors: newErrors, errorSchema: newErrorSchema };
}