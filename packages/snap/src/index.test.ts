import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { panel, text } from '@metamask/snaps-sdk';

describe('onRpcRequest', () => {
  describe('approve', () => {
    it('shows a confirmation dialog', async () => {
      const { request } = await installSnap();

      const response = request({
        method: 'approve',
        params: {
          tokenName: 'NFT',
          tokenId: '123',
        },
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('confirmation');
      expect(ui).toRender(
        panel([
          text('Approve NFT'),
          text(`Hello!`),
          text(`You will approve **NFT POOL** to spend your **NFT** NFT with token ID **123**.`),
          text(`If you not use this approval in the next 10 minutes, we recommend you to revoke it for security reasons.`),
        ]),
      );

      await ui.ok();

      expect(await response).toRespondWith(true);
    });
  });

  describe('deposit', () => {
    it('shows a prompt dialog', async () => {
      const { request } = await installSnap();

      const response = request({
        method: 'deposit',
        params: {
          tokenName: 'NFT',
          tokenId: '123',
        },
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('prompt');
      expect(ui).toRender(
        panel([
          text('Deposit NFT'),
          text(`Hello!`),
          text(`You will deposit **NFT** NFT with token ID **123** to **NFT POOL**.`),
          text(`Confirm this action typing the NFT Id below.`),
        ]),
      );

      await ui.ok('123');

      expect(await response).toRespondWith('123');
    });
  });

  describe('withdraw', () => {
    it('shows a prompt dialog', async () => {
      const { request } = await installSnap();

      const response = request({
        method: 'withdraw',
        params: {
          tokenName: 'NFT',
          tokenId: '123',
        },
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('prompt');
      expect(ui).toRender(
        panel([
          text('Withdraw NFT'),
          text(`Hello!`),
          text(`You will withdraw **NFT** NFT with token ID **123** from **NFT POOL**.`),
          text(`Confirm this action typing the NFT Id below.`),
        ]),
      );

      await ui.ok('123');

      expect(await response).toRespondWith('123');
    });
  });

  it('throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });

    await close();
  });
});
