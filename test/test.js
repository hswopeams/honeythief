const HoneyPot = artifacts.require("HoneyPot");
const HoneyThief = artifacts.require("HoneyThief");
const fs = require('fs');
const chai = require('chai');
const BN = require('bn.js');
const bnChai = require('bn-chai');
chai.use(bnChai(BN));
const assert = chai.assert;
const expect = chai.expect;

contract("Honey Thief Test", async accounts => {
  let five_eth;
  let honeyPot;
  let honeyThief;

  // Runs before all tests in this block.
  before("setting up test data", async () => {
      assert.isAtLeast(accounts.length,4);

      //Set up accounts for parties. In truffel owner = accounts[0].
      [owner,alice,bob, carol] = accounts;
  });

   //Run before each test case
   beforeEach("deploying new instance", async () => {
    five_eth = web3.utils.toWei("5", "ether");

    honeyPot = await HoneyPot.new({ from: carol, value: five_eth});
    honeyThief = await HoneyThief.new(honeyPot.address, { from: owner});

  });

  it('should check that contracts are initiated correctly', async () => {
    const honeyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(honeyPotBalance, five_eth,"honeyThiefBalance initial balance isn't correct");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, "0", "honeyThiefBalance initial balance isn't correct");

  });

  it('should steal ETH from HoneyPot', async () => {
    const startingHoneyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(startingHoneyPotBalance, web3.utils.toWei("5", "ether"),"contract balance isn't 5");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, '0',"contract balance isn't 0");

    /*HoneyThief needs ome ETH*/ 
    const send = await web3.eth.sendTransaction({from: alice, to: honeyThief.address, value: web3.utils.toWei("2", "ether")});

    const newHoneyThiefBalance = await web3.eth.getBalance(honeyThief.address);                         
    assert.strictEqual(newHoneyThiefBalance, web3.utils.toWei("2", "ether"),"newHoneyThiefBalance isn't correct");

    /*Invoke HoneyThief so it puts ETH in HoneyPot*/
    await honeyThief.put({from: alice});

    const honeyThiefBalanceAfterPut = await web3.eth.getBalance(honeyThief.address);                     
    assert.strictEqual(honeyThiefBalanceAfterPut, web3.utils.toWei("1", "ether"),"honeyThiefBalanceAfterPut isn't correct");

    /*Check HoneyThief's balance in HoneyPot contract*/
    const balanceInMapping = await honeyPot.balances(honeyThief.address);
    assert.strictEqual(balanceInMapping.toString(), web3.utils.toWei("1", "ether"),"balanceInMapping isn't correct");

    /*Steal HoneyPot's ETH*/
    await honeyThief.get({from: alice});

    const honeyThiefBalanceAfterGet = await web3.eth.getBalance(honeyThief.address);                            
    assert.strictEqual(honeyThiefBalanceAfterGet, web3.utils.toWei("7", "ether"),"honeyThiefBalanceAfterGet isn't correct");

    const newHoneyPotBalance = await web3.eth.getBalance(honeyPot.address);
    assert.strictEqual(newHoneyPotBalance,"0","contract balance isn't 0");

  });
});// end test contract