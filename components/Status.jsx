import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Done from '@material-ui/icons/Done';
import Error from '@material-ui/icons/Error';
import Pending from '@material-ui/icons/Autorenew';

import { STATUS, REJECTED_STATUSES } from '../constants/statuses';

const messages = defineMessages({
  status_accepted: {
    id: 'status_accepted',
    defaultMessage: 'Accepted',
  },
  status_pending: {
    id: 'status_pending',
    defaultMessage: 'Pending',
  },
  status_rejected: {
    id: 'status_rejected',
    defaultMessage: 'Rejected',
  },
  status_registration_error: {
    id: 'status_registration_error',
    defaultMessage: 'Application error',
  },
  status_terminated: {
    id: 'status_terminated',
    defaultMessage: 'Terminated',
  },
});

const styles = (theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    errorIcon: {
      color: theme.palette.error.main,
      marginRight: theme.spacing.unit,
    },
    iconContainer: {
      borderRadius: '50%',
      marginRight: theme.spacing.unit,
      padding: 2,
      display: 'flex',
      alignItems: 'center',
    },
    pendingIcon: {
      background: '#FFF5D2',
      color: '#7B6827 !important',
    },
    successIcon: {
      background: '#34C161',
      color: 'white',
    },
  };
};

const getStatusText = (status, intl) => {
  if (typeof status === 'string') {
    const message = messages[status.toLowerCase()];
    return message ? intl.formatMessage(message) : status;
  }

  return status;
};

const Status = ({ status, intl, classes, color, variant }) => {
  return (
    <div className={classes.root}>
      {status === STATUS.STATUS_ACCEPTED ? (
        <div className={classNames(classes.iconContainer, classes.successIcon)}>
          <Done fontSize="small" className={classes.icon} color="inherit" />
        </div>
      ) : null}
      {status === STATUS.STATUS_PENDING ? (
        <div className={classNames(classes.iconContainer, classes.pendingIcon)}>
          <Pending fontSize="small" className={classes.icon} color="inherit" />
        </div>
      ) : null}
      {REJECTED_STATUSES.includes(status) ? <Error className={classes.errorIcon} /> : null}
      <Typography variant={variant || 'subtitle2'} color={color || 'textSecondary'}>
        {getStatusText(status, intl)}
      </Typography>
    </div>
  );
};

Status.propTypes = {
  intl: intlShape.isRequired,
  status: PropTypes.string.isRequired,
};

export default withStyles(styles)(injectIntl(Status));
