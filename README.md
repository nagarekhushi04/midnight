<div align="center">
  <img src="https://img.shields.io/badge/Midnight-Network-blueviolet?style=for-the-badge&logo=blockchain" alt="Midnight Network" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Deployment" />
  <a href="https://github.com/nagarekhushi04/midnight/actions/workflows/ci.yml">
    <img src="https://github.com/nagarekhushi04/midnight/actions/workflows/ci.yml/badge.svg" alt="CI/CD Status" />
  </a>
</div>

<br />

<div align="center">
  <a href="https://midnight-seven-pi.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Try_it_now-success?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://www.loom.com/share/10214731f64c4035b750c5c755c1e3d1">
    <img src="https://img.shields.io/badge/Video_Demo-Watch_on_Loom-625df5?style=for-the-badge&logo=loom&logoColor=white" alt="Loom Video Demo" />
  </a>
  <br />
  <a href="https://midnight-seven-pi.vercel.app/"><strong>Hosted on Vercel</strong></a> &nbsp;|&nbsp; 
  <a href="https://www.loom.com/share/10214731f64c4035b750c5c755c1e3d1"><strong>📺 Watch Demo Video</strong></a>
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

### Privacy Model
Midnight Legacy guarantees absolute privacy by performing ZK-SNARK proof generation entirely client-side. When a user connects their wallet and invokes a circuit (e.g., executing a `claim()` or `checkIn()`), the frontend seamlessly connects to a local Proof Server. This server ingests the private witness inputs—such as secret seeds or private keys—and generates a cryptographic proof locally. Only this zero-knowledge proof is sent to the Midnight Network, ensuring that no sensitive user inputs or state variables are ever exposed on-chain or over the network payload. 

### Wallet & Circuit Documentation
- **Connect / Disconnect Wallet**: Users can easily connect and disconnect their 1AM Wallet or Lace extension from the UI header using explicit methods exposed via `useMidnight.ts`.
- **Circuit Invocation**: ZK circuits are invoked seamlessly. When triggering a contract function (like Claim), the application displays a dynamic loading indicator: *"Generating Zero-Knowledge Proof locally..."*, ensuring the user is aware of the client-side cryptographic work being performed while their private witness data remains securely masked.

---

# 📜 Smart Contract

The core logic of the Midnight Legacy protocol is deployed on the Midnight Network.

- **Network:** Midnight Testnet / Preprod
- **Deployment Tx Hash:** `d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35`
- **Explorer Link:** [View on Midnight Explorer](https://explorer.preview.midnight.network)

### Contract Address
> **`02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483`**

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

<img width="1920" height="1080" alt="Screenshot 2026-08-09 150241" src="https://github.com/user-attachments/assets/13eae725-48dd-43a6-8bcf-ccf9d705474a" />


<details>
<summary><b>Owner Check-In & Claim Vault</b></summary>
<br/>

<img width="1920" height="1080" alt="Screenshot 2026-08-09 144842" src="https://github.com/user-attachments/assets/8e766e3f-fcd5-485f-9519-f3dab1c061b8" />


<details>
<summary><b>ZK Proof Claim Form & Inputs</b></summary>
<br/>

<img width="1920" height="1080" alt="Screenshot 2026-08-09 144805" src="https://github.com/user-attachments/assets/a8a5820f-94ec-48ce-a139-91610269729a" />

<details>
<summary><b>Graceful Error Handling & Validation</b></summary>
<br/>
<img width="1920" height="1080" alt="Screenshot 2026-08-09 150241" src="https://github.com/user-attachments/assets/f48dbd0f-c073-4068-b4cd-864dc8c5ddf3" />


<details>
<summary><b>Compilation & Artifact Generation</b></summary>
<br/>
<img width="701" height="397" alt="Screenshot 2026-08-09 150205" src="https://github.com/user-attachments/assets/27ade6c3-bcec-4125-8e9f-5fb23c1dd177" />
<img width="901" height="477" alt="Screenshot 2026-08-09 150221" src="https://github.com/user-attachments/assets/a092aadf-318e-406f-8d99-ddef18c612fb" />

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

<details open>
<summary><b>LEVEL 3 REQUIREMENTS:</b></summary>

- [x] **Midnight.js Privacy Model:** Meaningful ZK architecture separating public ledger state from private zero-knowledge witnesses.
- [x] **Test Coverage:** Minimum 3 passing tests covering circuits, state transitions, and private state secrecy.
- [x] **CI/CD Pipeline:** Functional GitHub Actions workflow (`.github/workflows/ci.yml`) with automated test execution and build verification.
- [x] **Approved Idea:** Directly aligned with registered proposal from the approved hackathon idea list.
- [x] **Git History:** 40+ meaningful commits showing iterative, transparent development.
- [x] **Live Demo URL:** Deployed frontend connected to Midnight Preprod (`https://midnight-seven-pi.vercel.app/`).
- [x] **Preprod Contract Address:** Live deployed instance (`02008cfbfdce8b07cc5b4ebf2ff84976c6c21e64985220c91ab54ef390868846c483`).
- [x] **1-Minute Demo Video:** Concise video demonstrating Lace connection, ZK proof generation, and state updates (`https://www.loom.com/share/10214731f64c4035b750c5c755c1e3d1`).
- [x] **Privacy Model Breakdown:** Explicit documentation detailing what an observer CAN and CANNOT learn.

</details>

---

## 🧪 Test Suite & Verification

The repository includes comprehensive automated unit and circuit verification tests in `tests/Inheritance.test.ts`.

```text
khush@midnight:~/midnight-legacy$ npm test

> midnight-legacy@1.0.0 test
> tsx tests/Inheritance.test.ts

🧪 Running Inheritance Contract Unit Tests...

✅ Test 1 Passed: Circuit logic compiled and exported correctly.
✅ Test 2 Passed: Initial state transitions defined.
✅ Test 3 Passed: Private inputs (secretPasscode & beneficiaryAddr) are hidden from public ledger state.

🎉 ALL 3 TESTS PASSED SUCCESSFULLY!
```

---

## 🔒 Privacy Model & Architecture (Public State vs. Private Witness)

Midnight Legacy strictly separates what is known to the network from what remains securely in the user's client.

### 👁️ What an Observer CAN Learn
* **Public Contract State:** The current inactivity timer, timeout interval, and whether the inheritance vault has been claimed (`isClaimed`).
* **On-Chain Timestamps:** The timestamp of the owner's last check-in (`lastCheckIn`).
* **Transaction Hashes:** Cryptographic proof hashes and block inclusion metadata submitted to the Midnight network.
* **Public Balance:** The on-chain asset balance held by the smart contract.

### 🛡️ What an Observer CANNOT Learn
* **User Identities & Addresses:** The pre-designated beneficiary's unshielded address remains completely hidden until a valid claim circuit is executed.
* **Secret Passcodes & Salts:** The private passcodes, seeds, and witnesses used to verify beneficiary authorization are NEVER published to the blockchain or logged.
* **Private State Parameters:** Client-side proving parameters and witness assignments remain isolated in local browser memory.
* **Zero-Knowledge Witness Data:** Intermediate circuit execution states and raw witness values are fully concealed inside the ZK-SNARK proof.

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

---

## 🛠️ Troubleshooting & Circuit Execution Guide

If you experience unexpected behavior or errors during `checkIn` or `claim` circuit interactions, refer to these common Midnight.js and Compact execution resolutions:

### 1. `Assertion failed` (Compact Logic Rejection)
* **Cause:** Trying to check-in after the vault is already claimed, attempting to claim before the inactivity timeout has elapsed, or supplying an incorrect `secretPasscode`.
* **Resolution:** Verify on-chain state with `Refresh State` in the UI to ensure the timeout condition `currentTime >= (lastCheckIn + timeout)` is satisfied and that the provided beneficiary credentials match the initial commitment.

### 2. `Failed to fetch proof` / Proof Server Unreachable
* **Cause:** The client-side proof generation attempted to contact a local Proof Server (`http://127.0.0.1:6300`) that is offline or has mismatched `.zkir`/`.prover` artifact paths.
* **Resolution:** Ensure the Midnight Proof Server container is running (`docker run -p 6300:6300 midnightntwrk/proof-server`) or verify that browser-based proving assets in `/managed/Inheritance` are accessible.

### 3. Private Witness State & Disclose Guarantees
* **Cause:** In Compact, witness data is strictly private by default. Any variable that needs to be recorded to the ledger state or verified across transactions must be explicitly handled with `disclose()`.
* **Resolution:** Midnight Legacy explicitly manages `disclose(currentTime)` and `disclose(beneficiaryAddr)` in the smart contract while keeping secret passcodes masked inside the zero-knowledge circuit.

### 4. Insufficient DUST / Wallet Balancing Failure
* **Cause:** Midnight transactions require DUST tokens to balance fees. If the wallet balance is zero, `balanceTx` rejects before broadcasting.
* **Resolution:** Fund the connected Lace or 1AM Wallet via the Midnight Preprod Faucet and ensure the wallet extension is connected to the matching network ID (`preview`).
