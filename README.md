# Midnight Legacy - Decentralized Privacy-Preserving Inheritance

Midnight Legacy is a zero-knowledge decentralized application (dApp) built on the Midnight Network that enables a secure, privacy-preserving inheritance and will management system. 

It allows an owner to lock funds or assets, requiring them to "check in" periodically to prove they are active. If they fail to check in before a predefined timeout, a designated beneficiary can claim the inheritance without their identity being publicly revealed on-chain prior to the claim.

## 🌟 Features & Privacy Model

This dApp heavily leverages Midnight's unique capabilities, specifically the **Compact** language and its privacy model (Zero-Knowledge proofs).

### Public State (Transparent Ledger)
- **`lastCheckIn`**: The timestamp of the owner's last activity.
- **`timeout`**: The duration of inactivity allowed before the inheritance can be claimed.
- **`isClaimed`**: A boolean flag indicating whether the inheritance has already been claimed.
- **`beneficiaryCommitment`**: A hash (commitment) of the true beneficiary's identity.
- **`finalBeneficiary`**: The revealed address of the beneficiary, only populated *after* a successful claim.

### Private State (Zero-Knowledge Witnesses)
- **`beneficiaryAddr`**: The private address of the person claiming the will.
- **`secretPasscode`**: A private passcode used to verify the `beneficiaryCommitment`.

**The Privacy Guarantee**: The beneficiary's identity and the secret passcode remain completely private and hidden from the public ledger until the exact moment the inheritance is legitimately claimed. The smart contract uses Zero-Knowledge proofs to verify that the person claiming the inheritance possesses the correct passcode that matches the `beneficiaryCommitment` without ever exposing the passcode itself.

## 🛠 Prerequisites

- Node.js v22+
- Docker (for running the local Midnight node)
- Midnight Lace Wallet (for interacting with the frontend)
- Windows Subsystem for Linux (WSL) with `compact` CLI installed (for compiling the contract on Windows)

## 🚀 Getting Started

### 1. Run the Local Node
Start the local Midnight node, indexer, and proof server using Docker:
```bash
docker compose -f node/docker-compose.yaml up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Compile the Contract
Compile the Compact smart contract using the WSL script:
```bash
npm run compile
```

### 4. Deploy the Contract
Deploy the contract to your local `undeployed` network. This script will automatically create a wallet, fund it with tNight, generate DUST, and deploy the contract:
```bash
npm run deploy
```

### 5. Run the CLI
Interact with the smart contract using the CLI:
```bash
npm run cli
```
From the CLI, you can Check-In (as the owner) or Claim the Inheritance (as the beneficiary).

### 6. Run the Frontend (React + Vite)
Start the frontend interface to interact with the dApp via your browser:
```bash
npm run frontend:dev
```

## 🌍 Local Deployment Hashes

The application has been successfully tested and verified locally. The deployed contract references are as follows:

- **Network**: `undeployed` (Local Midnight Devnet)
- **Deployed Contract Address**: `370123c62a5b7019c07e45280bbe61bdfb174cc297426f2b47491c1bf0a885fc`
- **Deployer Identity**: `mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s`

This contract is locked to the devnet environments configuration.

## 🌐 Vercel Deployment

To deploy your Midnight Legacy frontend to Vercel, you need to configure the project settings to point to the correct directory and framework, and supply the environment variables.

### 1. Project Configuration in Vercel
When you import your GitHub repository into Vercel, configure the following settings:
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite` 
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Environment Variables 
In the Vercel deployment settings, expand the **Environment Variables** section and paste the following block. Vercel will automatically parse them into individual keys:

```text
VITE_NETWORK=preview
VITE_CONTRACT_ADDRESS=370123c62a5b7019c07e45280bbe61bdfb174cc297426f2b47491c1bf0a885fc
VITE_INDEXER_URL=https://indexer.preview.midnight.network/api/v4/graphql
```

## 📸 Deployment Evidence

### Successful Compile Output (Circuits Listed)
![Compile Output Screenshot](docs/compile-output.png)

### Contract Deployed with Address Shown
![Contract Deployed Screenshot](docs/deploy-output.png)

## 🏗 Architecture

- **`contracts/Inheritance.compact`**: The core Zero-Knowledge smart contract written in Compact.
- **`src/deploy.ts`**: Deployment script utilizing the Midnight.js SDK.
- **`src/cli.ts`**: Command-line interface for interacting with the contract state.
- **`frontend/`**: A React application demonstrating how to connect a Midnight Lace Wallet and interact with the deployed dApp.

## 📜 License
MIT
