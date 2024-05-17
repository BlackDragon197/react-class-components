import React from "react";
import cx from "classnames";
import _ from "lodash";
import Field from "./Field";
import Button from "./Button";
import Loader from "components/loader";


export default class Form extends React.Component {
  constructor(props) {
    super(props)
  }

  buildForm() {
    let props = this.props

    let fields = props.fields
    let icons = props.icons
    let labels = typeof props.labels != 'undefined' ? props.labels : {}
    let placeholders = typeof props.placeholders != 'undefined' ? props.placeholders : {}

    let fieldKeys = _.keys(fields)

    let result = []

    fieldKeys.map((fieldKey) => {
      let field = fields[fieldKey]
      let label = labels[fieldKey] ? labels[fieldKey] : ''
      let icon = icons[fieldKey] ? icons[fieldKey] : ''
      let placeholder = placeholders[fieldKey] ? placeholders[fieldKey] : ''

      let cols = props.columns
      if (cols == 0) {
        cols = 1
      }

      let fieldClass = `col-xs-${12/cols}`
      field['name'] = fieldKey

      result.push(<Field
        readOnly={props.readOnly}
        ref={fieldKey}
        key={fieldKey}
        field={field}
        label={label}
        icon={icon}
        name={fieldKey}
        onChange={props.onChange}
        fieldClass={fieldClass}
        placeholder={placeholder}/>)
    })

    return result
  }

  isValid() {
    let data = this.getData()
    let fields = this.props.fields

    for (let k in fields) {
      if (fields[k]['required'] && (_.isEmpty(data[k]))) {
        return false
      }
    }

    return true
  }

  getData() {
    let data = {}
    let props = this.props
    let fieldKeys = _.keys(props.fields)

    let k
    let result = {}
    for (var i = fieldKeys.length - 1; i >= 0; i--) {
      k = fieldKeys[i]
      result[k] = this.refs[k].value()
    }

    return result
  }

  getActions() {
    let result = []
    let props = this.props
    let actions = props.actions

    // build actions, based on request buttons
    // add field_order to items presented
    for (let k in actions) {
      if (actions.hasOwnProperty(k)) {
        result.push(<Button key={k} {...actions[k]} />)
      }
    }

    return result
  }

  render() {
    let state = this.state
    let props = this.props
    let hasFormFields = !_.isEmpty(props.fields)
    let fieldsView = this.buildForm()
    let actionButtons = this.getActions()

    if (!hasFormFields) {
      fieldsView = <div className="col-xs-12"><Loader /></div>
    }

    let messageClassObj = {'hide': props.message.length == 0}
    messageClassObj[`alert alert-${props.messageType}`] = 1

    return (
      <div className="col-xs-12">
        <h3 className="page-heading">{props.heading}</h3>
        <div className={cx(messageClassObj)} role="message">{props.message}</div>
        <form className="form-component" role="form">
          <div className="row">
            {fieldsView}
          </div>
          <div className={cx({'hide': !hasFormFields, 'actions': 1})}>
            {actionButtons}
          </div>
        </form>
      </div>
    )
  }
}
