
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
  return (
    <div className="glass-panel" style={{
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: address ? '#10B981' : '#EF4444',
          boxShadow: address ? '0 0 10px #10B981' : 'none'
        }} />
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
            Midnight Wallet
          </h3>
          {address ? (
            <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
              {address.slice(0, 10)}...{address.slice(-8)}
            </span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Not Connected</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          background: 'var(--accent-bg)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--accent-terracotta)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          border: '1px solid var(--accent-terracotta)'
        }}>
          {network || expectedNetwork}
        </span>

        {address ? (
          <button
            onClick={onDisconnect}
            style={{
              background: 'rgba(205, 108, 92, 0.1)',
              border: '1px solid rgba(205, 108, 92, 0.4)',
              color: 'var(--accent-terracotta)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            style={{
              background: 'var(--accent-terracotta)',
              border: 'none',
              color: 'var(--bg-obsidian)',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.2s'
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {error && (
        <div style={{
          width: '100%',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          color: '#FCA5A5',
          fontSize: '0.875rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {error}</span>
          <button
            onClick={onClearError}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FCA5A5',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
