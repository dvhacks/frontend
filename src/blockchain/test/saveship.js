const SaveShip = artifacts.require("./SaveShip.sol");

contract('SaveShip', function(accounts) {
  it("should set and return ID for new shipment", function() {
    var meta;

    return SaveShip.deployed().then(function(instance) {
      meta = instance;
      return meta.newShipment.call(11, 42);
    }).then(function(id) {
      // console.log(shipment);
      assert.equal(id, 11, "ID was not 11");
    });
  });
});
