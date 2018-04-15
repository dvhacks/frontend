import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from 'rmw-shell'
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { withRouter } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { withFirebase } from 'firekit-provider'
import FireForm from 'fireform'
import { change, submit } from 'redux-form';
import isGranted from '../../utils/auth';
import ShipmentForm from "../../components/Forms/ShipmentForm";
import shipment_contract_artifacts from '../../blockchain/build/contracts/SaveShip'
import contract from 'truffle-contract';
import { setDialogIsOpen } from "../../store/dialogs/actions";
import {CircularProgress} from "material-ui";
import {getGeolocation} from "../../utils/googleMaps";


const path = '/shipments/';
const form_name = 'shipment';


class Shipment extends Component {
  constructor(props) {
    super(props);

    this.handleCreateValues = this.handleCreateValues.bind(this);
    this.handleCreated = this.handleCreated.bind(this);
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);

    this.createdEventHack = 0;
    props.setDialogIsOpen('processing_shipment', false);

    this.state = {
      location: null
    }
  }

  validate = (values) => {
    const { intl } = this.props;
    const errors = {};

    errors.item_name = !values.item_name
      ? intl.formatMessage({ id: 'error_required_field', defaultMessage: 'Name is required'})
      : '';
    errors.item_value = !values.item_value
      ? intl.formatMessage({ id: 'error_required_field', defaultMessage: 'Value is required' })
      : '';
    errors.recipient_email = !values.recipient_email
      ? intl.formatMessage({ id: 'error_required_field', defaultMessage: 'Email is required' })
      : '';

    return errors
  };

  handleCreateValues(values) {
    const { auth } = this.props;
    const userUid = auth.uid;
    this.handleSubmitSuccess(values);

    return Object.assign({}, values, { user_id: userUid, pickup_location: this.state.location });
  }

  handleSubmitSuccess(values) {
    const { setDialogIsOpen } = this.props;
    const getAccount = window.web3.eth.getAccounts();
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);

    SaveShip.deployed().then((instance) => {

      setDialogIsOpen('processing_shipment', true);
      instance.Created(this.handleCreated);

      return getAccount.then(payload => {
        return payload[0];
      }).then((walletId) => {
        return instance.newShipment(values.id, parseInt(values.item_value), {
          from: walletId,
          gas: 140000,
        })
      });
    }).catch(e => {
      console.log(e);
    });
  }

  handleCreated() {
    const { history, setDialogIsOpen } = this.props;
    if (this.createdEventHack === 0) {
      this.createdEventHack += 1;
    } else {
      setDialogIsOpen('processing_shipment', false);
      this.createdEventHack = 0;
      history.push('/shipments');
    }
  }

  handleClose = () => {
    const { setDialogIsOpen } = this.props;

    setDialogIsOpen('delete_shipment', false);

  };

  handleDelete = () => {

    const { history, match, firebaseApp } = this.props;
    const uid = match.params.uid;

    if (uid) {
      firebaseApp.database().ref().child(`${path}${uid}`).remove().then(() => {
        this.handleClose();
        history.goBack();
      })
    }
  };


  render() {

    const {
      history,
      intl,
      setDialogIsOpen,
      dialogs,
      match,
      submit,
      muiTheme,
      isGranted,
      firebaseApp
    } = this.props;

    const uid = match.params.uid;

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'cancel' })}
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'delete' })}
        secondary={true}
        onClick={this.handleDelete}
      />,
    ];

    const menuList = [
      {
        hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)) || (!this.state.location),
        text: intl.formatMessage({ id: 'save' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip: intl.formatMessage({ id: 'save' }),
        onClick: () => { submit('shipment') }
      },
      {
        hidden: uid === undefined || !isGranted(`delete_${form_name}`),
        text: intl.formatMessage({ id: 'delete' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>delete</FontIcon>,
        tooltip: intl.formatMessage({ id: 'delete' }),
        onClick: () => { setDialogIsOpen('delete_shipment', true); }
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
          defaultMessage: match.params.uid ? 'Edit shipment' : 'Ship it!'
        })}>

        <div style={{ margin: 15, display: 'flex' }}>

          <FireForm
            firebaseApp={firebaseApp}
            name={'shipment'}
            path={`${path}`}
            validate={this.validate}
            handleCreateValues={this.handleCreateValues}
            onDelete={(values) => { history.push('/shipments'); }}
            uid={match.params.uid}>
            <ShipmentForm />
          </FireForm>
        </div>
        <Dialog
          title={intl.formatMessage({ id: 'delete_shipment_title', defaultMessage: 'Delete shipment' })}
          actions={actions}
          modal={false}
          open={dialogs.delete_shipment === true}
          onRequestClose={this.handleClose}>
          {intl.formatMessage({ id: 'delete_shipment_message', defaultMessage: 'Delete shipment' })}
        </Dialog>
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

Shipment.propTypes = {
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
)(injectIntl(withRouter(withFirebase(muiThemeable()(Shipment)))));
