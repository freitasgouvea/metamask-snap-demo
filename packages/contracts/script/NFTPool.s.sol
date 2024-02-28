// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {NFTPool} from "../src/NFTPool.sol";

contract NFTPoolScript is Script {
  // set NFT address, this is linea testnet test NFT address
  address public NFTAddress = 0x56F25c991cCcD6c2171F2c1BE190608ab1f09369;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    // deploy NFT pool
    NFTPool pool = new NFTPool();

    // initialize NFT pool
    pool.initialize(NFTAddress);

    vm.stopBroadcast();
  }
}
