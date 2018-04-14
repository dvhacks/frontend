import React, { Component, Fragment } from 'react';
import {
  AppBar,
  FlatButton,
  MenuItem,
  SelectField,
} from 'material-ui';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

export class ItemConfirmed extends Component {
  render() {
    return (
      <Fragment>
        <AppBar title="Confirmed" showMenuIconButton={false} />
        <h1>Confirmed!</h1>
      </Fragment>
    );
  }
}

ItemConfirmed.propTypes = {
  intl: intlShape.isRequired
};
