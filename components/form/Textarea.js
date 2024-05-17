import React from "react";
import AbstractField from "./AbstractField";

export default class Textarea extends AbstractField {
  value() {
    return this.refs.field.value
  }

    onChange = evt => {
      let props = this.props
      props.onChange(props.field.name, evt.target.value)
    }

    render() {
      let props = this.props
      let field = props.field
      let attrs = {}

      if (props.readOnly) {
        attrs['readOnly'] = true
      }

      let placeholder = ''
      if (field.placeholder) {
        placeholder = field.placeholder
      }

      return (
        <textarea
          {...attrs}
          ref="field"
          type="text"
          id={field.name}
          value={field.value}
          className="form-control"
          placeholder={placeholder}
          onChange={this.onChange}
        />
      )
    }
}
