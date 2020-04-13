# honeythief
#### Part of B9Lab course. Objective is to steal the ETH from [B9Lab's HoneyPot](https://ropsten.etherscan.io/address/0x7164292C87269749bc867AEb9159aCA0F296C1dE)
#### HoneyThief is deployed on [Ropsten](https://ropsten.etherscan.io/address/0xe57ec0794de003ae3c71e36bb9f5ac394407744b)
#### This repository includes HoneyPot.sol, but only so that HoneyThief.sol could be tested locally using truffle.
#### Updates
1. Added transferFunds so owner can get the funds out of the HoneyThief into her own account
2. Changed the way calls are made to HoneyPot from HoneyThief
3. HoneyPot is now instantiated using web3 with the ABI and bytecode in the test files instead of including HoneyPot.sol in the project
