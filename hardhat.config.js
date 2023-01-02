require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.7.6",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/QgwvY0emyKBYpjSIj1t7wZrizeNhBNMp",
      accounts: ["d5f5147f1a924d20768b4fedf9fa70bb355477e0923c372dc418c5dc957ac4aa"],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "D2ZNYW7R5D35H4PP7SEJW3EYUAH5A2DFM6",
  },
};

//npm install --save-dev @nomiclabs/hardhat-etherscan
