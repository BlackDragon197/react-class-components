import React from "react";
import _ from "lodash";
import {
  Boolean,
  Checkbox,
  DateTime,
  Integer,
  Decimal,
  Money,
  Select,
  Text,
  Password,
  Textarea,
  Time
} from "components/form/Types";
import ReactTooltip from "react-tooltip";


export default class GridField extends React.Component {

  constructor(props) {
    super(props)
  }

  value() {
    return this.refs.field.value()
  }

  render() {
    let props = this.props
    let className = `col-xs-${props.wrapperWidth} field-type-${props.type}`

    let style = {}
    if (_.isObject(props.style)) {
      style = props.style
    }

    if (props.label == '' && props.value == '') {
      return (<div style={style} className={className}><div className="row">&nbsp;</div></div>)
    }

    let attrs = {
      field: props,
      readOnly: typeof props.readOnly == 'undefined' ? false : props.readOnly
    }

    let isRequired = !_.isUndefined(props.required) ? props.required : false

    let view = ''
    if (props.type == 'text') {
      view = <Text ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'password') {
      view = <Password ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'time') {
      view = <Time ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'integer') {
      view = <Integer ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'decimal') {
      view = <Decimal ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'money') {
      view = <Money ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'boolean') {
      view = <Boolean ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'checkbox') {
      view = <Checkbox color="primary" ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'textarea') {
      view = <Textarea ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'select') {
      view = <Select ref="field" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'calendar') {
      view = <DateTime ref="field" format="YYYY-MM-DD" onChange={props.onChange} {...attrs} />
    } else if (props.type == 'datetime') {
      view = <DateTime ref="field" format="YYYY-MM-DD hh:mm:ss" onChange={props.onChange} {...attrs} />
    }

    className = `${className} field-${props.name}`

    let labelAttrs = {}
    let tooltip = ''
    if (props.description && props.description.length > 0) {
      labelAttrs['data-tip'] = props.description
      tooltip = <ReactTooltip />
    }

    let requiredSpan = ''
    if (isRequired) {
      requiredSpan = <span className="required-label">*</span>
    }

    return (
      <div className={className}>
        <div className="row">
          <div className="col-xs-3 field">
            <label {...labelAttrs}>{props.label}</label>
            {tooltip}{requiredSpan}
          </div>
          <div className="col-xs-9" style={style}>{view}</div>
        </div>
      </div>
    )
  }
}
