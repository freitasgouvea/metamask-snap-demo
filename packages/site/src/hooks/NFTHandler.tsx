import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { erc721Abi } from '../abis/erc721.abi';
import { nftAddress, nftPoolAddress } from '../config/addresses';

export const NFTHandler = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [error, setError] = useState<any>('');

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

  // Initialize NFT contract
  useEffect(() => {
    if (!provider) return;

    const initializeContract = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(nftAddress, erc721Abi, signer);
        setNftContract(contract);
      } catch (e) {
        console.error("Error initializing contract:", e);
        setError("Error initializing contract");
      }
    };

    initializeContract();
  }, [provider]);

  // Approve NFT
  const approve = useCallback(async (tokenId: string) => {
    setError('');
    if (!nftContract) {
      setError("NFT Contract not initialized");
      return null;
    }

    if (!nftContract.approve) {
      setError("NFT Contract does not have approve method");
      return null;
    }

    try {
      const transaction = await nftContract.approve(nftPoolAddress, tokenId);
      return transaction;
    } catch (e) {
      console.error("Error during approve: ", e);
      setError("Error during approve: " + (e as any).message);
      return null;
    }
  }, [nftContract]);

  return { approve, error };
};

export default NFTHandler;
