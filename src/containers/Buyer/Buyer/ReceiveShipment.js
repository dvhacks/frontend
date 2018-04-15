import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import { withFirebase } from "firekit-provider";
import Activity from "../../Activity/Activity";
import { CircularProgress, Dialog, FlatButton } from "material-ui";
import contract from 'truffle-contract';
import shipment_contract_artifacts from '../../../blockchain/build/contracts/SaveShip'
import { setDialogIsOpen } from "../../../store/dialogs/actions";
import isGranted from '../../../utils/auth';
import { connect } from "react-redux";
import { change, submit } from 'redux-form';

const path = '/shipments/';

class ReceiveShipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      snapshot: {}
    };

    this.handleUpdated = this.handleUpdated.bind(this);
    this.updateContract = this.updateContract.bind(this);

    this.createdEventHack = 0;
  }

  componentDidMount () {
    const { firebaseApp, match } = this.props;
    const uid = match.params.uid;

    firebaseApp.database().ref(`${path}${uid}`).once('value',
      snapshot => {
        this.setState({
          isLoading: false,
          snapshot: snapshot.val()
        })
      })
  }

  handleUpdated = () => {

    const { history, match, firebaseApp } = this.props;
    const uid = match.params.uid;

    if (uid) {
      firebaseApp.database().ref().child(`${path}${uid}`).update({
        received: true
      }).then(() => {
        history.push('/dashboard');
      })
    }
  };

  updateContract() {
    const getAccount = window.web3.eth.getAccounts();
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);
    SaveShip.deployed().then((instance) => {
      let id = this.state.snapshot.id;

      instance.Fulfilled(this.handleUpdated);

      return getAccount.then(payload => {
        return payload[0];
      }).then((walletId) => {
        return instance.fulfill(id, {
          from: walletId,
          gas: 140000,
        })
      });
    }).catch(e => {
      console.log(e);
    });
  }

  render() {

    const {
      history,
      intl,
      dialogs
    } = this.props;

    return (
      <Activity
        iconStyleRight={{ width: '50%' }}
        onBackClick={() => { history.goBack() }}
        title={intl.formatMessage({
          id:'job_title',
          defaultMessage: 'Shipment received?'
        })}>

        <div style={{ margin: 15, display: 'flex'}}>
          <FlatButton
            onClick={this.updateContract}
          >
            Confirm delivery
          </FlatButton>
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

ReceiveShipment.propTypes = {
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
)(injectIntl(withRouter(withFirebase(muiThemeable()(ReceiveShipment)))));
