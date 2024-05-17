import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiButton from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    height: '100%',
  },
});


const Button = ({ classes, loading, disabled, className, buttonClassName, ...props }) => {
  return (
    <div className={classNames(classes.root, className)}>
      <MuiButton
        disabled={loading || disabled}
        className={classNames(classes.button, buttonClassName)}
        {...props}
      />
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

Button.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default withStyles(styles)(Button);
