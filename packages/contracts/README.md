# NFT Pool Demo Contracts

This repository contains the smart contracts for the NFT Pool Demo.

This project uses [Foundry](https://book.getfoundry.sh/) to build, test and deploy the smart contracts and is configured to interact with [Linea Network](https://docs.linea.build/) using [Infura](https://docs.infura.io/) as a RPC provider.

## Demo Contracts Addresses

### Linea Testnet

- NFT: [0x56F25c991cCcD6c2171F2c1BE190608ab1f09369](https://goerli.lineascan.build/address/0x56F25c991cCcD6c2171F2c1BE190608ab1f09369)
- NFTPool: [0x65356C52e55c9EBCDaeb5d9aCA15ff1E86f7669E](https://goerli.lineascan.build/address/0x65356C52e55c9EBCDaeb5d9aCA15ff1E86f7669E)

## Deploy to Linea Network using Foundry and Infura

Before do this you need to add your `INFURA_API_KEY` and `PRIVATE_KEY` to `.env` file. See the example in `.env.example` file.

If you wanna to verify automaticaly your contracts, you need to add your `LINEASCAN_API_KEY` to `.env` file.

Then run the following command to load the environment variables:

```shell
$ source .env
```

For more information about how to get your Infura API Key, please visit [Infura](https://infura.io/).

Ensure you have tokens in your wallet in the network you are deploying to.

If you need to get founds in Linea networks, please visit [Fund Your Account](https://docs.linea.build/use-mainnet/fund).

### Deploy and Verify to Linea Mainnet

Before deploy to Linea Mainnet, update the script `NFTPool.s.sol` with the correct addresses of the NFT contract.

```shell
$ forge script --rpc-url linea-mainnet script/NFTPool.s.sol:NFTPoolScript --private-key $PRIVATE_KEY --evm-version london --broadcast --verify
```

### Deploy and Verify to Linea Testnet

Before deploy to Linea Mainnet, update the script `NFTPool.s.sol` with the correct addresses of the NFT contract.

```shell
forge script --rpc-url linea-testnet script/NFTPool.s.sol:NFTPoolScript --private-key $PRIVATE_KEY --evm-version london --broadcast --verify
```

### Linea EVM Compatibility

At the moment (Feb 2024), Linea Network is compatible with London Hardfork (EIP-1559), so you can deploy your contracts to Linea using the London version of the EVM.

Some features that was introduced after London Hardfork are not available in Linea Network, like the `PUSH0` opcode.

To read more information about, please visit [Differences between Ethereum and Linea](https://docs.linea.build/build-on-linea/ethereum-differences).

## Foundry Commands

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/NFTPool.s.sol:NFTPoolScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
