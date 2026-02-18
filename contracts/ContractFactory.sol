
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Base contract
import "@openzeppelin/contracts/access/AccessControl.sol";

// Import all 8 contracts to be created by the factory
import "./KalaKrutToken.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "./KalaKrutGovernor.sol";
import "./Treasury.sol";
import "./KalaKrutNFT.sol";
import "./EventTicket.sol";
import "./Fractionalizer.sol";
import "./Escrow.sol";

// Interfaces needed for casting
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract ContractFactory is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    event ContractCreated(
        address indexed contractAddress,
        address indexed creator,
        string contractType,
        uint256 timestamp
    );

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, initialAdmin);
        _grantRole(CREATOR_ROLE, msg.sender);
    }

    // 1. Create KalaKrutToken
    function createKalaKrutToken() public onlyRole(CREATOR_ROLE) returns (address) {
        KalaKrutToken newToken = new KalaKrutToken(msg.sender);
        emit ContractCreated(address(newToken), msg.sender, "KalaKrutToken", block.timestamp);
        return address(newToken);
    }

    // 2. Create TimelockController
    function createTimelockController(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        TimelockController newTimelock = new TimelockController(minDelay, proposers, executors, msg.sender);
        emit ContractCreated(address(newTimelock), msg.sender, "TimelockController", block.timestamp);
        return address(newTimelock);
    }

    // 3. Create KalaKrutGovernor
    function createGovernor(
        address _token,
        // CORRECTED: Changed address to address payable
        address payable _timelock 
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        // Cast addresses to the required contract types
        KalaKrutGovernor newGovernor = new KalaKrutGovernor(IVotes(_token), TimelockController(_timelock));
        emit ContractCreated(address(newGovernor), msg.sender, "KalaKrutGovernor", block.timestamp);
        return address(newGovernor);
    }

    // 4. Create Treasury
    function createTreasury() public onlyRole(CREATOR_ROLE) returns (address) {
        Treasury newTreasury = new Treasury(payable(msg.sender));
        emit ContractCreated(address(newTreasury), msg.sender, "Treasury", block.timestamp);
        return address(newTreasury);
    }

    // 5. Create KalaKrutNFT
    function createKalaKrutNFT(
        string memory _name,
        string memory _symbol
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        KalaKrutNFT newNFT = new KalaKrutNFT(msg.sender, _name, _symbol);
        emit ContractCreated(address(newNFT), msg.sender, "KalaKrutNFT", block.timestamp);
        return address(newNFT);
    }

    // 6. Create EventTicket
    function createEventTicket(
        string memory _uri
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        EventTicket newTicket = new EventTicket(msg.sender, _uri);
        emit ContractCreated(address(newTicket), msg.sender, "EventTicket", block.timestamp);
        return address(newTicket);
    }

    // 7. Create Fractionalizer
    function createFractionalizer(
        string memory name,
        string memory symbol,
        address _nftAddress,
        uint256 _nftId,
        uint256 _totalSupply
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        Fractionalizer newFractionalizer = new Fractionalizer(
            msg.sender, // initialOwner of the shares
            name,
            symbol,
            _nftAddress,
            _nftId,
            _totalSupply
        );
        emit ContractCreated(address(newFractionalizer), msg.sender, "Fractionalizer", block.timestamp);
        return address(newFractionalizer);
    }

    // 8. Create Escrow
    function createEscrow(
        address payable _beneficiary,
        address _arbiter
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        Escrow newEscrow = new Escrow(payable(msg.sender), _beneficiary, _arbiter);
        emit ContractCreated(address(newEscrow), msg.sender, "Escrow", block.timestamp);
        return address(newEscrow);
    }
}
