
const HoneyThief = artifacts.require("HoneyThief");
const fs = require('fs');
const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
chai.use(bnChai(BN));
const assert = chai.assert;
const expect = chai.expect;
const truffleAssert = require('truffle-assertions');
const bytecode = fs.readFileSync('./honeypot/HoneyPot.bin');
const abi = JSON.parse(fs.readFileSync('./honeypot/HoneyPot.abi'));

contract("Honey Thief Error Test", async accounts => {
  const ONE_ETH = web3.utils.toWei("1", "ether");;
  const FIVE_ETH  = web3.utils.toWei("5", "ether");
  const SIX_ETH = web3.utils.toWei("6", "ether");
  let honeyPot;
  let honeyThief;
  let owner,alice;

  // Runs before all tests in this block.
  before("setting up test data", async () => {
    assert.isAtLeast(accounts.length,4);

    //Set up accounts for parties. In truffel owner = accounts[0].
    [owner,alice,bob] = accounts;

  });

   //Run before each test case
   beforeEach("deploying new instance", async () => {
    honeyThief = await HoneyThief.new({ from: owner });

    //instantiate and deploy HoneyPot using ABI and bytecode
    honeyPot = new web3.eth.Contract(abi);

    honeyPot = await honeyPot.deploy({
      data: bytecode
    }).send({
      from: alice,
      value: FIVE_ETH,
      gas: 1000000
    });

  });



  it('should only allow certain funcitons function to be called by owner', async () => {
    await truffleAssert.reverts(
        honeyThief.attack(honeyPot.options.address, {from: bob}),
        "Ownable: caller is not the owner"
    ); 

    await truffleAssert.reverts(
        honeyThief.transferFunds({from: bob}),
        "Ownable: caller is not the owner"
    ); 
  });

 
});// end test contract