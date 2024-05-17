import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import sortBy from 'lodash/sortBy';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DateTime from 'components/DateTime';
import ExpandableWidget from './ExpandableWidget';

const styles = (theme) => ({
  logTitle: {
    display: 'flex',
    alignItems: 'baseline',
  },
  marginRight: {
    marginRight: 2 * theme.spacing.unit,
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
});

class Entry extends Component {
  getChangedBy(name) {
    if (isEmpty(name)) {
      return '';
    }

    let changedBy = '';

    if (/[^\/]+$/.test(name)) {
      changedBy = name.match(/[^\/]+$/);
    } else if (/^Person\/.+\//.test(name)) {
      changedBy = <FormattedMessage id="app" defaultMessage="App" />;
    } else if (/^Bank\/.+\//.test(name)) {
      changedBy = <FormattedMessage id="system" defaultMessage="System" />;
    }

    return changedBy;
  }

  render() {
    const { item, classes } = this.props;
    const name = !isEmpty(item.user_nickname) ? decodeURIComponent(item.user_nickname) : '';
    const changedBy = this.getChangedBy(name);

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <div className={classes.logTitle}>
            <Typography variant="caption" color="textSecondary" className={classes.marginRight}>
              <DateTime ts={item.date_created} />
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {changedBy}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            {item.comment}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    );
  }
}

const SHOWN_ITEMS = 10;

class LogEntries extends React.Component {
  state = {
    filterBy: '',
    showAll: false,
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggleShow = () => {
    this.setState(prevState => ({ showAll: !prevState.showAll }));
  };

  render() {
    const entries = [];
    const { items, classes } = this.props;
    const { filterBy, showAll } = this.state;

    if (isArray(items) && items.length > 0) {
      const compareAgainst = filterBy.toLowerCase();
      const list = sortBy(items, (v) => parseInt(v.date_created.replace(/[^0-9]/g, ''), 10));

      for (let i = list.length - 1; i >= 0; i--) {
        const li = list[i];
        const k = !isEmpty(li.user_key) ? decodeURIComponent(li.user_key) : '';

        if (compareAgainst.length > 0) {
          if (
            !(
              k.toLowerCase().indexOf(compareAgainst) > -1 ||
              (li.comment && li.comment.toLowerCase().indexOf(compareAgainst) > -1) ||
              li.date_created.indexOf(compareAgainst) > -1
            )
          ) {
            continue;
          }
        }

        entries.push(li);
      }
    }

    const shownItems = showAll ? entries : entries.slice(0, SHOWN_ITEMS);

    return (
      <ExpandableWidget title={<FormattedMessage id="log_entries" defaultMessage="Log entries" />}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="filterBy"
              label={<FormattedMessage id="history_filter" defaultMessage="Filter" />}
              onChange={this.onChange}
              fullWidth
              helperText={<FormattedMessage id="history_filter_hint" defaultMessage="e.g. 2017-01-06" />}
            />
          </Grid>
          <Grid item xs={12}>
            {shownItems.map((item) => <Entry key={item.request_log_id} item={item} classes={classes} />)}
          </Grid>
          {entries.length > SHOWN_ITEMS ? (
            <Grid item xs={12} className={classes.justifyCenter}>
              <Button onClick={this.toggleShow} variant="outlined" color="primary">
                {showAll ? (
                  <FormattedMessage id="hide" defaultMessage="Hide" />
                ) : (
                  <FormattedMessage id="show_all" defaultMessage="Show all" />
                )}
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </ExpandableWidget>
    );
  }
}

export default withStyles(styles)(LogEntries);
