import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import {withRouter} from "react-router";
import {withFirebase} from "firekit-provider";
import ConfirmItemForm from "../../../components/Forms/ConfirmItemForm";
import FireForm from 'fireform'
import Activity from "../../Activity/Activity";
import {ResponsiveMenu} from "material-ui-responsive-menu";
import {CircularProgress, Dialog, FontIcon} from "material-ui";
import contract from 'truffle-contract';
import shipment_contract_artifacts from '../../../blockchain/build/contracts/SaveShip'
import {setDialogIsOpen} from "../../../store/dialogs/actions";
import isGranted from '../../../utils/auth';
import {connect} from "react-redux";
import { change, submit } from 'redux-form';
import {getGeolocation} from "../../../utils/googleMaps";

const path = '/shipments/';
const form_name = 'confirm_shipment';

class ConfirmItem extends Component {
  constructor(props) {
    super(props);

    this.handleUpdateValues = this.handleUpdateValues.bind(this);
    this.handleUpdated = this.handleUpdated.bind(this);
    props.setDialogIsOpen('processing_shipment', false);

    this.createdEventHack = 0;

    this.state = {
      location: null
    }
  }

  handleUpdateValues(values) {
    const { setDialogIsOpen } = this.props;
    const getAccount = window.web3.eth.getAccounts();
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);
    setDialogIsOpen('processing_shipment', false);
    setDialogIsOpen('processing_shipment', true);

    SaveShip.deployed().then((instance) => {
      instance.RecipientEntered(this.handleUpdated);
      return getAccount.then(payload => {
        return payload[0];
      }).then((walletId) => {
        return instance.enterRecipient(values.id, {
          from: walletId,
          gas: 140000,
          value: parseInt(values.item_value, 10)
        });
      });
    }).catch(e => {
      console.log(e);
    });

    return Object.assign({}, values, {target_location: this.state.location});
  }

  handleUpdated() {
    const { history, setDialogIsOpen } = this.props;
    if (this.createdEventHack === 0) {
      this.createdEventHack += 1;
    } else {
      setDialogIsOpen('processing_shipment', false);
      this.createdEventHack = 0;
      history.push('/item-confirmed');
    }
  }

  render() {

    const {
      history,
      intl,
      dialogs,
      match,
      submit,
      muiTheme,
      isGranted,
      firebaseApp
    } = this.props;

    const uid = match.params.uid;

    const menuList = [
      {
        hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)) || !this.state.location,
        text: intl.formatMessage({ id: 'save' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip: intl.formatMessage({ id: 'save' }),
        onClick: () => { submit('shipment') }
      },
      {
        hidden: (this.state.location),
        text: intl.formatMessage({ id: 'locate' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>my_location</FontIcon>,
        tooltip: intl.formatMessage({ id: 'locate' }),
        onClick: () => {
          getGeolocation((pos) => {
              if (!pos) {
                return;
              } else if (!pos.coords) {
                return;
              }

              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;

              this.setState({
                location: {
                  lat, lon
                }
              });
            },
            (error) => console.log(error))
        }
      }
    ];

    return (
      <Activity
        iconStyleRight={{ width: '50%' }}
        iconElementRight={
          <div>
            <ResponsiveMenu
              iconMenuColor={muiTheme.palette.canvasColor}
              menuList={menuList}
            />
          </div>
        }

        onBackClick={() => { history.goBack() }}
        title={intl.formatMessage({
          id: match.params.uid ? 'edit_shipment' : 'create_shipment' ,
          defaultMessage: match.params.uid ? 'Confirm shipment' : 'Confirm shipment'
        })}>

        <div style={{ margin: 15, display: 'flex' }}>
          <FireForm
            firebaseApp={firebaseApp}
            name={'shipment'}
            path={`${path}`}
            handleUpdateValues={this.handleUpdateValues}
            uid={match.params.uid}>
            <ConfirmItemForm />
          </FireForm>
        </div>
        <Dialog
          title={intl.formatMessage({ id: 'processing_transaction', defaultMessage: 'Processing your shipment' })}
          modal={false}
          open={dialogs.processing_shipment === true}>
          {intl.formatMessage({
            id: 'processing_transaction_message',
            defaultMessage: 'We need some time to process your order'
          })}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 16
          }}>
            <CircularProgress />
          </div>
        </Dialog>
      </Activity>
    );
  }
}

ConfirmItem.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  isGranted: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { intl, dialogs, auth } = state;

  return {
    intl,
    dialogs,
    auth,
    isGranted: grant => isGranted(state, grant)
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen, change, submit }
)(injectIntl(withRouter(withFirebase(muiThemeable()(ConfirmItem)))));

