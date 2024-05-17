import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import JurisdictionSelector from "./navigation/JurisdictionSelector";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    fontSize: 40,
    color: '#0f1d34',

    '& strong': {
      color: '#ca1d37'
    }
  }
};

class Title extends Component {
  render() {
    const {
      page = 'Title',
      style = {},
      showAsAll = false,
      hideJurisdiction = false,
      classes
    } = this.props;
    const jurisdiction = showAsAll ? 'All jurisdictions' : JurisdictionSelector.getSelectedJurisdictionName();

    return (
      <Typography variant="h3" style={style} className={classes.root}>
        {page} {hideJurisdiction ? null : (
          <>
                        in <strong>{jurisdiction}</strong>
          </>
        )}
      </Typography>
    );
  }
}

export default withStyles(styles)(Title);