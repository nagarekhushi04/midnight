import { ZKConfigProvider } from '@midnight-ntwrk/midnight-js-types';
import type { ZKIR, ProverKey, VerifierKey } from '@midnight-ntwrk/midnight-js-types';

export class BrowserZkConfigProvider extends ZKConfigProvider<string> {
  private readonly basePath: string;
  
  constructor(basePath: string) {
    super();
    this.basePath = basePath;
  }

  async getZKIR(circuitId: string): Promise<ZKIR> {
    const response = await fetch(`${this.basePath}/zkir/${circuitId}.zkir`);
    if (!response.ok) throw new Error(`Failed to fetch ZKIR for '${circuitId}'`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer) as any;
  }

  async getProverKey(circuitId: string): Promise<ProverKey> {
    const response = await fetch(`${this.basePath}/keys/${circuitId}.prover`);
    if (!response.ok) throw new Error(`Failed to fetch ProverKey for '${circuitId}'`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer) as any;
  }

  async getVerifierKey(circuitId: string): Promise<VerifierKey> {
    const response = await fetch(`${this.basePath}/keys/${circuitId}.verifier`);
    if (!response.ok) throw new Error(`Failed to fetch VerifierKey for '${circuitId}'`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer) as any;
  }
}
