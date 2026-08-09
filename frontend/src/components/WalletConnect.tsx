import React from 'react';

interface WalletConnectProps {
  address: string | null;
  network: string | null;
  expectedNetwork: string;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearError: () => void;
}

const formatAddress = (addr: unknown): string => {
  if (typeof addr === 'string' && addr.length > 0) {
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
  return '';
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  address,
  network,
  expectedNetwork,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
  onClearError,
}) => {
  const formattedAddress = formatAddress(address);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {address && (
          <span className="mono-text" style={{ 
            fontSize: '12px', 
            color: 'var(--brand-orange)',
            textTransform: 'uppercase',
            borderRight: '1px solid rgba(255,255,255,0.2)',
            paddingRight: '16px'
          }}>
            {network || expectedNetwork} 
          </span>
        )}
        
        {address ? (
          <button
            onClick={onDisconnect}
            className="brutalist-button"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              border: '1px solid var(--pure-white)',
              background: 'transparent'
            }}
          >
            {formattedAddress} (DISCONNECT)
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="brutalist-button"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              background: 'var(--pure-white)',
              color: 'var(--solid-black)',
              border: '1px solid var(--pure-white)'
            }}
          >
            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
          </button>
        )}
      </div>

      {error && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--brand-orange)',
          color: 'var(--solid-black)',
          padding: '16px 24px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 9999,
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          border: '2px solid var(--solid-black)'
        }}>
          <span>ERR: {error}</span>
          <button 
            onClick={onClearError}
            style={{ background: 'transparent', border: 'none', color: 'var(--solid-black)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            [X]
          </button>
        </div>
      )}
    </>
  );
};
