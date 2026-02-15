// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KalaKrutNFT
 * @dev A standard ERC721 contract for minting unique digital assets.
 * This serves as the master template for artist-created NFTs.
 */
contract KalaKrutNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(initialOwner) {}

    /**
     * @dev Mints a new NFT and assigns it to the recipient.
     * The token URI (metadata) must be provided.
     * Only the owner (the artist) can mint new tokens.
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}
