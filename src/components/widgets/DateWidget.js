import React, { Component, PropTypes } from "react";
import { shouldRender, parseDateString, toDateString, pad } from "../../utils";

const NOT_SPECIFIED_DATE = "0000-01-01";
const ASCENDING = "asc";
const DESCENDING = "desc";
const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DateElement = (props) => {
  const {type, range, value, select, onBlur, rootId, disabled, readonly, autofocus, ariaDescribedBy, registry, widgetOptions} = props;
  const id = rootId + "_" + type;
  const {SelectWidget} = registry.widgets;
  return (
    <SelectWidget
      schema={{ type: "integer" }}
      id={id}
      className="form-control"
      options={{ enumOptions: configureDateOptions(type, range[0], range[1], widgetOptions.yearRange.sort) }}
      value={value ? value : -1}
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

const configureDateOptions = (type, start, stop, orderYearBy) => {
  // Capitalize the first character of the date type (i.e. year, month, day, etc.)
  const typeLabel = type.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function (letter) {
    return letter.toUpperCase();
  });
  // Initialize the list of options with the default option (i.e. Year..., Month..., Day..., etc.)
  let options = [{ value: -1, label: typeLabel + "..." }];
  // If getting  options for year, and they are to be sorted in descending order...
  if (type === "year" && orderYearBy.toLowerCase() === DESCENDING) {
    for (let i = stop; i >= start; i--) {
      options.push({ value: i, label: pad(i, 2) });
    }
  }
  // Otherwise, for all other year, month and day options, sort in ascending order...
  else {
    for (let i = start; i <= stop; i++) {
      // If the type is month, use string labels instead of integers
      options.push({ value: i, label: type === "month" ? MONTH_LABELS[i - 1] : pad(i, 2) });
    }
  }
  return options;
}

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

class DateWidget extends Component {
  static defaultProps = {
    time: false,
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
    this.state = parseDateString(props.value === NOT_SPECIFIED_DATE ? "" : props.value, props.time);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onBlur = (property, event) => {
    let nextState = Object.assign(this.state);

    let value = parseInt(event.target.value);

    nextState[property] = value === -1 ? null : value;

    this.setState(nextState, ()=> {
      // If one or more of the inputs are not yet set, propagate null...
      if (this.state.year === null || this.state.month === null || this.state.day === null) {
        this.props.onChange(null);
      }
    })
  };

  onChange = (property, value) => {
    value = parseInt(value);
    let nextState;
    // If the year has changed, and month and day is set...
    if (property === "year" && this.state.month !== -1 && this.state.day !== -1) {
      let newYearValue = value;
      // Check if the currently set day is within the new year and month
      if (this.state.day <= getDaysInMonth(newYearValue, this.state.month)) {
        nextState = { [property]: value };
      } 
      else {
        // Else, deselect the day
        nextState = { [property]: value, day: -1 };
      }
    } 
    // Otherwise, if the month has changed, and year and day is set...
    else if (property === "month" && this.state.year !== -1 && this.state.day !== -1) {
      let newMonthValue = value
      // Check if the currently set day is within the year and new month
      if (this.state.day <= getDaysInMonth(this.state.year, newMonthValue)) {
        nextState = { [property]: value };
      } 
      else {
        // Else, deselect the day
        nextState = { [property]: value, day: -1 };
      }
    } 
    // Otherwise, the date must have changed - nothing special here...
    else {
      nextState = { [property]: value };
    }

    this.setState(nextState, () => {
      // If we have a complete date (i.e. year, month, day specified), then propagate the
      // value up to the parent form...
      if (isCompleteDate(this.state)) {
        this.props.onChange(toDateString(this.state, this.props.time));
      }
    });
  };

  setNow = (event) => {
    event.preventDefault();
    const {time, disabled, readonly, onChange} = this.props;
    if (disabled || readonly) {
      return;
    }
    const nowDateObj = parseDateString(new Date().toJSON(), time);
    this.setState(nowDateObj, () => onChange(toDateString(this.state, time)));
  };

  clear = (event) => {
    event.preventDefault();
    const {time, disabled, readonly, onChange} = this.props;
    if (disabled || readonly) {
      return;
    }
    this.setState(parseDateString("", time), () => onChange(null));
  };

  get dateElementProps() {
    const {time, options} = this.props;
    const {year, month, day, hour, minute, second} = this.state;

    // If the year and month are set, then calculate the max number of days,
    // otherwise, set to days in the month to 31 
    let maxDays = year !== -1 && month !== -1 ? getDaysInMonth(year, month) : 31;

    const currentYear = new Date().getFullYear();

    const rangeStart = currentYear + options.yearRange.relativeStart;
    const rangeEnd = currentYear + options.yearRange.relativeEnd;

    const data = [
      { type: "year", range: [rangeStart, rangeEnd], value: year },
      { type: "month", range: [1, 12], value: month },
      { type: "day", range: [1, maxDays], value: day },
    ];
    if (time) {
      data.push(
        { type: "hour", range: [0, 23], value: hour },
        { type: "minutes", range: [0, 59], value: minute },
        { type: "seconds", range: [0, 59], value: second }
      );
    }
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
  DateWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: React.PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    options: PropTypes.shape({
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
    time: PropTypes.bool,
  };
}

export default DateWidget;
