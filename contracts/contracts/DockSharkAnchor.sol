// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title DockSharkAnchor
 * @dev This contract anchors Merkle roots of batched documents to the Ethereum/Polygon blockchain.
 * It is owned by the DockShark backend service which pushes the roots.
 */
contract DockSharkAnchor is Ownable2Step, Pausable {
    // Emitted when a new Merkle root is anchored
    event RootAnchored(bytes32 indexed root, uint256 timestamp);

    // Custom errors for gas optimization
    error InvalidRoot();
    error RootAlreadyAnchored(bytes32 root);

    // Track existing roots to prevent duplicates
    mapping(bytes32 => bool) public anchoredRoots;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Pauses the contract. In case of backend compromise.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Anchors a new Merkle root. Only callable by the owner (backend) when not paused.
     * @param _root The 32-byte Merkle root.
     */
    function anchorRoot(bytes32 _root) public onlyOwner whenNotPaused {
        if (_root == bytes32(0)) revert InvalidRoot();
        if (anchoredRoots[_root]) revert RootAlreadyAnchored(_root);
        
        anchoredRoots[_root] = true;
        emit RootAnchored(_root, block.timestamp);
    }

    /**
     * @dev Anchors multiple Merkle roots in a single transaction.
     * @param _roots Array of 32-byte Merkle roots.
     */
    function anchorRootsBatch(bytes32[] calldata _roots) external onlyOwner whenNotPaused {
        for (uint256 i = 0; i < _roots.length; i++) {
            anchorRoot(_roots[i]);
        }
    }

    /**
     * @dev Checks if a specific root has been anchored.
     * @param _root The 32-byte Merkle root to check.
     */
    function isAnchored(bytes32 _root) external view returns (bool) {
        return anchoredRoots[_root];
    }
}
