
const HoneyThief = artifacts.require("HoneyThief");


module.exports = function(deployer, network) {
  deployer.deploy(HoneyThief);
};
