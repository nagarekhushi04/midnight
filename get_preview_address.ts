import { resolveNetwork, getOrCreateSeed } from './src/network.js';
import { createWallet, unshieldedToken } from './src/wallet.js';
import { StandaloneConfig } from './src/config.js';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

async function main() {
  const seed = getOrCreateSeed('preview');
  const networkConfig = {
    networkId: 'preview' as NetworkId,
    indexer:   'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node:      'https://rpc.preview.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preview.nethermind.dev',
    composeServices: [],
  };

  const walletCtx = await createWallet({ network: 'preview', networkConfig, seed });
  const address = walletCtx.unshieldedKeystore.getBech32Address();
  console.log('Preview Wallet Address:', address);
  process.exit(0);
}

main().catch(console.error);
