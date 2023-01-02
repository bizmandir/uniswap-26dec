const { Contract, ContractFactory, utils, BigNumber } = require("ethers");

const WETH9 = require("../Context/WETH9.json");

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

const linkLibraries = ({ bytecode, linkReferences }, libraries) => {
  Object.keys(linkReferences).forEach((fileName) => {
    Object.keys(linkReferences[fileName]).forEach((contractName) => {
      if (!libraries.hasOwnProperty(contractName)) {
        throw new Error(`Missing link library name ${contractName}`);
      }

      const address = utils
        .getAddress(libraries[contractName])
        .toLowerCase()
        .slice(2);

      linkReferences[fileName][contractName].forEach(({ start, length }) => {
        const start2 = 2 + start * 2;
        const length2 = length * 2;

        bytecode = bytecode
          .slice(0, start2)
          .concat(address)
          .concat(bytecode.slice(start2 + length2, bytecode.length));
      });
    });
  });

  return bytecode;
};

async function main() {
   const MAINNET_URL =
     "https://eth-mainnet.g.alchemy.com/v2/xdjD09WhjdFRD64g1-D61CGDbtJtmfrZ";

  // const WALLET_ADDRESS = "0xa985030E0c261D4b663Fd5752250FAe2419DC01D";
  // const WALLET_SECRET =
  //   "d5f5147f1a924d20768b4fedf9fa70bb355477e0923c372dc418c5dc957ac4aa";
  // const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
  // const wallet = new ethers.Wallet(WALLET_SECRET);
  // const signer = wallet.connect(provider);

  const [signer] = await ethers.getSigners();
  Weth = new ContractFactory(
    artifacts.WETH9.abi,
    artifacts.WETH9.bytecode,
    signer
  );
  weth = await Weth.deploy();

  Factory = new ContractFactory(
    artifacts.UniswapV3Factory.abi,
    artifacts.UniswapV3Factory.bytecode,
    signer
  );
  factory = await Factory.deploy();

  SwapRouter = new ContractFactory(
    artifacts.SwapRouter.abi,
    artifacts.SwapRouter.bytecode,
    signer
  );
  swapRouter = await SwapRouter.deploy(factory.address, weth.address);

  NFTDescriptor = new ContractFactory(
    artifacts.NFTDescriptor.abi,
    artifacts.NFTDescriptor.bytecode,
    signer
  );
  nftDescriptor = await NFTDescriptor.deploy();

  const linkedBytecode = linkLibraries(
    {
      bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
      linkReferences: {
        "NFTDescriptor.sol": {
          NFTDescriptor: [
            {
              length: 20,
              start: 1261,
            },
          ],
        },
      },
    },
    {
      NFTDescriptor: nftDescriptor.address,
    }
  );

  NonfungibleTokenPositionDescriptor = new ContractFactory(
    artifacts.NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    signer
  );

  nonfungibleTokenPositionDescriptor =
    await NonfungibleTokenPositionDescriptor.deploy(weth.address);

  console.log(nonfungibleTokenPositionDescriptor);
  NonfungiblePositionManager = new ContractFactory(
    artifacts.NonfungiblePositionManager.abi,
    artifacts.NonfungiblePositionManager.bytecode,
    signer
  );
  nonfungiblePositionManager = await NonfungiblePositionManager.deploy(
    factory.address,
    weth.address,
    nonfungibleTokenPositionDescriptor.address
  );

  console.log("wethAddress=", `'${weth.address}'`);
  console.log("factoryAddress=", `'${factory.address}'`);
  console.log("swapRouterAddress=", `'${swapRouter.address}'`);
  console.log("nftDescriptorAddress=", `'${nftDescriptor.address}'`);
  console.log(
    "positionDescriptorAddress=",
    `'${nonfungibleTokenPositionDescriptor.address}'`
  );
  console.log(
    "positionManagerAddress=",
    `'${nonfungiblePositionManager.address}'`
  );
}

/*
// npx hardhat run --network localhost scripts/uniswapContract.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
