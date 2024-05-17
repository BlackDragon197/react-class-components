import React from "react";
import cx from "classnames";
import _ from "lodash";
import S from "underscore.string";
import AbstractField from "./AbstractField";


export default class Time extends AbstractField {
  constructor(props) {
    super(props)

    let obj = this.getDefaultValues()

    if (typeof props.field.value != 'undefined') {
      obj = this.parseTime(props.field.value)
    }

    this.state = obj
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let obj = this.parseTime(nextProps.field.value)
    this.setState({...obj})
  }

  parseTime(val) {
    if (typeof val != 'number' && _.isEmpty(val)) {
      return this.getDefaultValues()
    }

    if (typeof val == 'string' && val.indexOf(':') > -1) {
      return this.parseTimeFromString(val)
    } else if (typeof val == 'number') {
      return this.parseTimeFromNumber(val)
    } else {
      return this.parseTimeFromNumber(val)
    }
  }

  parseTimeFromNumber(val) {
    if (typeof val == 'string') {
      let valLength = val.length
      val = parseInt(val)
    }

    if ((val).toString().length > 8) {
      val = val / 1000000
    }

    let hours = Math.floor(val / 3600)
    let minutes = Math.floor( (val - (hours * 3600)) / 60 )
    let seconds = (val - (hours * 3600) - (minutes * 60))

    let days = 0
    if (this.showDay()) {
      days = Math.floor(hours / 24)
      hours -= (days * 24)
    }

    return { days, hours, minutes, seconds }
  }

  parseTimeFromString(timeString) {
    let matches = timeString.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)

    if (matches.length > 0) {
      matches.shift()
    }

    matches[0] = S.ltrim(matches[0], '0')
    matches[1] = S.ltrim(matches[1], '0')
    matches[2] = S.ltrim(matches[2], '0')

    let hours = matches[0] ? parseInt(matches[0]) : 0
    let minutes = matches[1] ? parseInt(matches[1]) : 0
    let seconds = matches[2] ? parseInt(matches[2]) : 0

    let days = 0
    if (this.showDay()) {
      days = Math.floor(hours / 24)
      hours -= (days * 24)
    }

    return { days, hours, minutes, seconds }
  }

  getDefaultValues() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }

  value() {
    return this.toClock()
  }

  toClock() {
    let state = this.state

    let hours = state.hours + (state.days * 24)
    let minutes = state.minutes
    let seconds = state.seconds

    hours = hours < 9 ? `0${hours}` : hours
    minutes = minutes < 9 ? `0${minutes}` : minutes
    seconds = seconds < 9 ? `0${seconds}` : seconds

    return `${hours}:${minutes}:${seconds}`;
  }

  toSeconds() {
    let state = this.state

    let hours = state.hours + (state.days * 24)
    let minutes = state.minutes
    let seconds = state.seconds

    return (hours * 3600) + (minutes * 60) + seconds
  }

  toMilliseconds() {
    return this.toSeconds() * 1000
  }

  toMicroseconds() {
    return this.toMilliseconds() * 1000
  }

    onChange = (fieldName, evt) => {
      let target = evt.target
      let val = target.value

      val = S.ltrim(val.replace(/[^0-9]/g, ''), '0')
      this.setField(fieldName, val)
    }

    setField(fieldName, val) {
      let { days, hours, minutes, seconds } = this.state

      if (typeof val == 'number' || val.length > 0) {
        if (typeof val != 'number') {
          val = parseInt(val)
        }

        if (fieldName == 'seconds') {
          seconds = val

          if (seconds > 59) {
            minutes += Math.floor(val / 60)
            if (minutes > 59) {
              hours += Math.floor(minutes / 60)
              minutes = minutes % 60
            }

            seconds = seconds % 60
          }
        }

        if (fieldName == 'minutes') {
          minutes = val

          if (minutes > 59) {
            hours += Math.floor(val / 60)

            if (this.showDay() && hours > 23) {
              days += Math.floor(hours / 24)
              hours = hours % 24
            }

            minutes = minutes % 60
          }
        }

        if (fieldName == 'hours') {
          hours = val

          if (this.showDay() && hours > 23) {
            days += Math.floor(val / 24)
            hours = hours % 24
          }
        }

        if (fieldName == 'days') {
          days = val
        }
      }

      this.setState({ days, hours, minutes, seconds }, () => {
        this.signalChange()
      })
    }

    signalChange() {
      let value = ''
      let props = this.props
      let updateFormat = props.field.updateFormat

      if (updateFormat == 'microseconds') {
        value = this.toMicroseconds()
      } else if (updateFormat == 'seconds') {
        value = this.toSeconds()
      } else if (updateFormat == 'clock') {
        value = this.toClock()
      }

      props.onChange(props.field.name, value)
    }

    onKeyUp = (fieldName, evt) => {
      let target = evt.target
      let val = target.value

      let updated = false
      if (evt.keyCode == 38) { // UP
        val = parseInt(val) + 1
        updated = true
      } else if (evt.keyCode == 40) { // DOWN
        val = parseInt(val) - 1
        val = val < 0 ? 0 : val
        updated = true
      }

      if (updated) {
        this.setField(fieldName, val)
      }
    }

    showDay() {
      return typeof this.props.field.useDay != 'undefined'
    }

    days() {
      return this.state.days
    }

    hours() {
      return this.state.hours
    }

    minutes() {
      return this.state.minutes
    }

    seconds() {
      return this.state.seconds
    }

    render() {
      let props = this.props
      let field = props.field
      let attrs = {}

      if (props.readOnly) {
        attrs['readOnly'] = true
      }

      return (
        <div className="input-time">
          <div className={cx({'days': 1, 'hide': !this.showDay()})}>
            <div className="badge">D</div>
            <input
              {...attrs}
              ref="field"
              type="text"
              id={`${field.name}_dd`}
              value={this.days()}
              className="form-control"
              onKeyUp={this.onKeyUp.bind(null, 'days')}
              onChange={this.onChange.bind(null, 'days')}
            />
          </div>
          <div className="hour">
            <div className="badge">H</div>
            <input
              {...attrs}
              ref="field"
              type="text"
              id={`${field.name}_hh`}
              value={this.hours()}
              className="form-control"
              onKeyUp={this.onKeyUp.bind(null, 'hours')}
              onChange={this.onChange.bind(null, 'hours')}
            />
          </div>

          <div className="minute">
            <div className="badge">M</div>
            <input
              {...attrs}
              ref="field"
              type="text"
              id={`${field.name}_mm`}
              value={this.minutes()}
              className="form-control"
              onKeyUp={this.onKeyUp.bind(null, 'minutes')}
              onChange={this.onChange.bind(null, 'minutes')}
            />
          </div>

          <div className="second">
            <div className="badge">S</div>
            <input
              {...attrs}
              ref="field"
              type="text"
              id={`${field.name}_ss`}
              value={this.seconds()}
              className="form-control"
              onKeyUp={this.onKeyUp.bind(null, 'seconds')}
              onChange={this.onChange.bind(null, 'seconds')}
            />
          </div>
        </div>
      )
    }
}
