// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    address public owner;

    event BatchAnchored(bytes32 indexed root, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can anchor batches");
        _;
    }

    function anchorBatch(bytes32 _merkleRoot) external onlyOwner {
        emit BatchAnchored(_merkleRoot, block.timestamp);
    }
}
