// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title KalaKrutNFT
 * @dev A secure, pausable, and burnable ERC721 contract for minting unique digital assets.
 * This serves as the master template for artist-created NFTs.
 * - Inherits from ERC721Burnable to allow token holders to burn their own tokens.
 * - Inherits from Pausable to allow the owner to halt minting in an emergency.
 */
contract KalaKrutNFT is ERC721URIStorage, Ownable, Pausable, ERC721Burnable {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(initialOwner) {}

    /**
     * @dev Mints a new NFT and assigns it to the recipient.
     * The token URI (metadata) must be provided.
     * Can only be called by the contract owner, and only when the contract is not paused.
     */
    function safeMint(address to, string memory uri) public onlyOwner whenNotPaused {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Pauses the minting of new tokens. Can only be called by the owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the minting of new tokens. Can only be called by the owner.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Overrides the default OpenZeppelin behavior to ensure that token transfers
     * are also paused when the contract is paused. This prevents assets from moving
     * during an emergency freeze.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) whenNotPaused returns (address) {
        return super._update(to, tokenId, auth);
    }
}
