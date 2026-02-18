
# Smart Contract System: Overview and Implementation Guide

## 1. Introduction

This document provides a comprehensive overview of the KalaKrut platform's smart contract architecture. The system is divided into two primary categories:

1.  **Core Platform Contracts**: Singleton contracts that form the foundational infrastructure of the DAO, the treasury, and the main NFT marketplace. These are deployed once by administrators.
2.  **User-Driven Contracts**: Contracts that can be dynamically created by authorized users through the `ContractFactory` to serve specific purposes like creating an escrow or a new event ticket series.

---

## 2. Managing Contract Addresses (Critical Step)

When the `scripts/deploy.cjs` script is run, it deploys the smart contracts to a blockchain network. Each contract is assigned a unique and permanent address **on that specific network**. The frontend application **must** be configured with these addresses to function.

### **IMPORTANT: Local vs. Public Network Addresses**

The addresses you see when running a script locally (e.g., with `npx hardhat run`) are from a **temporary, local test blockchain**. These addresses are for testing and debugging only. They are erased when the test run finishes and **are not publicly accessible**.

To get the real, persistent addresses that your web application will use, you must deploy the contracts to a public network like the **Sepolia testnet**.

### The Correct Workflow

1.  **Deploy to Sepolia**: Run the deployment script targeting the Sepolia network (e.g., `npx hardhat run scripts/deploy.cjs --network sepolia`).
2.  **Capture the Output**: The script will print the name and address of each deployed contract to the console. **This output from the Sepolia deployment is what you must save.**

    ```
    // Example output from a Sepolia deployment
    KalaKrutToken deployed to: 0xabc...123
    TimelockController deployed to: 0xdef...456
    KalaKrutGovernor deployed to: 0xghi...789
    ContractFactory deployed to: 0xjkl...012
    // ...and so on for all contracts.
    ```

3.  **Configure the Frontend**: These permanent addresses must be stored in a configuration file within the frontend application (e.g., in `src/config.ts` or as environment variables). The frontend code will then import these addresses to communicate with the live contracts on Sepolia.

**You must update this configuration after every new deployment to a public network.**

---

## 3. Core Platform Contracts

These are the central pillars of the platform, deployed once per network.

### a. `KalaKrutNFT.sol`
-   **Purpose**: The central ERC-721 contract for all art minted on the platform.
-   **Portal Integration**: The **`CreativeStudio.tsx`** component allows artists to mint new tokens within this contract.

### b. `KalaKrutToken.sol` (KKT)
-   **Purpose**: An ERC-20 governance token representing voting power in the DAO.
-   **Portal Integration**: Users view their balance in their profile. The **`DaoGovernance.tsx`** page uses the balance to determine voting power.

### c. `KalaKrutGovernor.sol`
-   **Purpose**: The core of the DAO, allowing KKT holders to create and vote on proposals.
-   **Portal Integration**: The **`DaoGovernance.tsx`** component is the main interface for all voting and proposal activities.

### d. `Treasury.sol`
-   **Purpose**: Holds platform funds. Can only be controlled by the DAO's `Timelock`.
-   **Portal Integration**: The **`TreasuryDashboard.tsx`** provides a view-only interface for transparency. All fund movements must be approved via a governance vote.

### e. `TimelockController.sol`
-   **Purpose**: Adds a mandatory time delay to all passed proposals for security.
-   **Portal Integration**: Works in the background. The **`DaoGovernance.tsx`** page displays the timelock status of proposals.

---

## 4. User-Driven Contracts via `ContractFactory.sol`

The `ContractFactory` allows authorized users to create new contracts on demand.

### a. `ContractFactory.sol`
-   **Purpose**: A secure on-chain API for deploying new `Escrow` and `EventTicket` contracts.
-   **Portal Integration**: A new admin page (e.g., **`AdminContracts.tsx`**) will provide a UI to select a contract type, enter parameters, and click "Create". The frontend listens for the `ContractCreated` event to confirm success and display the new contract's address.

### b. `Escrow.sol`
-   **Purpose**: A two-party escrow contract with an arbiter.

### c. `EventTicket.sol`
-   **Purpose**: A simple NFT contract to represent event tickets.
