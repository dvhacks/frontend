import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from 'rmw-shell';
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { withRouter } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { withFirebase } from 'firekit-provider';
import FireForm from 'fireform';
import { change, submit } from 'redux-form';
import isGranted from '../../utils/auth';
import shipment_contract_artifacts from '../../blockchain/build/contracts/SaveShip';
import contract from 'truffle-contract';
import { setDialogIsOpen } from '../../store/dialogs/actions';
import {CircularProgress} from 'material-ui';

const path = '/shipments/';
const form_name = 'shipment';

class Job extends Component {
  constructor(props) {
    super(props);

    this.handleCreateValues = this.handleCreateValues.bind(this);
    this.handleCreated = this.handleCreated.bind(this);
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);

    this.state = {
      isLoading: true,
      snapshot: {}
    };

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

  handleCreateValues(values) {
    const { auth } = this.props;
    const userUid = auth.uid;

    return Object.assign({}, values, { user_id: userUid });
  }

  handleSubmitSuccess(values) {
    const { setDialogIsOpen } = this.props;
    const getAccount = window.web3.eth.getAccounts();
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);
    setDialogIsOpen('processing_shipment', true);
    const { item_value, id } = this.state.snapshot;

    SaveShip.deployed().then((instance) => {
      instance.CourrierEntered(this.handleCreated);

      return getAccount.then(payload => {
        return payload[0]
      }).then((walletId) => {
        return instance.enterCourrier(id, {
          from: walletId,
          gas: 140000,
          value: parseInt(item_value)
        })
      })
    }).catch(e => {
      console.log(e);
    })
  }

  handleCreated(err, response) {
    const { history, setDialogIsOpen } = this.props;
    if (this.createdEventHack === 0) {
      this.createdEventHack += 1;
    } else {
      setDialogIsOpen('processing_shipment', false);
      this.createdEventHack = 0;
      history.push('/shipments');
    }
  }

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

    const {
      item_name,
      item_value,
    } = this.state.snapshot;
    const uid = match.params.uid;

    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: 'cancel' })}
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'delete' })}
        secondary
        onClick={this.handleDelete}
      />
    ];

    const menuList = [
      {
        hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)),
        text: intl.formatMessage({ id: 'save' }),
        icon: <FontIcon className='material-icons' color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip: intl.formatMessage({ id: 'save' }),
        onClick: () => { submit('shipment') }
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
          id: 'job_title',
          defaultMessage: 'Jobdetails'
        })}>

        <div style={{ margin: 15, display: 'flex'}}>
          <div style={{
            justifyContent: 'space-around'
          }}>
            <div>
              Item name: {item_name}
            </div>
            <div>
              Cost of the item: {item_value}
            </div>
            <FlatButton
              label='Accept job'
              primary
              onClick={this.handleSubmitSuccess}
            />,
          </div>

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

Job.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  isGranted: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
  const { intl, dialogs, auth } = state;

  return {
    intl,
    dialogs,
    auth,
    isGranted: grant => isGranted(state, grant)
  }
};

export default connect(
  mapStateToProps, { setDialogIsOpen, change, submit }
)(injectIntl(withRouter(withFirebase(muiThemeable()(Job)))))
