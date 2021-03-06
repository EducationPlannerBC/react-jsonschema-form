"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NOT_SPECIFIED_DATE = "0000-01-01";
var ASCENDING = "asc";
var DESCENDING = "desc";

var DateElement = function DateElement(props) {
  var type = props.type,
      range = props.range,
      value = props.value,
      select = props.select,
      _onBlur = props.onBlur,
      rootId = props.rootId,
      disabled = props.disabled,
      readonly = props.readonly,
      autofocus = props.autofocus,
      ariaDescribedBy = props.ariaDescribedBy,
      registry = props.registry,
      widgetOptions = props.widgetOptions;

  var id = rootId + "_" + type;
  var SelectWidget = registry.widgets.SelectWidget;


  var options = void 0;

  if (type === "year") {
    options = { enumOptions: configureYearOptions(type, range[0], range[1], widgetOptions.yearRange.sort) };
  } else if (type === "month") {
    var enumOptions = (0, _utils.optionsList)(widgetOptions.month);
    // If this list of options does not yet have a default option, add one...
    if (enumOptions.findIndex(function (eo) {
      return eo.value === "";
    }) === -1) {
      enumOptions.unshift((0, _utils.getDefaultOption)("Month..."));
    }
    options = { enumOptions: enumOptions };
  }

  return _react2.default.createElement(SelectWidget, {
    schema: { type: "integer" },
    id: id,
    className: "form-control",
    options: options,
    value: value ? value : "",
    disabled: disabled,
    readonly: readonly,
    autofocus: autofocus,
    ariaDescribedBy: ariaDescribedBy,
    onBlur: function onBlur(value) {
      return _onBlur(type, value);
    },
    onChange: function onChange(value) {
      return select(type, value);
    } });
};

var isCompleteDate = function isCompleteDate(state) {
  return Object.keys(state).every(function (key) {
    return state[key] !== -1 && state[key] !== null;
  });
};

var configureYearOptions = function configureYearOptions(type, start, stop, orderYearBy) {
  // Initialize the list of options with the default option (i.e. Year...)
  var options = [{ value: -1, label: "Year..." }];
  // If getting  options for year, and they are to be sorted in descending order...
  if (type === "year" && orderYearBy.toLowerCase() === DESCENDING) {
    for (var i = stop; i >= start; i--) {
      options.push({ value: i, label: (0, _utils.pad)(i, 2) });
    }
  }
  return options;
};

var getDaysInMonth = function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
};

var MonthYearWidget = function (_Component) {
  _inherits(MonthYearWidget, _Component);

  function MonthYearWidget(props) {
    _classCallCheck(this, MonthYearWidget);

    // If this is the not specified date (0000-01-01), set it to the empty string so that parseDateString 
    // will set the date to an unset date state of { year: -1, month: -1, day: -1 }
    var _this = _possibleConstructorReturn(this, (MonthYearWidget.__proto__ || Object.getPrototypeOf(MonthYearWidget)).call(this, props));

    _this.onBlur = function (property, event) {
      var nextState = Object.assign({}, _this.state);

      // It could be the case that event.target.value is an empty string "".
      // If that is the case, asNumber will convert it to 'undefined'.
      var value = (0, _utils.asNumber)(event.target.value);
      value = value ? value : -1;

      nextState[property] = value === -1 ? null : value;

      _this.setState(nextState, function () {
        // If one or more of the inputs are not yet set, propagate null...
        if (_this.state.year === null || _this.state.month === null || _this.state.day === null) {
          _this.props.onChange(null);
        }
      });
    };

    _this.onChange = function (property, value) {
      var options = _this.props.options;


      var nextState = Object.assign({}, _this.state);

      value = value ? value : -1;
      // If the year has changed, and month and day is set...
      if (property === "year" && _this.state.month !== -1 && _this.state.day !== -1) {
        var newYearValue = value;
        // Check if the currently set day is within the new year and month
        if (_this.state.day <= getDaysInMonth(newYearValue, _this.state.month)) {
          nextState[property] = value;
        } else {
          // Else, deselect the day
          nextState[property] = value;
          nextState.day = -1;
        }
      }
      // Otherwise, if the month has changed, and year and day is set...
      else if (property === "month" && _this.state.year !== -1 && _this.state.day !== -1) {
          var newMonthValue = value;
          // Check if the currently set day is within the year and new month
          if (_this.state.day <= getDaysInMonth(_this.state.year, newMonthValue)) {
            nextState[property] = value;
          } else {
            // Else, deselect the day
            nextState[property] = value;
            nextState.day = -1;
          }
        }
        // Otherwise, the date must have changed - nothing special here...
        else {
            nextState[property] = value;
          }

      // Ensure that if the day specified in ui:options is not greater than the max number of days
      // for the month and year specified.
      var daysInMonth = getDaysInMonth(nextState.year, nextState.month);
      nextState.day = (0, _utils.asNumber)(options.day) <= daysInMonth ? (0, _utils.asNumber)(options.day) : daysInMonth;

      _this.setState(nextState, function () {
        // If we have a complete date (i.e. year, month, day specified), then propagate the
        // value up to the parent form...
        if (isCompleteDate(_this.state)) {
          _this.props.onChange((0, _utils.toDateString)(_this.state, false));
        }
      });
    };

    _this.setNow = function (event) {
      event.preventDefault();
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          readonly = _this$props.readonly,
          onChange = _this$props.onChange;

      if (disabled || readonly) {
        return;
      }
      var nowDateObj = (0, _utils.parseDateString)(new Date().toJSON(), false);
      _this.setState(nowDateObj, function () {
        return onChange((0, _utils.toDateString)(_this.state, false));
      });
    };

    _this.clear = function (event) {
      event.preventDefault();
      var _this$props2 = _this.props,
          disabled = _this$props2.disabled,
          readonly = _this$props2.readonly,
          onChange = _this$props2.onChange;

      if (disabled || readonly) {
        return;
      }
      _this.setState((0, _utils.parseDateString)("", false), function () {
        return onChange(null);
      });
    };

    _this.state = (0, _utils.parseDateString)(props.value === NOT_SPECIFIED_DATE ? "" : props.value, false);
    return _this;
  }

  _createClass(MonthYearWidget, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _utils.shouldRender)(this, nextProps, nextState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          id = _props.id,
          disabled = _props.disabled,
          readonly = _props.readonly,
          autofocus = _props.autofocus,
          ariaDescribedBy = _props.ariaDescribedBy,
          registry = _props.registry,
          options = _props.options;

      return _react2.default.createElement(
        "ul",
        { className: "list-inline" },
        this.dateElementProps.map(function (elemProps, i) {
          return _react2.default.createElement(
            "li",
            { key: i },
            _react2.default.createElement(DateElement, _extends({
              rootId: id,
              onBlur: _this2.onBlur,
              select: _this2.onChange
            }, elemProps, {
              disabled: disabled,
              readonly: readonly,
              registry: registry,
              autofocus: autofocus && i === 0,
              ariaDescribedBy: ariaDescribedBy,
              widgetOptions: options }))
          );
        }),
        options.enableNow ? _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "a",
            { href: "#", className: "btn btn-info btn-now",
              onClick: this.setNow },
            "Now"
          )
        ) : null,
        options.enableClear ? _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            "a",
            { href: "#", className: "btn btn-warning btn-clear",
              onClick: this.clear },
            "Clear"
          )
        ) : null
      );
    }
  }, {
    key: "dateElementProps",
    get: function get() {
      var options = this.props.options;
      var _state = this.state,
          year = _state.year,
          month = _state.month,
          day = _state.day,
          hour = _state.hour,
          minute = _state.minute,
          second = _state.second;

      // If the year and month are set, then calculate the max number of days,
      // otherwise, set to days in the month to 31 

      var maxDays = year !== -1 && month !== -1 ? getDaysInMonth(year, month) : 31;

      var currentYear = new Date().getFullYear();

      var rangeStart = currentYear + options.yearRange.relativeStart;
      var rangeEnd = currentYear + options.yearRange.relativeEnd;

      var data = [{ type: "month", value: month }, { type: "year", range: [rangeStart, rangeEnd], value: year }];
      return data;
    }
  }]);

  return MonthYearWidget;
}(_react.Component);

MonthYearWidget.defaultProps = {
  disabled: false,
  readonly: false,
  autofocus: false,
  options: {
    yearRange: {
      relativeStart: -100,
      relativeEnd: 3,
      sort: "DESC"
    },
    enableNow: false,
    enableClear: false

  }
};


if (process.env.NODE_ENV !== "production") {
  MonthYearWidget.propTypes = {
    schema: _react.PropTypes.object.isRequired,
    id: _react.PropTypes.string.isRequired,
    value: _react2.default.PropTypes.string,
    required: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    readonly: _react.PropTypes.bool,
    autofocus: _react.PropTypes.bool,
    ariaDescribedBy: _react.PropTypes.string,
    options: _react.PropTypes.shape({
      day: _react.PropTypes.string,
      month: _react.PropTypes.shape({
        enum: _react.PropTypes.arrayOf(_react.PropTypes.string),
        enumNames: _react.PropTypes.arrayOf(_react.PropTypes.string)
      }),
      yearRange: _react.PropTypes.shape({
        relativeStart: _react.PropTypes.number,
        relativeEnd: _react.PropTypes.number,
        sort: _react.PropTypes.string
      }),
      enableNow: _react.PropTypes.bool,
      enableClear: _react.PropTypes.bool
    }),
    onChange: _react.PropTypes.func
  };
}

exports.default = MonthYearWidget;