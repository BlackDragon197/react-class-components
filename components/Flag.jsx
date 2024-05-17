import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InternationalFlag from 'images/International_Flag_of_Planet_Earth.svg';
import { withStyles } from '@material-ui/core/styles';

import 'flag-icon-css/css/flag-icon.min.css';

const styles = () => ({
  IntlFlagIcon: {
    backgroundImage: `url(${InternationalFlag})`
  }
});

const Flag = ({
  code,
  squared,
  className,
  classes
}) => {
  if (!code || typeof code !== 'string') {
    return null;
  }

  if (code === 'ALL') {
    return (
      <span
        className={classNames(className, 'flag-icon', classes.IntlFlagIcon, {
          'flag-icon-squared': squared,
        })}
      />
    );
  }


  return (
    <span
      className={classNames(className, `flag-icon flag-icon-${code.toLowerCase()}`, {
        'flag-icon-squared': squared,
      })}
    />
  );
};

Flag.propTypes = {
  code: PropTypes.string.isRequired,
  squared: PropTypes.bool,
};

Flag.defaultProps = {
  squared: false,
};

export default withStyles(styles)(Flag);
