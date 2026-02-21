require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "cancun"
        }
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: "cancun"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: 16777216,
      gasPrice: 8000000000
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/eAp31vpS8Z37pUE5v5gF_",
      accounts: ["23ab8bfe4bd51eafca5abd6f19ff23fc1405bd7683181f09a88bfaae41ca4c4d"]
    }
  }
};
