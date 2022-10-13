// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Lottery {
    // public keyword creates a message 'getter'
    address public manager;
    address[] public players;
     

    // 'msg' object includes .data, .gas, .sender, .value
    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        // require is a validation ie. if falsy function exits
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {

        // get sudo random index of players array
        uint index = random() % players.length;

        // get address object explicitly change type to 'account payable' and call method .transfer()
        // 'this' is reference to current contract
        payable(players[index]).transfer(address(this).balance);

        // reset players array
        players = new address[](0);
    }

    // function modifier
    modifier restricted() {
        // enforces security that ONLY the manager can call pick winner
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }
}