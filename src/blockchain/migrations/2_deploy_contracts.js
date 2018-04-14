var Voting = artifacts.require("./Voting.sol");
var SaveShip = artifacts.require("./SaveShip.sol");
module.exports = function(deployer) {
    deployer.deploy(Voting, ['Rama', 'Nick', 'Jose'], {gas: 6700000});
    deployer.deploy(SaveShip, 42, {gas: 6700000});
};
