import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store';
import config from './config';
import locales from './locales';
import registerServiceWorker from './registerServiceWorker';
import { addLocalizationData } from './locales';
import App from './App';
import Web3 from 'web3';

addLocalizationData(locales);

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  ReactDOM.render(
    <App appConfig={{ configureStore, ...config }} />
    , document.getElementById('root')
  );
});


registerServiceWorker();
