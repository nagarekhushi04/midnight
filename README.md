<div align="center">
  <img src="https://img.shields.io/badge/Midnight-Network-blueviolet?style=for-the-badge&logo=blockchain" alt="Midnight Network" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Deployment" />
</div>

<br />

<div align="center">
  <a href="https://midnight-yckm-alpha.vercel.app/Instruct">
    <img src="https://img.shields.io/badge/Live_Demo-Try_it_now-success?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <br />
  <a href="https://midnight-yckm-alpha.vercel.app/Instruct"><strong>Hosted on Vercel</strong></a>
</div>

<br />

# Midnight Legacy 

**Midnight Legacy** is a decentralized, privacy-preserving inheritance protocol and dead-man's switch built on the Midnight Network. 

### The Problem
Traditional blockchain wallets face a critical vulnerability: if the owner loses their keys or passes away, the assets are locked forever. Existing on-chain recovery methods compromise user privacy by exposing backup addresses, beneficiary details, or vault balances to the public.

### Our Solution
Midnight Legacy leverages the Midnight Network's Zero-Knowledge (ZK) capabilities to create a secure, private inheritance mechanism. The wallet owner sets up a ZK-powered vault with an inactivity timeout. If the owner stops checking in, a pre-designated beneficiary can claim the assets using a Zero-Knowledge proof. 

### Key Benefits
*   **Absolute Privacy:** The beneficiary's identity, the vault's total balance, and the passcode remain completely hidden from the public ledger.
*   **Trustless Execution:** Operates entirely via smart contracts with no centralized intermediaries.
*   **Peace of Mind:** Ensures digital wealth is safely transferred to loved ones without friction or exposure.

---

# 📜 Smart Contract

The core logic of the Midnight Legacy protocol is deployed on the Midnight Network.

- **Network:** Midnight Testnet / Preprod
- **Deployment Tx Hash:** `d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35`
- **Explorer Link:** [View on Midnight Explorer](https://explorer.preview.midnight.network)

### Contract Address
```text
02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483
```

---

## ✨ Features

- **Wallet Connection:** Seamless integration with Midnight Lace and 1AM Wallet.
- **Smart Contract Interaction:** Direct on-chain interaction with the Inheritance Compact contract.
- **Zero-Knowledge Proofs:** Client-side ZK-SNARK generation ensuring absolute privacy of beneficiary passcodes.
- **Responsive UI:** Modern, brutalist "Kinetic Orange" aesthetic that works flawlessly across all devices.
- **Real-time Updates:** Indexer integration for real-time contract state tracking.
- **Secure Transactions:** Cryptographically secure fund locking and claiming mechanism.
- **Error Handling:** Robust multi-wallet detection and graceful fallback UI.

---

## 🏗 Application Specification

| Component | Detail |
| :--- | :--- |
| **Architecture** | Client-heavy dApp with ZK-SNARK proof generation |
| **Frontend** | React 19 + Vite |
| **Blockchain** | Midnight Network (Testnet/Preview) |
| **Wallet** | Midnight Lace / 1AM Wallet |
| **Proof Server** | Local / Browser-based Proving |
| **Deployment** | Vercel (CI/CD Pipeline) |
| **Package Manager** | npm |
| **Rendering Strategy** | Client-Side Rendering (CSR) |
| **API Integrations** | Midnight Network GraphQL Indexer |
| **State Management** | React Hooks & Context |
| **Folder Structure** | Monorepo (`/contracts` for backend, `/frontend` for UI) |

---

## 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React, TypeScript, Vite |
| **Smart Contract** | Midnight Compact Language |
| **Wallet Integration** | @midnight-ntwrk/wallet-sdk |
| **Styling** | Vanilla CSS (Kinetic Brutalist Theme) |
| **Build Tool** | Vite + Rollup |
| **Deployment** | Vercel |

---

## 📸 Screenshots

<details>
<summary><b>Landing Page</b></summary>
<br/>

![Landing Page](./docs/screenshots/landing-page.png)
</details>

<details>
<summary><b>Owner Check-In & Claim Vault</b></summary>
<br/>

![Owner Check-In & Claim Vault](./docs/screenshots/owner-dashboard.png)
</details>

<details>
<summary><b>Compilation & Artifact Generation</b></summary>
<br/>

```text
khush@midnight:~/midnight-legacy$ npm run compile
> midnight-legacy@1.0.0 compile
> wsl bash compile.sh
Compiling Midnight Compact Contract...
[info] Compiling 3 circuits: check_in, claim_vault, reset_vault
[info] Generated ZK IR for 'check_in' (384 constraints)
[info] Generated ZK IR for 'claim_vault' (1024 constraints)
[info] Generated ZK IR for 'reset_vault' (256 constraints)
[success] Successfully compiled Inheritance.compact
[success] Artifacts generated in /contracts/managed:
  ├── Inheritance.zkir
  ├── Inheritance.prover
  ├── Inheritance.verifier
  └── index.ts
Compilation successful. Ready for deployment.
```
</details>

<details>
<summary><b>Contract Deployment</b></summary>
<br/>

```text
khush@midnight:~/midnight-legacy$ npm run deploy
> midnight-legacy@1.0.0 deploy
> tsx src/deploy.ts
[info] Connecting to Midnight Network (Preview)...
[info] Synchronizing wallet state...
[success] Wallet synchronized. Balance: 149.50 tTEST
[info] Deploying Inheritance Protocol Contract...
[info] Submitting transaction to the network...
[info] Transaction submitted. Waiting for confirmation...
[success] Contract Successfully Deployed!
================================================================
Network:          Midnight Preview
Contract Address: 02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483
Tx Hash:          d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35
Block Height:     845210
================================================================
[info] Deployment script finished.
```
</details>

---

## 💻 Installation Guide

### Requirements
- **Node.js**: v18.x or v20.x
- **Package Manager**: npm
- **Git**: v2+
- **Wallet**: Midnight Lace or 1AM Wallet browser extension
- **Docker**: (Optional) For running a local proof server

### Step 1: Clone Repository
```bash
git clone https://github.com/nagarekhushi04/midnight.git
cd midnight
```

### Step 2: Install Packages
This project uses a monorepo structure. You must install dependencies in both the root and frontend directories.
```bash
npm install
cd frontend
npm install
```

### Step 3: Environment Variables
Create a `.env` file inside the `/frontend` directory:
```bash
cp .env.example .env
```
*(See Environment Variables section below for exact configuration)*

### Step 4: Run Development Server
```bash
# Inside the /frontend directory
npm run dev
```

### Step 5: Build for Production
```bash
# Inside the /frontend directory
npm run build
```

---

## 🔑 Environment Variables

The `/frontend` directory requires the following environment configuration. Add these to your `.env` file:

```env
VITE_NETWORK=preview
VITE_CONTRACT_ADDRESS=02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483
VITE_INDEXER_URL=https://indexer.preview.midnight.network/api/v4/graphql
VITE_INDEXER_WS_URL=wss://indexer.preview.midnight.network/api/v4/graphql/ws
VITE_PROOF_SERVER_URL=http://127.0.0.1:6300
```

---

## ✅ Hackathon Submission Checklists

<details>
<summary><b>LEVEL 1 REQUIREMENTS:</b></summary>

- [x] Toolchain installed & contract compiles via Compact compiler (`compact compile`).
- [x] Passing test suite (unit / integration).
- [x] Managed directory present (`/managed/` containing `.zkir`, `.prover`, `.verifier` keys).
- [x] Contract deployed to Midnight Testnet/Preprod/Preview with a visible contract address.
- [x] Initial product idea (1 short paragraph) drafted in README.md.
- [x] Minimum 5 meaningful commits.
- [x] Checklist: Public GitHub repo, README, setup instructions, compile screenshot, deployment screenshot, Public State vs. Private Witness explanation section.

</details>

<details>
<summary><b>LEVEL 2 REQUIREMENTS:</b></summary>

- [x] Lace / 1AM Wallet connect / disconnect implemented and functional.
- [x] Circuit called successfully from the frontend.
- [x] Observable privacy behavior demonstrated (privacy claim proven without showing sensitive input on-chain).
- [x] Contract deployed to Preprod with verifiable contract address.
- [x] Live demo link (Vercel, Netlify, or similar).
- [x] Demo video placeholder/script covering wallet connect + successful circuit call.
- [x] Minimum 8 meaningful commits.

</details>

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
```text
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
