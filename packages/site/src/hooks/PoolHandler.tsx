import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { nftPoolAbi } from '../abis/nftPool.abi';

export const PoolHandler = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [poolContract, setPoolContract] = useState<Contract | null>(null);
  const [error, setError] = useState('');

  const nftPoolAddress = process.env.NFT_POOL_ADDRESS || '0xf6321ae199dfc9490e32e66c16418b92fe515294';

  // Initialize ethers provider
  useEffect(() => {
    if (!window.ethereum) {
      console.error("Ethereum object not found");
      setError("Ethereum object not found");
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethersProvider);
  }, []);

  // Initialize NFT Pool contract
  useEffect(() => {
    if (!provider) return;

    const initializeContract = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(nftPoolAddress, nftPoolAbi, signer);
        setPoolContract(contract);
      } catch (e) {
        console.error("Error initializing contract:", e);
        setError("Error initializing contract");
      }
    };

    initializeContract();
  }, [provider]);

  // Deposit NFT
  const deposit = useCallback(async (tokenId: string) => {
    setError('');
    if (!poolContract) {
      setError("Pool Contract not initialized");
      return null;
    }

    if (!poolContract.depositNFT) {
      setError("Pool Contract does not have deposit NFT method");
      return null;
    }

    try {
      const transaction = await poolContract.depositNFT(tokenId);
      return transaction;
    } catch (e) {
      console.error("Error during deposit:", e);
      setError("Error during deposit");
      return null;
    }
  }, [poolContract]);

  // Withdraw NFT
  const withdraw = useCallback(async (tokenId: string) => {
    setError('');
    if (!poolContract) {
      setError("Pool Contract not initialized");
      return null;
    }

    if (!poolContract.withdrawNFT) {
      setError("Pool Contract does not have withdraw NFT method");
      return null;
    }

    try {
      const transaction = await poolContract.withdrawNFT(tokenId);
      return transaction;
    } catch (e) {
      console.error("Error during withdraw:", e);
      setError("Error during withdraw");
      return null;
    }
  }, [poolContract]);

  return { deposit, withdraw, error };
};

export default PoolHandler;
