import React from "react";


export default class Action extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      icon: props.icon || 'query-circle-o'
    }
  }

    onClick = evt => {
      evt.preventDefault()

      let props = this.props
      props.onClick && props.onClick()
    }

    render() {
      let state = this.state
      let className = `fa fa-${state.icon} action-icon`

      return (
        <span onClick={this.onClick} className={className}></span>
      )
    }
}
