import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { withStyles } from '@material-ui/core/styles';
import Portal from 'services/Portal';

const styles = {
  label: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.54)',
    marginBottom: 4
  },
  placement: {
    color: '#f44336',
    fontSize: '0.75rem',
    lineHeight: '1em'
  }
};

class Tags extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tags: [],
      suggestions: []
    }

    this.reactTags = React.createRef();
  }

  async componentDidMount() {
    const { suggestionsUrl, defaultValue = [], onChange, name = '' } = this.props;
    let suggestions = [];
    let tags = [];
    if (suggestionsUrl) {
      const { data } = await Portal.get(suggestionsUrl);

      suggestions = data.map(entry => {
        let name = Object.keys(entry)[0];
        let id = entry[name];

        return {
          id,
          name
        }
      });
    }

    if (defaultValue && suggestions.length) {
      tags = suggestions.filter(s => defaultValue.indexOf(s.id) > -1);

      onChange && onChange({
        target: {
          name,
          value: tags
        }
      });
    }

    this.setState({
      suggestions,
      tags
    });
  }

    onDelete = i => {
      const { onChange, name } = this.props;
      const tags = this.state.tags.slice(0);
      tags.splice(i, 1);
      this.setState({ tags });

      onChange && onChange({
        target: {
          name,
          value: tags
        }
      });
    }

    onAddition = tag => {
      const { onChange, name } = this.props;
      const tags = [].concat(this.state.tags, tag);
      this.setState({ tags })

      onChange && onChange({
        target: {
          name,
          value: tags
        }
      });
    }

    getSuggestions = () => {
      const { suggestions, tags } = this.state;
      const selected = tags.map(t => t.name);
      return suggestions.filter(s => selected.indexOf(s.name) === -1);
    }

    suggestionsFilter = (suggestion, query) => {
      return suggestion.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    };

    render () {
      const { label, placeholder, classes, error } = this.props;
      const { tags } = this.state;
      const err_msg = <span className={classes.placement}>This field is required</span>
      return (
        <div style={{ position: 'relative '}}>
          {label && <label className={classes.label}>{label}</label>}
          <ReactTags
            ref={this.reactTags}
            suggestionsFilter={this.suggestionsFilter}
            placeholderText={placeholder}
            tags={tags}
            suggestions={this.getSuggestions()}
            minQueryLength={1}
            onDelete={this.onDelete}
            onAddition={this.onAddition}
          />
          {error?err_msg:''}
        </div>
      )
    }
}

export default withStyles(styles)(Tags);