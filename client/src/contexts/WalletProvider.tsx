import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
}

interface WalletContextType {
  wallet: WalletState;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getBalance: (address?: string) => Promise<number>;
  refreshBalance: () => Promise<void>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
  aptos: Aptos;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
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
      // Check if Petra wallet is available
      if (!window.aptos) {
        throw new Error('Petra wallet not found. Please install Petra wallet extension.');
      }

      // Connect to Petra wallet
      const response = await window.aptos.connect();
      
      if (response) {
        const address = response.address;
        
        // Get account balance
        let balance = 0;
        try {
          balance = await aptos.getAccountAPTAmount({ accountAddress: address });
          balance = balance / 100000000; // Convert octas to APT
        } catch (error) {
          console.log('Account not found on testnet, balance set to 0');
        }
        
        setWallet({
          connected: true,
          address,
          balance,
          network: 'testnet'
        });
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw new Error(error.message || 'Failed to connect to Petra wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
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
      const balance = await aptos.getAccountAPTAmount({ accountAddress: targetAddress });
      return balance / 100000000; // Convert octas to APT
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  };

  const refreshBalance = async () => {
    if (!wallet.address) return;
    
    try {
      const newBalance = await getBalance(wallet.address);
      setWallet(prev => ({
        ...prev,
        balance: newBalance
      }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const signAndSubmitTransaction = async (transaction: any) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await window.aptos.signAndSubmitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.aptos) {
        try {
          const isConnected = await window.aptos.isConnected();
          
          if (isConnected) {
            const account = await window.aptos.account();
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

  const value: WalletContextType = {
    wallet,
    isLoading,
    connectWallet,
    disconnectWallet,
    getBalance,
    refreshBalance,
    signAndSubmitTransaction,
    aptos
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string; publicKey: string }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      account: () => Promise<{ address: string; publicKey: string }>;
      signAndSubmitTransaction: (transaction: any) => Promise<any>;
      signTransaction: (transaction: any) => Promise<any>;
      signMessage: (message: any) => Promise<any>;
      network: () => Promise<string>;
    };
  }
}