const hre = require("hardhat");

async function main() {
  const Lottery = await hre.ethers.getContractFactory("SimpleLottery");
  const lottery = await Lottery.deploy();

  await lottery.waitForDeployment();

  console.log("Lottery deployed to:", await lottery.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// If you want to use this script as a module
if (require.main === module) {
  main();
}

module.exports = main;
