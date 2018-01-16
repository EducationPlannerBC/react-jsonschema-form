module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["lastName", "booleanRadio", "stringSelectEnum", "numberSelectEnum", "booleanConsent", "booleanRadioWithEnum", "numberRadioEnum"],
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
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      "booleanRadio": {
        "type": "boolean",
        "title": "Boolean Radio Group (default)",
        "default": null
      },
      "booleanRadioWithEnum": {
        "type": "boolean",
        "title": "Boolean Radio Group with Enum",
        "default": null,
        "enum": [
          true,
          false
        ],
        "enumNames": [
          "Status",
          "Non-status"
        ]
      },
      "booleanSelect": {
        "type": "boolean",
        "title": "Boolean Select (default)",
        "default": null
      },
      "booleanSelectWithEnum": {
        "type": "boolean",
        "title": "Boolean Select with Enum",
        "default": null,
        "enum": [
          true,
          false
        ],
        "enumNames": [
          "Status",
          "Non-status"
        ]
      },
      "booleanCheckbox": {
        "type": "boolean",
        "title": "Boolean Checkbox",
        "default": false
      },
      "booleanConsent": {
        "type": "boolean",
        "title": "Consent",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquet diam tortor, vel pellentesque magna maximus a. Pellentesque faucibus vehicula laoreet. Ut venenatis, nisi id tempus pulvinar, ante urna tincidunt mauris, sed mollis sem dolor scelerisque dui. Aenean blandit risus vitae enim ullamcorper posuere. Ut tristique tortor ante, sed iaculis metus ultricies quis. Nulla gravida scelerisque velit ut molestie. Donec nec varius orci. Nulla mattis vitae enim vel venenatis.Nam at sem nisl. Donec orci leo, pharetra non convallis non, pretium a orci. Donec vehicula lorem sed leo ullamcorper cursus. Aliquam vel ipsum rutrum, egestas tortor sit amet, vehicula nunc. Maecenas lobortis nulla quam, in mattis augue posuere in. Aliquam molestie finibus quam, a congue dolor faucibus ac. Maecenas nulla sapien, feugiat at tellus volutpat, ullamcorper congue turpis. Ut et feugiat erat. Aenean eleifend nisl ac aliquet fermentum. Duis risus dolor, molestie eget ante eget, molestie tristique lectus. Sed eu blandit nunc, id aliquet quam. Sed eget dignissim tellus, quis fringilla erat. Integer vitae orci enim. Ut ut tellus sapien. Mauris vel magna risus. Proin vehicula vestibulum pharetra. Mauris euismod eleifend varius. Quisque placerat commodo dolor, sed facilisis sem varius at. Proin sollicitudin lacus eu condimentum faucibus. Curabitur venenatis, risus id volutpat luctus, erat ligula mollis justo, quis tincidunt odio mauris ut quam. Praesent molestie aliquet arcu eget tristique. Donec sagittis ac velit eu facilisis. Donec vel libero eu nunc imperdiet molestie. Mauris placerat sem eget accumsan mattis. Quisque suscipit eros tellus. Aliquam congue, arcu at tincidunt vehicula, leo urna sollicitudin augue, ut lobortis sem nunc ut nisi. Nullam sed lorem accumsan lectus auctor auctor nec ut risus. Donec ut venenatis elit. Etiam ullamcorper, justo sit amet euismod accumsan, augue orci placerat erat, at maximus felis est quis lorem. In cursus in nunc eu pharetra. Suspendisse et nisi felis. Nunc eros libero, facilisis vitae metus eget, sollicitudin luctus erat. Nulla feugiat lorem sem, eu luctus elit lacinia eu. Quisque pellentesque tempor velit, et bibendum eros cursus vel. In hac habitasse platea dictumst. Suspendisse ac turpis leo. Mauris et finibus massa. Vestibulum laoreet tortor felis, id euismod sapien facilisis vitae. Aliquam commodo eros in magna vulputate varius. Vestibulum mollis laoreet ex, non tempus tellus varius a. Cras scelerisque tempor sollicitudin. Duis elementum nulla et velit varius porta. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin nisl massa, tempus et facilisis ac, lobortis vel magna. Maecenas nec sapien enim. Maecenas placerat, magna sit amet fermentum sollicitudin, libero elit dignissim tortor, in faucibus quam nisl eget purus. Sed sit amet nunc a enim convallis rhoncus. Quisque porttitor magna eget purus rhoncus faucibus. Quisque neque massa, luctus ut massa vel, tincidunt lacinia ipsum. Phasellus finibus, felis a pretium rutrum, sem lectus aliquet nunc, eget auctor ex magna et est. Phasellus mauris quam, iaculis id facilisis ut, congue sed lorem. Proin sapien magna, dignissim et nisi non, sollicitudin fermentum enim. Aliquam eget nunc a ipsum blandit consectetur nec at tortor. Nam facilisis lorem a feugiat pharetra. Nullam eu turpis.",
        "default": null
      },
      "stringSelectEnum": {
        "type": "string",
        "title": "String select",
        "default": null,
        "enum": [
          "choice1",
          "choice2",
        ],
        "enumNames": [
          "Choice 1",
          "Choice 2"
        ]
      },
      "stringRadioEnum": {
        "type": "string",
        "title": "String radio group",
        "default": null,
        "enum": [
          "choice1",
          "choice2",
        ],
        "enumNames": [
          "Choice 1",
          "Choice 2"
        ]
      },
      "numberSelectEnum": {
        "type": "number",
        "title": "Number select",
        "default": null,
        "enum": [
          1,
          2,
        ],
        "enumNames": [
          "Choice 1",
          "Choice 2"
        ]
      },
      "numberRadioEnum": {
        "type": "number",
        "title": "Number radio group",
        "default": null,
        "enum": [
          1,
          2,
        ],
        "enumNames": [
          "Choice 1",
          "Choice 2"
        ]
      },
      "checkboxes": {
        type: "array",
          minItems: 2,
            title: "A multiple choices list",
              items: {
          type: "string",
          enum: ["foo", "bar", "fuzz", "qux"],
        },
        uniqueItems: true
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:autofocus": true,
      "ui:emptyValue": "",
      "ui:help": "Help!"
    },
    age: {
      "ui:widget": "updown",
      "ui:title": "Age of person",
      "ui:description": "(earthian year)",
      "ui:help": "Help, I'm getting old!"
    },
    bio: {
      "ui:widget": "textarea",
      "ui:help": "Help!"
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
    },
    booleanRadio: {
      "ui:options": {
        inline: true
      },
      "ui:help": "Help radio!"
    },
    booleanRadioWithEnum: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true
      },
      "ui:help": "Help!"
    },
    booleanSelect: {
      "ui:widget": "select",
      "ui:help": "Help select!"
    },
    booleanSelectWithEnum: {
      "ui:widget": "select",
      "ui:help": "Help booleanSelectWithEnum!"
    },
    booleanCheckbox: {
      "ui:widget": "checkbox",
      "ui:help": "Just click the box!"
    },
    booleanConsent: {
      "ui:widget": "consent",
      "ui:help": "Please read the disclaimer!"
    },
    stringSelectEnum: {
      "ui:widget": "select",
      "ui:help": "Help stringSelectEnum!"
    },
    stringRadioEnum: {
      "ui:widget": "radio",
      "ui:help": "Help stringRadioEnum!"
    },
    numberSelectEnum: {
      "ui:widget": "select",
      "ui:help": "Help numberSelectEnum!"
    },
    numberRadioEnum: {
      "ui:widget": "radio",
      "ui:help": "Help numberRadioEnum!"
    },
    checkboxes: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true
      }
    },
    date: {
      "ui:widget": "alt-datetime",
    },
    telephone: {
      "ui:options": {
        inputType: "tel",
      },
    },
  },
  formData: {
    firstName: null,
    lastName: null,
    age: null,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
    "booleanRadio": null,
    "booleanConsent": null
  },
};
