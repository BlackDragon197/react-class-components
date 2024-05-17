import React from "react";
import _ from "lodash";
import moment from "moment";
import AbstractField from "./AbstractField";
import {DateField} from "react-date-picker";

export default class DateTime extends AbstractField {
  constructor(props) {
    super(props)

    let field = props.field
    let value = _.isEmpty(field.value) ? '' : field.value

    if (value.length > 0) {
      value = moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    this.state = { value }
  }

  value() {
    return this.state.value
  }

    onChange = value => {
      let props = this.props

      // only for the 20th century
      if (value.substr(0, 1) != '2') {
        value = null
      }

      this.setState({ value }, () => {
        props.onChange(props.field.name, value)
      })
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      let field = newProps.field
      let value = _.isEmpty(field.value) ? '' : field.value

      if (value.length > 0) {
        if (value.indexOf('.') > -1) {
          value = value.substr(0, value.indexOf('.'))
        }

        if (value.match(/\d{4}-\d{2}-\d{2}/).length > 0) {
          // value already in the correct format nothing todo: YYYY-MM-DD
        } else if (value.indexOf(' ') > -1 && value.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/).length > 0) {
          // value already in the correct format nothing todo: YYYY-MM-DD HH:mm:ss
        } else {
          value = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }

      this.setState({ value })
    }

    render() {
      const { value } = this.state
      const { format, attrs } = this.props

      return (
        <div className="calendar-datetime">
          <DateField
            {...attrs}
            ref="field"
            onChange={this.onChange}
            updateOnDateClick={false}
            forceValidDate={false}
            dateFormat={format}
            collapseOnDateClick={false}
            value={value}
          />
        </div>
      )
    }
}
