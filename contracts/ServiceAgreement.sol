// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ServiceAgreement
 * @dev A contract to manage a service agreement between a provider and a client.
 * The client funds the contract with ETH, and the funds are released to the
 * provider upon completion of the service, as confirmed by the client.
 * An arbiter is assigned to resolve disputes.
 */
contract ServiceAgreement is ReentrancyGuard {
    address public provider; // The address of the service provider
    address public client;   // The address of the client
    address public arbiter;  // The address of the arbiter for dispute resolution

    uint256 public paymentAmount; // The agreed payment amount in wei
    string public terms;          // The terms of the service agreement

    enum State { Created, Funded, Completed, Cancelled, InDispute }
    State public currentState;

    event AgreementFunded(uint256 amount);
    event AgreementCompleted(address indexed provider, uint256 amount);
    event AgreementCancelled();
    event DisputeRaised(address indexed by);
    event DisputeResolved(address indexed by, bool releasePayment);

    modifier onlyClient() {
        require(msg.sender == client, "Only the client can perform this action");
        _;
    }

    modifier onlyProvider() {
        require(msg.sender == provider, "Only the provider can perform this action");
        _;
    }
    
    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only the arbiter can perform this action");
        _;
    }

    /**
     * @param _provider The address of the service provider.
     * @param _client The address of the client.
     * @param _arbiter The address of the arbiter.
     * @param _terms A string describing the terms of the agreement.
     */
    constructor(address _provider, address _client, address _arbiter, string memory _terms) payable {
        provider = _provider;
        client = _client;
        arbiter = _arbiter;
        terms = _terms;
        paymentAmount = msg.value;
        currentState = State.Created;

        if (paymentAmount > 0) {
            currentState = State.Funded;
            emit AgreementFunded(paymentAmount);
        }
    }

    /**
     * @dev Allows the client to fund the contract if it wasn't funded at creation.
     */
    function fundAgreement() external payable onlyClient nonReentrant {
        require(currentState == State.Created, "Agreement is already funded or has progressed");
        require(msg.value > 0, "Must send ETH to fund");
        
        paymentAmount = msg.value;
        currentState = State.Funded;
        emit AgreementFunded(paymentAmount);
    }

    /**
     * @dev Allows the client to confirm the completion of the service.
     * This releases the funds to the provider.
     */
    function confirmCompletion() external onlyClient nonReentrant {
        require(currentState == State.Funded, "Agreement not in a fundable state");
        currentState = State.Completed;
        
        (bool success, ) = provider.call{value: paymentAmount}("");
        require(success, "Failed to send payment to provider");
        
        emit AgreementCompleted(provider, paymentAmount);
    }

    /**
     * @dev Allows either party to cancel the agreement before completion.
     * Funds are returned to the client.
     */
    function cancelAgreement() external nonReentrant {
        require(msg.sender == client || msg.sender == provider, "Only parties can cancel");
        require(currentState == State.Created || currentState == State.Funded, "Cannot cancel a completed or disputed agreement");
        
        currentState = State.Cancelled;
        
        if (address(this).balance > 0) {
            (bool success, ) = client.call{value: address(this).balance}("");
            require(success, "Failed to return funds to client");
        }
        
        emit AgreementCancelled();
    }

    /**
     * @dev Allows either party to raise a dispute, locking the funds.
     * The arbiter must then resolve the dispute.
     */
    function raiseDispute() external {
        require(msg.sender == client || msg.sender == provider, "Only parties can raise a dispute");
        require(currentState == State.Funded, "Can only raise a dispute when funded");
        
        currentState = State.InDispute;
        emit DisputeRaised(msg.sender);
    }

    /**
     * @dev Allows the arbiter to resolve a dispute.
     * @param releasePayment If true, funds go to the provider. If false, to the client.
     */
    function resolveDispute(bool releasePayment) external onlyArbiter nonReentrant {
        require(currentState == State.InDispute, "No dispute to resolve");
        
        if (releasePayment) {
            currentState = State.Completed;
            (bool success, ) = provider.call{value: address(this).balance}("");
            require(success, "Failed to send payment to provider");
            emit AgreementCompleted(provider, address(this).balance);
        } else {
            currentState = State.Cancelled;
            (bool success, ) = client.call{value: address(this).balance}("");
            require(success, "Failed to return funds to client");
            emit AgreementCancelled();
        }

        emit DisputeResolved(msg.sender, releasePayment);
    }

    /**
     * @dev A fallback function to receive ETH.
     */
    receive() external payable {}
}
