# honeythief
#### Part of B9Lab course. Objective is to steal the ETH from [B9Lab's HoneyPot](https://ropsten.etherscan.io/address/0x7164292C87269749bc867AEb9159aCA0F296C1dE)
#### An earlier version of HoneyThief is deployed on [Ropsten](https://ropsten.etherscan.io/address/0xe57ec0794de003ae3c71e36bb9f5ac394407744b)
#### Updates
1. Added transferFunds so owner can get the funds out of the HoneyThief into her own account
2. Changed the way calls are made to HoneyPot from HoneyThief
3. HoneyPot is now instantiated using web3 with the ABI and bytecode in the test files instead of including HoneyPot.sol in the project
4. Changed the way HoneyPot address is passed to put() function so that HoneyPot can instantiated more easily
5. Removed get() funciton. HoneyPot.get() is now called directly from the put() function.
6. Added test-ropsten folder so that test cases can be run from forked ganache-cli using ganache-cli --fork https://ropsten.infura.io/v3/<<project_id>>. The Ropsten test cases are in a separate file so that they don't get run by the `truffle test` command. Instead it has to be run explicitly using `truffle test test-ropsten/test-ropsten.js`
