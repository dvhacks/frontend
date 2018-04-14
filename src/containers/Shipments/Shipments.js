import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import { Activity } from 'rmw-shell';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import { withFirebase } from 'firekit-provider';
import isGranted from 'rmw-shell/lib/utils/auth';
import Scrollbar from 'rmw-shell/lib/components/Scrollbar/Scrollbar';

class Shipments extends Component {
  componentDidMount () {
    const { watchList, firebaseApp } = this.props;

    const ref = firebaseApp.database().ref('shipments').limitToFirst(20);

    watchList(ref);
  }

  renderList (shipments) {
    const { history } = this.props;

    if (shipments === undefined) {
      return <div />;
    }

    return shipments.map((shipment, index) => {
      return <div key={index}>
        <ListItem
          leftAvatar={
            <Avatar
              src={shipment.val.photoURL}
              alt="bussines"
              icon={
                <FontIcon className="material-icons">
                  mail_outline
                </FontIcon>
              }
            />
          }
          key={index}
          primaryText={shipment.val.item_name}
          secondaryText={shipment.val.wallet_id}
          onClick={() => {
            history.push(`/shipments/edit/${shipment.key}`);
          }}
          id={index}
        />
        <Divider inset />
      </div>;
    });
  }

  render () {
    const { intl, shipments, muiTheme, history, isGranted } = this.props;

    return (
      <Activity
        isLoading={shipments === undefined}
        containerStyle={{ overflow: 'hidden' }}
        title={intl.formatMessage({ id: 'shipments' })}>

        <Scrollbar>

          <div style={{ overflow: 'none', backgroundColor: muiTheme.palette.convasColor }}>
            <List id="test" style={{ height: '100%' }} ref={(field) => {
              this.list = field;
            }}>
              {this.renderList(shipments)}
            </List>
          </div>

          <div style={{ position: 'fixed', right: 18, zIndex: 3, bottom: 18 }}>
            {
              isGranted('create_shipment') &&
              <FloatingActionButton secondary onClick={() => {
                history.push(`/shipments/create`);
              }} style={{ zIndex: 3 }}>
                <FontIcon className="material-icons" >add</FontIcon>
              </FloatingActionButton>
            }
          </div>
        </Scrollbar>
      </Activity>
    );
  }
}

Shipments.propTypes = {
  shipments: PropTypes.array,
  history: PropTypes.object,
  isGranted: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const { auth, browser, lists } = state;

  return {
    shipments: lists.shipments,
    auth,
    browser,
    isGranted: grant => isGranted(state, grant)
  };
};

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withRouter(withFirebase(Shipments)))));
