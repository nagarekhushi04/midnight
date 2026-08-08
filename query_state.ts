import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import * as fs from 'node:fs';

async function main() {
  const stateJson = fs.readFileSync('.midnight-state.json', 'utf-8');
  const state = JSON.parse(stateJson);
  const contractAddress = state.deployments.undeployed.address;

  console.log(`Querying state for contract: ${contractAddress}`);
  
  const publicDataProvider = indexerPublicDataProvider('http://127.0.0.1:8088/api/v4/graphql', 'ws://127.0.0.1:8088/api/v4/graphql/ws');
  
  try {
    const contractState = await publicDataProvider.queryContractState(contractAddress);
    console.log("Contract state data:");
    console.log(contractState);
  } catch (err) {
    console.error("Error querying state:", err);
  }
}

main().catch(console.error);
