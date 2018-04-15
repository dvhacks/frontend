import React from 'react'
import makeLoadable from './containers/MyLoadable'
import RestrictedRoute from './containers/RestrictedRoute'

const MyLoadable = (opts, preloadComponents) => makeLoadable({
  ...opts,
  firebase: () => import('./firebase')
}, preloadComponents)

const AsyncDashboard = MyLoadable({loader: () => import('./containers/Dashboard/Dashboard')})
const AsyncDocument = MyLoadable({loader: () => import('./containers/Document/Document')})
const AsyncCollection = MyLoadable({loader: () => import('./containers/Collection/Collection')})
const AsyncAbout = MyLoadable({loader: () => import('./containers/About/About')})
const AsyncTask = MyLoadable({loader: () => import('./containers/Tasks/Task')})
const AsyncTasks = MyLoadable({loader: () => import('./containers/Tasks/Tasks')}, [AsyncTask])
const AsyncCompany = MyLoadable({loader: () => import('./containers/Companies/Company')})
const AsyncCompanies = MyLoadable({loader: () => import('./containers/Companies/Companies')}, [AsyncCompany])


const AsyncShipment = MyLoadable({loader: () => import('./containers/Shipments/Shipment')});
const AsyncShipments = MyLoadable({loader: () => import('./containers/Shipments/Shipments')});


const AsyncJobs = MyLoadable({loader: () => import('./containers/Jobs/Jobs')});
const AsyncJob = MyLoadable({loader: () => import('./containers/Jobs/Job')});

const Routes = [
  <RestrictedRoute type='private' path="/" exact component={AsyncDashboard}/>,

  <RestrictedRoute type='private' path="/shipments" exact component={AsyncShipments}/>,
  <RestrictedRoute type='private' path="/shipments/create" exact component={AsyncShipment}/>,
  <RestrictedRoute type='private' path="/shipments/edit/:uid" exact component={AsyncShipment}/>,

  <RestrictedRoute type='private' path="/jobs" exact component={AsyncJobs}/>,
  <RestrictedRoute type='private' path="/jobs/details/:uid" exact component={AsyncJob}/>,

  <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard}/>,

  <RestrictedRoute type='private' path="/tasks" exact component={AsyncTasks}/>,
  <RestrictedRoute type='private' path="/tasks/edit/:uid" exact component={AsyncTask}/>,
  <RestrictedRoute type='private' path="/tasks/create" exact component={AsyncTask}/>,
  <RestrictedRoute type='private' path="/companies" exact component={AsyncCompanies}/>,
  <RestrictedRoute type='private' path="/companies/edit/:uid" exact component={AsyncCompany}/>,
  <RestrictedRoute type='private' path="/companies/create" exact component={AsyncCompany}/>,
  <RestrictedRoute type='private' path="/about" exact component={AsyncAbout}/>,
  <RestrictedRoute type='private' path="/document" exact component={AsyncDocument}/>,
  <RestrictedRoute type='private' path="/collection" exact component={AsyncCollection}/>,
]

export default Routes
