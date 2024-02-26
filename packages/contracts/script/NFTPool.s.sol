// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {NFTPool} from "../src/NFTPool.sol";

contract NFTPoolScript is Script {
    // NFT address
    address public NFTAddress = 0x0000000000000000000000000000000000000000;

    function setUp() public {}

    function run() public {
      vm.startBroadcast();

      // Deploy one pool
      NFTPool pool = new NFTPool();

      // initialize the pool
      pool.initialize(NFTAddress);
    }
}
