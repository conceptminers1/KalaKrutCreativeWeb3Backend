# KALA Token: Creation, Network, and Usage

This document provides a detailed explanation of how the KALA token is created, on which networks it can be deployed, and how it is used within the KalaKrut platform.

## 1. How KALA Currency is Created

The KALA currency is an ERC20 token, which is the standard for creating fungible tokens on Ethereum-compatible blockchains. It is represented by the `KalaKrutToken` contract.

### The Process:

1.  **No Initial Supply**: When a new `KalaKrutToken` contract is deployed, it starts with a total supply of zero.
2.  **Minting New Tokens**: The `mint` function is the only way to create new KALA tokens. This function can only be called by the "owner" of the contract.
3.  **DAO Creation**: The `createDAO` function in the `ContractFactory` contract is what triggers the creation of a new `KalaKrutToken` contract. The user who calls `createDAO` becomes the `initialOwner` of the new token contract.
4.  **Distribution**: The `initialOwner` is then responsible for minting and distributing the KALA tokens to the community. They can mint tokens to their own address, or to the addresses of other users.

In short, a designated administrator creates a new DAO, which in turn creates the KALA token supply. That administrator then controls the minting and distribution of the tokens.

## 2. On Which Network?

The KALA token can be deployed to any Ethereum-compatible blockchain network. The choice of network depends on the project's needs:

*   **Local Development Network**: For testing and development, you can deploy the contracts to a local network using a tool like Hardhat. This is a private network that runs on your computer.
*   **Testnet**: Before deploying to a mainnet, it's highly recommended to deploy to a public testnet like Sepolia or Goerli. These networks are free to use and allow you to test your application in a live environment.
*   **Mainnet**: For a production application with real users and real value, you would deploy to the Ethereum Mainnet or another public blockchain like Polygon or Arbitrum.

The choice of network will affect the cost of deployment and transactions, as well as the security and decentralization of your application.

## 3. How KALA is Used by Users

The primary use of the KALA token, as defined in the contracts, is for **governance**.

*   **Voting Power**: The `KalaKrutToken` contract includes the `ERC20Votes` extension. This means that the token is used to determine a user's voting power in the DAO. The more KALA a user holds, the more weight their vote carries on proposals.
*   **DAO Proposals**: The `KalaKrutGovernor` contract is the heart of the DAO. Users can create proposals to change the rules of the platform, allocate funds from the treasury, or take other actions. KALA token holders can then vote on these proposals.

### Potential Future Uses

While the current contracts focus on governance, here are some other potential uses for the KALA token that you could implement in the future:

*   **On-Platform Transactions**: KALA could be used as the primary currency for buying and selling NFTs, event tickets, and fractionalized art on the platform.
*   **Staking and Rewards**: A system where users can "stake" their KALA tokens to earn rewards, such as a share of platform fees or newly minted tokens.
*   **Access Control**: Holding a certain amount of KALA could grant users access to exclusive features, content, or community channels.
