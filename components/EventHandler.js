import React from "react";
import _ from "lodash";
import Preferences from "services/Preferences";
import EE from "services/EventEmitter";
import * as constants from "app-constants";

// sole purpose is to be vessel to catch events that
// occur somewhere in the system, but the component to whom
// events are concerned is not mounted
export default class EventHandler extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.searchHistory()
  }

  searchHistory() {
    EE.on(constants.EE.SEARCH_HISTORY_SAVEITEM, (item) => {
      Preferences
        .getItem(constants.EE.SEARCH_HISTORY)
        .then((existingHistory) => {
          let history = _.isEmpty(existingHistory) ? [] : existingHistory

          // if this item already exists in history then remove old item
          if (history.indexOf(item) > -1) {
            history.splice(history.indexOf(item), 1)
          }

          if (history.length > 25) {
            history = history.slice(0, 25)
          }

          history.unshift(item)

          Preferences.setItem(constants.EE.SEARCH_HISTORY, history)
        })
    })
  }

  render() {
    return <div className="hide"></div>
  }
}