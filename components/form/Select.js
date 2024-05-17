import React from "react";
import _ from "lodash";
import AbstractField from "./AbstractField";


export default class Select extends AbstractField {
  value() {
    let field = this.refs.field
    return field[field.selectedIndex].value
  }

    onChange = evt => {
      let props = this.props
      let field = props.field
      let value = []
      let target = evt.target

      for (var i = 0; i < target.options.length; i++) {
        let opt = target.options[i]

        if (opt.selected) {
          value.push(opt.value)
        }
      }

      if (!field.multiple) {
        value = value[0]
      }

      props.onChange(props.field.name, value)
    }

    render() {
      let props = this.props
      let field = props.field
      let attrs = {}

      if (_.isObject(field.attrs)) {
        attrs = field.attrs
      }

      if (props.readOnly) {
        attrs['disabled'] = true
      }

      if (field.size) {
        attrs['size'] = field.size
      }

      if (field.multiple) {
        attrs['multiple'] = "multiple"
      }

      let options = []
      if (_.isArray(field.values)) {
        for (var i = 0; i < field.values.length; i++) {
          let optionField = field.values[i]

          options.push(
            <option
              key={optionField.value}
              value={optionField.value}
            >
              {optionField.label}
            </option>
          )
        }
      }

      let after = <span></span>
      if (field.textAfter) {
        after = <span className="text-after">{field.textAfter}</span>
      }

      return (
        <div>
          <select {...attrs} ref="field" value={field.value || ''} onChange={this.onChange}>
            {options}
          </select>
          {after}
        </div>
      )
    }
}
