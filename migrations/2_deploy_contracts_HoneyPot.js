const HoneyPot = artifacts.require("HoneyPot");
const HoneyThief = artifacts.require("HoneyThief");


module.exports = function(deployer, network) {
  /*
  deployer.deploy(HoneyPot).then(function() {
    return deployer.deploy(HoneyThief, HoneyPot.address);
  });
  */

 deployer.deploy(HoneyThief);
  
};
