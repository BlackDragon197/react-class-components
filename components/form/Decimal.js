import React from "react";
import S from "underscore.string";
import AbstractField from "./AbstractField";


export default class Decimal extends AbstractField {
  constructor(props) {
    super(props)

    this.state = {
      value: this.filterValue(props.field.value)
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      value: this.filterValue(newProps.field.value)
    })
  }

  filterValue(value) {
    if (value == null || value.length == 0) {
      return ''
    }

    value = value.replace(/[^0-9.-]/g, '')
    return value
  }

  backapiFormat(val) {
    if (val.length == 0) {
      return null
    }

    return val
  }

    onChange = evt => {
      let value = evt.target.value.replace(/[^0-9.-]/g, '')

      if (S.count(value, '.') > 1) {
        let beforeDot = value.substr(0, value.indexOf('.'))
        let afterDot = value.substr(beforeDot.length).replace(/[^0-9]/g, '')

        value = `${beforeDot}.${afterDot}`
      }

      this.setState({ value }, () => {
        this.signalChange()
      })
    }

    signalChange() {
      let state = this.state
      let props = this.props
      let field = props.field

      if (field.value != state.value) {
        props.onChange(props.field.name, this.backapiFormat(state.value))
      }
    }

    render() {
      let state = this.state
      let props = this.props
      let field = props.field
      let attrs = {}

      if (props.readOnly) {
        attrs['readOnly'] = true
      }

      return (
        <input
          {...attrs}
          type="text"
          id={field.name}
          value={state.value}
          className="form-control"
          onChange={this.onChange}
        />
      )
    }
}
