// Token addresses
tdotAddrss=  "0xD832462B1bE2b0c600CC87b734E630408736E875";
cokuAddress= "0x52e8ED5e47544b9Cf92f744EaAe0B1438B91Bb70";
AskTrabaajoaddress= "0xF60be104fB98bDC81E3B0B9525C715a041f60c91";

SHO_RAY = "0xEED35b5e260d3Da1741B3967Ad15127A802a2d80";

// Uniswap contract address
wethAddress= '0xA359D4C2D45495B6fbb2495e67ff2FF5D6fe1eF7';
factoryAddress= '0x72C0C5e08f1B222475CF79bb6a7e650acf629927';
swapRouterAddress= '0x7b8b250273B0C1407450E9F3333F9fDE01088CA7';
nftDescriptorAddress= '0x6ecbc541f2fB1498b6b23772Ec1528dDdEdaDE64';
positionDescriptorAddress= '0x66D5888faB880a7408174dbB3dbB0Dc6bD2a3c02';
positionManagerAddress= '0x11A5396515c7b7FaD8152b42f099335F98cCA82c';

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  coku: require("../artifacts/contracts/coku.sol/coku.json"),
  tdot: require("../artifacts/contracts/tdot.sol/tdot.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  console.log(tickSpacing, fee, liquidity, slot0);
  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

async function main() {
  const MAINNET_URL = "https://eth-mainnet.g.alchemy.com/v2/xdjD09WhjdFRD64g1-D61CGDbtJtmfrZ";

  const WALLET_ADDRESS = "0xa985030E0c261D4b663Fd5752250FAe2419DC01D";
  const WALLET_SECRET = "d5f5147f1a924d20768b4fedf9fa70bb355477e0923c372dc418c5dc957ac4aa";
  const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET);
  const signer = wallet.connect(provider);

  const cokuContract = new Contract(
    cokuAddress,
    artifacts.coku.abi,
    provider
  );
  const tdotContract = new Contract(
    tdotAddrss,
    artifacts.tdot.abi,
    provider
  );

  await cokuContract.connect(signer).approve(
    positionManagerAddress,
    ethers.utils.parseEther("599900")
  );
  await tdotContract.connect(signer).approve(
    positionManagerAddress,
    ethers.utils.parseEther("599900")
  );

  const poolContract = new Contract(
    SHO_RAY,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  const poolData = await getPoolData(poolContract);

  const cokuToken = new Token(5, cokuAddress, 18, "coku", "SHO");
  const tdotToken = new Token(5, tdotAddrss, 18, "tdot", "RAY");

  const pool = new Pool(
    cokuToken,
    tdotToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

  const position = new Position({
    pool: pool,
    liquidity: ethers.utils.parseUnits("2000", 18).toString(),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });
  console.log(position);
  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

  params = {
    token0: cokuAddress,
    token1: tdotAddrss,
    fee: poolData.fee,
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: amount0Desired.toString(),
    amount1Min: amount1Desired.toString(),
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  const tx = await nonfungiblePositionManager
    .connect(signer)
    .mint(params, { gasLimit: "1000000" });
  const receipt = await tx.wait();
  console.log(receipt);
}

/*
  npx hardhat run --network localhost scripts/addLiquidity.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
