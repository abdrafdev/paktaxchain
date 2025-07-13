const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy PakTaxChain contract
  const PakTaxChain = await ethers.getContractFactory("PakTaxChain");
  const pakTaxChain = await PakTaxChain.deploy();
  await pakTaxChain.waitForDeployment();

  console.log("PakTaxChain contract deployed to:", await pakTaxChain.getAddress());

  // Deploy TaxpayerNFT contract
  const TaxpayerNFT = await ethers.getContractFactory("TaxpayerNFT");
  const taxpayerNFT = await TaxpayerNFT.deploy();
  await taxpayerNFT.waitForDeployment();

  console.log("TaxpayerNFT contract deployed to:", await taxpayerNFT.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    contracts: {
      PakTaxChain: await pakTaxChain.getAddress(),
      TaxpayerNFT: await taxpayerNFT.getAddress()
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
