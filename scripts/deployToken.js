async function main() {
  const [owner] = await ethers.getSigners();

  AskTrabaajo = await ethers.getContractFactory("AskTrabaajo");
  AskTrabaajo = await AskTrabaajo.deploy();

  Shoaib = await ethers.getContractFactory("Shoaib");
  shoaib = await Shoaib.deploy();

  Rayyan = await ethers.getContractFactory("Rayyan");
  rayyan = await Rayyan.deploy();

  PopUp = await ethers.getContractFactory("PopUp");
  popUp = await PopUp.deploy();

  console.log("shoaibAddress=", `'${shoaib.address}'`);
  console.log("rayyanAddrss=", `'${rayyan.address}'`);
  console.log("popUpAddress=", `'${popUp.address}'`);
  console.log("popUpAddress=", `'${AskTrabaajo.address}'`);

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
