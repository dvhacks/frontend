import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import locales, { getLocaleMessages } from '../../locales'
import {getThemeSource} from '../../themes'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { IntlProvider } from 'react-intl'
import AppLayout from '../../containers/AppLayout'
import {
  watchAuth,
  clearInitialization,
  initConnection,
  watchList,
  watchPath
} from 'firekit'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom'

const history = createHistory();

class Root extends Component {

  handlePresence = (user, firebaseApp) => {

    let myConnectionsRef = firebaseApp.database().ref(`users/${user.uid}/connections`);

    let lastOnlineRef = firebaseApp.database().ref(`users/${user.uid}/lastOnline`);
    lastOnlineRef.onDisconnect().set(new Date());

    let con = myConnectionsRef.push(true)
    con.onDisconnect().remove();

  }

  onAuthStateChanged = (user, firebaseApp) => {
    const {
      clearInitialization,
      watchConnection,
      watchList,
      watchPath,
      appConfig
    } = this.props;


    clearInitialization();

    if (user) {

      this.handlePresence(user, firebaseApp);
      setTimeout(() => { watchConnection(firebaseApp); }, 1000);

      const userData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        email: user.email ? user.email : ' ',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        providerData: user.providerData,
      };

      let publicProviderData = []

      user.providerData.forEach(provider => {
        publicProviderData.push({
          providerId: provider.providerId,
          displayName: provider.displayName ? provider.displayName : null
        })
      });


      const publicUserData = {
        displayName: user.displayName ? user.displayName : 'UserName',
        photoURL: user.photoURL,
        uid: user.uid,
        providerData: publicProviderData,
      };

      watchList(firebaseApp, `user_grants/${user.uid}`);
      watchPath(firebaseApp, `admins/${user.uid}`);

      if (appConfig.onAuthStateChanged) {
        try {
          appConfig.onAuthStateChanged(user, this.props, firebaseApp)
        } catch (err) {
          console.warn(err)
        }
      }

      firebaseApp.database().ref(`users/${user.uid}`).update(publicUserData);

      return userData;

    } else {
      return null;
    }

  }

  componentWillMount() {
    const { watchAuth, appConfig } = this.props;

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      watchAuth(firebaseApp, (user) => this.onAuthStateChanged(user, firebaseApp))
    })


  }

  componentWillUnmount() {
    //const { clearApp }= this.props;
    //clearApp(this.firebaseApp); //TODO: add it after firekit update
  }

  render() {
    const { locale, muiTheme, messages, appConfig } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <IntlProvider locale={locale} key={locale} messages={messages}>
          <Router history={history} >
            <Switch>
              <Route children={(props) => <AppLayout {...props} />} />
            </Switch>
          </Router>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }

}

Root.propTypes = {
  locale: PropTypes.string.isRequired,
  source: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { theme, locale } = state;
  const { appConfig } = ownProps

  const source = getThemeSource(theme, appConfig.themes);
  const messages = { ...(getLocaleMessages(locale, locales)), ...(getLocaleMessages(locale, appConfig.locales)) }
  const muiTheme = getMuiTheme(source);

  return {
    locale,
    source,
    messages,
    muiTheme
  };
};


export default connect(
  mapStateToProps, { watchAuth, clearInitialization, watchConnection: initConnection, watchList, watchPath }
)(Root);
