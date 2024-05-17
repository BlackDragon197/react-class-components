import React from "react";
import cx from "classnames";
import Text from "./Text";
import Money from "./Money";
import Boolean from "./Boolean";
import Integer from "./Integer";
import Password from "./Password";


export default class Field extends React.Component {
  constructor(props) {
    super(props)
  }

  value() {
    return this.refs.field.value()
  }

  render() {
    let props = this.props
    let field = props.field
    let fieldView = ''

    switch (field.type) {
      case 'boolean':
        fieldView = <Boolean readOnly={props.readOnly} onChange={props.onChange} ref="field" {...props} />
        break;

      case 'integer':
        fieldView = <Integer readOnly={props.readOnly} onChange={props.onChange} ref="field" {...props} />
        break;

      case 'money':
        fieldView = <Money readOnly={props.readOnly} onChange={props.onChange} ref="field" {...props} />
        break;

      case 'password':
        fieldView = <Password readOnly={props.readOnly} onChange={props.onChange} ref="field" {...props} />
        break;

      default:
        fieldView = <Text readOnly={props.readOnly} onChange={props.onChange} ref="field" {...props} />
        break;
    }

    let classObj = {'form-group': 1}
    classObj[props.fieldClass] = 1

    let icon = { 'field-icon': 1 }
    icon[!!props.icon ? props.icon : 'hide'] = 1

    let icons
    // icons = {'hide': !props.icon, 'input-group-addon': 1}
    icons = {'hide': 1}

    return (
      <div className={cx(classObj)}>
        <label className={cx({'hide': !props.label, 'readonly': props.readOnly})}>{props.label} <span className={cx({'hide': !field.required})}>*</span></label>
        <div className={cx({'field': 1, 'input-group': !!props.icon, 'readonly': props.readOnly})}>
          <span className={cx(icons)}><span className={props.icon}></span></span>
          {fieldView}
        </div>
      </div>
    )
  }
}
