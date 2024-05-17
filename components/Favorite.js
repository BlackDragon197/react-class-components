import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import EE from 'services/EventEmitter'
import * as constants from 'app-constants'

class Favorite extends React.Component {
  render() {
    const {bookmarks} = this.context
    const {style, iconStyle, item} = this.props
    const _style = style || {}
    const _iconStyle = iconStyle || {}
    const active = bookmarks.indexOf(item.idx) > -1 ? true : false

    return (
      <span
        style={_style}
        onClick={() => EE.emit(constants.EE.BOOKMARKS, item.idx)}
        className={cx('favorite-icon', {'state-on': active, 'state-off': !active})}
      >
        <i className='icon-on fa fa-star'/>
        <i className='icon-off fa fa-star-o' style={_iconStyle}/>
      </span>
    )
  }
}

Favorite.contextTypes = {
  bookmarks: PropTypes.array
}

export default Favorite
