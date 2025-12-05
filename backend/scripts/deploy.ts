import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Starting deployment...\n');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'MATIC\n');

  // Deploy CreatorToken
  console.log('📝 Deploying CreatorToken...');
  const CreatorTokenFactory = await ethers.getContractFactory('CreatorToken');
  const creatorToken = await CreatorTokenFactory.deploy();
  await creatorToken.waitForDeployment();
  const creatorTokenAddress = await creatorToken.getAddress();
  console.log('✅ CreatorToken deployed to:', creatorTokenAddress);

  // Deploy ContentNFT
  console.log('\n📝 Deploying ContentNFT...');
  const ContentNFTFactory = await ethers.getContractFactory('ContentNFT');
  const contentNFT = await ContentNFTFactory.deploy();
  await contentNFT.waitForDeployment();
  const contentNFTAddress = await contentNFT.getAddress();
  console.log('✅ ContentNFT deployed to:', contentNFTAddress);

  // Deploy RewardPool
  console.log('\n📝 Deploying RewardPool...');
  const RewardPoolFactory = await ethers.getContractFactory('RewardPool');
  const rewardPool = await RewardPoolFactory.deploy(creatorTokenAddress);
  await rewardPool.waitForDeployment();
  const rewardPoolAddress = await rewardPool.getAddress();
  console.log('✅ RewardPool deployed to:', rewardPoolAddress);

  // Transfer ownership of CreatorToken to RewardPool
  console.log('\n🔄 Transferring CreatorToken ownership to RewardPool...');
  const transferTx = await creatorToken.transferOwnership(rewardPoolAddress);
  await transferTx.wait();
  console.log('✅ Ownership transferred');

  // Save deployment addresses
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      CreatorToken: creatorTokenAddress,
      ContentNFT: contentNFTAddress,
      RewardPool: rewardPoolAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `deployment-${deploymentInfo.chainId}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n📄 Deployment info saved to:', filename);
  console.log('\n🎉 Deployment complete!\n');
  console.log('Contract Addresses:');
  console.log('-------------------');
  console.log('CreatorToken:', creatorTokenAddress);
  console.log('ContentNFT:', contentNFTAddress);
  console.log('RewardPool:', rewardPoolAddress);
  console.log('\n💡 Update your .env files with these addresses');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
