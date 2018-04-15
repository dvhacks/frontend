import React from 'react';
import RestrictedRoute from '../../containers/RestrictedRoute';
import makeLoadable from '../../containers/MyLoadable';
import { Route } from 'react-router-dom';

const getAppRoutes = (firebaseLoader) => {

  const MyLoadable = (opts, preloadComponents) => makeLoadable({ ...opts, firebase: firebaseLoader }, preloadComponents);

  const AsyncMyAccount = MyLoadable({ loader: () => import('../../containers/MyAccount/MyAccount') });
  const AsyncPageNotFound = MyLoadable({ loader: () => import('../../components/PageNotFound/PageNotFound') });
  const AsyncRole = MyLoadable({ loader: () => import('../../containers/Roles/Role') });
  const AsyncSignIn = MyLoadable({ loader: () => import('../../containers/SignIn/SignIn') });
  const AsyncUser = MyLoadable({ loader: () => import('../../containers/Users/User') });
  const AsyncRoles = MyLoadable({ loader: () => import('../../containers/Roles/Roles') }, [AsyncRole]);
  const AsyncUsers = MyLoadable({ loader: () => import('../../containers/Users/Users') }, [AsyncUser]);

  return [
    <RestrictedRoute type='private' path="/my_account" exact component={AsyncMyAccount} />,
    <RestrictedRoute type='private' path="/roles" exact component={AsyncRoles} />,
    <RestrictedRoute type='private' path="/roles/edit/:uid/:editType" exact component={AsyncRole} />,
    <RestrictedRoute type='private' path="/users" exact component={AsyncUsers} />,
    <RestrictedRoute type='private' path="/users/:select" exact component={AsyncUsers} />,
    <RestrictedRoute type='private' path="/users/edit/:uid/:editType" exact component={AsyncUser} />,
    <RestrictedRoute type='public' path="/signin" component={AsyncSignIn} />,
    <RestrictedRoute type='private' path="/" exact component={AsyncUsers} />,
    <Route component={AsyncPageNotFound} />
  ]
};

export default getAppRoutes;
