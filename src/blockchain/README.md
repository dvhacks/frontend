# Blockchain contract

Solidity contract containing a list of shipments, each connecting package sender, recipient and a courrier.

## Prerequisites

1. Truffle framework installed, [here's how](http://truffleframework.com/docs/getting_started/installation)
1. Install the [Metamask browser extension](https://metamask.io/)

## Usage

1. Run

    npm install

1. Start a local blockchain network

    node_modules/.bin/ganache-cli -p 7545

1. Deploy the contract

    truffle migrate

1. Run the webapp

    npm start

## Tests

    truffle test

