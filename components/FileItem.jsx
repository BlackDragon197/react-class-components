import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import CloudDownload from '@material-ui/icons/CloudDownload';

class FileItem extends Component {
  static propTypes = {
    downloadUrl: PropTypes.string,
    primary: PropTypes.node,
    secondary: PropTypes.node,
    target: PropTypes.string,
    timestamp: PropTypes.string
  };

  render() {
    const {target, primary, secondary } = this.props;
    return (
      <ListItem
        component="div"
        target={target}
        button
      >
        <Avatar>
          <FileIcon />
        </Avatar>
        <ListItemText
          primary={primary}
        />
        <ListItemText
          style={{ textAlign: 'end' }}
          secondary={secondary}
        />
        <CloudDownload color="action" />
      </ListItem>
    );
  }
}

export default FileItem;
