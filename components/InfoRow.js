import React from "react";
import PropTypes from 'prop-types';
import cx from 'classnames'
import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableRow } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'

const styles = theme => ({
  paddingDefault: {
    'padding': '0 10px',
  },
  success: {
    'color': theme.palette.success.text,
    'background-color': theme.palette.success.bg,
  },
  warning: {
    'color': theme.palette.warning.text,
    'background-color': theme.palette.warning.bg,
  },
  danger: {
    'color': theme.palette.danger.text,
    'background-color': theme.palette.danger.bg,
  },
});

const InfoRow = ({ key, label, i18n, children, classes, status }) => {
  return (
    <TableRow key={key} className={cx(classes[status])}>
      <TableCell padding="dense" className={cx(classes.paddingDefault, classes[status])}>
        {i18n
          ? <strong>{label || <FormattedMessage id={i18n} />}</strong>
          : <strong>{label}</strong>
        }
      </TableCell>
      <TableCell className={cx(classes[status])}>{children}</TableCell>
    </TableRow>
  )
}

InfoRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoRow);
