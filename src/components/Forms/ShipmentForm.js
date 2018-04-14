import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { Avatar } from 'rmw-shell/lib/containers/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions';
import { ImageCropDialog } from 'rmw-shell/lib/containers/ImageCropDialog';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import shipment_contract_artifacts from '../../blockchain/build/contracts/SaveShip'
import contract from 'truffle-contract';

class ShipmentForm extends Component {
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.accountId = null;
  }

  handlePhotoUploadSuccess (snapshot) {
    const { setDialogIsOpen, change } = this.props;

    change('photoURL', snapshot.downloadURL);
    setDialogIsOpen('new_company_photo', undefined);
  }

  handleSubmit() {
    const SaveShip = contract(shipment_contract_artifacts);
    console.log({SaveShip});
    SaveShip.setProvider(window.web3.currentProvider);
    SaveShip.deployed().then((instance) => {
      return instance.newShipment(2, 1, {
        from: this.accountId,
        gas: 140000,
      })
    }).catch(e => {
      console.log(e);
    });

    this.props.handleSubmit(...arguments);
  }

  render () {
    const {
      handleSubmit,
      intl,
      initialized,
      setDialogIsOpen,
      dialogs,
      match
    } = this.props;

    const uid = match.params.uid;

    return (
      <form onSubmit={this.handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type="submit" style={{ display: 'none' }} />

        <div>
          <div>
            <Field
              name="item_name"
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'item_name_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'item_name_label' })}
              ref="item_name"
              withRef
            />
          </div>

          <div>
            <Field
              name="recipient_email"
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'recipient_email_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'recipient_email_label' })}
              ref="recipient_email"
              withRef
            />
          </div>

          <div>
            <Field
              name="wallet_id"
              disabled={!initialized}
              component={(props) => {
                if (!this.accountId) {
                  const getAccount = window.web3.eth.getAccounts();
                  getAccount.then(payload => {
                    this.accountId = payload[0];
                    props.input.onChange(this.accountId);
                  });
                }

                return <span />
              }}
              hintText={intl.formatMessage({ id: 'recipient_email_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'recipient_email_label' })}
              ref="recipient_email"
              withRef
            />
          </div>
        </div>

      </form>
    );
  }
}

ShipmentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const ConnectedForm = reduxForm({ form: 'shipment' })(ShipmentForm);
const selector = formValueSelector('shipment');
const mapStateToProps = state => {
  const { intl, vehicleTypes, users, dialogs } = state;

  return {
    intl,
    vehicleTypes,
    users,
    dialogs,
    // photoURL: selector(state, 'photoURL')
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen }
)(injectIntl(withRouter(muiThemeable()(ConnectedForm))));
