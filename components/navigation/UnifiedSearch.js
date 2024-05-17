import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputBase from "@material-ui/core/InputBase";
import CloseIcon from "@material-ui/icons/Close";
import { FormattedMessage } from "react-intl";
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import { hasParentWithMatchingSelector } from 'helpers/dom';
import Person from 'entity/Person';
import Backoffice from 'services/Backoffice';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PersonIcon from '@material-ui/icons/Person';
import StoreIcon from '@material-ui/icons/Store';
import BusinessIcon from '@material-ui/icons/Business';
import Chip from '@material-ui/core/Chip';
import { formatPersonId } from "../../helpers/format";
import Fuse from 'fuse.js';

const styles = {
  closeIcon: {
    display: 'none',
    '@media(max-width: 887px)': {
      display: 'block'
    },
  },
  searchButton: {
    color: '#fff',
    marginLeft: -30,
    display: 'none',

    '@media(max-width: 887px)': {
      display: 'block'
    }
  },
  searchRoot: {
    height: 41,
    width: 430,
    display: 'flex',
    position: 'relative',

    '@media(max-width:1105px)': {
      width: 320
    },

    '@media(max-width: 887px)': {
      position: 'absolute',
      top: 0,
      width: '100%',
      left: 0,
      right: 0,
      zIndex: 99999,
      height: 64,
      display: 'none',
      borderRadius: 0,

      '&.searchOpened': {
        display: 'flex'
      }
    },

    '& > button + div': {
      'flex-grow': 1
    },

    '& input': {
      padding: 0,
      'flex-grow': 1,
      paddingRight: 10
    }
  },
  resultsFilters: {
    display: 'flex',

    '& div': {
      color: '#ca1d37',
      cursor: 'pointer',
      marginRight: 21,
      fontSize: 15,

      '&.active': {
        fontWeight: 600,
        textDecoration: 'underline'
      }
    }
  },
  searchResults: {
    position: 'absolute',
    background: '#fff',
    right: 0,
    top: 39,
    height: 430,
    color: '#000',
    padding: 20,
    zIndex: 99999999,
    left: 0,
    width: 650,
    boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.12)',

    '@media(max-width: 887px)': {
      top: 65,
      width: '100%'

    },
  },
  noResults: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',

    '& svg': {
      color: '#ca1d37',
      fontSize: 100,
      display: 'block',
      margin: '-20px auto 20px auto'
    },

    '& span': {
      color: '#0f1d34'
    }
  },
  resultsList: {
    overflowY: 'visible',
    height: 377,
    overflowX: 'auto',
    margin: '15px -20px 0 -20px',
  },
  result: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '11px 15px',
    borderBottom: '1px solid #e0e0e0',

    '&.hovered': {
      background: '#f9f9f9'
    },

    '& .avatar': {
      height: 50,
      width: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: '#f2f2f2'
    },

    '& .name': {
      marginBottom: -15,
      display: 'block',
      fontWeight: 500,
      wordBreak: 'break-word'
    },

    '& .details': {
      marginLeft: 23,
      width: 130
    },

    '& .detail': {
      marginRight: 10,
      width: 81,

      '@media(max-width: 800px)': {
        wordBreak: 'break-all',
      },

      '& :first-child': {
        textTransform: 'uppercase',
        color: '#4e4e4e',
        fontSize: 12,
        fontWeight: 500,
        marginTop: 4,
        marginBottom: 4
      },

      '& span': {
        fontSize: 14,
        display: 'block',
        wordBreak: 'break-all',
      }
    }
  },
  viewButton: {
    cursor: 'pointer',
    color: '#2196f3',
    marginLeft: 'auto',
    marginTop: '18px',

    '& svg': {
      fontSize: '19px'
    }
  },
  noEntries: {
    marginLeft: 20
  }
};

class UnifiedSearch extends Component {
    state = {
      searchOpened: false,
      searchQuery: '',
      searchLoading: false,
      searchResults: [],
      results: {},
      filtered: '',
      searchCounts: {},
      resultHovered: ''
    };

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
      this.unlistenRouteChange = this.props.router.listen((location, action) => {
        this.setState({
          displaySearchResults: false
        });
      });
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = e => {
      if (this.resultsRef
            && !this.resultsRef.contains(e.target)
            && !hasParentWithMatchingSelector(e.target, '.search-container')) {
        this.setState({
          displaySearchResults: false
        });
      }
    };

    filter = type => {
      const { results, searchQuery } = this.state;
      let searchResults = [];

      if (type === 'all') {
        const fuse = new Fuse([
          ...results.people,
          ...results.legalEntities,
          ...results.merchants
        ], {
          keys: [
            'name',
            'business_name',
            'msisdn'
          ]
        });

        searchResults = fuse.search(searchQuery).map(i => i.item);
      } else {
        searchResults = results[type];
      }

      this.setState({
        filtered: type,
        searchResults
      });
    }

    showSearch = () => {
      this.setState({ searchOpened: true });

      setTimeout(() => {
        this.searchInput && this.searchInput.focus();
      }, 300);
    }

    onSearch = async e => {
      const { value } = e.target;
      const extra = {};

      clearTimeout(this.searchTimeout);

      this.setState({
        searchQuery: value,
      });

      if (typeof value === 'string' && value.length < 3) {
        return
      }

      this.searchTimeout = setTimeout(async() => {
        this.setState({
          searchLoading: true
        });

        let [people, merchants, legalEntities] = await Promise.all([
          Person.search(`"${value}"`, '', extra),
          Backoffice.get(`search/merchant/?q=${value}`, extra),
          Backoffice.get(`search/legal_entity/?q=${value}`, extra),
        ]);

        people = (people.data.items || []).map(p => ({
          ...p,
          type: 'person'
        }));

        merchants = (merchants.data.items || []).map(m => ({
          ...m,
          type: 'merchant'
        }));

        legalEntities = (legalEntities.data.items || []).map(l => ({
          ...l,
          type: 'legalEntity'
        }))

        const fuse = new Fuse([...people, ...merchants, ...legalEntities], {
          keys: [
            'name',
            'business_name',
            'msisdn'
          ]
        });

        this.setState({
          displaySearchResults: true,
          searchResults: fuse.search(value).map(i => i.item),
          results: {
            people,
            merchants,
            legalEntities
          },
          searchLoading: false,
          filtered: 'all',
          searchCounts: {
            people: people.length,
            merchants: merchants.length,
            legalEntites: legalEntities.length
          }
        });
      }, 350);
    };

    onSearchFocus = () => {
      if (this.hasSearchResults()) {
        this.setState({
          displaySearchResults: true
        });
      }
    }

    hideSearch = () => {
      this.setState({
        searchOpened: false,
        searchQuery: '',
        searchResults: []
      });
    }

    hasSearchResults = () => {
      const { results } = this.state;
      return Object.keys(results).map(key => results[key]).some(entry => entry.length > 0);
    };

    redirect = entry => {
      const { router } = this.props;

      this.setState({
        displaySearchResults: false
      });

      const id = formatPersonId(entry);
      const path = entry.type === 'legalEntity' ? 'legalentity' : entry.type;

      router.push(`/${path}/${id}/`);
    }

    render() {
      const { classes } = this.props;
      const {
        searchOpened,
        searchQuery,
        searchLoading,
        searchResults,
        displaySearchResults,
        searchCounts,
        filtered,
        resultHovered
      } = this.state;

      return (
        <>
          {!searchOpened && <IconButton className={classes.searchButton} onClick={this.showSearch} aria-label="Search">
            <SearchIcon />
          </IconButton>}
          <Paper className={classNames(classes.searchRoot, { searchOpened }, 'search-container')} elevation={1}>
            <IconButton className={classes.iconButton} aria-label="Search">
              {searchLoading ? <CircularProgress size={20} color={'secondary'} /> : <SearchIcon />}
            </IconButton>
            <InputBase
              onFocus={this.onSearchFocus}
              className={classes.input}
              placeholder="Search for shops, people or businesses..."
              value={searchQuery}
              onChange={this.onSearch}
              inputRef={ref => this.searchInput = ref}
            />
            <IconButton className={classes.closeIcon} aria-label="Close" onClick={this.hideSearch}>
              <CloseIcon />
            </IconButton>
            {displaySearchResults && <div className={classes.searchResults} ref={ref => this.resultsRef = ref}>
              {
                this.hasSearchResults() && (
                  <div>
                    <div className={classes.resultsFilters}>
                      <div
                        className={classNames({active: filtered === 'all'})}
                        onClick={e => this.filter('all')}
                      >
                        <FormattedMessage
                          id={'filter_best_match'}
                          defaultMessage={'Best Match'} />
                      </div>
                      <div
                        className={classNames({active: filtered === 'merchants'})}
                        onClick={e => this.filter('merchants')}
                      >
                        <FormattedMessage
                          id={'filter_merchants_count'}
                          defaultMessage={'Merchants ({count})'}
                          values={{ count: searchCounts.merchants }} />
                      </div>
                      <div
                        className={classNames({active: filtered === 'people'})}
                        onClick={e => this.filter('people')}
                      >
                        <FormattedMessage
                          id={'filter_people_count'}
                          defaultMessage={'People ({count})'}
                          values={{ count: searchCounts.people }} />
                      </div>
                      <div
                        className={classNames({active: filtered === 'legalEntities'})}
                        onClick={e => this.filter('legalEntities')}
                      >
                        <FormattedMessage
                          id={'filter_le_count'}
                          defaultMessage={'Legal Entities ({count})'}
                          values={{ count: searchCounts.legalEntites }} />
                      </div>
                    </div>
                    <div className={classes.resultsList}>
                      {
                        searchResults.length === 0 && (
                          <div className={classes.noEntries}>
                            <FormattedMessage id={'no_entries'} defaultMessage={'There are no entries'} />
                          </div>
                        )
                      }

                      {searchResults.map((result, index) => {
                        if (result.type === 'person') {
                          return (
                            <div key={index} className={classNames(classes.result, { hovered: index === resultHovered })}>
                              <div className={'avatar'}>
                                <PersonIcon />
                              </div>
                              <div className={'details'}>
                                <span className={'name'}>{result.name}</span>
                                <br />
                                <Chip label={'Person'} />
                              </div>
                              <div className={'detail'}>
                                <span>DoB</span>
                                <span>{result.date_of_birth_ ? result.date_of_birth_.date : '-'}</span>
                              </div>
                              <div className={'detail'}>
                                <span>Status</span>
                                <span>{result.active ? 'Active' : 'Inactive'}</span>
                              </div>
                              <div className={'detail'}>
                                <span>Eula</span>
                                <span>{result.accepted_eula ? result.accepted_eula[0] : '-'}</span>
                              </div>
                              <div
                                onClick={e => this.redirect(result)}
                                className={classes.viewButton}
                                onMouseOver={e => this.setState({ resultHovered: index })}
                                onMouseOut={e => this.setState({ resultHovered: '' })}
                              >
                                <ArrowForwardIosIcon />
                              </div>
                            </div>
                          )
                        }

                        if (result.type === 'merchant') {
                          return (
                            <div key={index} className={classNames(classes.result, { hovered: index === resultHovered })}>
                              <div className={'avatar'}>
                                <StoreIcon />
                              </div>
                              <div className={'details'}>
                                <span className={'name'}>{result.business_name}</span>
                                <br />
                                <Chip label={'Merchant'}/>
                              </div>
                              <div className={'detail'} style={{ width: 92 }}>
                                <span>Organization</span>
                                <span>{result.organization_id || '-'}</span>
                              </div>
                              <div className={'detail'}>
                                <span>Risk</span>
                                <span>{result.purchases_risk ? result.purchases_risk.replace('RISK_', '') : '-'}</span>
                              </div>
                              <div className={'detail'}>
                                <span>Status</span>
                                <span>{result.application ? result.application.status.replace('STATUS_', '') : '-'}</span>
                              </div>
                              <div
                                onClick={e => this.redirect(result)}
                                className={classes.viewButton}
                                onMouseOver={e => this.setState({ resultHovered: index })}
                                onMouseOut={e => this.setState({ resultHovered: '' })}
                              >
                                <ArrowForwardIosIcon />
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={index} className={classNames(classes.result, { hovered: index === resultHovered })}>
                            <div className={'avatar'}>
                              <BusinessIcon />
                            </div>
                            <div className={'details'}>
                              <span className={'name'}>{result.business_name}</span>
                              <br />
                              <Chip label={'Legal Entity'}/>
                            </div>
                            <div className={'detail'} style={{ width: 130 }}>
                              <span>Structure</span>
                              <span>{result.ownership_structure ? result.ownership_structure : '-'}</span>
                            </div>
                            <div className={'detail'}>
                              <span>Risk</span>
                              <span>{result.risk ? result.risk.replace('RISK_', '') : '-'}</span>
                            </div>
                            <div className={'detail'}>
                              <span>Status</span>
                              <span>{result.application ? result.application.status.replace('STATUS_', '') : '-'}</span>
                            </div>
                            <div
                              onClick={e => this.redirect(result)}
                              className={classes.viewButton}
                              onMouseOver={e => this.setState({ resultHovered: index })}
                              onMouseOut={e => this.setState({ resultHovered: '' })}
                            >
                              <ArrowForwardIosIcon />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              }
              {
                !this.hasSearchResults() && (
                  <div className={classes.noResults}>
                    <div>
                      <SpeakerNotesOffIcon />
                      <FormattedMessage id={'no_search_results'} defaultMessage={'There are no results for this search query'} />
                    </div>
                  </div>
                )
              }
            </div>}
          </Paper>
        </>
      )
    }
}

export default withRouter(withStyles(styles)(UnifiedSearch));
