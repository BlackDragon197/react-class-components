import React from 'react'

import FlipToBack from '@material-ui/icons/FlipToBack'
import History from '@material-ui/icons/History'
import SettingsInputComponent from '@material-ui/icons/SettingsInputComponent'
import AccessTime from '@material-ui/icons/AccessTime'
import MoveToInbox from '@material-ui/icons/MoveToInbox'
import Payment from '@material-ui/icons/Payment'
import LocalOffer from '@material-ui/icons/LocalOffer'
import SettingsEthernet from '@material-ui/icons/SettingsEthernet'
import Store from '@material-ui/icons/Store'
import Search from '@material-ui/icons/Search'
import LockOpen from '@material-ui/icons/LockOpen'
import Assignment from '@material-ui/icons/Assignment'
import People from '@material-ui/icons/People'
import PersonAdd from '@material-ui/icons/GroupAdd'
import InsertChart from '@material-ui/icons/InsertChart'
import Link from '@material-ui/icons/Link';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Equalizer from '@material-ui/icons/Equalizer';
import ContactMail from '@material-ui/icons/ContactMail';
import Revenue from '@material-ui/icons/Description';

const icons = {
  FlipToBack,
  History,
  SettingsInputComponent,
  AccessTime,
  MoveToInbox,
  Payment,
  LocalOffer,
  SettingsEthernet,
  Store,
  Search,
  LockOpen,
  Assignment,
  People,
  PersonAdd,
  InsertChart,
  Link,
  LibraryBooks,
  Equalizer,
  ContactMail,
  Revenue,
}

const MaterialIcon = function render(props, context) {
  const iconName = props.icon.replace(/Icon$/, '')
  const resolved = icons[iconName]

  if (!resolved) {
    throw Error(`Could not find @material-ui/icons/${iconName}`)
  }

  return React.createElement(resolved, props)
};

export default MaterialIcon
