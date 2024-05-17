import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ExitToApp from '@material-ui/icons/ExitToApp';
import UserItem from './UserItem';

const styles = theme => ({
  divider: {
    marginBottom: theme.spacing.unit,
  },
  primary: {},
  icon: {
    marginRight: 0
  },
});

const UserMenu = ({ anchorEl, classes, user, actions }) => (
  <Menu
    id="menu-appbar"
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={Boolean(anchorEl)}
    onClose={actions.close}
  >
    {user ? <UserItem user={user} /> : null}
    {user ? <Divider className={classes.divider} /> : null}
    <MenuItem onClick={actions.logout}>
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText inset primary={<FormattedMessage id="logout" />} />
    </MenuItem>
  </Menu>
);

export default withStyles(styles)(UserMenu);
