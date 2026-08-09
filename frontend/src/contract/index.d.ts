import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  setup(context: __compactRuntime.CircuitContext<PS>,
        initialTimeout_0: bigint,
        hiddenBeneficiaryHash_0: string,
        currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  checkIn(context: __compactRuntime.CircuitContext<PS>, currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        currentTime_0: bigint,
        beneficiaryAddr_0: string,
        secretPasscode_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  setup(context: __compactRuntime.CircuitContext<PS>,
        initialTimeout_0: bigint,
        hiddenBeneficiaryHash_0: string,
        currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  checkIn(context: __compactRuntime.CircuitContext<PS>, currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        currentTime_0: bigint,
        beneficiaryAddr_0: string,
        secretPasscode_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  setup(context: __compactRuntime.CircuitContext<PS>,
        initialTimeout_0: bigint,
        hiddenBeneficiaryHash_0: string,
        currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  checkIn(context: __compactRuntime.CircuitContext<PS>, currentTime_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claim(context: __compactRuntime.CircuitContext<PS>,
        currentTime_0: bigint,
        beneficiaryAddr_0: string,
        secretPasscode_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly lastCheckIn: bigint;
  readonly timeout: bigint;
  readonly isClaimed: boolean;
  readonly finalBeneficiary: string;
  readonly beneficiaryCommitment: string;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
