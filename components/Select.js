import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import VirtualList from 'react-tiny-virtual-list';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

const renderInput = (inputProps) => {
  const { InputProps, classes, ref, selectedValue, ...others } = inputProps;
  others.inputProps.autoComplete = inputProps.autoComplete;

  return (
    <TextField
      className={'downshift-input'}
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps
      }}
      {...others}
    />
  );
}

renderInput.propTypes = {
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
};

const renderSuggestion = (suggestionProps) => {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem, onChange } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  delete suggestionProps.style.height;
  delete suggestionProps.style.width;
  suggestionProps.style.right = 0;
  suggestionProps.style.left = 0;

  return (
    <MenuItem
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        ...suggestionProps.style
      }}
      onClick={itemProps.onClick}
    >
      {suggestion.label}
    </MenuItem>
  );
};

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const getSuggestions = (value, { showEmpty = false } = {}, suggestions = []) => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? suggestions : suggestions.filter(suggestion => {
    return suggestion.label.toLowerCase().indexOf(inputValue) > -1;
  }).sort((a, b) => a.label.toLowerCase().indexOf(inputValue) < b.label.toLowerCase().indexOf(inputValue) ? -1 : 1);
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 5,
    marginTop: '10px',
    width: 390,
    maxHeight: 233,
    paddingBottom: 0,
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#737373',
      borderRadius: 4
    }
  },
  chip: {
    margin: '5px 2.5px',
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
    background: '#eef3f7'
  },
  divider: {
    height: '20px',
  },
});

const messages = defineMessages({
  noEntries: {
    id: 'no_entries',
    defaultMessage: 'No entries'
  },
});

class Select extends Component {
  constructor(props) {
    super(props);
    const { value, options } = props;
    const selectedValue = (options.find(option => option.value === value) || { value: '' }).value;

    this.state = {
      value: selectedValue
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.value !== this.props.value) {
      const { defaultValue, value, options } = this.props;
      const selectedValue = (options.find(option => option.value === value) || { value: '' }).value;
      this.setState({
        value: selectedValue ? selectedValue : value
      });
    }
  }

  handleStateChange = changes => {
    if (changes.hasOwnProperty('selectedItem')) {
      this.setState({ value: changes.selectedItem })
    } else if (changes.hasOwnProperty('inputValue')) {
      this.setState({ value: changes.inputValue })
    }
  }

  render() {
    const {
      classes,
      defaultValue,
      placeholder,
      label,
      options,
      onChange: handleChange,
      intl,
      autoComplete,
      ...others
    } = this.props;

    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Downshift id="downshift-options" selectedItem={value} onChange={handleChange} onStateChange={this.handleStateChange}>
          {({
            clearSelection,
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            openMenu,
            selectedItem
          }) => {
            const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
              onChange: event => {
                if (event.target.value === '') {
                  clearSelection();
                }
              },
              onFocus: openMenu,
              placeholder,
              onBlur: e => {
                let { value } = this.state;
                value = value.toUpperCase()

                const item = options.find(option => option.value === value || option.label === value);
                value = item ? item.value : '';

                this.setState({
                  value
                });
              },
              onKeyDown: e => {
                let { value } = this.state;

                if (e.key === 'Tab') {
                  const item = options.find(option => option.value === value.toUpperCase() || option.label === value.toUpperCase());
                  value = item ? item.value : '';
                  this.setState({
                    value
                  });
                  handleChange(value);
                }

                if (e.key === 'Tab' && value === '') {
                  this.setState({
                    value: ''
                  });
                  handleChange('');
                }
              }
            });

            const items = getSuggestions(inputValue, { showEmpty: true }, options);

            return (
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  label,
                  InputLabelProps: getLabelProps({ shrink: true }),
                  InputProps: { onBlur, onChange, onFocus },
                  inputProps,
                  options,
                  autoComplete,
                  ...others
                })}
                <div {...getMenuProps()}>
                  {isOpen ? (
                    <Paper className={classes.paper} square>
                      {
                        Boolean(items.length) && (
                          <VirtualList
                            scrollToIndex={highlightedIndex || 0}
                            scrollToAlignment="auto"
                            height={items.length < 5 ? items.length * 42 : 233}
                            itemCount={items.length}
                            itemSize={46}
                            renderItem={({ index, style }) => (
                              renderSuggestion({
                                suggestion: items[index],
                                index,
                                style,
                                itemProps: getItemProps({ item: items[index].label }),
                                highlightedIndex,
                                selectedItem
                              })
                            )}
                          />
                        )
                      }
                      {
                        !Boolean(items.length) && (
                          <MenuItem
                            style={{
                              fontWeight: 400
                            }}
                          >
                            {intl.formatMessage(messages.noEntries)}
                          </MenuItem>
                        )
                      }
                    </Paper>
                  ) : null}
                </div>
              </div>
            );
          }}
        </Downshift>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Select));