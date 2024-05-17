import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    padding: 2 * theme.spacing.unit,
  },
  success: {
    color: theme.palette.success.text,
    backgroundColor: theme.palette.success.bg,
  },
  warning: {
    color: theme.palette.warning.text,
    backgroundColor: theme.palette.warning.bg,
  },
  danger: {
    color: theme.palette.danger.text,
    backgroundColor: theme.palette.danger.bg,
  },
});

const InfoBar = ({ children, classes, status, elevation, square, style = {} }) => {
  return (
    <Paper elevation={elevation} style={style} square={square} className={classNames(classes.root, classes[status])}>
      {children}
    </Paper>
  );
};

InfoBar.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.oneOf(['success', 'warning', 'danger']),
};

InfoBar.defaultProps = {
  elevation: 1,
};

export default withStyles(styles)(InfoBar);
