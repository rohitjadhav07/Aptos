import { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
}

export function useAptos() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    network: 'testnet'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Aptos client for testnet
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Check if wallet extension is available
      const isWalletAvailable = 'aptos' in window;
      
      if (!isWalletAvailable) {
        throw new Error('Aptos wallet not found. Please install Petra, Pontem, or another Aptos wallet.');
      }

      const walletAPI = (window as any).aptos;
      
      // Connect to wallet
      const response = await walletAPI.connect();
      
      if (response) {
        const address = response.address;
        
        // Get account balance
        try {
          const resources = await aptos.getAccountResources({ accountAddress: address });
          const accountResource = resources.find((r: any) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
          const balance = accountResource ? parseInt(accountResource.data.coin.value) / 100000000 : 0; // Convert octas to APT
          
          setWallet({
            connected: true,
            address,
            balance,
            network: 'testnet'
          });
        } catch (error) {
          // Handle case where account might not exist on testnet
          setWallet({
            connected: true,
            address,
            balance: 0,
            network: 'testnet'
          });
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if ('aptos' in window) {
        const walletAPI = (window as any).aptos;
        await walletAPI.disconnect();
      }
      
      setWallet({
        connected: false,
        address: null,
        balance: 0,
        network: 'testnet'
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getBalance = async (address?: string) => {
    if (!address && !wallet.address) return 0;
    
    try {
      const targetAddress = address || wallet.address!;
      const resources = await aptos.getAccountResources({ accountAddress: targetAddress });
      const accountResource = resources.find((r: any) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      return accountResource ? parseInt(accountResource.data.coin.value) / 100000000 : 0;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  };

  const signAndSubmitTransaction = async (transaction: any) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const walletAPI = (window as any).aptos;
      const result = await walletAPI.signAndSubmitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if ('aptos' in window) {
        try {
          const walletAPI = (window as any).aptos;
          const isConnected = await walletAPI.isConnected();
          
          if (isConnected) {
            const account = await walletAPI.account();
            if (account) {
              const balance = await getBalance(account.address);
              setWallet({
                connected: true,
                address: account.address,
                balance,
                network: 'testnet'
              });
            }
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return {
    wallet,
    isLoading,
    connectWallet,
    disconnectWallet,
    getBalance,
    signAndSubmitTransaction,
    aptos
  };
}