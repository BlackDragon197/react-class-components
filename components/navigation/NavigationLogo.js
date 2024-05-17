import React from 'react'
import {Link} from 'react-router'

const logo = require(`../logo.svg`)

const NavigationLogo = () => {
  return __THEME_SHOW_LOGO__ ?
    <Link to="/">
      <img
        src={logo}
        style={{
          padding: 4,
          height: 42
        }}
      />
    </Link>
    : null
}

export default NavigationLogo
