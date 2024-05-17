import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import NavItem from './NavItem'
import access from './Access'
import routes from './routes'
import {FormattedMessage} from 'react-intl'
import {isDebugMode} from 'helpers/urls'
import {Divider} from '@material-ui/core';
import {List, ListSubheader} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles'
import Person from '../../entity/Person';
import {is} from "helpers/access";

const styles = theme => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
    '@media (min-width:600px)': {
      backgroundColor: theme.palette.background.default,
    }
  },
  label: {
    marginLeft: 2 * theme.spacing.unit,
    marginRight: 2 * theme.spacing.unit,
  },
  spacer: {
    marginTop: 51
  }
});

class Links extends React.Component {
  constructor(props) {
    super(props)

    this.storageKey = 'nav.links'
    this.state = {
      menu: routes,
      accessList: [],
    }
  }

  componentDidMount() {
    this.grantAccess(Person.current());
  }

  grantAccess({roles, is_money_handler}) {
    let list = []

    roles.map(role => list.push(...(access[role.key] || [])));

    for (const role of roles) {
      for (const entry in access) {
        if (access[entry].indexOf(role.key) > -1) {
          list.push(entry);
        }

        if (is_money_handler && access[entry].indexOf('money_handler') > -1) {
          list.push(entry);
        }

        if (isDebugMode() && access[entry].indexOf('dev') > -1) {
          list.push(entry);
        }
      }
    }

    this.setState({accessList: list})
  }

  render() {
    const {classes} = this.props;
    const {menu, accessList} = this.state;
    const hasAccess = index => accessList.indexOf(index) > -1;

    return (
      <List className={classes.root}>
        {Object.keys(menu)
          .map((submenu, key) => {
            let header;

            /**
                         * Dp entries don't have header
                         */

            if (is('dp_commercial_l1', 'dp_commercial_l2')) {
              header = key === 0 ? <div className={classes.spacer} /> : null;
            } else {
              const headerId = `subheader_${submenu}`;
              header = (
                <ListSubheader className={classes.subheader} disableGutters>
                  <div className={classes.label}>
                    <FormattedMessage id={headerId}/>
                  </div>
                  <Divider/>
                </ListSubheader>
              );
            }

            if (submenu === 'places' && is('spv_commercial_l1', 'spv_commercial_l2')) {
              header = null;
            }

            const content = menu[submenu]
              .map((item, itemIndex) => {
                const navItem = <NavItem key={itemIndex} item={item}/>;
                return hasAccess(item.idx) ? navItem : null;
              })
              .filter(i => i);

            if (!content.length) {
              return null;
            }

            return (
              <Fragment key={key}>
                {header}
                {content}
              </Fragment>
            );
          })}
      </List>
    );
  }
}

Links.contextTypes = {
  i18n: PropTypes.object,
  bookmarks: PropTypes.array
}

export default withStyles(styles)(Links)
