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
      const targetWalletAPI = installedWallets[0] as any;

      if (!targetWalletAPI) {
        throw new Error('No compatible Midnight wallet provider detected.');
      }

      // Midnight Lace uses .enable(), but fallback to .connect()
      let connection;
      if (typeof targetWalletAPI.enable === 'function') {
        connection = await targetWalletAPI.enable();
      } else if (typeof targetWalletAPI.connect === 'function') {
        connection = await targetWalletAPI.connect();
      } else {
        throw new Error('Wallet extension does not provide enable() or connect() methods.');
      }

      console.log('Connected Wallet API Object:', connection);

      let walletNetwork = expectedNetwork;
      let unshieldedAddr = 'Not Available';

      // Defensive checking for networkId
      if (connection.networkId) {
        if (typeof connection.networkId === 'function') {
          walletNetwork = await connection.networkId();
        } else if (typeof connection.networkId === 'string') {
          walletNetwork = connection.networkId;
        }
      }

      // Defensive checking for unshielded address
      if (connection.getUnshieldedAddress) {
        unshieldedAddr = await connection.getUnshieldedAddress();
      } else if (connection.unshieldedAddress) {
        unshieldedAddr = connection.unshieldedAddress;
      }

      // Modern Midnight SDK uses an Observable state()
      if (connection.state && typeof connection.state === 'function') {
        const stateResult = connection.state();
        // If it looks like an RxJS observable
        if (stateResult && typeof stateResult.subscribe === 'function') {
          stateResult.subscribe((s: any) => {
            console.log('Wallet State update:', s);
            if (s.networkId) setNetwork(s.networkId);
            if (s.unshieldedAddress) setAddress(s.unshieldedAddress);
          });
        } else {
          // If state is just a Promise or object
          const resolvedState = await Promise.resolve(stateResult);
          if (resolvedState.networkId) walletNetwork = resolvedState.networkId;
          if (resolvedState.unshieldedAddress) unshieldedAddr = resolvedState.unshieldedAddress;
        }
      }

      setWallet(connection);
      setNetwork(walletNetwork);
      setAddress(unshieldedAddr);
    } catch (err: any) {
      console.error(err);
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
