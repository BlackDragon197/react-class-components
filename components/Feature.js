import PropTypes from 'prop-types';
import React from "react";
import { withStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  icon: {
    cursor: 'pointer',
    marginLeft: 10,
    color: theme.palette.secondary['A400'],
  },
});

class Feature extends React.Component {
  render() {
    const { user, prefs } = this.context
    const { name, classes, className, style, onClick, canEdit = false } = this.props

    if (name === 'edit' && canEdit) {
      return <EditIcon className={classes.icon} onClick={onClick} />
    }

    return null
  }
}

Feature.contextTypes = {
  user: PropTypes.object,
  prefs: PropTypes.object
}

export default withStyles(styles, { withTheme: true })(Feature)
