# NFT Pool Example Snaps

This snap demonstrates how to develop a snap with TypeScript.

## Snaps in this package

All snaps in this package are inside the `src/index.ts` file.

### RPC Request Snap

#### Approve

This snap demonstrates how to use the `confirmation` type of snap, recieve the `tokenName` and `tokenId` as inputs and returns a boolean value.

#### Deposit and Withdraw

These snaps demonstrate how to use the `prompt` type of snap, recieve the `tokenName` and `tokenId` as inputs and returns the user input value.

## Testing

The snap comes with some basic tests, to demonstrate how to write tests for
snaps. To test the snap, run `yarn test` in this directory. This will use
[`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest)
to run the tests in `src/index.test.ts`.
