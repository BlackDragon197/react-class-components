import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  footer: {
    marginRight: 2 * theme.spacing.unit,
  },
});

const ExpandableWidget = ({ children, defaultExpanded, actions, title, classes, unmountOnExit }) => {
  return (
    <ExpansionPanel defaultExpanded={defaultExpanded} CollapseProps={{ unmountOnExit }} square>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {title}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {children}
      </ExpansionPanelDetails>
      {actions ? (
        <ExpansionPanelActions className={classes.footer}>
          {actions}
        </ExpansionPanelActions>
      ) : null}
    </ExpansionPanel>
  );
};

ExpandableWidget.propTypes = {
  defaultExpanded: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  title: PropTypes.node,
};

ExpandableWidget.defaultProps = {
  defaultExpanded: true,
  unmountOnExit: true,
  title: '',
};

export default withStyles(styles)(ExpandableWidget);
