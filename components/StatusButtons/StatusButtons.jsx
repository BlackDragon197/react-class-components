import React from 'react';
import Button from '@material-ui/core/Button';

export const StatusButton = ({ classes, active, text, onClick }) => {
  const color = active ? 'primary' : undefined
  const variant = active ? 'contained' : 'outlined'

  return (
    <Button
      variant={variant}
      color={color}
      className={classes}
      onClick={() => onClick()}
    >
      {text}
    </Button>
  )
}

export default StatusButton;
