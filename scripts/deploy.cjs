const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Using existing contract addresses
  const nftAddress = "0xE1e5B593de494621Df33dA43728F72C482671775";
  const eventTicketAddress = "0x2b2b6D5107C5F309cc6F68C879387a113Eb66bC9";
  const fractionalizerAddress = "0xC1E1b6603c1614A64df3Bc04Ab711Bc7C02e4b44";

  console.log("Using existing KalaKrutNFT at:", nftAddress);
  console.log("Using existing EventTicket at:", eventTicketAddress);
  console.log("Using existing Fractionalizer at:", fractionalizerAddress);

  const nft = await ethers.getContractAt("KalaKrutNFT", nftAddress);
  const fractionalizer = await ethers.getContractAt("Fractionalizer", fractionalizerAddress);

  // Approve and deposit the NFT
  console.log(`Approving tokenId 0 for Fractionalizer ${fractionalizer.target}...`);
  const approveTx = await nft.approve(fractionalizer.target, 0);
  await approveTx.wait(); // Wait for the transaction to be mined
  console.log("Approval transaction hash:", approveTx.hash);

  // VERIFY blockchain state
  const ownerOfToken = await nft.ownerOf(0);
  console.log("Owner of tokenId 0 is:", ownerOfToken);
  console.log("Deployer address is:", deployer.address);

  const approvedAddress = await nft.getApproved(0);
  console.log("Approved address for tokenId 0 is:", approvedAddress);
  console.log("Fractionalizer address is:", fractionalizer.target);

  console.log("Depositing NFT into Fractionalizer...");
  const depositTx = await fractionalizer.depositNFT();
  await depositTx.wait();
  console.log("NFT deposited. Transaction hash:", depositTx.hash);

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(deployer.address, deployer.address, deployer.address);
  await escrow.waitForDeployment();
  console.log("Escrow deployed to:", escrow.target);

  // Deploy ServiceAgreement
  const ServiceAgreement = await ethers.getContractFactory("ServiceAgreement");
  const serviceAgreement = await ServiceAgreement.deploy(deployer.address, deployer.address, deployer.address, "Sample Service Agreement");
  await serviceAgreement.waitForDeployment();
  console.log("ServiceAgreement deployed to:", serviceAgreement.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
