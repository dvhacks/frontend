const SaveShip = artifacts.require("./SaveShip.sol");

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

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      meta.enterCourrier(11, { from: accounts[2], value: 42 });
    }).then(function() {
      meta.abort(11);
    }).then(function() {
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is rejected
      assert.equal(shipment[5].valueOf(), 4);
    });
  });

  it("should fulfill", function() {
    var meta;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      meta.newShipment(11, 42);
    }).then(function() {
      meta.enterRecipient(11, { from: accounts[1], value: 42 });
    }).then(function() {
      meta.enterCourrier(11, { from: accounts[2], value: 42 });
    }).then(function() {
      meta.fulfill(11);
    }).then(function() {
      return meta.shipments(11);
    }).then(function(shipment) {
      // state is fulfilled
      assert.equal(shipment[5].valueOf(), 3);
    });
  });
});
