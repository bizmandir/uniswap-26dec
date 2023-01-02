// Token addresses
tdotAddrss=  "0xD832462B1bE2b0c600CC87b734E630408736E875";
cokuAddress= "0x52e8ED5e47544b9Cf92f744EaAe0B1438B91Bb70";
AskTrabaajoaddress= "0xF60be104fB98bDC81E3B0B9525C715a041f60c91";

// Uniswap contract address
wethAddress= '0xA359D4C2D45495B6fbb2495e67ff2FF5D6fe1eF7';
factoryAddress= '0x72C0C5e08f1B222475CF79bb6a7e650acf629927';
swapRouterAddress= '0x7b8b250273B0C1407450E9F3333F9fDE01088CA7';
nftDescriptorAddress= '0x6ecbc541f2fB1498b6b23772Ec1528dDdEdaDE64';
positionDescriptorAddress= '0x66D5888faB880a7408174dbB3dbB0Dc6bD2a3c02';
positionManagerAddress= '0x11A5396515c7b7FaD8152b42f099335F98cCA82c';


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
  const MAINNET_URL = "https://eth-mainnet.g.alchemy.com/v2/xdjD09WhjdFRD64g1-D61CGDbtJtmfrZ";

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
  const shoRay = await deployPool(
    tdotAddrss,
    cokuAddress,
    3000,
    encodePriceSqrt(1, 1)
  );

  console.log("SHO_RAY=", `'${shoRay}'`);
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
