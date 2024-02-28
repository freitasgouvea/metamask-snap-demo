# Metamask Snap Demo

This repository is a fork of the [MetaMask template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo) and contains a demo application of a NFT Pool using the following technologies:

- [Linea Network](https://docs.linea.build/)
- [Infura](https://docs.infura.io/)
- [Metamask SDK](https://metamask.io/sdk/)
- [Metamask Snaps](https://metamask.io/snaps/)
- [Foundry](https://book.getfoundry.sh/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Packages

### contracts

This package contains the smart contracts for the NFT Pool Demo and uses [Foundry](https://book.getfoundry.sh/) to build, test and deploy the smart contracts and is configured to interact with [Linea Network](https://docs.linea.build/) using [Infura](https://docs.infura.io/) as a RPC provider.

See full details in [contracts/README.md](./packages/contracts/README.md)

### site

Contains the frontend application for the demo snap and was built using [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)

Has a set of [hooks](./packages/site/src/hooks) built to easily instantiate MetaMask wallet and interact with smart contracts deployed on the Linea Network. Also has a [snap file](./packages/site/src/utils/snap.tsx) to show how to integrate the frontend application with the snap.

See full details in [site/README.md](./packages/site/README.md)

### snap

This package was built using [TypeScript](https://www.typescriptlang.org/) and contains the snaps for the NFT Pool Demo.

See full details in [snap/README.md](./packages/snap/README.md)

## Getting Started

Clone the template-snap repository [using this template](https://github.com/MetaMask/template-snap-monorepo/generate)
and set up the development environment:

```shell
yarn install && yarn start
```

## Cloning

This repository contains GitHub Actions that you may find useful, see
`.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing)
below for more information.

If you clone or create this repository outside the MetaMask GitHub organization,
you probably want to run `./scripts/cleanup.sh` to remove some files that will
not work properly outside the MetaMask GitHub organization.

If you don't wish to use any of the existing GitHub actions in this repository,
simply delete the `.github/workflows` directory.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

### Using NPM packages with scripts

Scripts are disabled by default for security reasons. If you need to use NPM
packages with scripts, you can run `yarn allow-scripts auto`, and enable the
script in the `lavamoat.allowScripts` section of `package.json`.

See the documentation for [@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts)
for more information.
