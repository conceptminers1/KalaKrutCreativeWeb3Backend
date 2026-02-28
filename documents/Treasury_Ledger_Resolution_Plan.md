# Treasury Ledger: Problem and Resolution Plan

This document summarizes the investigation and final plan for implementing the Treasury Ledger feature.

### 1. The Initial Problem

The Treasury Ledger page was not displaying any data. The component responsible, `TreasuryRealDataTable.tsx`, was present but empty.

### 2. The Investigation and Evolving Strategy

Our approach to fixing this evolved as we learned more about the application's architecture.

*   **Attempt 1 (Incorrect Web2 Assumption):** My initial assumption was a standard web application. I tried to populate the table by creating and fetching from a static JSON file (`/api/treasury_transactions.json`). This failed because it did not account for the application's true nature.

*   **Attempt 2 (Correct Web3 Discovery):** The user correctly pointed out that this is a Web3 dApp with smart contracts. After listing the project files, we confirmed the existence of `contracts/Treasury.sol` and a Hardhat environment. The new plan was to connect the frontend to the smart contract to read its transaction history.

*   **Attempt 3 (Smart Contract Analysis):** Upon reading `Treasury.sol`, we discovered it does not store a list of transactions directly. Instead, it emits `FundsDeposited` and `FundsWithdrawn` events. The plan was updated to query the blockchain for these historical events.

*   **Attempt 4 (User Insight - The Hybrid Model):** The user made the crucial observation that a real treasury must show **both crypto and fiat** transactions. A ledger showing only on-chain data would be incomplete. This insight was pivotal.

*   **Attempt 5 (Backend Reality Check):** To implement the hybrid model, we needed a source for fiat transactions. We investigated the backend server code (`server/src/index.js`) and, most importantly, the database schema (`server/prisma/schema.prisma`). We concluded that **the backend functionality to store and serve general fiat transactions has not been built yet.**

### 3. The Final, Pragmatic Solution

Based on our complete understanding, the final plan acknowledges the current state of the backend while delivering a fully functional and visually complete user interface.

1.  **Fetch Live On-Chain Data:** The `TreasuryRealDataTable.tsx` component will use the `useWeb3` hook and `ethers.js` to connect to the deployed `Treasury` smart contract. It will query the blockchain for all `FundsDeposited` and `FundsWithdrawn` events to build a list of real, live crypto transactions.

2.  **Use a Temporary Fiat Data Source:** For off-chain (fiat) data like operational expenses and grants, the component will fetch data from the `public/api/treasury_dashboard.json` file. This acts as a well-structured placeholder until the backend is developed.

3.  **Merge and Display:** The component will fetch from both sources simultaneously, merge the two datasets into a single list, and sort them chronologically. The final table will display a unified ledger with clear labels for on-chain (ETH) and off-chain (USD) transactions.

This hybrid approach allows us to proceed immediately, delivering a feature-complete Treasury Ledger that is ready to be seamlessly connected to a real fiat transaction API in the future without requiring any UI changes.
