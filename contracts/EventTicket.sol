// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EventTicket
 * @dev A secure, pausable, and burnable ERC1155 contract for event tickets.
 * Allows for multiple tiers of tickets (e.g., General, VIP).
 * - Inherits from ERC1155Burnable to allow token holders to burn their own tickets.
 * - Inherits from Pausable to allow the owner to halt all activity in an emergency.
 */
contract EventTicket is ERC1155, Ownable, Pausable, ERC1155Burnable {
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
     * This function is pausable.
     */
    function checkInTicket(address holder, uint256 id) public onlyOwner whenNotPaused {
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

    /**
     * @dev Pauses all token transfers and check-ins.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers and check-ins.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Hook that is called before any token transfer, including minting and burning.
     * Overridden to prevent all token movements when the contract is paused.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Burnable) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
