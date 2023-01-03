// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: {
//     compilers: [
//       {
//         version: "0.7.6",
//         settings: {
//           evmVersion: "istanbul",
//           optimizer: {
//             enabled: true,
//             runs: 1000,
//           },
//         },
//       },
//     ],
//   },
//   networks: {
//     hardhat: {
//       forking: {
//         url: "your",
//       },
//     },
//   },
// };

require("@nomiclabs/hardhat-waffle");
const API_URL = "Your testnet rpc link";
const PRIVATE_KEY = "QgwvY0emyKBYpjSIj1t7wZrizeNhBNMp"
const PUBLIC_KEY = "Your Account Address";

module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/xdjD09WhjdFRD64g1-D61CGDbtJtmfrZ",
        accounts: [`0x${"d5f5147f1a924d20768b4fedf9fa70bb355477e0923c372dc418c5dc957ac4aa"}`],
      },
    },
  },
};
