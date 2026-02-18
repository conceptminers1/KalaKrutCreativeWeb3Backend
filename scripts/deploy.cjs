const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Resuming deployment with the account:", deployer.address);

  // --- USE ALREADY DEPLOYED CONTRACTS ---
  const tokenAddress = "0x67eeAedF8A791BB4e661959Bf2e5aa8ab2d12776";
  const timelockAddress = "0xe9E5D4a9B223679eB86A0a913A8FafD3afD73C61";
  const deployedGovernorAddress = "0xDC304662539550251eD88467CE06E49F130C3E02";
  const treasuryAddress = "0x2f567D9057530a161F7AFc27cEf655335995d535";
  const nftAddress = "0x369D9d5DD6706025C6F0376df9000C03e18daEE7";
  const ticketAddress = "0x5dEA09497196D0A3E3676956e28Aa4c428313e8e";
  const fractionalizerAddress = "0x39b15Af3C4a222adDf69098149E02B965d40f9af";
  const escrowAddress = "0x9F9601e0288Ca1d23E5A16da9DC98032Cf045eb8";

  console.log("Using existing KalaKrutToken at:", tokenAddress);
  console.log("Using existing TimelockController at:", timelockAddress);
  console.log("Using existing KalaKrutGovernor at:", deployedGovernorAddress);
  console.log("Using existing Treasury at:", treasuryAddress);
  console.log("Using existing KalaKrutNFT at:", nftAddress);
  console.log("Using existing EventTicket at:", ticketAddress);
  console.log("Using existing Fractionalizer at:", fractionalizerAddress);
  console.log("Using existing Escrow at:", escrowAddress);


  // Get an instance of the TimelockController contract
  const timelock = await ethers.getContractAt("TimelockController", timelockAddress);


 
  // Deploy KalaKrutToken
  const KalaKrutToken = await ethers.getContractFactory("KalaKrutToken");
  const token = await KalaKrutToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("KalaKrutToken deployed to:", tokenAddress);

  // Pre-calculate Governor address to pass to Timelock constructor
  const nonce = await deployer.getNonce();
  const governorNonce = nonce + 1; // Timelock is deployed next, then governor
  const governorAddress = ethers.getCreateAddress({ from: deployer.address, nonce: governorNonce });

  // Deploy TimelockController
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const minDelay = 1; // 1 second for testnet
  const proposers = [governorAddress];
  const executors = ["0x0000000000000000000000000000000000000000"]; // address(0) means anyone can execute
  const admin = deployer.address; // Deployer is admin initially to set up roles
  const timelock = await TimelockController.deploy(minDelay, proposers, executors, admin);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("TimelockController deployed to:", timelockAddress);

  // Deploy KalaKrutGovernor
  const KalaKrutGovernor = await ethers.getContractFactory("KalaKrutGovernor");
  const governor = await KalaKrutGovernor.deploy(tokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const deployedGovernorAddress = await governor.getAddress();
  console.log("KalaKrutGovernor deployed to:", deployedGovernorAddress);
 
  // --- Configure Roles (Resuming from here) ---
  console.log("Configuring Timelock roles...");
  // Manually get the role hash to bypass the error from the previous attempt
  const TIMELOCK_ADMIN_ROLE = ethers.id("TIMELOCK_ADMIN_ROLE");
  
  // The PROPOSER_ROLE was already granted to the governor in the TimelockController constructor.
  // Now, set up the admin roles. The best practice is to make the Timelock itself its own admin.
  console.log("Granting TIMELOCK_ADMIN_ROLE to the Timelock itself...");
  let tx = await timelock.grantRole(TIMELOCK_ADMIN_ROLE, timelockAddress);
  await tx.wait();

  console.log("Renouncing deployer's TIMELOCK_ADMIN_ROLE...");
  tx = await timelock.renounceRole(TIMELOCK_ADMIN_ROLE, deployer.address);
  await tx.wait();
  console.log("Deployer renounced TIMELOCK_ADMIN_ROLE.");


  // Deploy Treasury and transfer ownership to Timelock
  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(deployedGovernorAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("Treasury deployed to:", treasuryAddress);

  // Deploy KalaKrutNFT
  const KalaKrutNFT = await ethers.getContractFactory("KalaKrutNFT");
  const nft = await KalaKrutNFT.deploy(deployer.address, "KalaKrut NFT", "KKNFT");
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("KalaKrutNFT deployed to:", nftAddress);
  await nft.safeMint(deployer.address, "ipfs://some-uri");
  console.log("Minted a test NFT to the deployer.");

  // Deploy EventTicket
  const EventTicket = await ethers.getContractFactory("EventTicket");
  const ticket = await EventTicket.deploy(deployer.address, "ipfs://event-uri");
  await ticket.waitForDeployment();
  console.log("EventTicket (sample) deployed to:", await ticket.getAddress());

  // Deploy Fractionalizer
  const Fractionalizer = await ethers.getContractFactory("Fractionalizer");
  
  // Pre-calculate the fractionalizer address to approve the NFT transfer beforehand
  const fractionalizerNonce = (await deployer.getNonce()) + 1;
  const fractionalizerAddress = ethers.getCreateAddress({ from: deployer.address, nonce: fractionalizerNonce });
  
  const approveTx = await nft.approve(fractionalizerAddress, 0);
  await approveTx.wait();
  console.log(`Pre-approved Fractionalizer (${fractionalizerAddress}) to take NFT #0`);

  const fractionalizer = await Fractionalizer.deploy(
    deployer.address,
    "Fractional NFT",
    "FNFT",
    nftAddress,
    0,
    1000
  );
  await fractionalizer.waitForDeployment();
  console.log("Fractionalizer deployed to:", await fractionalizer.getAddress());

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(deployer.address, deployer.address, deployer.address);
  await escrow.waitForDeployment();
  console.log("Escrow (sample) deployed to:", await escrow.getAddress());
  
  // Deploy ContractFactory
  const ContractFactory = await ethers.getContractFactory("ContractFactory");
  const factory = await ContractFactory.deploy(deployer.address);
  await factory.waitForDeployment();
  console.log("ContractFactory deployed to:", await factory.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
