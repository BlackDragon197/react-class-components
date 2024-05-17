import React from 'react';
import DocumentTitle from 'react-document-title'
import PropTypes from 'prop-types';
import settings from 'settings'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

const PageTitle = ({ title, children }) => {
  return (
    <DocumentTitle title={`${title}`}>{children}</DocumentTitle>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default PageTitle
