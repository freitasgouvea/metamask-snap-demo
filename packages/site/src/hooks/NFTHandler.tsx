import type { BrowserProvider, Contract } from 'ethers';
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

import { erc721Abi } from '../abis/erc721.abi';
import { nftAddress, nftPoolAddress } from '../config/addresses';

export const NFTHandler = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [error, setError] = useState<any>('');

  // Initialize ethers provider
  useEffect(() => {
    if (!window.ethereum) {
      console.error('Ethereum object not found');
      setError('Ethereum object not found');
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethersProvider);
  }, []);

  // Initialize NFT contract
  useEffect(() => {
    if (!provider) {
      return;
    }

    const initializeContract = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(nftAddress, erc721Abi, signer);
        setNftContract(contract);
      } catch (contractError) {
        console.error('Error initializing contract:', contractError);
        setError('Error initializing contract');
      }
    };

    // intentionally not awaited
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeContract();
  }, [provider]);

  // Approve NFT
  const approve = useCallback(
    async (tokenId: string) => {
      setError('');
      if (!nftContract) {
        setError('NFT Contract not initialized');
        return null;
      }

      if (!nftContract.approve) {
        setError('NFT Contract does not have approve method');
        return null;
      }

      try {
        const transaction = await nftContract.approve(nftPoolAddress, tokenId);
        return transaction;
      } catch (approveError) {
        console.error('Error during approve: ', approveError);
        setError(`Error during approve: ${(approveError as Error).message}`);
        return null;
      }
    },
    [nftContract],
  );

  return { approve, error };
};

export default NFTHandler;
