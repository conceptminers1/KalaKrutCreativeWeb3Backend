// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract EventTicket is ERC1155, Ownable, ERC1155Pausable, ERC1155Burnable {
    mapping(uint256 => uint256) public tierSupply;
    mapping(uint256 => mapping(address => bool)) public checkedIn;

    constructor(
        address initialOwner,
        string memory uri
    ) ERC1155(uri) {
        transferOwnership(initialOwner);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
        tierSupply[id] += amount;
    }

    function checkInTicket(address holder, uint256 id) public onlyOwner {
        require(balanceOf(holder, id) > 0, "Holder does not own this ticket");
        require(!checkedIn[id][holder], "Ticket already checked in");
        checkedIn[id][holder] = true;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
        for (uint i = 0; i < ids.length; ++i) {
            tierSupply[ids[i]] += amounts[i];
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // --- OVERRIDES ---

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
