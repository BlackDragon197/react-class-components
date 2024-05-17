import React from "react";
import AbstractField from "./AbstractField";


export default class Integer extends AbstractField {
  constructor(props) {
    super(props)
    this.state = {
      value: props.field.value
    }
  }

  value() {
    return parseInt(this.state.value)
  }

    onChange = evt => {
      let value = evt.target.value.replace(/[^0-9-]/g, '')
      let valueStr = (value).toString()

      let dashesMatched = valueStr.match(/\-/g)
      if (dashesMatched != null && dashesMatched.length > 0) {
        valueStr = '-' + valueStr.replace(/[-]/g, '')
      }

      let numsMatched = valueStr.match(/[0-9]+/g)
      if (numsMatched != null && numsMatched.length > 0) {
        valueStr = parseInt(valueStr)
      }

      this.setState({ value: valueStr }, () => {
        if ((value).toString().length > 0) {
          this.signalChange()
        }
      })
    }

    signalChange() {
      let props = this.props
      props.onChange(props.field.name, this.state.value)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      let state = this.state

      if (nextProps.field.value != state.value) {
        this.setState({
          value: nextProps.field.value
        })
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
          ref="field"
          type="text"
          id={field.name}
          value={state.value}
          className="form-control integer"
          onChange={this.onChange}
        />
      )
    }
}
