import React from "react";
import _ from "lodash";
import AbstractField from "./AbstractField";


export default class Password extends AbstractField {
  value() {
    return this.refs.field.value;
  }

    onChange = evt => {
      let props = this.props
      props.onChange(props.field.name, evt.target.value)
    }

    render() {
      let props = this.props
      let isRequired = !_.isUndefined(props.required) ? props.required : false
      let field = props.field
      let attrs = {}

      if (_.isObject(field.attrs)) {
        attrs = field.attrs
      }

      if (props.readOnly) {
        attrs['readOnly'] = true
      }

      let after = <span></span>
      if (field.textAfter) {
        after = <span className="text-after">{field.textAfter}</span>
      }

      return (
        <div>
          <input
            {...attrs}
            ref="field"
            type="password"
            id={field.name}
            value={field.value}
            className="form-control"
            onChange={this.onChange}
          />
          {after}
        </div>
      )
    }
}
