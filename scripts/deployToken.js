async function main() {
  const [owner] = await ethers.getSigners();

  AskTrabaajo = await ethers.getContractFactory("AskTrabaajo");
  AskTrabaajo = await AskTrabaajo.deploy();

  tdot = await ethers.getContractFactory("tdot");
  tdot = await tdot.deploy();

  coku = await ethers.getContractFactory("coku");
  coku = await coku.deploy();

  

  console.log("tdotAddress=", `'${tdot.address}'`);
  console.log("cokuAddrss=", `'${coku.address}'`);
  console.log("AskTrabaajoaddress=", `'${AskTrabaajo.address}'`);

}

/*
  npx hardhat run --network localhost scripts/deployToken.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
