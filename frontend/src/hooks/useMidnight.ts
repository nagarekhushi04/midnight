import { useState, useCallback, useRef, useEffect } from 'react';

declare global {
  interface Window {
    midnight?: Record<string, any>;
    oneAMWallet?: any;
    lace?: any;
  }
}

export interface MidnightWalletConnection {
  networkId: () => Promise<string>;
  getUnshieldedAddress: () => Promise<string>;
  serviceUriConfig: () => Promise<{ indexerUri: string; proofServerUri: string }>;
  submitTransaction?: (tx: any) => Promise<string>;
  state?: () => any;
  shieldedSecretKeys?: any;
  dustSecretKey?: any;
  wallet?: any;
}

export function useMidnight() {
  const [wallet, setWallet] = useState<MidnightWalletConnection | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletDetected, setIsWalletDetected] = useState<boolean>(false);
  const [indexerUri, setIndexerUri] = useState<string | null>(null);
  const [proofServerUri, setProofServerUri] = useState<string | null>(null);

  const subscriptionRef = useRef<{ unsubscribe?: () => void } | null>(null);
  const connectionCacheRef = useRef<MidnightWalletConnection | null>(null);
  const expectedNetwork = import.meta.env.VITE_NETWORK || 'preview';

  const clearSubscription = useCallback(() => {
    if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (err) {
        console.warn('Error unsubscribing wallet stream:', err);
      }
      subscriptionRef.current = null;
    }
  }, []);

  // Polling for extension injection on load (up to 3 seconds)
  useEffect(() => {
    let attempts = 0;
    const checkWallet = setInterval(() => {
      attempts++;
      const midnight = (window as any).midnight;
      if (midnight && (midnight.mnLace || midnight.oneKey || typeof midnight.enable === 'function')) {
        setIsWalletDetected(true);
        clearInterval(checkWallet);
      } else if (attempts >= 15) {
        clearInterval(checkWallet);
      }
    }, 200);
    return () => clearInterval(checkWallet);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSubscription();
      connectionCacheRef.current = null;
    };
  }, [clearSubscription]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    if (connectionCacheRef.current) {
      setWallet(connectionCacheRef.current);
      return;
    }

    setIsConnecting(true);
    setError(null);
    clearSubscription();

    try {
      const getWalletProvider = () => {
        const midnight = (window as any).midnight;
        if (!midnight) return null;
        return midnight.mnLace || midnight.oneKey || (typeof midnight.enable === 'function' ? midnight : null);
      };

      let targetWalletAPI: any = null;

      for (let i = 0; i < 15; i++) {
        const provider = getWalletProvider();
        if (provider) {
          targetWalletAPI = provider;
          break;
        }
        await new Promise(r => setTimeout(r, 200));
      }

      if (!targetWalletAPI) {
        setIsWalletDetected(false);
        throw new Error('Wallet extension not detected. Please ensure your Midnight-compatible wallet (1AM / Lace / OneKey) is installed, enabled, and unlocked.');
      } else {
        setIsWalletDetected(true);
      }

      const connection = await targetWalletAPI.enable();
      connectionCacheRef.current = connection;

      let walletNetwork = expectedNetwork;
      let unshieldedAddr = 'mn_addr1...ft7u';

      try {
        if (typeof targetWalletAPI.getConfiguration === 'function') {
          const config = await targetWalletAPI.getConfiguration();
          if (config) {
            if (config.networkId) walletNetwork = config.networkId;
            if (config.indexerUri) setIndexerUri(config.indexerUri);
            if (config.proofServerUri) setProofServerUri(config.proofServerUri);
          }
        }
      } catch (err) {
        console.warn('Failed to getConfiguration:', err);
      }

      if (connection.networkId && typeof connection.networkId === 'function') {
        walletNetwork = await connection.networkId();
      } else if (connection.networkId && typeof connection.networkId === 'string') {
        walletNetwork = connection.networkId;
      }

      if (connection.getUnshieldedAddress) {
        try {
          const rawAddr = await connection.getUnshieldedAddress();
          if (rawAddr) unshieldedAddr = typeof rawAddr === 'string' ? rawAddr : (rawAddr.bech32 || String(rawAddr));
        } catch {
          // fallback
        }
      } else if (connection.unshieldedAddress) {
        unshieldedAddr = connection.unshieldedAddress;
      }

      // Safe stream subscription
      if (connection.state && typeof connection.state === 'function') {
        try {
          const stateResult = connection.state();
          if (stateResult && typeof stateResult.subscribe === 'function') {
            const sub = stateResult.subscribe({
              next: (s: any) => {
                if (s?.networkId) setNetwork(s.networkId);
                if (s?.unshieldedAddress) {
                  const addrStr = typeof s.unshieldedAddress === 'string' ? s.unshieldedAddress : (s.unshieldedAddress.bech32 || String(s.unshieldedAddress));
                  setAddress(addrStr);
                }
              },
              error: (err: any) => console.warn('Stream notice:', err)
            });
            subscriptionRef.current = sub;
          }
        } catch (streamErr) {
          console.warn('Stream initialize notice:', streamErr);
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
      connectionCacheRef.current = null;
    } finally {
      setIsConnecting(false);
    }
  }, [expectedNetwork, clearSubscription]);

  const disconnect = useCallback(() => {
    clearSubscription();
    connectionCacheRef.current = null;
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
    isWalletDetected,
    indexerUri,
    proofServerUri,
  };
}
