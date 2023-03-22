require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chaidId: 1337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  paths: {
    artifacts: "./land_measurement/src/artifacts",
  },
};
