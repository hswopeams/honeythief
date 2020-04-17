
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
    [owner,alice] = accounts;

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
      value: FIVE_ETH ,
      gas: 1000000
    });

  });

 
  it('should check that contracts are initiated correctly', async () => {
    const honeyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(honeyPotBalance, FIVE_ETH ,"honeyPotBalance initial balance isn't correct");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, "0", "honeyThiefBalance initial balance isn't correct");

  });
  
  it('should steal ETH from HoneyPot', async () => {
    const startingHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(startingHoneyPotBalance, FIVE_ETH ,"contract balance isn't 5");

    const honeyThiefBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefBalance, '0',"contract balance isn't 0");

    //Attack
    await honeyThief.attack(honeyPot.options.address, {from: owner, value: ONE_ETH});

    const honeyThiefBalanceAfterGet = await web3.eth.getBalance(honeyThief.address);                            
    assert.strictEqual(honeyThiefBalanceAfterGet, SIX_ETH,"honeyThiefBalanceAfterGet isn't correct");
   
    const endingHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(endingHoneyPotBalance,"0","contract balance isn't 0");

  });

  it('should allow owner to transfer funds to self', async () => {
    const startingHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(startingHoneyPotBalance, FIVE_ETH ,"contract balance isn't 5");
   
    //Attack
    const txObj = await honeyThief.attack(honeyPot.options.address, {from: owner, value: ONE_ETH});

    const honeyThiefBalanceAfterGet = await web3.eth.getBalance(honeyThief.address);                            
    assert.strictEqual(honeyThiefBalanceAfterGet, SIX_ETH,"honeyThiefBalanceAfterGet isn't correct");
   
    const newHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(newHoneyPotBalance,"0","contract balance isn't 0");

    const ownerBalanceAfterGet = await web3.eth.getBalance(owner);

    //trasnfer funds to self
    const txObj3 = await honeyThief.transferFunds({from: owner});
    const transferGasPrice = (await web3.eth.getTransaction(txObj3.tx)).gasPrice;
    const transferTxPrice = transferGasPrice * txObj3.receipt.gasUsed;

    const expectedOwnerBalance = new BN(ownerBalanceAfterGet).sub(new BN(transferTxPrice)).add(new BN(honeyThiefBalanceAfterGet));

    const newOwnerBalance = await web3.eth.getBalance(owner);

    expect(new BN(newOwnerBalance)).to.eq.BN(expectedOwnerBalance);
    

  });

  it('should steal smaller increments from HoneyPot', async () => {
    const startingHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(startingHoneyPotBalance, FIVE_ETH ,"contract balance isn't 5");

    const honeyThiefStartingBalance = await web3.eth.getBalance(honeyThief.address);
    assert.strictEqual(honeyThiefStartingBalance, '0',"contract balance isn't 0");

    //Attack
    const txObj = await honeyThief.attack(honeyPot.options.address, {from: owner, value: 10000000000000000});

    let honeyThiefBalanceAfterGet = await web3.eth.getBalance(honeyThief.address);  

    while (new BN(honeyThiefBalanceAfterGet) < 5010000000000000000){
      await honeyThief.attack(honeyPot.options.address, {from: owner, value: 10000000000000000});
      honeyThiefBalanceAfterGet  = await web3.eth.getBalance(honeyThief.address);      
    }

    const honeyThiefBalanceAfterLoop  = await web3.eth.getBalance(honeyThief.address);    
    assert.strictEqual(honeyThiefBalanceAfterLoop, "5070000000000000000","honeyThiefBalanceAfterLoop isn't correct");
   
    const newHoneyPotBalance = await web3.eth.getBalance(honeyPot.options.address);
    assert.strictEqual(newHoneyPotBalance,"0","contract balance isn't 0");

  });

});// end test contract