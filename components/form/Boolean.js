import React from "react";
import _ from "lodash";
import AbstractField from "./AbstractField";


export default class Boolean extends AbstractField {
  constructor(props) {
    super(props)

    this.state = {
      checked: _.isObject(props.field) ? props.field.value : false
    }
  }

  value() {
    return this.refs.field.checked
  }

    onChange = evt => {
      let props = this.props
      let checked = evt.target.checked

      this.setState({ checked }, () => {
        props.onChange(props.field.name, checked)
      })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      let field = nextProps.field

      if (typeof field.value == 'boolean') {
        this.setState({
          checked: field.value
        })
      }
    }

    render() {
      let state = this.state
      let props = this.props
      let field = props.field
      let attrs = {}

      if (props.readOnly) {
        attrs['disabled'] = true
      }

      return (
        <input
          {...attrs}
          ref="field"
          type="checkbox"
          id={field.name}
          checked={state.checked}
          className="form-control boolean"
          onChange={this.onChange}
        />
      )
    }
}
