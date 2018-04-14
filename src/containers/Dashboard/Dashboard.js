import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl, intlShape } from 'react-intl';
import { GitHubIcon } from 'rmw-shell/lib/components/Icons';
import { Activity } from 'rmw-shell';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase } from 'firekit-provider';
import {FontIcon} from "material-ui";

const currentYear = new Date().getFullYear();
const daysPath = `/user_registrations_per_day/${currentYear}/${new Date().toISOString().slice(5, 7)}`;
const monthsPath = `/user_registrations_per_month/${currentYear}`;
const providerPath = `/provider_count`;

class Dashboard extends Component {
  componentDidMount () {
    const { watchPath } = this.props;

    watchPath(daysPath);
    watchPath(monthsPath);
    watchPath(providerPath);
    watchPath('users_count');
  }

  render () {
    const { muiTheme, intl, days, months, providers, usersCount, history } = this.props;

    return (
      <Activity
        iconElementRight={
          <FlatButton
            style={{ marginTop: 4 }}
            href="https://github.com/TarikHuber/react-most-wanted"
            target="_blank"
            rel="noopener"
            secondary
            icon={<GitHubIcon />}
          />
        }
        title={intl.formatMessage({ id: 'dashboard' })} >

        <FlatButton
          onClick={() => {
            history.push('/shipment/create')
          }}
          primary
        >
          <FontIcon style={{marginTop: 10}} className="material-icons" >add</FontIcon>
          Send shipment
        </FlatButton>

      </Activity >
    );
  }
}

Dashboard.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = (state) => {
  const { paths } = state;

  return {
    days: paths[daysPath],
    months: paths[monthsPath],
    providers: paths[providerPath],
    usersCount: paths.users_count ? paths.users_count : 0
  };
};

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withFirebase(Dashboard))));
