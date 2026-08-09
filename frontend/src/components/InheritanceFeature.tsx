import React, { useState, useEffect } from 'react';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { BrowserZkConfigProvider } from '../utils/BrowserZkConfigProvider';
import { getMemoryPrivateStateProvider } from '../utils/dummyPrivateStateProvider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as Inheritance from '../contract/index.js';

function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) throw new Error("Invalid hex string");
  const array = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    array[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return array;
}

const PRIVATE_STATE_ID = 'InheritancePrivateState';

interface ContractState {
  lastCheckIn: string;
  timeout: string;
  isClaimed: boolean;
  finalBeneficiary: string;
  beneficiaryCommitment: string;
}

interface InheritanceFeatureProps {
  contractAddress: string | null;
  walletConnected: boolean;
  wallet?: any;
}

export const InheritanceFeature: React.FC<InheritanceFeatureProps> = ({
  contractAddress,
  walletConnected,
  wallet,
}) => {
  const [state, setState] = useState<ContractState | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [isProving, setIsProving] = useState(false);
  const [provingAction, setProvingAction] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form inputs for claiming
  const [beneficiaryAddrInput, setBeneficiaryAddrInput] = useState('');
  const [secretPasscodeInput, setSecretPasscodeInput] = useState('');

  const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network/api/v4/graphql';
  const indexerWsUrl = import.meta.env.VITE_INDEXER_WS_URL || 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';

  // Helpers to fetch public data
  const publicDataProvider = indexerPublicDataProvider(indexerUrl, indexerWsUrl);

  const fetchContractState = async () => {
    if (!contractAddress) return;
    setLoadingState(true);
    try {
      const contractStateData = await publicDataProvider.queryContractState(contractAddress);
      if (contractStateData) {
        const ledgerState = Inheritance.ledger(contractStateData.data);
        setState({
          lastCheckIn: ledgerState.lastCheckIn.toString(),
          timeout: ledgerState.timeout.toString(),
          isClaimed: ledgerState.isClaimed,
          finalBeneficiary: ledgerState.finalBeneficiary,
          beneficiaryCommitment: ledgerState.beneficiaryCommitment,
        });
      } else {
        // Fallback or empty state
        setState(null);
      }
    } catch (err: any) {
      console.error('Error fetching state:', err);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchContractState();
    // In a real app we could subscribe to publicDataProvider.contractStateObservable(contractAddress) here
  }, [contractAddress]);

  const connectToContract = async () => {
    if (!wallet || !contractAddress) {
      throw new Error("Wallet not connected or contract address missing");
    }

    const compiledContract = CompiledContract.make('Inheritance', Inheritance.Contract).pipe(
      CompiledContract.withVacantWitnesses
    );

    const zkConfigProvider = new BrowserZkConfigProvider('/managed/Inheritance');
    
    const providers = {
      privateStateProvider: getMemoryPrivateStateProvider(),
      publicDataProvider,
      zkConfigProvider,
      proofProvider: httpClientProofProvider('http://127.0.0.1:6300', zkConfigProvider),
      walletProvider: {
        getCoinPublicKey: () => wallet.shieldedSecretKeys.coinPublicKey,
        getEncryptionPublicKey: () => wallet.shieldedSecretKeys.encryptionPublicKey,
        async balanceTx(tx: any, ttl?: Date) {
          const recipe = await wallet.wallet.balanceUnboundTransaction(
            tx,
            { shieldedSecretKeys: wallet.shieldedSecretKeys, dustSecretKey: wallet.dustSecretKey },
            { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
          );
          return wallet.wallet.finalizeRecipe(recipe);
        },
        submitTx: (tx: any) => wallet.wallet.submitTransaction(tx) as any,
      },
      midnightProvider: undefined as any,
    };
    
    // Polyfill midnightProvider field
    providers.midnightProvider = providers.walletProvider;

    return findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });
  };

  const handleCheckIn = async () => {
    if (!walletConnected) {
      setActionError('Please connect your Midnight wallet first.');
      return;
    }
    setActionError(null);
    setTxResult(null);
    setIsProving(true);
    setProvingAction('Owner Check-In: Generating Zero-Knowledge Proof (talking to Proof Server)...');

    try {
      const deployed = await connectToContract();
      const currentTime = BigInt(Math.floor(Date.now() / 1000));
      
      const tx = await (deployed.callTx as any).checkIn(currentTime);

      setTxResult(`Check-in successful! Tx Hash: ${tx.public.txHash}`);
      await fetchContractState();
    } catch (err: any) {
      setActionError(err?.message || 'Check-in failed.');
    } finally {
      setIsProving(false);
      setProvingAction(null);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      setActionError('Please connect your Midnight wallet first.');
      return;
    }
    if (!beneficiaryAddrInput || !secretPasscodeInput) {
      setActionError('Please fill in your private beneficiary details.');
      return;
    }

    setActionError(null);
    setTxResult(null);
    setIsProving(true);
    setProvingAction('Executing Claim: Proving ownership (talking to Proof Server)...');

    try {
      const deployed = await connectToContract();
      const currentTime = BigInt(Math.floor(Date.now() / 1000));

      let beneficiaryAddr = new Uint8Array(32);
      beneficiaryAddr.fill(1);
      if (beneficiaryAddrInput.length === 64) {
        beneficiaryAddr = hexToUint8Array(beneficiaryAddrInput) as any;
      }

      let secretPasscode = new Uint8Array(32);
      secretPasscode.fill(1);
      if (secretPasscodeInput.length === 64) {
        secretPasscode = hexToUint8Array(secretPasscodeInput) as any;
      }

      const tx = await (deployed.callTx as any).claim(currentTime, beneficiaryAddr, secretPasscode);

      setTxResult(`Inheritance claimed! Tx Hash: ${tx.public.txHash}`);
      
      setBeneficiaryAddrInput('');
      setSecretPasscodeInput('');
      await fetchContractState();
    } catch (err: any) {
      setActionError(err?.message || 'Claim execution failed.');
    } finally {
      setIsProving(false);
      setProvingAction(null);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Contract State View */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Contract On-Chain State</h2>
          <button
            onClick={fetchContractState}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {loadingState ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Deployed Address:</span>
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--accent-rose-light)', wordBreak: 'break-all', marginTop: '4px' }}>
              {contractAddress || 'No Contract Address Provided (.env.example)'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <div style={{ fontWeight: 'bold', color: state?.isClaimed ? 'var(--accent-terracotta)' : '#10B981', marginTop: '4px' }}>
                {state?.isClaimed ? 'CLAIMED' : (state ? 'ACTIVE / UNCLAIMED' : 'LOADING...')}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Inactivity Timeout:</span>
              <div style={{ marginTop: '4px' }}>{state ? `${Number(state.timeout) / 3600} hours` : '...'}</div>
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Beneficiary Commitment (Public ZK Hash):</span>
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--text-sand)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {state?.beneficiaryCommitment || '...'}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Revealed Beneficiary (Post-Claim):</span>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-rose-light)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {state?.finalBeneficiary || 'Hidden until claimed'}
            </div>
          </div>
        </div>
      </div>

      {/* Owner & Beneficiary Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Owner Check-In */}
        <div className="glass-panel">
          <h2 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>Owner Check-In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Reset your inactivity timer to prove you are active and keep your inheritance locked.
          </p>

          <div style={{ display: 'inline-block', background: 'var(--accent-bg)', color: 'var(--accent-rose-light)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '20px', border: '1px solid var(--accent-bg)' }}>
            🔒 Proved without revealing your input
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isProving || !walletConnected || state?.isClaimed}
            style={{
              width: '100%',
              background: state?.isClaimed ? 'var(--bg-charcoal)' : 'var(--text-sand)',
              border: 'none',
              color: state?.isClaimed ? 'var(--text-muted)' : 'var(--bg-obsidian)',
              padding: '14px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: isProving || !walletConnected || state?.isClaimed ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: state?.isClaimed ? 'none' : '0 2px 10px rgba(255,255,255,0.1)'
            }}
          >
            {isProving && provingAction?.includes('Check-In') ? 'Generating ZK Proof...' : 'Reset Inactivity Timer'}
          </button>
        </div>

        {/* Beneficiary Claim */}
        <div className="glass-panel">
          <h2 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>Claim Inheritance</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Provide your private identity and secret passcode to execute the will after the timeout.
          </p>

          <div style={{ display: 'inline-block', background: 'var(--accent-bg)', color: 'var(--accent-terracotta)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '20px', border: '1px solid var(--accent-terracotta)' }}>
            🔒 Proved without revealing your input
          </div>

          <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Beneficiary Address/Identity (Hex):</label>
              <input
                type="text"
                placeholder="64 character hex string"
                value={beneficiaryAddrInput}
                onChange={(e) => setBeneficiaryAddrInput(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secret Passcode (Hex Witness):</label>
              <input
                type="password"
                placeholder="64 character hex string"
                value={secretPasscodeInput}
                onChange={(e) => setSecretPasscodeInput(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isProving || !walletConnected || state?.isClaimed}
              style={{
                width: '100%',
                background: state?.isClaimed ? 'var(--bg-charcoal)' : 'var(--accent-terracotta)',
                border: 'none',
                color: state?.isClaimed ? 'var(--text-muted)' : 'var(--text-sand)',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: isProving || !walletConnected || state?.isClaimed ? 'not-allowed' : 'pointer',
                marginTop: '12px',
                transition: 'all 0.2s',
                boxShadow: state?.isClaimed ? 'none' : 'var(--shadow-glow)'
              }}
            >
              {isProving && provingAction?.includes('Claim') ? 'Proving ZK Circuit...' : 'Execute Claim Circuit'}
            </button>
          </form>
        </div>
      </div>

      {/* Proving / Execution Notifications */}
      {isProving && (
        <div style={{
          gridColumn: '1 / -1',
          background: 'var(--bg-charcoal)',
          border: '1px solid var(--accent-rose-light)',
          borderRadius: '12px',
          padding: '20px',
          color: 'var(--text-sand)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid var(--accent-rose-light)', borderTopColor: 'transparent', borderRadius: '50%' }} />
          <span style={{ fontWeight: 500 }}>{provingAction}</span>
        </div>
      )}

      {txResult && (
        <div style={{
          gridColumn: '1 / -1',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10B981',
          borderRadius: '12px',
          padding: '20px',
          color: '#10B981',
          fontWeight: 500,
          wordBreak: 'break-all'
        }}>
          ✅ {txResult}
        </div>
      )}

      {actionError && (
        <div style={{
          gridColumn: '1 / -1',
          background: 'rgba(205, 108, 92, 0.15)',
          border: '1px solid var(--accent-terracotta)',
          borderRadius: '12px',
          padding: '20px',
          color: 'var(--accent-terracotta)',
          fontWeight: 500,
          wordBreak: 'break-word'
        }}>
          ⚠️ {actionError}
        </div>
      )}
    </div>
  );
};
