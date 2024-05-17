import React from "react";
import cx from "classnames";

export default class Toggle extends React.Component {
  render() {
    const {show, showIcon, hideIcon, style, showIconStyle, hideIconStyle, idx, onToggle} = this.props
    const _style = style || {}
    const _showIconStyle = showIconStyle || {}
    const _hideIconStyle = hideIconStyle || {}

    return (
      <span
        onClick={() => onToggle(idx)}
        className={cx('toggle-icon', {'state-show': show, 'state-hide': !show})}
        style={_style}
      >
        <i style={_showIconStyle} className={`icon-show ${showIcon}`}/>
        <i style={_hideIconStyle} className={`icon-hide ${hideIcon}`}/>
      </span>
    )
  }
}