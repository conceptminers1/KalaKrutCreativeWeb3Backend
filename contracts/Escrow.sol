// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @dev A simple escrow contract to hold funds for a project between two parties.
 * The payer deposits funds, and the payee can withdraw them only when the payer releases them.
 */
contract Escrow is Ownable, ReentrancyGuard {
    address public payer;
    address public payee;
    uint256 public amount;

    enum State { AwaitingPayment, AwaitingRelease, Complete, Cancelled }
    State public currentState;

    event Deposited(uint256 amount);
    event Released(uint256 amount);
    event Cancelled();

    modifier onlyPayer() {
        require(msg.sender == payer, "Only the payer can call this function");
        _;
    }

    constructor(
        address _payer,
        address _payee,
        address _initialOwner
    ) Ownable(_initialOwner) {
        payer = _payer;
        payee = _payee;
        currentState = State.AwaitingPayment;
    }

    /**
     * @dev Payer deposits funds into the escrow.
     * This can only be done once.
     */
    function deposit() public payable onlyPayer {
        require(currentState == State.AwaitingPayment, "Deposit already made");
        amount = msg.value;
        currentState = State.AwaitingRelease;
        emit Deposited(amount);
    }

    /**
     * @dev Payer releases the funds to the payee.
     */
    function release() public onlyPayer nonReentrant {
        require(currentState == State.AwaitingRelease, "Cannot release funds in current state");
        currentState = State.Complete;
        (bool success, ) = payee.call{value: amount}("");
        require(success, "Transfer failed.");
        emit Released(amount);
    }

    /**
     * @dev If the work is not completed, the payer can cancel the escrow
     * and get their funds back.
     * For this simple contract, we assume cancellation can only happen
     * before the funds are released.
     */
    function cancel() public onlyPayer nonReentrant {
        require(currentState == State.AwaitingRelease, "Cannot cancel in current state");
        currentState = State.Cancelled;
        (bool success, ) = payer.call{value: amount}("");
        require(success, "Refund failed.");
        emit Cancelled();
    }
}
