import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationItem,
  FlatButton,
  FontIcon,
  List,
  ListItem,
  Paper
} from 'material-ui';
import { injectIntl, intlShape } from 'react-intl';

const buttonOptions = {
  backgroundColor: '#00cea5',
  fullWidth: true,
  hoverColor: '#00d9ae',
  style: { color: '#fff' },
  primary: true
};

class Dashboard extends Component {

  render () {
    return (
      <Fragment>
        <AppBar title="Grasshoppr" showMenuIconButton={false} />
        <List>
          <ListItem>
            <FlatButton {...buttonOptions}>
              Seller
            </FlatButton>
          </ListItem>
          <ListItem>
            <FlatButton {...buttonOptions}>
              Buyer
            </FlatButton>
          </ListItem>
          <ListItem>
            <FlatButton {...buttonOptions}>
              Courier
            </FlatButton>
          </ListItem>
        </List>
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
  intl: intlShape.isRequired
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(
  mapStateToProps
)(injectIntl(Dashboard));
