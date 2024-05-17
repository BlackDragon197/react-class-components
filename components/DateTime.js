import React from "react";
import cx from "classnames";
import moment from "moment";


export default class DateTime extends React.Component {
  render() {
    const { ts, format, timezone } = this.props
    const _ts = ts ? ts : new Date().getTime()
    const m = moment.utc(_ts).local()
    const label = m.format(format || 'YYYY-MM-DD HH:mm')
    const datetimeProps = {}

    if (!timezone) {
      datetimeProps['title'] = m.format('Z')
    }

    return (
      <span className="component-datetime">
        <span className="datetime" {...datetimeProps}>{label}</span>
        <span className={cx({'timezone': 1, 'hide': !timezone})}>{m.format('Z')}</span>
      </span>
    )
  }
}
