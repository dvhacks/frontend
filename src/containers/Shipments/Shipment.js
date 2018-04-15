import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from 'rmw-shell'
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions';
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


const path = '/shipments/';
const form_name = 'shipment';


class Shipment extends Component {
  constructor(props) {
    super(props);

    this.handleCreateValues = this.handleCreateValues.bind(this);
    this.handleCreated = this.handleCreated.bind(this);
  }

  validate = (values) => {
    const { intl } = this.props;
    const errors = {}

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
    const getAccount = window.web3.eth.getAccounts();
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);


    SaveShip.deployed().then((instance) => {

      instance.Created(this.handleCreated);

      return getAccount.then(payload => {
        return payload[0];
      }).then((walletId) => {
        return instance.newShipment(2, 1, {
          from: walletId,
          gas: 140000,
        })
      });
    }).catch(e => {
      console.log(e);
    });

    return Object.assign({}, values, { user_id: userUid });
  }

  handleCreated(err, response) {
    const { firebaseApp } = this.props;
    const getAccount = window.web3.eth.getAccounts();

    console.log('SUCCESS', err, response);
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
        hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)),
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
            onSubmitSuccess={(values) => { history.push('/shipments'); }}
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
