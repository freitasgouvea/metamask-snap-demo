import { getSnaps } from './snap';

/**
 * Tries to detect if one of the injected providers is MetaMask and checks if snaps is available in that MetaMask version.
 *
 * @returns True if the MetaMask version supports Snaps, false otherwise.
 */
export const detectSnaps = async () => {
  if (window.ethereum?.detected) {
    for (const provider of window.ethereum.detected) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        // enforces MetaMask as provider
        if (window.ethereum.setProvider) {
          window.ethereum.setProvider(provider);
        }

        return true;
      } catch {
        // no-op
      }
    }
  }

  if (window.ethereum?.providers) {
    for (const provider of window.ethereum.providers) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        window.ethereum = provider;

        return true;
      } catch {
        // no-op
      }
    }
  }

  try {
    await getSnaps();

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is MetaMask Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet is connected to the Linea network
 *
 * @returns True if the wallet is connected to the Linea network, false otherwise.
 */
export const isLineaNetwork = async () => {
  const provider = window.ethereum;

  try {
    const chainId = await provider?.request({
      method: 'eth_chainId',
    });

    return chainId === '0xe704';
  } catch {
    return false;
  }
}

/**
 * Switch the wallet to the Linea network
 *
 * @returns True if the wallet is successfully switched to the Linea network, false otherwise.
 */
export const switchToLineaNetwork = async () => {
  const provider = window.ethereum;

  try {
    const chainId = '0xe704'; // Linea testnet chain ID

    // Attempt to switch using Metamask wallet_switchEthereumChain method
    if (provider.request) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
    } else {
      // If wallet_switchEthereumChain is not available, prompt the user to switch manually
      if (confirm('Please switch your network to Linea testnet in Metamask settings.')) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainId,
            rpcUrl: 'https://rpc.goerli.linea.build',
            chainName: 'Linea Testnet',
            nativeCurrency: {
              name: 'Linea',
              symbol: 'LNE',
              decimals: 18,
            },
            blockExplorerUrls: ['https://goerli.lineascan.build/'],
          }],
        });
      } else {
        return false; // User canceled network switch
      }
    }

    return true; // Switch successful
  } catch (error) {
    console.error('Error switching to Linea network:', error);
    return false;
  }
}
