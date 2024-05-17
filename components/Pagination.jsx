import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = (theme) => ({
  root: {
    paddingLeft: 2 * theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fullWidth: {
    justifyContent: 'space-between',
  },
  rowsPerPage: {
    display: 'flex',
    alignItems: 'center',
  },
  rowsPerPageTitle: {
    marginRight: theme.spacing.unit,
  },
});

class Pagination extends Component {
  static propTypes = {
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    labelRowsPerPage: PropTypes.node,
    rowsPerPage: PropTypes.number,
    onChangeRowsPerPage: PropTypes.func,
    SelectProps: PropTypes.object,
    backIconButtonProps: PropTypes.object,
    nextIconButtonProps: PropTypes.object,
    onNextPage: PropTypes.func,
    onPreviousPagePage: PropTypes.func,
    cursor: PropTypes.shape({
      next_cursor: PropTypes.any,
      prev_cursor: PropTypes.any,
    }),
  };

  static defaultProps = {
    rowsPerPageOptions: [],
  };

  handleBackButtonClick = (e) => {
    const { onPreviousPagePage, cursor } = this.props;

    if (onPreviousPagePage && typeof onPreviousPagePage === 'function') {
      onPreviousPagePage(e, cursor.prev_cursor);
    }
  };

  handleNextButtonClick = (e) => {
    const { onNextPage, cursor } = this.props;

    if (onNextPage && typeof onNextPage === 'function') {
      onNextPage(e, cursor.next_cursor);
    }
  };

  hasCursor = () => {
    const { cursor } = this.props;

    return cursor && (cursor.next_cursor || cursor.prev_cursor);
  };

  hasDisabledBackButton = () => {
    const { cursor } = this.props;

    if (Array.isArray(cursor.prev_cursor)) {
      return !cursor.prev_cursor.length || !this.hasCursor();
    }

    return (cursor && !cursor.prev_cursor) || !this.hasCursor();
  }

  render() {
    const {
      rowsPerPageOptions,
      labelRowsPerPage,
      rowsPerPage,
      SelectProps,
      onChangeRowsPerPage,
      backIconButtonProps,
      nextIconButtonProps,
      cursor,
      fullWidth,
      classes,
    } = this.props;

    if (!cursor) {
      return null;
    }

    return (
      <div className={classNames(classes.root, { [classes.fullWidth]: fullWidth })}>
        {Array.isArray(rowsPerPageOptions) && rowsPerPageOptions.length > 1 ? (
          <div className={classes.rowsPerPage}>
            <Typography color="inherit" variant="caption" className={classes.rowsPerPageTitle}>
              {labelRowsPerPage || <FormattedMessage id="rows_per_page" defaultMessage="Rows per page" />}
            </Typography>
            <Select
              input={<InputBase />}
              value={rowsPerPage}
              onChange={onChangeRowsPerPage}
              {...SelectProps}
            >
              {rowsPerPageOptions.map(rowsPerPageOption => (
                <MenuItem
                  key={rowsPerPageOption}
                  value={rowsPerPageOption}
                >
                  {rowsPerPageOption}
                </MenuItem>
              ))}
            </Select>
          </div>
        ) : null}
        <div className={classes.buttons}>
          <IconButton
            onClick={this.handleBackButtonClick}
            color="inherit"
            disabled={this.hasDisabledBackButton()}
            {...backIconButtonProps}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={this.handleNextButtonClick}
            color="inherit"
            disabled={(cursor && !cursor.next_cursor) || !this.hasCursor()}
            {...nextIconButtonProps}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Pagination);
