import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import FileUploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px dashed #ddd',
    width: '100%',
    height: 200,
    transition: theme.transitions.create('background-color'),
  },
  dropzoneActive: {
    backgroundColor: theme.palette.action.hover,
  },
});

const Dropzone = ({ classes, icon, children, ...props }) => {
  return (
    <ReactDropzone
      className={classes.dropzone}
      activeClassName={classes.dropzoneActive}
      {...props}
    >
      {icon || <FileUploadIcon fontSize="large" color="disabled" />}
      {children}
    </ReactDropzone>
  );
};

Dropzone.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
};

export default withStyles(styles)(Dropzone);
