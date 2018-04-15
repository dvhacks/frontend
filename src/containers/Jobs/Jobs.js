import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import { Activity } from 'rmw-shell';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import { withFirebase } from 'firekit-provider';
import isGranted from 'rmw-shell/lib/utils/auth';
import Scrollbar from 'rmw-shell/lib/components/Scrollbar/Scrollbar';

class Jobs extends Component {
  constructor(props) {
    super(props);

    this.getSecondaryText = this.getSecondaryText.bind(this);
  }

  componentDidMount () {
    const { watchList, firebaseApp } = this.props;

    const ref = firebaseApp.database().ref('shipments').child('curier_id').equalTo(null).limitToFirst(20);

    watchList(ref);
  }

  getSecondaryText(shipment) {
    const {intl} = this.props;
    // TODO format correctly
    return intl.formatMessage({
      id: 'job_secondary_message',
      defaultMessage: 'Value: {value}$ | Revenue: {revenue}$'},
      {
        value: shipment.val.item_value,
        revenue: intl.formatNumber(5),
      });
  }

  calculateDistance(shipment) {
    // TODO

    return 2
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
            <Avatar>
              {this.calculateDistance(shipment)}
            </Avatar>
          }
          key={index}
          primaryText={shipment.val.item_name}
          secondaryText={this.getSecondaryText(shipment)}
          id={index}
          onClick={() => {
            history.push(`/jobs/details/${shipment.key}`)
          }}
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
        title={intl.formatMessage({ id: 'shipments', defaultMessage: 'Open Jobs' })}>

        <Scrollbar>

          <div style={{ overflow: 'none', backgroundColor: muiTheme.palette.convasColor }}>
            <List id="test" style={{ height: '100%' }} ref={(field) => {
              this.list = field;
            }}>
              {this.renderList(shipments)}
            </List>
          </div>
        </Scrollbar>
      </Activity>
    );
  }
}

Jobs.propTypes = {
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
)(injectIntl(muiThemeable()(withRouter(withFirebase(Jobs)))));
