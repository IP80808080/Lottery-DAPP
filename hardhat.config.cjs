require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: process.env.GANACHE_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1337,
    },
  },
};
