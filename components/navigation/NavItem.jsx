import React from 'react'
import { Link, IndexLink } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'

import MaterialIcon from './MaterialIcon'

const styles = theme => ({
  container: {
    width: '100%',
  },
  navigation: {
    width: '100%',
  },
  listItem: {
    '&:focus': {
      textDecoration: 'none',
    }
  },
  listItemActive: {
    background: 'rgba(0,0,0,.04)',
    fontWeight: '500',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
    '&:focus': {
      textDecoration: 'none',
    },
    '& .nav-icon' : {
      color: "#000"
    }
  },
  listItemIcon: {
    margin: '0 0 0 16px',
    [theme.breakpoints.up('sm')]: {
      margin: '0 0 0 8px',
    },

    color: '#818894',
    marginRight: 9,
    marginLeft: 3
  },

  navText: {
    '& > span': {
      fontSize: 15
    }
  },

  content: {
    width: '100%',
    maxWidth: '1280px',
    flexGrow: 1,
    padding: 24,
    margin: 'auto',
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

const NavItem = ({
  classes,
  item
}) => (
  <ListItem
    dense={false}
    button
    component={item.url === '/' ? IndexLink : Link}
    to={item.url}
    classes={{ root: classes.listItem }}
    activeClassName={classes.listItemActive}
    onlyActiveOnIndex
  >
    <ListItemIcon classes={{ root: classes.listItemIcon }}>
      <MaterialIcon icon={item.icon || 'BookmarkBorder'} className={'nav-icon'} />
    </ListItemIcon>
    <ListItemText disableTypography className={classes.navText} primary={<FormattedMessage id={item.idx.substr(item.idx.indexOf('-') + 1)} />} />
  </ListItem>
)

export default withStyles(styles)(NavItem)
