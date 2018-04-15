const SaveShip = artifacts.require("./SaveShip.sol");
module.exports = function(deployer) {
    deployer.deploy(SaveShip, {gas: 6700000});
};
