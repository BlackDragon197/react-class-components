import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setError } from "../store/errors";

import Button from 'components/Button';

const styles = (theme) => ({
  dialogActions: {
    marginRight: 2 * theme.spacing.unit,
  },
  errorBox: {
    border: '1px solid #dcdcdc',
    padding: '10px',
    maxHeight: 320,
    background: '#fbfbfb',
    borderRadius: '4px',
    display: 'block',
    marginTop: 15,
    whiteSpace: 'pre-wrap',
    overflow: 'scroll',
    wordBreak: 'break-all'
  }
});

const messages = defineMessages({
  error_unk: {
    id: 'error_unk',
    defaultMessage: 'An unknown error occurred'
  },
  error_no_internet: {
    id: 'error_no_internet',
    defaultMessage: 'You are not connected to internet'
  },
  error_500: {
    id: 'error_500',
    defaultMessage: 'An error occurred due of server'
  },
  error_403: {
    id: 'error_403',
    defaultMessage: 'You don’t have access, talk to your administrator if this doesn’t seem right'
  }
});

const mapStateToProps = store => ({
  error: store.errors.error,
});

const mapActionsToProps = (dispatch) => ({
  dispatch,
  setError
});

class ErrorDialog extends Component {
    state = {};

    close = async () => {
      const { setError, dispatch } = this.props;
      dispatch(setError(false));
    };

    render() {
      const { error, classes, intl } = this.props;

      return (
        <Dialog open={!!error} onClose={this.close} fullWidth>
          <DialogTitle>
            <FormattedMessage id="error" defaultMessage="Error" />{' '}
            {error.status || ''}
          </DialogTitle>
          <DialogContent>
            {intl.formatMessage(messages[error.message] || messages.error_unk)}
            {error.data && <pre className={classes.errorBox}>
              {JSON.stringify(error.data)}
            </pre>}
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.close} color="primary">
              <FormattedMessage id="close" defaultMessage="Close" />
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(injectIntl(ErrorDialog)));
