import type { MetaMaskInpageProvider } from '@metamask/providers';

import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

/**
 * Invoke approve method from the NFT snap.
 * @param tokenName - The name of the token.
 * @param tokenId - The ID of the token.
 * @returns Boolean indicating if the user approved the dialog.
 */
export const approveNFTSnap = async (tokenName: string, tokenId: string) => {
  const approveSnap = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'approve', params: { tokenName, tokenId } },
    },
  });
  return approveSnap;
};

/**
 * Invoke deposit method from the Pool snap.
 * @param tokenName - The name of the token.
 * @param tokenId - The ID of the token.
 * @returns String hash of the signed message.
 */
export const depositNFTSnap = async (tokenName: string, tokenId: string) => {
  const message = `I agrree with the terms of service and deposit NFT ${tokenName} ID ${tokenId} to the pool.`;
  const salt = 'test';

  const depositSnap = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'deposit',
        params: { tokenName, tokenId, message, salt },
      },
    },
  });
  return depositSnap;
};

/**
 * Invoke withdraw method from the Pool snap.
 * @param tokenName - The name of the token.
 * @param tokenId - The ID of the token.
 * @returns String value of user input.
 */
export const withdrawNFTSnap = async (tokenName: string, tokenId: string) => {
  const withdrawSnap = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'withdraw', params: { tokenName, tokenId } },
    },
  });
  return withdrawSnap;
};
