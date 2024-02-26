/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Pausable} from "../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";

/**
* @title NFTPool contract
* @notice This contract simulates a pool of NFTs for borrowing and lending
* @dev This contract is not fully implemented and is for demonstration purposes only
*/
contract NFTPool is Ownable, Pausable, ReentrancyGuard {
  address public nft;
  bool public initialized;

  mapping(address => uint256) public NFTBalances;

  event Deposit(address token, address indexed from, uint256 tokenId);
  event Withdraw(address token, address indexed to, uint256 tokenId);

  /**
  * @notice Create a new pool
  * @dev The pool is paused by default
  * @dev The owner of the pool is the deployer
  */
  constructor() Ownable(msg.sender) {
    _pause();
  }

  /**
  * @notice Initialize the pool
  * @dev This function can only be called once
  * @param _nftAddress The address of the NFT to deposit
  */
  function initialize(address _nftAddress) public onlyOwner {
    require(!initialized, "NFTPool: already initialized");
    require(_nftAddress != address(0), "NFTPool: nft address cannot be zero");

    nft = _nftAddress;
    _unpause();
    initialized = true;
  }


  /**
   * @notice Deposit NFTs to be borrowed into the pool
   * @dev This function can only be called when the pool is not paused
   * @param _tokenId The ID of the NFT to deposit
   */
  function depositNFT(uint256 _tokenId) public whenNotPaused nonReentrant {
    require(IERC721(nft).ownerOf(_tokenId) == msg.sender, "NFTPool: sender must be the owner of the NFT");
    require(IERC721(nft).getApproved(_tokenId) == address(this), "NFTPool: contract must be approved to transfer the NFT");

    IERC721(nft).transferFrom(msg.sender, address(this), _tokenId);
    NFTBalances[msg.sender] = NFTBalances[msg.sender] + 1;

    emit Deposit(nft, msg.sender, _tokenId);
  }


  /**
   * @notice Withdraw NFTs from the pool
   * @dev This function can only be called when the pool is not paused
   * @param _tokenId The ID of the NFT to withdraw
   */
  function withdrawNFT(uint _tokenId) public whenNotPaused nonReentrant {
    require(NFTBalances[msg.sender] != 0, "NFTPool: sender must have a NFT deposited");
    require(IERC721(nft).ownerOf(_tokenId) == address(this), "NFTPool: contract must be the owner of the NFT");

    IERC721(nft).transferFrom(address(this), msg.sender, NFTBalances[msg.sender]);
    NFTBalances[msg.sender] = NFTBalances[msg.sender] - 1;

    emit Withdraw(nft, msg.sender, _tokenId);
  }
}
