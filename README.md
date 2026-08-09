# Midnight Legacy – Zero-Knowledge Inactivity Will & Inheritance Protocol

## 🚀 Executive Summary

**Midnight Legacy** solves the critical problem of decentralized inheritance and asset recovery. Traditional blockchain wallets are lost forever if the owner loses their keys or passes away. Existing on-chain recovery methods require exposing backup addresses or balances publicly, compromising user privacy.

Midnight Legacy acts as a **Zero-Knowledge Dead-Man's Switch**. It leverages the Midnight Network's ZK-proof capabilities to allow a wallet owner to check-in securely. If the owner becomes inactive past a configurable timeout, a pre-designated beneficiary can claim the locked assets via a ZK proof, **without ever revealing the beneficiary's private identity or the total vault balance publicly.**

---

## 🔒 Privacy Model & Architecture (Public State vs. Private Witness)

Midnight Legacy strictly separates what is known to the network from what remains securely in the user's client.

### On-Chain Ledger State (Public)
- **Inactivity Timer & Timeout:** The exact block time of the last check-in and the timeout duration.
- **Owner Public Key:** Identifies the creator of the contract.
- **Encrypted Vault State:** The locked assets and encrypted beneficiary commitments (only accessible by the owner or the beneficiary with the correct private seed).

### Client Private Witness (Private)
- **Secret Seeds & Passcodes:** Hex passcodes required to generate the claim proof.
- **Beneficiary Private Keys:** The unshielded identity of the inheritor.
- **Proof Generation:** Occurs entirely locally. Only a Zero-Knowledge Proof (ZK-SNARK) is submitted on-chain, proving the beneficiary knows the passcode without ever exposing it.

### Architecture Flow
```
[User Client (Browser)] 
       │ (Passcode + Address)
       ▼
[Local Witness / Memory] 
       │ (Generates inputs for ZK Circuit)
       ▼
[Proof Server (localhost:6300)] 
       │ (Computes ZK Proof using .zkir & .prover)
       ▼
[ZK Proof (Transaction)] 
       │ (Submitted via Wallet API)
       ▼
[Midnight Node / Devnet]
```

---

## ⚙️ Contract Circuits & Verification

The core smart contract logic is written in **Compact (v0.14.0+)** and compiled into ZK artifacts.

- **`setup()`**: Initializes the contract, sets the inactivity timeout, and commits the beneficiary hash.
- **`checkIn()`**: A circuit called by the owner to reset the inactivity timer.
- **`claim()`**: A circuit executed by the beneficiary. It proves knowledge of the secret passcode and verifies the inactivity timeout has elapsed before transferring assets.

### ZK Artifact Hosting
The compiled artifacts (`.zkir`, `.prover`, `.verifier`) are hosted in the Vite public directory (`/public/managed/Inheritance/`). They are fetched dynamically by the custom `BrowserZkConfigProvider` allowing the frontend to generate proofs entirely in the browser environment via the local Proof Server.

---

## 📡 Deployment & Verification Evidence

- **Network:** Midnight Testnet / Devnet
- **Proof Server Endpoint:** `http://127.0.0.1:6300`
- **Indexer Endpoint:** `https://indexer.preview.midnight.network/api/v4/graphql`

### Contract Details
- **Deployed Contract Address:** `02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483`
- **Deployment Tx Hash:** `d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35`
- **Check-In Tx Hash:** *(Available upon manual testing)*
- **Claim Tx Hash:** *(Available upon manual testing)*

*(Note: Transaction hashes can be verified against the Midnight indexer GraphQL API).*

---

## 💻 Local Setup & Build Instructions

### Prerequisites
- **Node.js** (v18+)
- **Docker** (For the local proof server)
- **Midnight Compact Compiler** (For contract modifications)

### Quickstart

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/nagarekhushi04/midnight.git
   cd midnight
   npm install
   cd frontend && npm install
   ```

2. **Start the Local Proof Server**
   ```bash
   docker run -d -p 6300:6300 meshsdk/midnight-proof-server:1.0.0
   ```

3. **Run the Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🦊 Wallet Integration & Resilience

Midnight Legacy implements a **Multi-Wallet Detection Strategy**. The frontend application robustly scans the browser environment for:
- **1AM Wallet** (`window.oneAMWallet`, `window.midnight.oneAMWallet`)
- **Midnight Lace** (`window.lace`, `window.midnight.mnLace`)

### Graceful Error Boundaries
If a wallet extension is not detected or the connection fails, the application does not crash. It leverages React `<ErrorBoundary>` components and defensive string formatting to display clean UI prompts, ensuring the "e.slice is not a function" error (common in Web3 dApps) is strictly prevented.
