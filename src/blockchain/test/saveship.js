const SaveShip = artifacts.require("./SaveShip.sol");

function assertBalanceEqual(real, expected) {
  // TODO account for spent transaction gas. Currently we only check the last small part of the bignumber.
  assert.equal(real.valueOf().substr(-5, 5), expected.valueOf().substr(-5, 5));
}

contract('SaveShip', function(accounts) {
  it("should create new shipment", function() {
    var meta;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      meta.newShipment(11, 42, { from: accounts[0] });
    }).then(function() {
      return meta.shipments(11);
    }).then(function(shipment) {
      assert.equal(shipment[0], 11);
      assert.equal(shipment[1], accounts[0]);
      assert.equal(shipment[4], 42);
      // state is created
      assert.equal(shipment[5], 0);
    });
  });

  it("should enter recipient to shipment", function() {
    var meta;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is pending
      assert.equal(shipment[2], accounts[1]);
      assert.equal(shipment[5].valueOf(), 1);
    });
  });

  it("should enter courrier to shipment", function() {
    var meta;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      meta.enterCourrier(11, { from: accounts[2], value: 42 });
    }).then(function() {
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is pending
      assert.equal(shipment[1], accounts[0]);
      assert.equal(shipment[2], accounts[1]);
      assert.equal(shipment[3], accounts[2]);
      assert.equal(shipment[5].valueOf(), 2);
    });
  });

  it("should abort", function() {
    var meta;

    var sender = accounts[0];
    var recipient = accounts[1];
    var courrier = accounts[2];

    var senderStartingBalance;
    var recipientStartingBalance;
    var courrierStartingBalance;
    var senderEndingBalance;
    var recipientEndingBalance;
    var courrierEndingBalance;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      senderStartingBalance = web3.eth.getBalance(sender);
      recipientStartingBalance = web3.eth.getBalance(recipient);
      courrierStartingBalance = web3.eth.getBalance(courrier);
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      meta.enterCourrier(11, { from: accounts[2], value: 42 });
    }).then(function() {
      meta.abort(11);
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is rejected
      assert.equal(shipment[5].valueOf(), 4);

      senderEndingBalance = web3.eth.getBalance(sender);
      recipientEndingBalance = web3.eth.getBalance(recipient);
      courrierEndingBalance = web3.eth.getBalance(courrier);

      // check that balances are unchanged
      assertBalanceEqual(senderEndingBalance, senderStartingBalance);
      assertBalanceEqual(recipientEndingBalance, recipientStartingBalance);
      assertBalanceEqual(courrierEndingBalance, courrierStartingBalance);
    });
  });

  it("should fulfill", function() {
    var meta;

    var sender = accounts[0];
    var recipient = accounts[1];
    var courrier = accounts[2];

    var senderStartingBalance;
    var recipientStartingBalance;
    var courrierStartingBalance;
    var senderEndingBalance;
    var recipientEndingBalance;
    var courrierEndingBalance;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      senderStartingBalance = web3.eth.getBalance(sender);
      recipientStartingBalance = web3.eth.getBalance(recipient);
      courrierStartingBalance = web3.eth.getBalance(courrier);
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      meta.enterCourrier(11, { from: accounts[2], value: 42 });
    }).then(function() {
      meta.fulfill(11);
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is fulfilled
      assert.equal(shipment[5].valueOf(), 3);

      senderEndingBalance = web3.eth.getBalance(sender);
      recipientEndingBalance = web3.eth.getBalance(recipient);
      courrierEndingBalance = web3.eth.getBalance(courrier);

      // check that balances updated correctly
      assertBalanceEqual(senderEndingBalance, senderStartingBalance.plus(42));
      assertBalanceEqual(recipientEndingBalance, recipientStartingBalance.minus(42));
      // TODO pay the courrier and also pay us a small fee
      assertBalanceEqual(courrierEndingBalance, courrierStartingBalance);
    });
  });
});
