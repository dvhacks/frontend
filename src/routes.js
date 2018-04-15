import React from 'react'
import makeLoadable from './containers/MyLoadable'
import RestrictedRoute from './containers/RestrictedRoute'

const MyLoadable = (opts, preloadComponents) => makeLoadable({
  ...opts,
  firebase: () => import('./firebase')
}, preloadComponents);

const AsyncDashboard = MyLoadable({loader: () => import('./containers/Dashboard/Dashboard')});
const AsyncShipment = MyLoadable({loader: () => import('./containers/Shipments/Shipment')});
const AsyncShipments = MyLoadable({loader: () => import('./containers/Shipments/Shipments')});
const AsyncJobs = MyLoadable({loader: () => import('./containers/Jobs/Jobs')});
const AsyncJob = MyLoadable({loader: () => import('./containers/Jobs/Job')});
const AsyncConfirm = MyLoadable({loader: () => import('./containers/Buyer/Buyer/ConfirmItem')});
const AsyncReceiveShipment = MyLoadable({loader: () => import('./containers/Buyer/Buyer/ReceiveShipment')});

const Routes = [
  <RestrictedRoute type='private' path="/" exact component={AsyncDashboard}/>,
  <RestrictedRoute type='private' path="/shipments" exact component={AsyncShipments}/>,
  <RestrictedRoute type='private' path="/shipments/create" exact component={AsyncShipment}/>,
  <RestrictedRoute type='private' path="/shipments/edit/:uid" exact component={AsyncShipment}/>,
  <RestrictedRoute type='private' path="/confirm/:uid" exact component={AsyncConfirm}/>,
  <RestrictedRoute type='private' path="/receive/:uid" exact component={AsyncReceiveShipment}/>,
  <RestrictedRoute type='private' path="/jobs" exact component={AsyncJobs}/>,
  <RestrictedRoute type='private' path="/jobs/details/:uid" exact component={AsyncJob}/>,
  <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard}/>
];

export default Routes
