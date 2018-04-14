import getMenuItems from './menuItems'
import locales from './locales'
import routes from './routes'
import {allThemes} from './themes'
import grants from './grants'

const config = {
  firebase_config: {
    apiKey: 'AIzaSyDws6EBIkXKbkeRs8Tz-MB-kDcglfKeqHU',
    authDomain: 'dvhacks-a9bf3.firebaseapp.com',
    databaseURL: 'https://dvhacks-a9bf3.firebaseio.com',
    projectId: 'dvhacks-a9bf3',
    storageBucket: 'dvhacks-a9bf3.appspot.com',
    messagingSenderId: '1080887397011'
  },
  firebase_config_dev: {
    apiKey: 'AIzaSyDws6EBIkXKbkeRs8Tz-MB-kDcglfKeqHU',
    authDomain: 'dvhacks-a9bf3.firebaseapp.com',
    databaseURL: 'https://dvhacks-a9bf3.firebaseio.com',
    projectId: 'dvhacks-a9bf3',
    storageBucket: 'dvhacks-a9bf3.appspot.com',
    messagingSenderId: '1080887397011'
  },
  firebase_providers: [
    'google.com',
    'facebook.com',
    'twitter.com',
    'github.com',
    'password',
    'phone'
  ],
  initial_state: {
    theme: 'dark',
    locale: 'en'
  },
  drawer_width: 256,
  locales,
  allThemes,
  grants,
  routes,
  getMenuItems,
  firebaseLoad: () => import('./firebase'),
}

export default config
