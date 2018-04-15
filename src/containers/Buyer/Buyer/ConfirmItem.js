import React, { Component, Fragment } from 'react';
import {
  AppBar,
  FlatButton,
  TextField
} from 'material-ui';
import { buttonOptions, textFieldOptions } from '../../options';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

export class ConfirmItem extends Component {
  render() {
    return(
      <Fragment>
        <AppBar title="Confirm item" showMenuIconButton={false} />
        <TextField
          {...textFieldOptions}
          hintText="Item name"
        />
        <TextField
          {...textFieldOptions}
          hintText="Delivery time"
        />
        <TextField
          {...textFieldOptions}
          hintText="Price $" type="number"
        />
        <TextField
          {...textFieldOptions}
          hintText="Your address"
          multiLine
        />
        <FlatButton
          {...buttonOptions}
          // disabled={buttonDisabled}
        >
          {/*{buttonDisabled ? 'Choose items' : 'Continue'}*/}
          Send item
        </FlatButton>
      </Fragment>
    );
  }
}

ConfirmItem.propTypes = {
  intl: intlShape.isRequired
};
