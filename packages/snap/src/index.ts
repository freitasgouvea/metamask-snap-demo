import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { heading, panel, text } from '@metamask/snaps-sdk';

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
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
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
              `You will approve **NFT POOL** to spend your **${(request?.params as Record<string, any>)?.tokenName}** NFT with token ID **${(request?.params as Record<string, any>)?.tokenId}**.`
            ),
            text(
              `If you not use this approval in the next 10 minutes, we recommend you to revoke it for security reasons.`
            )
          ]),
        },
      });
    case 'deposit':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('Deposit NFT'),
            text(`Hello!`),
            text(
              `You will deposit **${(request?.params as Record<string, any>)?.tokenName}** NFT with token ID **${(request?.params as Record<string, any>)?.tokenId}** to **NFT POOL**.`
            ),
            text(
              `Confirm this action typing the NFT Id below.`
            )
          ]),
          placeholder: 'NFT Id',
        },
      });
    case 'withdraw':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('Withdraw NFT'),
            text(`Hello!`),
            text(
              `You will withdraw **${(request?.params as Record<string, any>)?.tokenName}** NFT with token ID **${(request?.params as Record<string, any>)?.tokenId}** from **NFT POOL**.`
            ),
            text(
              `Confirm this action typing the NFT Id below.`
            )
          ]),
          placeholder: 'NFT Id',
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
