import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { InheritanceFeature } from './components/InheritanceFeature';
import './index.css';

export function App() {
  const {
    address,
    network,
    expectedNetwork,
    isConnecting,
    error,
    connect,
    disconnect,
    clearError,
    wallet,
  } = useMidnight();

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || null;

  return (
    <div>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo.svg" alt="Midnight Legacy Logo" style={{ width: '80px', height: '80px', marginBottom: '16px' }} />
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-terracotta), var(--accent-rose-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px 0'
          }}>
            Midnight Legacy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
            Zero-Knowledge Inactivity Will & Inheritance Protocol
          </p>
        </header>

        <WalletConnect
          address={address}
          network={network}
          expectedNetwork={expectedNetwork}
          isConnecting={isConnecting}
          error={error}
          onConnect={connect}
          onDisconnect={disconnect}
          onClearError={clearError}
        />

        <main style={{ marginTop: '32px' }}>
          <InheritanceFeature
            contractAddress={contractAddress}
            walletConnected={!!address}
            wallet={wallet}
          />
        </main>

        <footer style={{
          marginTop: '80px',
          textAlign: 'center',
          color: 'var(--border-color)',
          fontSize: '0.9rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '32px',
          paddingBottom: '32px'
        }}>
          Built for Midnight Network (Preview) • Zero-Knowledge Data Protection DApp
        </footer>
      </div>
    </div>
  );
}

export default App;
