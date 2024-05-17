import React from 'react';
import HelpIcon from '@material-ui/icons/Help';
import { withStyles } from '@material-ui/core/styles';
import MaterialTooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';

const styles = {
  root: {
    cursor: 'pointer',
    display: 'inline',
    position: 'relative',
    top: 5,
    left: -9,

    '& svg': {
      color: '#2196f3',
      fontSize: 19
    }
  },
  tooltip: {
    maxWidth: 300,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },
  inField: {
    position: 'absolute',
    right: 0,
    left: 'calc(100% - 18px)',
    top: 27,
    zIndex: 3,
  }
};

const Tooltip = ({
  classes,
  left,
  right,
  top,
  bottom,
  position = '',
  content = '',
  style = {},
  inField
}) => {
  let placement = position ? position : left ? 'left' : right ? 'right' : top ? 'top' : bottom ? 'bottom' : 'left';

  return (
    <div className={classNames(classes.root, { [classes.inField]: inField })} style={style}>
      <MaterialTooltip interactive leaveDelay={500} title={content} placement={placement} classes={{ tooltip: classes.tooltip }}>
        <HelpIcon />
      </MaterialTooltip>
    </div>
  );
};

export default withStyles(styles)(Tooltip);