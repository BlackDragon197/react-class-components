import React from "react";
import _ from "lodash";
import AbstractField from "./AbstractField";


export default class Text extends AbstractField {
  value() {
    return this.refs.field.value;
  }

    onChange = evt => {
      const { field, onChange } = this.props
      onChange(field.name, evt.target.value)
    }

    onKeyUp = evt => {
      const { field, onKeyUp } = this.props
      if (_.isFunction(onKeyUp)) {
        onKeyUp(field.name, evt.target.value, evt)
      }
    }

    render() {
      const { field, required, readOnly } = this.props
      const isRequired = !_.isUndefined(required) ? required : false

      let attrs = {}
      if (_.isObject(field.attrs)) {
        attrs = field.attrs
      }

      if (_.isBoolean(readOnly) && readOnly) {
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
            type="text"
            id={field.name}
            value={field.value}
            className="form-control"
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
          />
          {after}
        </div>
      )
    }
}
