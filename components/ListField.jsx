import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => {
  return {
    row: {
      display: 'flex',
    },
    button: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: theme.spacing.unit / 2,
    },
    field: {
      marginRight: 3 * theme.spacing.unit,
    },
    addContainer: {
      marginTop: 3 * theme.spacing.unit,
    },
    addButton: {
      paddingLeft: theme.spacing.unit / 4,
      paddingRight: theme.spacing.unit / 4,
    },
  };
};

class ListField extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    maxRows: PropTypes.number,
    label: PropTypes.node,
  };

  handleItemChange = (index) => (e) => {
    const { value } = this.props;

    const changed = value.map((owner, i) => {
      if (i !== index) {
        return owner;
      }

      return e.target.value;
    });

    this.onChange(changed);
  };

  onAddItem = () => {
    const { value, maxRows } = this.props;

    if (maxRows && value.length > maxRows - 1) {
      return;
    }

    this.onChange([...value, '']);
  };

  onRemove = (index) => () => {
    const { value } = this.props;

    const changed = value.length <= 1 ? [''] : value.filter((_, i) => i !== index);

    this.onChange(changed);
  };

  onChange = (value) => {
    this.props.onChange({
      // noop function to mock React's event persist function in our fake event object.
      persist() {
        return;
      },
      target: {
        name: this.props.name,
        value,
      },
    });
  };

  render() {
    const {
      value,
      maxRows,
      label,
      classes,
      helperText,
      error,
      fieldLabel,
      removeLabel,
      addItemLabel,
      errors,
    } = this.props;

    return (
      <Grid container>
        {label ? (
          <Typography variant="subtitle2">
            {label}
          </Typography>
        ) : null}
        {value.map((owner, index) => (
          <Grid item xs={12} key={index} className={classes.row}>
            <TextField
              className={classes.field}
              name={`list_item_${index}`}
              fullWidth
              margin="dense"
              label={fieldLabel || <FormattedMessage id="name" defaultMessage="Name" />}
              onChange={this.handleItemChange(index)}
              value={owner}
              error={!!(errors && errors[index])}
              helperText={errors && errors[index]}
            />
            <div className={classes.button}>
              <Button color="secondary" onClick={this.onRemove(index)}>
                {removeLabel || <FormattedMessage id="remove" defaultMessage="Remove" />}
              </Button>
            </div>
          </Grid>
        ))}
        {helperText ? (
          <Grid item xs={12}>
            <FormHelperText error={error}>{helperText}</FormHelperText>
          </Grid>
        ) : null}
        <Grid item xs={12} className={classes.addContainer}>
          <Button
            color="primary"
            className={classes.addButton}
            onClick={this.onAddItem}
            disabled={maxRows ? value.length > maxRows - 1 : false}
          >
            <Add color="inherit" />
            {addItemLabel || <FormattedMessage id="add_item" defaultMessage="Add item" />}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ListField);
