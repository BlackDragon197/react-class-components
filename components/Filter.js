import React from "react";


export default class Filter extends React.Component {
  render() {
    let props = this.props

    return (
      <div className="input-group">
        <span className="input-group-addon"><span className="glyphicon glyphicon-filter"/></span>
        <input
          type="text"
          className="col-xs-12 form-control"
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange} />
      </div>
    )
  }
}