import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit',
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: theme.palette.grey['400'],
  },
  hovered: {
    background: theme.palette.action.hover,
  },
  hoveredLast: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
  ignoreDayHover: {
    '&:hover': {
      background: 'transparent',
    },
  },
  highlight: {
    background: [theme.palette.primary.main, '!important'],
    color: theme.palette.common.white,
  },
  startHighlight: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  endHighlight: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
  disabled: {
    opacity: 0.3,
    pointerEvents: 'none',
  },
});

class Day extends PureComponent {
  static propTypes = {
    date: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onHover: PropTypes.func,
    dayInCurrentMonth: PropTypes.bool,
    isFirstDay: PropTypes.bool,
    isLastDay: PropTypes.bool,
    isHovered: PropTypes.bool,
    isBetween: PropTypes.bool,
    isLastHover: PropTypes.bool,
    isHoverBetween: PropTypes.bool,
    isHoverAfterFirst: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  onMouseEnter = e => {
    const { date, onHover } = this.props;

    if (onHover) {
      onHover(e, date);
    }
  };

  onMouseLeave = e => {
    const { onHover } = this.props;

    if (onHover) {
      onHover(e, null);
    }
  };

  onClick = () => {
    const { onSelect, date } = this.props;

    if (onSelect) {
      onSelect(date);
    }
  };

  render() {
    const {
      date,
      dayInCurrentMonth,
      isFirstDay,
      isLastDay,
      isHovered,
      isBetween,
      isLastHover,
      isHoverBetween,
      isHoverAfterFirst,
      disabled,
      classes,
    } = this.props;

    const wrapperClassName = classNames({
      [classes.hovered]: isHoverBetween || isLastHover,
      [classes.hoveredLast]: isHovered && isHoverAfterFirst && isLastHover,
      [classes.highlight]: isBetween || isFirstDay || isLastDay,
      [classes.startHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.disabled]: disabled,
    });

    const dayClassName = classNames(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && isBetween,
      [classes.ignoreDayHover]: isHovered && isHoverAfterFirst && isLastHover,
    });

    return (
      <div
        className={wrapperClassName}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={!dayInCurrentMonth ? this.onClick : undefined}
        onKeyPress={!dayInCurrentMonth ? this.onClick : undefined}
        role="presentation"
      >
        <IconButton className={dayClassName}>
          <span>
            {date.format('D')}
          </span>
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(Day);
