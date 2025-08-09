const hre = require("hardhat");

async function main() {
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  // Wait until the contract is deployed
  await escrow.waitForDeployment();

  console.log("Escrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
