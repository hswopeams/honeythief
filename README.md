# Honeythief
#### This was an exrcise that was part of B9lab Academy Ethereum Developer course. The objective was to steal the ETH from [B9lab's HoneyPot](https://ropsten.etherscan.io/address/0x7164292C87269749bc867AEb9159aCA0F296C1dE)
#### The exercise was designed to teach students about re-entrancy by letting them exploit vulnerable code.
#### My HoneyThief is deployed on [Ropsten](https://ropsten.etherscan.io/address/0x2bdf4b569a3f878f26a648499f1403966ef3f446)
#### I successfully attacked the HoneyPot using HoneyThief's `attack` function. I sent 1 ETH but got all 5 from HoneyPot's balance. The transaction can be found on [Etherscan](https://ropsten.etherscan.io/tx/0x05257865282a185bc58317c4e7bfabf42be35cb0c78c22e68c793bac99545d88).
#### I then transferred the stolen funds to my own account using the `transferFunds` function.
#### I then put the funds back in the HoneyPot using its `put` function so that other students could do the exercise too.
#### I first tested against the built-in ganache instance that truffle develop mode spins up. For these tests I used the .abi and .bin files in the honeypot directory
#### The tests in the test-ropsten folder were used to test locally against the HoneyPot deployed on Ropsten using a local ganache fork of Ropsten so I could test against Ropsten before actually deploying to Ropsten. I used the following command to fork:

```
ganache-cli --fork https://ropsten.infura.io/v3/<Infura ID> [--verbose]

```
