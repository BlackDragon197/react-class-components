import React from "react";
import _ from "lodash";
import AbstractField from "./AbstractField";


export default class Checkbox extends AbstractField {
  constructor(props) {
    super(props)

    let field = props.field
    let values = []
    let checked = []

    if (!_.isUndefined(field) && _.isArray(field.values)) {
      values = field.values
      checked = field.value
    }

    this.state = {
      field,
      values,
      checked
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    let field = newProps.field
    let values = []
    let checked = []

    if (!_.isUndefined(field) && _.isArray(field.values)) {
      values = field.values
      checked = field.value
    }

    this.setState({
      field,
      values,
      checked
    })
  }

  checked() {
    return this.state.checked
  }

  value() {
    return this.checked()
  }

    onChange = evt => {
      let state = this.state
      let checked = state.checked
      let targetValue = evt.target.value

      if (checked.indexOf(targetValue) == -1) {
        checked.push(targetValue)
      } else {
        checked = _.without(checked, targetValue)
      }

      this.setState({ checked }, () => {
        this.props.onChange(state.field.name, this.checked())
      })
    }

    list() {
      let rows = []
      let state = this.state

      if (state.values.length > 0) {
        let attrs = {}
        let field = state.field
        let values = state.values

        values = _.sortBy(values, (v) => v.label)

        if (field.readOnly) {
          attrs['disabled'] = true
        }

        for (var i = 0; i < values.length; i++) {
          let val = values[i]

          rows.push(
            <label key={`${field.name}_${i}`}>
              <input
                {...attrs}
                type="checkbox"
                name={`${field.name}`}
                value={val.name}
                checked={_.intersection([val.name], state.checked).length > 0}
                className="form-control checkbox"
                onChange={this.onChange}
              />

              <span className="field-label">{val.label}</span>
            </label>
          )
        }
      }

      return rows
    }

    render() {
      let props = this.props
      let field = props.field
      let attrs = {}

      if (props.readOnly) {
        attrs['disabled'] = true
      }

      return (
        <div>{this.list()}</div>
      )
    }
}
