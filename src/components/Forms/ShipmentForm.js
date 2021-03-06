import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import {textFieldOptions} from '../../containers/options';

class ShipmentForm extends Component {
  constructor(props){
    super(props);

    this.accountId = null;
    this.shipmentId = null;
  }

  render () {
    const {
      intl,
      initialized,
      handleSubmit
    } = this.props;

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        width: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type="submit" style={{ display: 'none' }} />

        <div style={{
          flex: 1
        }}>
          <div>
            <Field
              {...textFieldOptions}
              name="item_name"
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'item_name_hint', defaultMessage: 'Name of the item' })}
              floatingLabelText={intl.formatMessage({ id: 'item_name_label', defaultMessage: 'Name' })}
              ref="item_name"
              withRef
            />
          </div>

          <div>
            <Field
              {...textFieldOptions}
              name="recipient_email"
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'recipient_email_hint', defaultMessage: 'Email of the recipient' })}
              floatingLabelText={intl.formatMessage({ id: 'recipient_email_label', defaultMessage: 'Recipient email' })}
              ref="recipient_email"
              withRef
            />
          </div>

          <div>
            <Field
              {...textFieldOptions}
              name="item_value"
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'item_value_hint', defaultMessage: 'Price of the package' })}
              floatingLabelText={intl.formatMessage({ id: 'item_value_label', defaultMessage: 'Total price' })}
              ref="item_value"
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
            />
          </div>

          <div>
            <Field
              name="id"
              disabled={!initialized}
              component={(props) => {
                if (!this.shipmentId) {
                  this.shipmentId = Math.floor(Math.random() * 1000) + 1;
                  props.input.onChange(this.shipmentId);
                }
                return <span />
              }}
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
const mapStateToProps = state => {
  const { intl, vehicleTypes, users, dialogs } = state;

  return {
    intl,
    vehicleTypes,
    users,
    dialogs,
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen }
)(injectIntl(withRouter(muiThemeable()(ConnectedForm))));
