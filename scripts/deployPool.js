// Token addresses
//shoaibAddress = "0x0F527785e39B22911946feDf580d87a4E00465f0";
//rayyanAddrss = "0x1D3EDBa836caB11C26A186873abf0fFeB8bbaE63";
//popUpAddress = "0x9C85258d9A00C01d00ded98065ea3840dF06f09c";

tdotAddress= "0xdD3ff18d5dc010fA9911756572E0Ac2016DB7808",
cokuAddrss= "0xA87e6703b9243941Af4Ebd0F152566F5D26B30d1",
AskTrabaajoaddress= "0xA5a9fECBd49963eFc946d8b5B36b165CA70C359C",

// Uniswap contract address
wethAddress = "0x6F6fbe0dD1A1D157e23fab3392e9ef99f7e03BFC";
factoryAddress = "0x826A7339Ac4802153C98e6EA9f46F22cfC567Ac9";
swapRouterAddress = "0x884D26e1070E3b74533FDd9C4Ccb984ebbBD490d";
nftDescriptorAddress = "0xe6E2407a888bB82AbFdDe11756Cd1441C61B68EB";
positionDescriptorAddress = "0x2175d59A91b5279e15e6EBBF8DBe539Fe9817fB9";
positionManagerAddress = "0x16A32d960fAD1B28dFd3a1a4caAf3285FAF58163";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { waffle } = require("hardhat");
const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL = "https://eth-goerli.g.alchemy.com/v2/QgwvY0emyKBYpjSIj1t7wZrizeNhBNMp";

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
  const [owner] = await ethers.getSigners();
  const MAINNET_URL = "https://eth-goerli.g.alchemy.com/v2/QgwvY0emyKBYpjSIj1t7wZrizeNhBNMp";

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
    .connect(owner)
    .getPool(token0, token1, fee);
  return poolAddress;
}

async function main() {
  const askcoku = await deployPool(
    AskTrabaajoaddress,
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
