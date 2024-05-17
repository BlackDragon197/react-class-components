import React from "react";
import _ from "lodash";


export default class AbstractField extends React.Component {
  constructor(props) {
    super(props)
  }

  isRequired() {
    let props = this.props
    return !_.isUndefined(props.required) ? props.required : false
  }

  isValid() {
    let val = this.value()

    if (this.isRequired()) {
      if (_.isEmpty(val)) {
        return false
      }
    }

    return true
  }
}