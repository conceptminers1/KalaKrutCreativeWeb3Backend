// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Treasury
 * @dev A simple treasury contract for a DAO. Holds funds and only allows
 * the designated owner (the Governor contract) to withdraw them.
 */
contract Treasury {
    address payable public owner;

    event FundsDeposited(address from, uint256 amount);
    event FundsWithdrawn(address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address payable _owner) {
        owner = _owner;
    }

    /**
     * @dev Receive Ether.
     */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Allows the owner (Governor) to withdraw funds to a specific address.
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed.");
        emit FundsWithdrawn(to, amount);
    }
}
