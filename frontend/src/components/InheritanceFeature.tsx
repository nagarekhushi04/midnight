import React, { useState, useEffect } from 'react';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { BrowserZkConfigProvider } from '../utils/BrowserZkConfigProvider';
import { getMemoryPrivateStateProvider } from '../utils/dummyPrivateStateProvider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as Inheritance from '../contract/index.js';
import { ArrowRight, RefreshCw } from 'lucide-react';

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
  const [isProving, setIsProving] = useState(false);
  const [provingAction, setProvingAction] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [beneficiaryAddrInput, setBeneficiaryAddrInput] = useState('');
  const [secretPasscodeInput, setSecretPasscodeInput] = useState('');

  // Expandable UI States
  const [activeForm, setActiveForm] = useState<'checkin' | 'claim' | null>(null);

  const indexerUrl = import.meta.env.VITE_INDEXER_URL || 'https://indexer.preview.midnight.network/api/v4/graphql';
  const indexerWsUrl = import.meta.env.VITE_INDEXER_WS_URL || 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';

  const publicDataProvider = indexerPublicDataProvider(indexerUrl, indexerWsUrl);

  const getCleanAddress = (addr: string | null | undefined): string | null => {
    if (!addr) return null;
    let clean = addr.trim();
    if (clean.startsWith('0x') || clean.startsWith('0X')) {
      clean = clean.slice(2);
    }
    return clean;
  };

  const fetchContractState = async () => {
    const cleanAddress = getCleanAddress(contractAddress);
    if (!cleanAddress) return;
    try {
      const contractStateData = await publicDataProvider.queryContractState(cleanAddress);
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
        setState(null);
      }
    } catch (err: any) {
      console.error('Error fetching state:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadState = async () => {
      const cleanAddress = getCleanAddress(contractAddress);
      if (!cleanAddress) return;
      try {
        const contractStateData = await publicDataProvider.queryContractState(cleanAddress);
        if (isMounted) {
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
            setState(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching state:', err);
        }
      }
    };

    loadState();

    return () => {
      isMounted = false;
    };
  }, [contractAddress]);

  const connectToContract = async () => {
    const cleanAddress = getCleanAddress(contractAddress);
    if (!wallet || !cleanAddress) {
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
    
    providers.midnightProvider = providers.walletProvider;

    return findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: cleanAddress,
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
    setProvingAction('Generating Zero-Knowledge Proof locally...');

    try {
      const deployed = await connectToContract();
      const currentTime = BigInt(Math.floor(Date.now() / 1000));
      const tx = await (deployed.callTx as any).checkIn(currentTime);

      setTxResult(`CHECK-IN SUCCESS! TX: ${tx.public.txHash}`);
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
    setProvingAction('Generating Zero-Knowledge Proof locally...');

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

      setTxResult(`INHERITANCE CLAIMED! TX: ${tx.public.txHash}`);
      
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
    <div style={{ padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Network / Status Info Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ border: '2px solid var(--pure-white)', padding: '16px 24px' }}>
            <div className="mono-text" style={{ fontSize: '12px', opacity: 0.6 }}>STATUS</div>
            <div style={{ fontFamily: 'var(--font-archivo)', fontSize: '24px', color: state?.isClaimed ? 'var(--brand-orange)' : 'var(--pure-white)' }}>
              {state?.isClaimed ? 'CLAIMED' : (state ? 'ACTIVE / UNCLAIMED' : 'LOADING...')}
            </div>
          </div>
          <div style={{ border: '2px solid var(--pure-white)', padding: '16px 24px' }}>
            <div className="mono-text" style={{ fontSize: '12px', opacity: 0.6 }}>TIMEOUT</div>
            <div style={{ fontFamily: 'var(--font-archivo)', fontSize: '24px' }}>
              {state ? `${Number(state.timeout) / 3600} HOURS` : '...'}
            </div>
          </div>
        </div>

        <button
          onClick={fetchContractState}
          className="brutalist-button"
          style={{ padding: '16px 32px', fontSize: '16px' }}
        >
          <RefreshCw size={16} style={{ marginRight: '8px' }} />
          REFRESH STATE
        </button>
      </div>

      {/* Notifications */}
      {isProving && (
        <div style={{ background: 'var(--pure-white)', color: 'var(--solid-black)', padding: '24px', border: '2px solid var(--solid-black)', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
          <RefreshCw size={24} className="spin-slow" />
          {provingAction}
        </div>
      )}
      
      {txResult && (
        <div style={{ background: 'var(--brand-orange)', color: 'var(--solid-black)', padding: '24px', border: '2px solid var(--solid-black)', marginBottom: '40px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', wordBreak: 'break-all' }}>
          {txResult}
        </div>
      )}

      {actionError && (
        <div style={{ background: 'var(--solid-black)', color: 'var(--pure-white)', padding: '24px', border: '2px solid var(--brand-orange)', marginBottom: '40px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', wordBreak: 'break-word' }}>
          ERROR: {actionError}
        </div>
      )}

      {/* Brutalist Service List */}
      <div>
        
        {/* Check-In Service Card */}
        <div className="service-card" style={{ padding: '40px 0', cursor: 'pointer' }} onClick={() => setActiveForm(activeForm === 'checkin' ? null : 'checkin')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <span className="mono-text" style={{ fontSize: '24px', color: 'var(--brand-orange)' }}>01</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <h2 className="service-title" style={{ fontSize: 'clamp(32px, 7vw, 96px)' }}>OWNER CHECK-IN</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ border: '1px solid var(--pure-white)', borderRadius: '9999px', padding: '4px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>ZK PROOF</span>
                  <span style={{ border: '1px solid var(--brand-orange)', borderRadius: '9999px', padding: '4px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>PRIVATE</span>
                </div>
              </div>
            </div>
            <ArrowRight size={64} className="service-arrow" />
          </div>

          {activeForm === 'checkin' && (
            <div style={{ marginTop: '40px', marginLeft: '64px', maxWidth: '600px' }}>
              <p className="mono-text" style={{ opacity: 0.8, marginBottom: '24px' }}>
                Reset your inactivity timer to prove you are active and keep your inheritance locked.
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleCheckIn(); }}
                disabled={isProving || !walletConnected || state?.isClaimed}
                className="brutalist-button"
                style={{ padding: '16px 32px', fontSize: '16px' }}
              >
                EXECUTE CHECK-IN
              </button>
            </div>
          )}
        </div>

        {/* Claim Service Card */}
        <div className="service-card" style={{ padding: '40px 0', cursor: 'pointer' }} onClick={() => setActiveForm(activeForm === 'claim' ? null : 'claim')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <span className="mono-text" style={{ fontSize: '24px', color: 'var(--brand-orange)' }}>02</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <h2 className="service-title" style={{ fontSize: 'clamp(32px, 7vw, 96px)' }}>CLAIM VAULT</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ border: '1px solid var(--pure-white)', borderRadius: '9999px', padding: '4px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>ZK PROOF</span>
                  <span style={{ border: '1px solid var(--brand-orange)', borderRadius: '9999px', padding: '4px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>PRIVATE</span>
                </div>
              </div>
            </div>
            <ArrowRight size={64} className="service-arrow" />
          </div>

          {activeForm === 'claim' && (
            <div style={{ marginTop: '40px', marginLeft: '64px', maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
              <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label className="mono-text" style={{ fontSize: '14px', color: 'var(--pure-white)', display: 'block', marginBottom: '8px' }}>BENEFICIARY HEX IDENTITY</label>
                  <input
                    type="text"
                    placeholder="64-CHAR HEX STRING"
                    value={beneficiaryAddrInput}
                    onChange={(e) => setBeneficiaryAddrInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mono-text" style={{ fontSize: '14px', color: 'var(--pure-white)', display: 'block', marginBottom: '8px' }}>SECRET PASSCODE WITNESS</label>
                  <input
                    type="password"
                    placeholder="64-CHAR HEX STRING"
                    value={secretPasscodeInput}
                    onChange={(e) => setSecretPasscodeInput(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProving || !walletConnected || state?.isClaimed}
                  className="brutalist-button"
                  style={{ padding: '16px 32px', fontSize: '16px', marginTop: '8px', alignSelf: 'flex-start' }}
                >
                  EXECUTE CLAIM CIRCUIT
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
