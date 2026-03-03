// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Fractionalizer is ERC20, Ownable {
    IERC721 public immutable nft;
    uint256 public immutable tokenId;
    bool public isDeposited;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        address _nftAddress,
        uint256 _tokenId,
        uint256 _fractions
    ) ERC20(name, symbol) {
        transferOwnership(initialOwner);
        nft = IERC721(_nftAddress);
        tokenId = _tokenId;
        _mint(initialOwner, _fractions);
    }

    function depositNFT() public {
        require(!isDeposited, "NFT already deposited");
        require(nft.ownerOf(tokenId) == msg.sender, "Only NFT owner can deposit");
        nft.transferFrom(msg.sender, address(this), tokenId);
        isDeposited = true;
    }

    function withdrawNFT() public onlyOwner {
        require(isDeposited, "NFT not deposited");
        uint256 totalFractions = totalSupply();
        require(balanceOf(msg.sender) == totalFractions, "You don't own all fractions");
        _burn(msg.sender, totalFractions);
        nft.transferFrom(address(this), msg.sender, tokenId);
        isDeposited = false;
    }
}
