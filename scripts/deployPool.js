// Token addresses
tdotAddrss=  "0x01cf58e264d7578D4C67022c58A24CbC4C4a304E";
cokuAddress= "0xd038A2EE73b64F30d65802Ad188F27921656f28F";
AskTrabaajoaddress= "0x25C0a2F0A077F537Bd11897F04946794c2f6f1Ef";

// Uniswap contract address
wethAddress= "0x0F527785e39B22911946feDf580d87a4E00465f0";
factoryAddress= "0x1D3EDBa836caB11C26A186873abf0fFeB8bbaE63";
swapRouterAddress= "0x9C85258d9A00C01d00ded98065ea3840dF06f09c";
nftDescriptorAddress= "0xFCFE742e19790Dd67a627875ef8b45F17DB1DaC6";
positionDescriptorAddress= "0x398E4948e373Db819606A459456176D31C3B1F91";
positionManagerAddress= "0xbe18A1B61ceaF59aEB6A9bC81AB4FB87D56Ba167";


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
  "https://eth-mainnet.g.alchemy.com/v2/xdjD09WhjdFRD64g1-D61CGDbtJtmfrZ";

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
