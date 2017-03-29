import React, { Component, PropTypes } from "react";
import { 
  asNumber,
  optionsList,
  getDefaultOption,
  pad,
  parseDateString, 
  shouldRender,
  toDateString
 } from "../../utils";

const NOT_SPECIFIED_DATE = "0000-01-01";
const ASCENDING = "asc";
const DESCENDING = "desc";

const DateElement = (props) => {
  const {type, range, value, select, onBlur, rootId, disabled, readonly, autofocus, ariaDescribedBy, registry, widgetOptions} = props;
  const id = rootId + "_" + type;
  const {SelectWidget} = registry.widgets;

  let options;

  if (type === "year") {
    options = { enumOptions: configureYearOptions(type, range[0], range[1], widgetOptions.yearRange.sort) };
  }
  else if (type === "month") {
    let enumOptions = optionsList(widgetOptions.month);
    // If this list of options does not yet have a default option, add one...
    if (enumOptions.findIndex(eo => eo.value === "") === -1) {
      enumOptions.unshift(getDefaultOption(`Month...`));
    }
    options = { enumOptions };
  }

  return (
    <SelectWidget
      schema={{ type: "integer" }}
      id={id}
      className="form-control"
      options={options}
      value={value ? value : ""}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      ariaDescribedBy={ariaDescribedBy}
      onBlur={(value) => onBlur(type, value)}
      onChange={(value) => select(type, value)} />
  );
}

const isCompleteDate = (state) => {
  return Object.keys(state).every(key => {
    return state[key] !== -1 && state[key] !== null
  });
}

const configureYearOptions = (type, start, stop, orderYearBy) => {
  // Initialize the list of options with the default option (i.e. Year...)
  let options = [{ value: -1, label: "Year..." }];
  // If getting  options for year, and they are to be sorted in descending order...
  if (type === "year" && orderYearBy.toLowerCase() === DESCENDING) {
    for (let i = stop; i >= start; i--) {
      options.push({ value: i, label: pad(i, 2) });
    }
  }
  return options;
}

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

class MonthYearWidget extends Component {
  static defaultProps = {
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
      enableClear: false,
      
    }
  };

  constructor(props) {
    super(props);

    // If this is the not specified date (0000-01-01), set it to the empty string so that parseDateString 
    // will set the date to an unset date state of { year: -1, month: -1, day: -1 }
    this.state = parseDateString(props.value === NOT_SPECIFIED_DATE ? "" : props.value, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onBlur = (property, event) => {
    let nextState = Object.assign({}, this.state);

    // It could be the case that event.target.value is an empty string "".
    // If that is the case, asNumber will convert it to 'undefined'.
    let value = asNumber(event.target.value)
    value = value ? value : -1;
    
    nextState[property] = value === -1 ? null : value;

    this.setState(nextState, ()=> {
      // If one or more of the inputs are not yet set, propagate null...
      if (this.state.year === null || this.state.month === null || this.state.day === null) {
        this.props.onChange(null);
      }
    })
  };

  onChange = (property, value) => {
    const {options} = this.props;

    let nextState = Object.assign({}, this.state);

    value = value ? value : -1;
    // If the year has changed, and month and day is set...
    if (property === "year" && this.state.month !== -1 && this.state.day !== -1) {
      let newYearValue = value;
      // Check if the currently set day is within the new year and month
      if (this.state.day <= getDaysInMonth(newYearValue, this.state.month)) {
        nextState[property] = value;
      } 
      else {
        // Else, deselect the day
        nextState[property] = value;
        nextState.day = -1 ; 
      }
    } 
    // Otherwise, if the month has changed, and year and day is set...
    else if (property === "month" && this.state.year !== -1 && this.state.day !== -1) {
      let newMonthValue = value
      // Check if the currently set day is within the year and new month
      if (this.state.day <= getDaysInMonth(this.state.year, newMonthValue)) {
        nextState[property] = value;
      } 
      else {
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
    let daysInMonth = getDaysInMonth(nextState.year, nextState.month);
    nextState.day = asNumber(options.day) <= daysInMonth ? asNumber(options.day) : daysInMonth;

    this.setState(nextState, () => {
      // If we have a complete date (i.e. year, month, day specified), then propagate the
      // value up to the parent form...
      if (isCompleteDate(this.state)) {
        this.props.onChange(toDateString(this.state, false));
      }
    });
  };

  setNow = (event) => {
    event.preventDefault();
    const {disabled, readonly, onChange} = this.props;
    if (disabled || readonly) {
      return;
    }
    const nowDateObj = parseDateString(new Date().toJSON(), false);
    this.setState(nowDateObj, () => onChange(toDateString(this.state, false)));
  };

  clear = (event) => {
    event.preventDefault();
    const {disabled, readonly, onChange} = this.props;
    if (disabled || readonly) {
      return;
    }
    this.setState(parseDateString("", false), () => onChange(null));
  };

  get dateElementProps() {
    const {options} = this.props;
    const {year, month, day, hour, minute, second} = this.state;

    // If the year and month are set, then calculate the max number of days,
    // otherwise, set to days in the month to 31 
    let maxDays = year !== -1 && month !== -1 ? getDaysInMonth(year, month) : 31;

    const currentYear = new Date().getFullYear();

    const rangeStart = currentYear + options.yearRange.relativeStart;
    const rangeEnd = currentYear + options.yearRange.relativeEnd;

    const data = [
      { type: "month", value: month },
      { type: "year", range: [rangeStart, rangeEnd], value: year }
    ];
    return data;
  }

  render() {
    const {id, disabled, readonly, autofocus, ariaDescribedBy, registry, options} = this.props;
    return (
      <ul className="list-inline">{
        this.dateElementProps.map((elemProps, i) => (
          <li key={i}>
            <DateElement
              rootId={id}
              onBlur={this.onBlur}
              select={this.onChange}
              {...elemProps}
              disabled={disabled}
              readonly={readonly}
              registry={registry}
              autofocus={autofocus && i === 0}
              ariaDescribedBy={ariaDescribedBy}
              widgetOptions={options} />
          </li>
        ))
      }
        {options.enableNow ? <li>
          <a href="#" className="btn btn-info btn-now"
            onClick={this.setNow}>Now</a>
        </li> : null}
        {options.enableClear ? <li>
          <a href="#" className="btn btn-warning btn-clear"
            onClick={this.clear}>Clear</a>
        </li> : null}
      </ul>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  MonthYearWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: React.PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    options: PropTypes.shape({
      day: PropTypes.string,
      month: PropTypes.shape(
        {
          enum: PropTypes.arrayOf(PropTypes.string),
          enumNames: PropTypes.arrayOf(PropTypes.string)
        }
      ),
      yearRange: PropTypes.shape(
        {
          relativeStart: PropTypes.number,
          relativeEnd: PropTypes.number,
          sort: PropTypes.string,
        }
      ),
      enableNow: PropTypes.bool,
      enableClear: PropTypes.bool,
    }),
    onChange: PropTypes.func,
  };
}

export default MonthYearWidget;
