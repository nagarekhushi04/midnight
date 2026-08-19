import { useState, useCallback, useRef, useEffect } from 'react';

declare global {
  interface Window {
    midnight?: Record<string, any>;
    oneAMWallet?: any;
    lace?: any;
  }
}

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

export function useMidnight() {
  const [wallet, setWallet] = useState<MidnightWalletConnection | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionRef = useRef<{ unsubscribe?: () => void } | null>(null);
  const expectedNetwork = import.meta.env.VITE_NETWORK || 'preview';

  const clearSubscription = useCallback(() => {
    if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (err) {
        console.warn('Error unsubscribing from wallet state stream:', err);
      }
      subscriptionRef.current = null;
    }
  }, []);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      clearSubscription();
    };
  }, [clearSubscription]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    clearSubscription();

    try {
      let targetWalletAPI: any = null;

      if (window.midnight) {
        if (window.midnight.oneAMWallet) {
          targetWalletAPI = window.midnight.oneAMWallet;
        } else if (window.midnight.mnLace) {
          targetWalletAPI = window.midnight.mnLace;
        } else if (Object.keys(window.midnight).length > 0) {
          targetWalletAPI = Object.values(window.midnight)[0];
        }
      } 
      
      if (!targetWalletAPI && window.oneAMWallet) {
        targetWalletAPI = window.oneAMWallet;
      }
      
      if (!targetWalletAPI && window.lace) {
        targetWalletAPI = window.lace;
      }

      if (!targetWalletAPI) {
        throw new Error('1AM / Midnight Wallet extension not detected. Please install the extension or enable Devnet mode.');
      }

      // Midnight Lace uses .enable(), fallback to .connect()
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
          const sub = stateResult.subscribe({
            next: (s: any) => {
              console.log('Wallet State update:', s);
              if (s?.networkId) setNetwork(s.networkId);
              if (s?.unshieldedAddress) setAddress(s.unshieldedAddress);
            },
            error: (err: any) => {
              console.warn('Wallet stream error:', err);
            }
          });
          subscriptionRef.current = sub;
        } else {
          // If state is just a Promise or object
          const resolvedState = await Promise.resolve(stateResult);
          if (resolvedState?.networkId) walletNetwork = resolvedState.networkId;
          if (resolvedState?.unshieldedAddress) unshieldedAddr = resolvedState.unshieldedAddress;
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
  }, [expectedNetwork, clearSubscription]);

  const disconnect = useCallback(() => {
    clearSubscription();
    setWallet(null);
    setAddress(null);
    setNetwork(null);
    setError(null);
  }, [clearSubscription]);

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
