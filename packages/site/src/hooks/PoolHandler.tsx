import type { BrowserProvider, Contract } from 'ethers';
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

import { nftPoolAbi } from '../abis/nftPool.abi';
import { nftPoolAddress } from '../config/addresses';

export const PoolHandler = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [poolContract, setPoolContract] = useState<Contract | null>(null);
  const [error, setError] = useState('');

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

  // Initialize NFT Pool contract
  useEffect(() => {
    if (!provider) {
      return;
    }

    const initializeContract = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          nftPoolAddress,
          nftPoolAbi,
          signer,
        );
        setPoolContract(contract);
      } catch (contractError) {
        console.error('Error initializing contract:', contractError);
        setError('Error initializing contract');
      }
    };

    // intentionally not awaited
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeContract();
  }, [provider]);

  // Deposit NFT
  const deposit = useCallback(
    async (tokenId: string) => {
      setError('');
      if (!poolContract) {
        setError('Pool Contract not initialized');
        return null;
      }

      if (!poolContract.depositNFT) {
        setError('Pool Contract does not have deposit NFT method');
        return null;
      }

      try {
        const transaction = await poolContract.depositNFT(tokenId);
        return transaction;
      } catch (depositError) {
        console.error('Error during deposit: ', depositError);
        setError(`Error during deposit: ${(depositError as Error).message}`);
        return null;
      }
    },
    [poolContract],
  );

  // Withdraw NFT
  const withdraw = useCallback(
    async (tokenId: string) => {
      setError('');
      if (!poolContract) {
        setError('Pool Contract not initialized');
        return null;
      }

      if (!poolContract.withdrawNFT) {
        setError('Pool Contract does not have withdraw NFT method');
        return null;
      }

      try {
        const transaction = await poolContract.withdrawNFT(tokenId);
        return transaction;
      } catch (withdrawError) {
        console.error('Error during withdraw: ', withdrawError);
        setError(`Error during withdraw: ${(withdrawError as Error).message}`);
        return null;
      }
    },
    [poolContract],
  );

  return { deposit, withdraw, error };
};

export default PoolHandler;
