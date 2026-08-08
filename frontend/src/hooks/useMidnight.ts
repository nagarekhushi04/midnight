import { useState, useCallback } from 'react';

export interface MidnightWalletAPI {
  name: string;
  icon?: string;
  apiVersion: string;
  connect: () => Promise<MidnightWalletConnection>;
}

export interface MidnightWalletConnection {
  networkId: () => Promise<string>;
  getUnshieldedAddress: () => Promise<string>;
  serviceUriConfig: () => Promise<{ indexerUri: string; proofServerUri: string }>;
  submitTransaction?: (tx: any) => Promise<string>;
}

declare global {
  interface Window {
    midnight?: Record<string, MidnightWalletAPI>;
  }
}

export function useMidnight() {
  const [wallet, setWallet] = useState<MidnightWalletConnection | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedNetwork = import.meta.env.VITE_NETWORK || 'preview';

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.midnight || Object.keys(window.midnight).length === 0) {
        throw new Error('No Midnight wallet extension found. Please install Midnight Lace Wallet.');
      }

      // Discover wallet using Object.values without hardcoding wallet names
      const installedWallets = Object.values(window.midnight);
      const targetWalletAPI = installedWallets[0];

      if (!targetWalletAPI) {
        throw new Error('No compatible Midnight wallet provider detected.');
      }

      const connection = await targetWalletAPI.connect();
      const walletNetwork = await connection.networkId();

      // Validate network ID matches expected network (e.g. preview)
      if (walletNetwork.toLowerCase() !== expectedNetwork.toLowerCase()) {
        throw new Error(
          `Network mismatch: Wallet is connected to "${walletNetwork}", but app expects "${expectedNetwork}".`
        );
      }

      const unshieldedAddr = await connection.getUnshieldedAddress();

      setWallet(connection);
      setNetwork(walletNetwork);
      setAddress(unshieldedAddr);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Midnight Wallet.');
      setWallet(null);
      setAddress(null);
      setNetwork(null);
    } finally {
      setIsConnecting(false);
    }
  }, [expectedNetwork]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setAddress(null);
    setNetwork(null);
    setError(null);
  }, []);

  return {
    wallet,
    address,
    network,
    isConnecting,
    error,
    connect,
    disconnect,
    clearError,
    expectedNetwork,
  };
}
