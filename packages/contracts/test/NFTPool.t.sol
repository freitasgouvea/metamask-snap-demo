// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {NFTPool} from "../src/NFTPool.sol";
import {ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract NFTPoolTest is Test {
  NFT public nft;
  NFTPool public nftPool;

  address public owner = address(1);
  address public user = address(2);

  function setUp() public {
    vm.startPrank(owner);

    // deploy NFT and mint NFT to user
    nft = new NFT("NFT", "NFT");
    nft.mint(user, 1);

    // deploy and initialize NFT pool
    nftPool = new NFTPool();
    nftPool.initialize(address(nft));

    vm.stopPrank();

    // approve NFT pool spend user NFT
    vm.prank(user);
    nft.approve(address(nftPool), 1);
  }

  function testDeposit() public {
    // deposit NFT to NFT pool
    vm.prank(user);
    nftPool.depositNFT(1);

    // check NFT pool balance
    assertEq(nft.balanceOf(address(nftPool)), 1);
    assertEq(nft.balanceOf(user), 0);
    assertEq(nft.ownerOf(1), address(nftPool));
    assertEq(nftPool.NFTBalances(user), 1);
  }

  function testWithdraw() public {
    // deposit NFT to NFT pool
    vm.prank(user);
    nftPool.depositNFT(1);

    // withdraw NFT from NFT pool
    vm.prank(user);
    nftPool.withdrawNFT(1);

    // check NFT pool balance
    assertEq(nft.balanceOf(address(nftPool)), 0);
    assertEq(nft.balanceOf(user), 1);
    assertEq(nft.ownerOf(1), user);
    assertEq(nftPool.NFTBalances(user), 0);
  }
}
