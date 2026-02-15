// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Fractionalizer
 * @dev This contract locks an NFT and mints ERC20 tokens representing
 *      fractional ownership of that NFT.
 */
contract Fractionalizer is ERC20, Ownable, ReentrancyGuard {
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
     * @dev "Redeem". In the future, a mechanism could be added to allow a user
     * who collects all the fractional tokens to redeem them for the underlying NFT.
     * This is a complex process involving buyouts and is kept simple for now.
     */
    function redeem() public nonReentrant {
        // Require the user to own the total supply of fractional tokens
        require(balanceOf(msg.sender) == totalSupply(), "You must own all fractional shares to redeem the NFT");

        // Burn all the fractional tokens
        _burn(msg.sender, totalSupply());

        // Transfer the NFT to the user
        nft.transferFrom(address(this), msg.sender, nftId);
    }
}
