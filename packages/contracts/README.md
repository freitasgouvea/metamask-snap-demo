## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

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

## Deploy to Linea Network using Foundry and Infura

Before do this you need to add your `INFURA_API_KEY` and `PRIVATE_KEY` to `.env` file. See the example in `.env.example` file.

For more information about how to get your Infura API Key, please visit [Infura](https://infura.io/).

Ensure you have tokens in your wallet in the network you are deploying to. If you need to get founds in Linea networks, please visit [Fund Your Account](https://docs.linea.build/use-mainnet/fund).

### Deploy to Linea Mainnet

```shell
$ forge create --rpc-url linea-mainnet src/NFTPool.sol:NFTPoolScript --private-key $PRIVATE_KEY
```

### Deploy to Linea Testnet

```shell
$ forge create --rpc-url linea-testnet src/NFTPool.sol:NFTPoolScript --private-key $PRIVATE_KEY
```
