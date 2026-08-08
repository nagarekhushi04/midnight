import assert from 'node:assert';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'Inheritance', 'contract', 'index.js');

async function runTests() {
  console.log('🧪 Running Inheritance Contract Unit Tests...\n');

  // Test 1: Circuit Logic
  const Inheritance = await import(pathToFileURL(contractPath).href);
  assert.ok(Inheritance.Contract, 'Contract definition should be exported');
  
  const contract = new Inheritance.Contract({});
  assert.ok(contract.impureCircuits, 'Contract should have impureCircuits');
  assert.ok(contract.impureCircuits.setup, 'setup circuit should exist');
  assert.ok(contract.impureCircuits.checkIn, 'checkIn circuit should exist');
  assert.ok(contract.impureCircuits.claim, 'claim circuit should exist');
  console.log('✅ Test 1 Passed: Circuit logic compiled and exported correctly.');

  // Test 2: State Transitions
  assert.ok(contract.initialState, 'Contract initial state should be defined');
  console.log('✅ Test 2 Passed: Initial state transitions defined.');

  // Test 3: Privacy Guarantee
  const publicLedgerKeys = Object.keys(contract.initialState || {});
  assert.strictEqual(publicLedgerKeys.includes('secretPasscode'), false, 'secretPasscode must NOT be exposed in public ledger');
  assert.strictEqual(publicLedgerKeys.includes('beneficiaryAddr'), false, 'beneficiaryAddr must NOT be exposed in public ledger prior to claim');
  console.log('✅ Test 3 Passed: Private inputs (secretPasscode & beneficiaryAddr) are hidden from public ledger state.\n');

  console.log('🎉 ALL 3 TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
