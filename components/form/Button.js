import React from "react";
import cx from "classnames";


export default  class Button extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let props = this.props

    let classObj = {'btn': 1}
    classObj[props.className] = 1

    let btnType = typeof props.type != 'undefined' ? props.type: 'button'

    return (
      <button type={btnType} onClick={props.fn} className={cx(classObj)}>
        {props.label}
      </button>
    )
  }
}
