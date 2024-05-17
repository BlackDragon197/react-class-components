import React from 'react'
import { Link } from 'react-router'
import Favorite from 'components/Favorite'
import { FormattedMessage } from 'react-intl'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  container: {
    width: '100%',
  },
  navigation: {
    width: '100%',
  },
  icon: {
    margin: '0 0 0 16px',
    [theme.breakpoints.up('sm')]: {
      margin: '0 0 0 8px',
    },
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
  menuButton: {
    color: theme.palette.primary.contrastText,
  },
  title: {

  }
});

const AppBar = ({
  classes,
  handleMenuButton
}) => (
  <AppBar className={classNames(classes.appBar)}>
    <Toolbar disableGutters className={classNames(classes.toolBar)}>
      <IconButton
        aria-label="open drawer"
        onClick={handleMenuButton}
        className={classNames(classes.menuButton)}
      >
        <MenuIcon />
      </IconButton>
      <NavigationLogo />
      <Typography variant="h5" color="inherit" noWrap className={`${classes.flex} ${classes.title}`}>
        Example
      </Typography>
      <LoginStatus user={i18n.not_logged_in}/>
    </Toolbar>
  </AppBar>
)

export default withStyles(styles)(AppBar)
