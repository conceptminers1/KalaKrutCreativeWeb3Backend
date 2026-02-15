// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./KalaKrutNFT.sol";
import "./EventTicket.sol";
import "./Fractionalizer.sol";
import "./Escrow.sol";
import "./KalaKrutGovernor.sol";
import "./KalaKrutToken.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import "./Treasury.sol";

/**
 * @title ContractFactory
 * @dev A factory for creating instances of all KalaKrut contracts.
 */
contract ContractFactory {
    event NFTCollectionCreated(address indexed owner, address indexed nftAddress);
    event EventTicketCreated(address indexed owner, address indexed ticketAddress);
    event FractionalizerCreated(address indexed owner, address indexed fractionalizerAddress);
    event EscrowCreated(address indexed payer, address indexed payee, address indexed escrowAddress);
    event DAOCreated(address indexed owner, address governor, address timelock, address token, address treasury);

    /**
     * @dev Creates a new NFT collection.
     */
    function createNFTCollection(string memory name, string memory symbol) external {
        KalaKrutNFT newNFT = new KalaKrutNFT(msg.sender, name, symbol);
        emit NFTCollectionCreated(msg.sender, address(newNFT));
    }

    /**
     * @dev Creates a new Event Ticket contract.
     */
    function createEventTicket(string memory uri) external {
        EventTicket newTicket = new EventTicket(msg.sender, uri);
        emit EventTicketCreated(msg.sender, address(newTicket));
    }

    /**
     * @dev Creates a new Fractionalizer contract.
     * The caller must have approved the factory to take the NFT.
     */
    function createFractionalizer(
        string memory name,
        string memory symbol,
        address nftAddress,
        uint256 nftId,
        uint256 totalSupply
    ) external {
        Fractionalizer newFractionalizer = new Fractionalizer(msg.sender, name, symbol, nftAddress, nftId, totalSupply);
        emit FractionalizerCreated(msg.sender, address(newFractionalizer));
    }

    /**
     * @dev Creates a new Escrow contract.
     */
    function createEscrow(address payee) external {
        Escrow newEscrow = new Escrow(msg.sender, payee, msg.sender);
        emit EscrowCreated(msg.sender, payee, address(newEscrow));
    }

    /**
     * @dev Creates a new DAO, including the Governor, Timelock, Token, and Treasury.
     */
    function createDAO(uint256 minTimelockDelay) external {
        // 1. Create the Token
        KalaKrutToken token = new KalaKrutToken(msg.sender);

        // 2. Create the Timelock
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        // Initially, anyone can execute, but this can be restricted.
        executors[0] = address(0);
        TimelockController timelock = new TimelockController(minTimelockDelay, proposers, executors, msg.sender);

        // 3. Create the Governor
        KalaKrutGovernor governor = new KalaKrutGovernor(token, timelock);

        // 4. Create the Treasury
        Treasury treasury = new Treasury(address(governor));

        // 5. Set up roles
        // The governor is the only one who can propose to the timelock.
        proposers[0] = address(governor);
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        // The governor is also the only one who can cancel proposals.
        timelock.grantRole(timelock.CANCELLER_ROLE(), address(governor));

        // 6. Revoke the deployer's admin role on the timelock.
        // The timelock is now only controlled by the governor.
        timelock.renounceRole(timelock.DEFAULT_ADMIN_ROLE(), msg.sender);

        emit DAOCreated(msg.sender, address(governor), address(timelock), address(token), address(treasury));
    }
}
