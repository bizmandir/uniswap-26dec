// Token addresses
//shoaibAddress = "0x0F527785e39B22911946feDf580d87a4E00465f0";
//rayyanAddrss = "0x1D3EDBa836caB11C26A186873abf0fFeB8bbaE63";
//popUpAddress = "0x9C85258d9A00C01d00ded98065ea3840dF06f09c";
tdotAddress= "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
cokuAddrss= "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
AskTrabaajoaddress= "0x0165878A594ca255338adfa4d48449f69242Eb8F";

// Uniswap contract address
//wethAddress = "0xCa57C1d3c2c35E667745448Fef8407dd25487ff8";
//factoryAddress = "0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB";
//swapRouterAddress = "0x124dDf9BdD2DdaD012ef1D5bBd77c00F05C610DA";
//nftDescriptorAddress = "0xe044814c9eD1e6442Af956a817c161192cBaE98F";
//positionDescriptorAddress = "0xaB837301d12cDc4b97f1E910FC56C9179894d9cf";
//positionManagerAddress = "0x4ff1f64683785E0460c24A4EF78D582C2488704f";
wethAddress= "0x5FbDB2315678afecb367f032d93F642f64180aa3";
factoryAddress= "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
swapRouterAddress= "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
nftDescriptorAddress= "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
positionDescriptorAddress= "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
positionManagerAddress= "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

// const { waffle } = require("hardhat");
const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL =
  "https://eth-goerli.g.alchemy.com/v2/cnURwhLXPAyeILTBwvvC3qw-iVg2VMmp";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

const nonfungiblePositionManager = new Contract(
  positionManagerAddress,
  artifacts.NonfungiblePositionManager.abi,
  provider
);

const factory = new Contract(
  factoryAddress,
  artifacts.UniswapV3Factory.abi,
  provider
);

async function deployPool(token0, token1, fee, price) {
  // const [owner] = await ethers.getSigners();
  const MAINNET_URL = "https://eth-goerli.g.alchemy.com/v2/cnURwhLXPAyeILTBwvvC3qw-iVg2VMmp";

  const WALLET_ADDRESS = "0xa985030E0c261D4b663Fd5752250FAe2419DC01D";
  const WALLET_SECRET = "d5f5147f1a924d20768b4fedf9fa70bb355477e0923c372dc418c5dc957ac4aa";
  const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET);
  const signer = wallet.connect(provider);
  const create = await nonfungiblePositionManager
    .connect(signer)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 5000000,
    });

  console.log(create);
  const poolAddress = await factory
    .connect(signer)
    .getPool(token0, token1, fee);
  return poolAddress;
}

async function main() {
  const askcoku = await deployPool(
    AskTrabaajo,
    cokuAddrss,
    3000,
    encodePriceSqrt(1, 1)
  );

  console.log("ASK_COKU=", `'${askcoku}'`);
}

/*
  npx hardhat run --network goerli scripts/deployPool.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
