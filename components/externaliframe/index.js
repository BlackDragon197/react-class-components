import React from 'react';
import settings from 'settings';
import EE from 'services/EventEmitter';

export default class ExternalIFrame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      link: settings.BASE_URL,
    };

    this.handleEvents();
  }

  handleEvents() {
    EE.on('settings.loaded', () => {
      this.setState({
        link: settings.BASE_URL
      })
    })
  }

  getIFrameURL() {
    const { routeParams, location } = this.props;
    const { link } = this.state;
    const { splat } = routeParams;

    const backofficePrefix = 'backoffice/';
    const resource = splat[splat.length - 1] === '/' ? splat : `${splat}/`;

    const search = (location.search || '').substring(1);
    const query = `?hidemenu${search ? `&${search}` : ''}`;

    return `${link}${backofficePrefix}${resource}${query}`;
  }

  render() {
    const url = this.getIFrameURL();

    return (
      <div className="external-iframe">
        <iframe ref="dest_iframe" frameBorder="0" src={url} />
      </div>
    );
  }
}
