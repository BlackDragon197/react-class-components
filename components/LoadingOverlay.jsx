import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  backdrop: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(242,242,242,0.4)',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  progress: {
    position: 'fixed',
    display: 'flex',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingOverlay = ({ classes, color, show }) => {
  return show ? (
    <Fragment>
      <div className={classes.backdrop} />
      <div className={classes.progress}>
        <CircularProgress color={color} />
      </div>
    </Fragment>
  ) : null;
};

LoadingOverlay.defaultProps = {
  color: 'primary',
};

export default withStyles(styles)(LoadingOverlay);
