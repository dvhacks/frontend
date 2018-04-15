import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationItem,
  FlatButton,
  FontIcon,
  Paper
} from 'material-ui';
import {injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';

const buttonOptions = {
  backgroundColor: '#00cea5',
  fullWidth: true,
  hoverColor: '#00d9ae',
  style: {color: '#fff', marginTop: 20},
  primary: true
};

class Dashboard extends Component {

  render() {
    const {history} = this.props;

    return (
      <Fragment>
        <AppBar title="Grasshoppr" showMenuIconButton={false}/>
        <div style={{
          margin: '10px'
        }}>
          <FlatButton
            {...buttonOptions}
            onClick={() => {
              history.push('/shipments/create')
            }}
          >
            Send
          </FlatButton>
          <FlatButton
            {...buttonOptions}
            onClick={() => {
              history.push('/jobs')
            }}
          >
            Deliver
          </FlatButton>

          <FlatButton {...buttonOptions}>
            My Shipments
          </FlatButton>
        </div>
        <Paper zDepth={1}>
          <BottomNavigation>
            <BottomNavigationItem
              icon={<FontIcon className="material-icons md-36">face</FontIcon>}
            />
          </BottomNavigation>
        </Paper>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  intl: intlShape.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(
  mapStateToProps
)(injectIntl(Dashboard));
