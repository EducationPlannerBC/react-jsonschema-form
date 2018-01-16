module.exports = {
  schema: {
    title: "Date and time widgets",
    type: "object",
    properties: {
      native: {
        title: "Native",
        description:
          "May not work on some browsers, notably Firefox Desktop and IE.",
        type: "object",
        required: ["date"],
        properties: {
          datetime: {
            type: "string",
            format: "date-time",
          },
          date: {
            type: "string",
            format: "date",
          },
        },
      },
      alternative: {
        title: "Alternative",
        description: "These work on most platforms.",
        type: "object",
        properties: {
          "alt-datetime": {
            type: "string",
            format: "date-time",
          },
          "alt-date": {
            type: "string",
            format: "date",
          },
        },
      },
      monthYear: {
        title: "Month Year Widget",
        type: "object",
        properties: {
          "PrevAttendDate": {
            "type": "string",
            "format": "date",
            "title": "Most recent term  attended or applied for:"
          }
        }
      },
      monthYearNoDefault: {
        title: "Month Year Widget (no default specified in ui:options)",
        type: "object",
        properties: {
          "PrevAttendDate": {
            "type": "string",
            "format": "date",
            "title": "Most recent term  attended or applied for:"
          }
        }
      },
    },
  },
  uiSchema: {
    native: {
      "date": {
        "ui:widget": "date",
        "ui:options": {
          "yearRange": {
            "relativeStart": -100,
            "relativeEnd": -10,
            "sort": "DESC"
          },
          "enableNow": true,
          "enableClear": true
        },
        "ui:help": "Pick a date"
      }
    },
    alternative: {
      "alt-datetime": {
        "ui:widget": "alt-datetime",
      },
      "alt-date": {
        "ui:widget": "alt-date",
      },
    },
    monthYear: {
      "PrevAttendDate": {
        "ui:widget": "ym-date",
        "ui:options": {
          "day": "31", // a static day
          "month": {
            "enum": [
              "",
              "1",
              "5",
              "9"
            ],
            "enumNames": [
              "Select Term...",
              "Spring (Jan - April)",
              "Summer (May - Aug)",
              "Fall (Sept - Dec)"
            ]
          },
          "yearRange": {
            "relativeStart": -100,
            "relativeEnd": -10,
            "sort": "DESC"
          },
        }
      }
    },
    monthYearNoDefault: {
      "PrevAttendDate": {
        "ui:widget": "ym-date",
        "ui:options": {
          "day": "31", // a static day
          "month": {
            "enum": [
              "1",
              "5",
              "9"
            ],
            "enumNames": [
              "Spring (Jan - April)",
              "Summer (May - Aug)",
              "Fall (Sept - Dec)"
            ]
          },
          "yearRange": {
            "relativeStart": -100,
            "relativeEnd": -10,
            "sort": "DESC"
          },
        }
      }
    },
  },
  formData: {
    native: {
      date: null
    },
    monthYear: {
      "PrevAttendDate": null
    }
  }
};
