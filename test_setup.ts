import { bboardContract } from './src/bboard.js'; // no wait
import { Contract } from './contracts/managed/Inheritance/contract/index.js';
import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

const contract = new Contract({});

const constructorContext = {
    initialPrivateState: {},
    initialZswapLocalState: { coinPublicKey: new Uint8Array(32) }
};

const result = contract.initialState(constructorContext as any);
console.log("Initial state created:", result.currentContractState.data);

const context = {
    currentQueryContext: new __compactRuntime.QueryContext(result.currentContractState.data, __compactRuntime.dummyContractAddress()),
    currentPrivateState: result.currentPrivateState,
    currentZswapLocalState: result.currentZswapLocalState,
    gasCost: __compactRuntime.emptyRunningCost(),
    costModel: __compactRuntime.CostModel.initialCostModel()
};

try {
    const setupResult = contract.impureCircuits.setup(context, 86400n, 'secret_passcode_123', 123456789n);
    console.log("Setup executed successfully:", setupResult);
} catch (e) {
    console.error("Setup failed:", e);
}
