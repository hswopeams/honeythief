# Honeythief
#### This was an exrcise that was part of B9lab Academy Ethereum Developer course. The objective was to steal the ETH from [B9lab's HoneyPot](https://ropsten.etherscan.io/address/0x7164292C87269749bc867AEb9159aCA0F296C1dE)
#### The exercise was designed to teach students about re-entrancy by letting them exploit vulnerable code.
#### HoneyThief is deployed on [Ropsten](https://ropsten.etherscan.io/address/0x2bdf4b569a3f878f26a648499f1403966ef3f446)
#### I successfully attacked the HoneyPot using the `attack` function. I then transferred the stolen funds to my own account using the `transferFunds` function.
#### I then put the funds back in the HoneyPot using its `put` function so that other students could do the exercise too.
#### I first tested against the built-in ganache instance that truffle develop mode spins up. The tests in the test-ropsten folder were used to test locally against the HoneyPot deployed on Ropsten using a local ganache fork of Ropsten:

```
ganache-cli --fork https://ropsten.infura.io/v3/<Infura ID> [--verbose]

```