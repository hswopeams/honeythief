//const HoneyPot = artifacts.require("HoneyPot");
const HoneyThief = artifacts.require("HoneyThief");
const fs = require('fs');
const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
chai.use(bnChai(BN));
const assert = chai.assert;
const expect = chai.expect;
const bytecode = fs.readFileSync('./honeypot/HoneyPot.bin');
const abi = JSON.parse(fs.readFileSync('./honeypot/HoneyPot.abi'));

contract("Honey Thief Test", async accounts => {
  let five_eth;
  let one_eth;
  let honeyPot;
  let honeyThief;

  // Runs before all tests in this block.
  before("setting up test data", async () => {
    five_eth = web3.utils.toWei("5", "ether");
    assert.isAtLeast(accounts.length,4);

    //console.log("cwd ", process.cwd());

    //Set up accounts for parties. In truffel owner = accounts[0].
    [owner,alice,bob, carol] = accounts;

    honeyPot = new web3.eth.Contract(abi);
   
    honeyPot.deploy({
      data: bytecode
    }).send({
      from: carol,
      value: five_eth,
      gas: 1000000
    }).then((deployment) => {
      console.log('HonyPot was successfully deployed!');
      console.log('HoneyPot can be interfaced with at this address:');
      //console.log("deployment ", deployment);
      honeyPot.address = deployment.options.address;
    }).catch((err) => {
      console.error(err);
    });
 
  });

   //Run before each test case
   beforeEach("deploying new instance", async () => {
    one_eth = web3.utils.toWei("1", "ether");

    console.log("carol's balance before deploying HoneyPot", await web3.eth.getBalance(carol));

    honeyThief = await HoneyThief.new({ from: owner });

  });

 

  it('should check that contracts are initiated correctly', async () => {
    console.log("honeyThief ", honeyThief.address);
    console.log("honeyPot ", honeyPot.address);

    const honeyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(honeyPotBalance, five_eth,"honeyThiefBalance initial balance isn't correct");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, "0", "honeyThiefBalance initial balance isn't correct");

  });


  it('should steal ETH from HoneyPot', async () => {
    console.log("owner ", owner);
    console.log("honeyThief ", honeyThief.address);
    console.log("honeyPot insecond test case", honeyPot.address);

    const startingHoneyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(startingHoneyPotBalance, web3.utils.toWei("5", "ether"),"contract balance isn't 5");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, '0',"contract balance isn't 0");

    //Invoke HoneyThief so it puts ETH in HoneyPot
    await honeyThief.put(honeyPot.address, {from: owner, value: one_eth});

    //Check HoneyThief's balance in HoneyPot contract
    //const balanceInMapping = await honeyPot.balances(honeyThief.address);
    //const balanceInMapping = await honeyPot.address.methods.balances(honeyThief.address).call();
    //assert.strictEqual(balanceInMapping.toString(), one_eth, "balanceInMapping isn't correct");

    //Steal HoneyPot's ETH
    await honeyThief.get(honeyPot.address, {from: owner});
    
    const honeyThiefBalanceAfterGet = await web3.eth.getBalance(honeyThief.address);                            
    assert.strictEqual(honeyThiefBalanceAfterGet, web3.utils.toWei("6", "ether"),"honeyThiefBalanceAfterGet isn't correct");
   

    const newHoneyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(newHoneyPotBalance,"0","contract balance isn't 0");

  });

 
});// end test contract