module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age"
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3
      },
      "booleanRadio": {
        "type": "boolean",
        "title": "Boolean Radio Group (default)",
        "default": null
      },
      "booleanCheckbox": {
        "type": "boolean",
        "title": "Boolean Checkbox",
        "default": false
      }
    }
  },
  uiSchema: {
    firstName: {
      "ui:autofocus": true
    },
    age: {
      "ui:widget": "updown"
    },
    bio: {
      "ui:widget": "textarea"
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!"
    },
    booleanRadio: {
      "ui:options": {
        inline: true
      }
    },
    booleanCheckbox: {
      "ui:widget": "checkbox"
    },
    date: {
      "ui:widget": "alt-datetime"
    }
  },
  formData: {
    firstName: "Chuck",
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed"
  }
};
