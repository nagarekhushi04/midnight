# Midnight Preprod Testnet Project Proposal

## Question 1: Product Overview & Target Audience
**Overview:** This application is a decentralized Will & Inheritance vault. It allows users to securely lock digital assets in a smart contract with a dead-man's switch mechanism. If the owner fails to "check-in" before the inactivity timer expires, a designated beneficiary can claim the assets using a secret passcode.
**Target Audience:** Individuals seeking to secure their digital legacy, crypto-holders wanting non-custodial inheritance solutions without relying on centralized legal entities or exposed public smart contracts.

## Question 2: Technical Rationale for Midnight
**Why Midnight?** A standard public blockchain (like Ethereum or Cardano without privacy) would expose the beneficiary's identity, the vault balance, and the secret claiming passcode to all network observers. Midnight is strictly required because it provides a **Data Protection** layer via Zero-Knowledge (ZK) proofs. This ensures that while the execution is verifiable on a public ledger, the sensitive inputs (such as the secret passcode and beneficiary identity) remain completely private and hidden from the network.

## Question 3: Data & State Architecture
**Public Ledger State:**
- `lastCheckIn`: Timestamp of the owner's last liveness check.
- `timeout`: Configured inactivity period.
- `isClaimed`: Boolean flag indicating if the assets have been successfully claimed.
- `checkInCount`: Number of times the owner has checked in.

**Private ZK Witnesses:**
- The *beneficiary address* is maintained locally. During a claim, a ZK proof is generated locally that proves knowledge of this address matching a public commitment, without ever broadcasting the raw address.
- The *secret passcode* is never transmitted to the blockchain. The local ZK circuit uses the passcode as a witness to prove the user has authorization to claim the vault.

**Controlled Disclosures:**
- Upon a successful claim, the `vaultBalance` transitions and the state publicly marks the vault as `isClaimed = true`. We disclose *that* a valid claim occurred, but not *how* or *to whom* (unless explicitly opted-in by the contract logic).

## Question 4: Roadmap & Scope Feasibility
**Milestone 1 (Current):** Implement the core Inheritance smart contract, frontend integration with 1AM Wallet, and deploy to Midnight Preprod Testnet.
**Milestone 2:** Security audit of the ZK circuit, specifically ensuring that witness data does not leak through any side channels or public state transitions.
**Milestone 3:** Mainnet Launch (Targeted by Level 6). The application architecture is lightweight and stateless on the frontend, relying entirely on indexer data and local proof synthesis. It is fully feasible to transition the configuration to the Midnight Mainnet once it is live and stable.
