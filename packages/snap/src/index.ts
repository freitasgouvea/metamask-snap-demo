import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { DialogType, heading, panel, text } from '@metamask/snaps-sdk';
import { providerErrors } from '@metamask/rpc-errors';
import { bytesToHex, stringToBytes } from '@metamask/utils';
import { sign } from '@noble/bls12-381';
import { getEntropy } from './utils';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'approve':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Approve NFT'),
            text(`Hello!`),
            text(
              `You will approve **NFT POOL** to spend your **${
                (request?.params as Record<string, any>)?.tokenName
              }** NFT with token ID **${
                (request?.params as Record<string, any>)?.tokenId
              }**.`,
            ),
            text(
              `If you not use this approval in the next 10 minutes, we recommend you to revoke it for security reasons.`,
            ),
          ]),
        },
      });
    case 'deposit':
      const depositApproved = await snap.request({
        method: 'snap_dialog',
        params: {
          type: DialogType.Confirmation,
          content: panel([
            heading('Terms of Service'),
            text(
              'By clicking "Approve" you agree to the terms of service from ***NFT POOL***:',
            ),
            text(
              `1 - You will deposit one NFT with token ID **${
                (request?.params as Record<string, any>)?.tokenId
              }** from **${
                (request?.params as Record<string, any>)?.tokenName
              }** Collection to the pool.`,
            ),
            text(
              `2 - You will be able to withdraw one NFT from this pool at any time.`,
            ),
            text(
              `3 - Once deposited, it is not guaranteed that you will be able to withdraw the same NFT you deposited.`,
            ),
            text(
              `4 - The ***NFT POOL*** is not responsible for any loss of NFTs.`,
            ),
          ]),
        },
      });

      if (!depositApproved) {
        throw providerErrors.userRejectedRequest();
      }

      const privateKey = await getEntropy(
        (request?.params as Record<string, any>).salt,
      );
      const newLocal = await sign(
        stringToBytes((request?.params as Record<string, any>).message),
        privateKey,
      );
      return bytesToHex(newLocal);
    case 'withdraw':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('Withdraw NFT'),
            text(`Hello!`),
            text(
              `You will withdraw **${
                (request?.params as Record<string, any>)?.tokenName
              }** NFT with token ID **${
                (request?.params as Record<string, any>)?.tokenId
              }** from **NFT POOL**.`,
            ),
            text(`Confirm this action typing the NFT Id below.`),
          ]),
          placeholder: 'NFT Id',
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
