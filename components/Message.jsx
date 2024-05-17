import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';

export default class Message extends Component {
  state = {
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
  };

  timeout = null;

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidUpdate(prevProps) {
    const { msg, hideAfter } = this.props;
    if (prevProps.msg && msg && prevProps.msg.text !== msg.text) {
      if (msg.text) {
        this.setState({ open: true });

        if (hideAfter) {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            this.setState({ open: false });
          }, hideAfter * 1000);
        }
      }
    }
  }

  render() {
    const { msg } = this.props;
    const { vertical, horizontal, open } = this.state;

    if (msg && msg.text !== '') {
      return (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{msg.text}</span>}
        />
      )
    }
    return null
  }
}
