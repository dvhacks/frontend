[![logo](grasshoppr.png)](https://grasshoppr.co)

## Team

 - Dejan Eremic
 - Jakub Horak
 - Matt Finucane
 - Alexander Reichert
 
## Project description

Peer to peer decentralized shipping platform using blockchain on ETH - aiming towards building a decentralized mobility network.

## Folder Structure

The project has following folder structure:

```
grasshoppr/
  .gitignore
  README.md
  node_modules/
  package.json
  public/
    icons/
    index.html
    favicon.ico
    manifest.json
  src/
    blockchain/
      contracts/
      migrations/
      test/
      truffle.js
    components/
    containers/
    firebase/
    utils/
    locales/
    store/
      index.js
      reducers.js
    themes/
    config.js
    index.js
```

All application parts and code should be stored in the `src` folder.

Smart contract is a subproject in `src/blockchain/` folder.

All `react` components should be separated in presentational and container components. This great [article](https://www.fullstackreact.com/p/using-presentational-and-container-components-with-redux/) describes the why and how. For this purpose we have the `components` and `containers` folders.

All `redux` related files are in the `store` folder. You can find more about redux [here](http://redux.js.org/docs/introduction/).

## Usage

### Simple run

To just run the project on you own device you should have installed:

1. git, node and npm
1. For the blockchain, you need Truffle framework installed, [here's how](http://truffleframework.com/docs/getting_started/installation)
1. and install the [Metamask browser extension](https://metamask.io/) to be able to submit smart contracts

After all the prerequisites are installed, set up the blockchain subproject by running the following:

1. Install blockchain subproject NPM dependencies

```
cd src/blockchain
npm install
```

1. Start a local ethereum network

    node_modules/.bin/ganache-cli -p 7545

  Save the mnemonic phrase for later step.

1. Deploy the contract

    truffle migrate

1. Open the Metamask extension and import the account using the mnemonic phrase from previous step. This gives
   you ETH to spend.

1. After that, go back to the the project root folder and install base NPM dependendencies by running:

```
cd ../..
npm install
```

1. Then, run this command to start the development mode of the project:

```js
npm start
```

1. For publishing run:

```js
npm run build
```

After it finished follow the instructions or publish the project build folder to your preferred  provider or own server.

## TODO
- [ ] recipient (buyer) screens
- [ ] admin view
- [ ] replace Metamask and sign transactions using biometric authentication with [uPort.me](https://www.uport.me/)
- [ ] Add proper permissions/roles and protect data
- [ ] Add error handling, right now only the happy path works (if at all)
- [ ] Refactor/Restructure, there are too many "smart" components - and all smart-components live in one file - this should change
- [ ] Links between pages based on state/roles
- [ ] Implement map views in multiple places
- [ ] add i18n messages where missing
- [ ] remove hardcoded config variables from the app into the environment
- [ ] unify package json files
- [ ] add full test coverage - unit, integration, e2e
- [ ] integration with social media services
- [ ] dockerize the application for easier start/development
- [ ] imoprove the PWA setup
- [ ] add server side rendering/isomorphism
- [ ] optimize gas usage
- [ ] open zeppelin to make the contract more secure
- [ ] ci/cd setup
- [ ] improve design
