// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Fractionalizer
 * @dev This contract locks an NFT and mints ERC20 tokens representing
 *      fractional ownership of that NFT. It is pausable and allows burning of fractional shares.
 */
contract Fractionalizer is ERC20, Ownable, Pausable, ReentrancyGuard, ERC20Burnable {
    IERC721 public nft;
    uint256 public nftId;

    constructor(
        address initialOwner,
        string memory name,      // Name for the fractional tokens
        string memory symbol,    // Symbol for the fractional tokens
        address _nftAddress,    // Address of the NFT contract
        uint256 _nftId,         // ID of the NFT to fractionalize
        uint256 _totalSupply    // Total number of fractional shares to create
    ) ERC20(name, symbol) Ownable(initialOwner) {
        nft = IERC721(_nftAddress);
        nftId = _nftId;
        _mint(initialOwner, _totalSupply);

        // The user must first approve this contract to take their NFT
        nft.transferFrom(initialOwner, address(this), _nftId);
    }

    /**
     * @dev Allows a user who collects all fractional tokens to redeem the underlying NFT.
     * This function is protected against re-entrancy and can be paused.
     */
    function redeem() public nonReentrant whenNotPaused {
        // Require the user to own the total supply of fractional tokens
        require(balanceOf(msg.sender) == totalSupply(), "You must own all fractional shares to redeem the NFT");

        // Burn all the fractional tokens held by the sender
        _burn(msg.sender, totalSupply());

        // Transfer the NFT from this contract back to the user
        nft.transferFrom(address(this), msg.sender, nftId);
    }

    /**
     * @dev Pauses all token transfers and the redeem function.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers and the redeem function.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Hook that is called before any token transfer, including minting and burning.
     * Overridden to prevent all token movements when the contract is paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Burnable) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
