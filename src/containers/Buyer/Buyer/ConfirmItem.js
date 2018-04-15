import React, { Component, Fragment } from 'react';
import {
  AppBar,
  FlatButton,
  TextField
} from 'material-ui';
import { buttonOptions, textFieldOptions } from '../../options';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

class ConfirmItem extends Component {
  constructor(props) {
    super(props);

    this.handleCreateValues = this.handleCreateValues.bind(this);
    this.handleUpdated = this.handleUpdated.bind(this);
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);

    this.createdEventHack = 0;
  }

  handleSubmitSuccess(values) {
    const { setDialogIsOpen } = this.props;
    const SaveShip = contract(shipment_contract_artifacts);
    SaveShip.setProvider(window.web3.currentProvider);
    setDialogIsOpen('processing_shipment', true);

    SaveShip.deployed().then((instance) => {
      instance.RecipientEntered(this.handleUpdated);
    }).catch(e => {
      console.log(e);
    });
  }

  handleUpdated(err, response) {
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
      setDialogIsOpen,
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
        hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)),
        text: intl.formatMessage({ id: 'save' }),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
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
          id: match.params.uid ? 'edit_shipment' : 'create_shipment' ,
          defaultMessage: match.params.uid ? 'Confirm shipment' : 'Confirm shipment'
        })}>

        <div style={{ margin: 15, display: 'flex' }}>

          <FireForm
            firebaseApp={firebaseApp}
            name={'confirmItem'}
            path={`${path}`}
            onSubmitSuccess={this.handleSubmitSuccess}
            uid={match.params.uid}>
            <ConfirmItem />
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

