import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl, defineMessages } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormHelperText from '@material-ui/core/FormHelperText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import { BasePicker, Calendar, TimePickerView } from 'material-ui-pickers';

import Day from './Day';
import { DATE_FORMAT } from '../../settings';
import Button from '../Button';

const styles = theme => ({
  input: {
    '& fieldset': {
      borderColor: '#D6DAE1 !important',
    },
    '& input': {
      padding: '15.5px 14px',
      cursor: 'pointer',
      transition: theme.transitions.create('background', {
        duration: theme.transitions.duration.shortest,
      }),
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        background: theme.palette.action.hover,
      },
    },
  },
  inputContainer: {
    cursor: 'pointer',
  },
  footer: {
    marginBottom: 2 * theme.spacing.unit,
    marginRight: 2 * theme.spacing.unit,
    textAlign: 'right',
  },
  applyButton: {
    marginLeft: theme.spacing.unit,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  dateHeader: {
    padding: `${3 * theme.spacing.unit}px ${3 * theme.spacing.unit}px 0 ${3 * theme.spacing.unit}px`,
  },
  headerText: {
    color: 'white',
  },
  timePickerContainer: {
    display: 'flex',
  },
  timePickerStart: {
    marginLeft: 10,
    marginRight: 5,
  },
  timePickerEnd: {
    marginLeft: 5,
    marginRight: 10,
  },
  popover: {
    marginTop: -5,
  },
  error: {
    textAlign: 'right',
    marginTop: 0,
    marginBottom: theme.spacing.unit,
  },
});

const messages = defineMessages({
  endDateRequired: {
    id: 'datepicker_end_date_required',
    defaultMessage: 'You need to specify the end date!',
  },
});

class DatePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    format: PropTypes.string,
    fromDate: PropTypes.object.isRequired,
    toDate: PropTypes.object.isRequired,
    disableFuture: PropTypes.bool,
    disablePast: PropTypes.bool,
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    format: DATE_FORMAT.DATE,
    disableFuture: false,
    disablePast: false,
  };

  state = {
    startDate: null,
    endDate: null,
    lastSelected: null,
    hovered: null,
    tab: 0,
    startTimeType: 'hours',
    endTimeType: 'hours',
    error: '',
  };

  handleDateChange = date => {
    const { startDate, endDate } = this.state;

    if (date.isBefore(startDate) || (startDate && endDate)) {
      this.setState({
        startDate: date.startOf('day'),
        endDate: null,
        lastSelected: date.startOf('day'),
        error: '',
      });
    } else if (!startDate) {
      this.setState({
        lastSelected: date.startOf('day'),
        startDate: date.startOf('day'),
        error: '',
      });
    } else {
      this.setState({
        lastSelected: date.endOf('day'),
        endDate: date.endOf('day'),
        error: '',
      });
    }
  };

  handleTimeChange = (time, type, next) => (value, isFinish) => {
    const nextState = {
      [time]: value,
    };

    if (isFinish) {
      nextState[type] = next || 'hours';
    }

    this.setState(nextState);
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  save = e => {
    const { onChange, intl } = this.props;
    const { startDate, endDate } = this.state;

    if (startDate && endDate) {
      onChange(e, {
        startDate,
        endDate,
      });

      this.handleClose();
    } else {
      this.setState({
        error: intl.formatMessage(messages.endDateRequired),
      });
    }
  };

  onHover = (e, date) => {
    this.setState({ hovered: date });
  };

  renderDay = (date, selectedDate, dayInCurrentMonth, { props }) => {
    const { startDate, endDate, hovered } = this.state;

    const startedSelect = startDate && !endDate;
    const hasSelection = startDate && endDate;
    const shouldHighlightHover = startedSelect && hovered;

    const isFirstDay = startDate && date.isSame(startDate, 'day');
    const isLastDay = endDate && date.isSame(endDate, 'day');
    const dayIsBetween = hasSelection && date.isBetween(startDate, endDate, 'day', '[]');

    const isLastHover = shouldHighlightHover && date.isSame(hovered, 'day');
    const isHoverAfterFirst = shouldHighlightHover && hovered.isAfter(startDate, 'day');
    const isHoverBetween = shouldHighlightHover && date.isBetween(startDate, hovered, 'day', '[]');

    return (
      <Day
        onHover={this.onHover}
        onSelect={this.handleDateChange}
        date={date}
        dayInCurrentMonth={dayInCurrentMonth}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isBetween={dayIsBetween}
        isHovered={Boolean(hovered)}
        isHoverBetween={isHoverBetween}
        isLastHover={isLastHover}
        isHoverAfterFirst={isHoverAfterFirst}
        {...props}
      />
    );
  };

  handleOpen = event => {
    const { fromDate, toDate } = this.props;

    this.setState({
      anchorEl: event.currentTarget,
      startDate: fromDate,
      endDate: toDate,
      lastSelected: toDate,
      tab: 0,
      startTimeType: 'hours',
      endTimeType: 'hours',
      error: '',
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  getValue = () => {
    const { fromDate, toDate, format } = this.props;

    return fromDate && toDate ? `${fromDate.format(format)} - ${toDate.format(format)}` : '';
  };

  render() {
    const { anchorEl, lastSelected, startDate, endDate, tab, startTimeType, endTimeType, error } = this.state;
    const {
      textFieldProps,
      popoverProps,
      classes,
      cancelLabel,
      acceptLabel,
      inputLabel,
      disableFuture,
      disablePast,
    } = this.props;
    const open = Boolean(anchorEl);

    return (
      <BasePicker value={lastSelected} onChange={this.handleDateChange} autoOk>
        {({ date, handleChange }) => (
          <div>
            <TextField
              variant="outlined"
              label={inputLabel || <FormattedMessage id="select_date_range" defaultMessage="Select date range" />}
              {...textFieldProps}
              className={classes.inputContainer}
              onClick={this.handleOpen}
              value={this.getValue()}
              InputProps={{
                readOnly: true,
                className: classes.input,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <Popover
              id="datepicker-popover"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              {...popoverProps}
              open={open}
              anchorEl={anchorEl}
              onClose={this.handleClose}
              classes={{
                paper: classes.popover,
              }}
            >
              <div className={classes.header}>
                <Grid container spacing={0} className={classes.dateHeader}>
                  <Grid item xs={6}>
                    <Typography className={classes.headerText}>{startDate ? startDate.format('YYYY') : ''}</Typography>
                    <Typography variant="h6" className={classes.headerText}>
                      {startDate ? startDate.format('ddd, MMM DD') : ''}
                    </Typography>
                    <Typography className={classes.headerText}>{startDate ? startDate.format('HH:mm') : ''}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.headerText}>{endDate ? endDate.format('YYYY') : ''}</Typography>
                    <Typography variant="h6" className={classes.headerText}>
                      {endDate ? endDate.format('ddd, MMM DD') : ''}
                    </Typography>
                    <Typography className={classes.headerText}>{endDate ? endDate.format('HH:mm') : ''}</Typography>
                  </Grid>
                </Grid>
                <Tabs variant="fullWidth" value={tab} onChange={this.handleTabChange}>
                  <Tab label={<DateRangeIcon nativeColor="white" />} />
                  <Tab label={<AccessTimeIcon nativeColor="white" />} />
                </Tabs>
              </div>
              {tab === 0 ? (
                <Calendar
                  date={date}
                  onChange={handleChange}
                  renderDay={this.renderDay}
                  disableFuture={disableFuture}
                  disablePast={disablePast}
                />
              ) : null}
              {tab === 1 && startDate && endDate ? (
                <div className={classes.timePickerContainer}>
                  <div className={classes.timePickerStart}>
                    <TimePickerView
                      date={startDate}
                      ampm={false}
                      onHourChange={this.handleTimeChange('startDate', 'startTimeType', 'minutes')}
                      onMinutesChange={this.handleTimeChange('startDate', 'startTimeType', 'hours')}
                      onSecondsChange={this.handleTimeChange('startDate', 'startTimeType')}
                      type={startTimeType}
                    />
                  </div>
                  <div className={classes.timePickerEnd}>
                    <TimePickerView
                      date={endDate}
                      ampm={false}
                      onHourChange={this.handleTimeChange('endDate', 'endTimeType', 'minutes')}
                      onMinutesChange={this.handleTimeChange('endDate', 'endTimeType', 'hours')}
                      onSecondsChange={this.handleTimeChange('endDate', 'endTimeType')}
                      type={endTimeType}
                    />
                  </div>
                </div>
              ) : null}
              <div className={classes.footer}>
                <FormHelperText error className={classes.error}>
                  {error}
                </FormHelperText>
                <Button onClick={this.handleClose}>
                  {cancelLabel || <FormattedMessage id="cancel" defaultMessage="Cancel" />}
                </Button>
                <Button variant="contained" color="primary" onClick={this.save} className={classes.applyButton}>
                  {acceptLabel || <FormattedMessage id="ok" defaultMessage="Ok" />}
                </Button>
              </div>
            </Popover>
          </div>
        )}
      </BasePicker>
    );
  }
}

export default withStyles(styles)(injectIntl(DatePicker));
