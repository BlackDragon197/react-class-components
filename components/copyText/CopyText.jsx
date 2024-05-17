import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopy';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


const styles = (theme) => ({
  shortLink: {
    display: 'flex',
    alignItems: 'center',
    
    '& .copy-btn': {
      cursor: 'pointer',
    },
    
    '& .copy-icon': {
      marginLeft: 8,
      display: 'block',
      color: '#2b96f3',
    },
    
    '& .copy-icon.success': {
      color: 'green',
    },
    
    '& input': {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '8px 9px',
      border: 'none',
      borderRadius: 4,
      background: 'whitesmoke',
      userSelect: 'all',
    },
    
    '& .highlight': {
      '&:hover': {
        color: '#1f5293',
        cursor: 'pointer',
        fontWeight: 500,
      },
    },
  },
});

const CopyText = ({ classes, text, customInputClass = '', shouldBeInput = false, customClass = '' }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleTooltipClose = () => {
    setOpen(false);
  };
  
  const handleTooltipOpen = () => {
    setOpen(true);
  };
  
  const onCopy = () => {
    setCopied(true);
  };
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCopied(false);
    }, 300);
    
    return () => {
      clearTimeout(timer1);
    };
  }, [copied]);
  
  return (
    <div className={`${classes.shortLink} ${customClass}`}>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          open={open}
          title={text}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          className={'highlight'}
        >
          {shouldBeInput ?
            <input
              className={customInputClass}
              readOnly={true}
              defaultValue={text}
              onClick={handleTooltipOpen}
            />
            :
            <span className={customInputClass} onClick={handleTooltipOpen}>{text}</span>
          }
        </Tooltip>
      </ClickAwayListener>
      <CopyToClipboard
        text={text}
        className={'copy-btn'} onCopy={onCopy}>
        <span>
          {copied ?
            <Check className={'copy-icon success'} />
            :
            <FileCopy className={'copy-icon'} />
          }
        </span>
      </CopyToClipboard>
    </div>
  );
};

CopyText.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CopyText);
