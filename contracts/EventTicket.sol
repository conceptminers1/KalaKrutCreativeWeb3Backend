// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EventTicket
 * @dev An ERC1155 contract for creating and managing event tickets.
 * Allows for multiple tiers of tickets (e.g., General, VIP).
 */
contract EventTicket is ERC1155, Ownable {
    // A mapping from ticket tier ID to the total supply of that tier
    mapping(uint256 => uint256) public tierSupply;

    // A mapping to track which tickets have been checked in
    mapping(uint256 => mapping(address => bool)) public checkedIn;

    constructor(
        address initialOwner,
        string memory uri
    ) ERC1155(uri) Ownable(initialOwner) {}

    /**
     * @dev Sets the URI for the token metadata. The URI should point to a
     * JSON file that contains metadata for each ticket tier.
     * See EIP-1155 for the expected metadata structure.
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev Mints a specified amount of tickets for a given tier (id).
     * Only the owner (the event organizer) can mint new tickets.
     */
    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
        tierSupply[id] += amount;
    }

    /**
     * @dev Allows a venue to check in a ticket for a specific holder.
     * This prevents the same ticket from being used multiple times.
     * For simplicity, only the contract owner can check in tickets.
     * In a real-world scenario, you might have a separate "checker" role.
     */
    function checkInTicket(address holder, uint256 id) public onlyOwner {
        require(balanceOf(holder, id) > 0, "Holder does not own this ticket");
        require(!checkedIn[id][holder], "Ticket already checked in");
        checkedIn[id][holder] = true;
    }

    /**
     * @dev Allows an admin to airdrop multiple ticket types at once.
     * Useful for promotions or distributing to sponsors.
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
        for (uint i = 0; i < ids.length; ++i) {
            tierSupply[ids[i]] += amounts[i];
        }
    }
}
