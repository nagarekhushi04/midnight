import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { InheritanceFeature } from './components/InheritanceFeature';
import { ScrollIndicator } from './components/ScrollIndicator';
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
    isWalletDetected,
    indexerUri,
    proofServerUri,
  } = useMidnight();

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || null;

  return (
    <div style={{ backgroundColor: 'var(--brand-orange)' }}>
      {/* Floating Navigation */}
      <nav style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        right: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px', fontFamily: 'var(--font-archivo)', color: 'var(--solid-black)' }}>
          MIDNIGHT<br/>LEGACY
        </div>
        
        <div style={{
          background: 'var(--solid-black)',
          borderRadius: '9999px',
          padding: '8px 24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '2px solid var(--solid-black)'
        }}>
          <span className="mono-text" style={{ fontSize: '12px', color: 'var(--pure-white)', opacity: 0.8 }}>
            v1.0.0
          </span>
          <WalletConnect
            address={address}
            network={network}
            expectedNetwork={expectedNetwork}
            isConnecting={isConnecting}
            error={error}
            isWalletDetected={isWalletDetected}
            onConnect={connect}
            onDisconnect={disconnect}
            onClearError={clearError}
          />
        </div>
      </nav>

      {/* Typographic Hero Section */}
      <header style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '120px',
        backgroundColor: 'var(--brand-orange)',
        color: 'var(--solid-black)'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '15vw', width: '100%', wordBreak: 'break-word', margin: 0, padding: 0 }}>
            INHERIT
          </h1>
          <h1 style={{ fontSize: '15vw', width: '100%', wordBreak: 'break-word', margin: 0, padding: 0, textAlign: 'right' }}>
            SECURE
          </h1>
        </div>
        
        <div style={{
          borderTop: '2px solid var(--solid-black)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px'
        }}>
          <div className="mono-text" style={{ fontSize: '14px', maxWidth: '300px', fontWeight: 'bold' }}>
            BASED IN ZERO-KNOWLEDGE<br/>MIDNIGHT NETWORK
          </div>
          
          <ScrollIndicator />
          
          <div className="mono-text" style={{ fontSize: '14px', maxWidth: '300px', textAlign: 'right', fontWeight: 'bold' }}>
            DEAD-MAN'S SWITCH PROTOCOL<br/>PROTECT YOUR ASSETS
          </div>
        </div>
      </header>

      {/* Skewed Marquee Section */}
      <div className="skewed-container">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            <h2 style={{ fontSize: '10vw', color: 'var(--brand-orange)', paddingRight: '24px', whiteSpace: 'nowrap' }}>
              TRUSTLESS INHERITANCE / SECURE VAULTS / PRIVATE IDENTITY /
            </h2>
            <h2 style={{ fontSize: '10vw', color: 'var(--brand-orange)', paddingRight: '24px', whiteSpace: 'nowrap' }}>
              TRUSTLESS INHERITANCE / SECURE VAULTS / PRIVATE IDENTITY /
            </h2>
          </div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-content reverse">
            <h2 style={{ fontSize: '8vw', color: 'rgba(255,255,255,0.8)', paddingRight: '24px', whiteSpace: 'nowrap' }}>
              NO THIRD PARTIES / NO COMPROMISES / ZK PROOFS /
            </h2>
            <h2 style={{ fontSize: '8vw', color: 'rgba(255,255,255,0.8)', paddingRight: '24px', whiteSpace: 'nowrap' }}>
              NO THIRD PARTIES / NO COMPROMISES / ZK PROOFS /
            </h2>
          </div>
        </div>
      </div>

      {/* Main Service List (Features) */}
      <main style={{ backgroundColor: 'var(--solid-black)', padding: '120px 0', minHeight: '100vh' }}>
        <InheritanceFeature
          contractAddress={contractAddress}
          walletConnected={!!address}
          wallet={wallet}
          isWalletDetected={isWalletDetected}
          indexerUri={indexerUri}
          proofServerUri={proofServerUri}
        />
      </main>

      {/* Giant CTA & Footer */}
      <div style={{ backgroundColor: 'var(--brand-orange)', color: 'var(--solid-black)', paddingTop: '120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px', padding: '0 24px' }}>
          <h1 style={{ fontSize: '12vw', marginBottom: '40px' }}>PROTECT IT ALL</h1>
          <button 
            onClick={() => {
              if (!address || !isWalletDetected) {
                alert('Please connect your Midnight-compatible wallet (1AM or OneKey) first.');
              } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }}
            className="brutalist-button" 
            style={{ 
              fontSize: '24px', 
              padding: '24px 64px', 
              background: 'var(--solid-black)', 
              color: 'var(--pure-white)', 
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            START NOW
          </button>
        </div>

        <footer style={{
          borderTop: '2px solid var(--solid-black)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          <div>© 2026 MIDNIGHT LEGACY</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--solid-black)', textDecoration: 'none' }}>TWITTER</a>
            <a href="#" style={{ color: 'var(--solid-black)', textDecoration: 'none' }}>GITHUB</a>
            <a href="#" style={{ color: 'var(--solid-black)', textDecoration: 'none' }}>DISCORD</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
