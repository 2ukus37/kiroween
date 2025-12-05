import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CreatorToken, RewardPool } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('RewardPool', function () {
  let creatorToken: CreatorToken;
  let rewardPool: RewardPool;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;

  beforeEach(async function () {
    [owner, creator] = await ethers.getSigners();

    // Deploy CreatorToken
    const CreatorTokenFactory = await ethers.getContractFactory('CreatorToken');
    creatorToken = await CreatorTokenFactory.deploy();
    await creatorToken.waitForDeployment();

    // Deploy RewardPool
    const RewardPoolFactory = await ethers.getContractFactory('RewardPool');
    rewardPool = await RewardPoolFactory.deploy(await creatorToken.getAddress());
    await rewardPool.waitForDeployment();

    // Transfer ownership of CreatorToken to RewardPool
    await creatorToken.transferOwnership(await rewardPool.getAddress());
  });

  describe('Deployment', function () {
    it('Should set the correct creator token address', async function () {
      expect(await rewardPool.creatorToken()).to.equal(await creatorToken.getAddress());
    });

    it('Should set correct reward rates', async function () {
      expect(await rewardPool.LIKE_REWARD()).to.equal(ethers.parseEther('0.1'));
      expect(await rewardPool.SHARE_REWARD()).to.equal(ethers.parseEther('0.5'));
      expect(await rewardPool.COMMENT_REWARD()).to.equal(ethers.parseEther('0.2'));
      expect(await rewardPool.VIRAL_BONUS()).to.equal(ethers.parseEther('50'));
      expect(await rewardPool.VIRAL_THRESHOLD()).to.equal(1000);
    });
  });

  describe('Reward Calculation', function () {
    it('Should calculate rewards correctly for likes only', async function () {
      const reward = await rewardPool.calculateReward(1, 10, 0, 0);
      expect(reward).to.equal(ethers.parseEther('1')); // 10 * 0.1
    });

    it('Should calculate rewards correctly for shares only', async function () {
      const reward = await rewardPool.calculateReward(1, 0, 10, 0);
      expect(reward).to.equal(ethers.parseEther('5')); // 10 * 0.5
    });

    it('Should calculate rewards correctly for comments only', async function () {
      const reward = await rewardPool.calculateReward(1, 0, 0, 10);
      expect(reward).to.equal(ethers.parseEther('2')); // 10 * 0.2
    });

    it('Should calculate combined rewards correctly', async function () {
      const reward = await rewardPool.calculateReward(1, 10, 5, 3);
      // (10 * 0.1) + (5 * 0.5) + (3 * 0.2) = 1 + 2.5 + 0.6 = 4.1
      expect(reward).to.equal(ethers.parseEther('4.1'));
    });

    it('Should add viral bonus for 1000+ likes', async function () {
      const reward = await rewardPool.calculateReward(1, 1000, 0, 0);
      // (1000 * 0.1) + 50 = 150
      expect(reward).to.equal(ethers.parseEther('150'));
    });

    it('Should not add viral bonus for 999 likes', async function () {
      const reward = await rewardPool.calculateReward(1, 999, 0, 0);
      expect(reward).to.equal(ethers.parseEther('99.9')); // 999 * 0.1
    });
  });

  describe('Claiming Rewards', function () {
    it('Should allow claiming rewards', async function () {
      const videoId = 1;
      const tx = await rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3);
      await tx.wait();

      const expectedReward = ethers.parseEther('4.1');
      expect(await creatorToken.balanceOf(creator.address)).to.equal(expectedReward);
    });

    it('Should emit RewardClaimed event', async function () {
      const videoId = 1;
      const expectedReward = ethers.parseEther('4.1');

      await expect(rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3))
        .to.emit(rewardPool, 'RewardClaimed')
        .withArgs(creator.address, videoId, expectedReward);
    });

    it('Should mark video as claimed', async function () {
      const videoId = 1;
      await rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3);
      expect(await rewardPool.hasClaimedReward(videoId)).to.be.true;
    });

    it('Should not allow claiming twice for same video', async function () {
      const videoId = 1;
      await rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3);

      await expect(
        rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3)
      ).to.be.revertedWith('Rewards already claimed');
    });

    it('Should not allow claiming with no engagement', async function () {
      const videoId = 1;
      await expect(
        rewardPool.connect(creator).claimEngagementReward(videoId, 0, 0, 0)
      ).to.be.revertedWith('No engagement to reward');
    });

    it('Should update creator balance tracking', async function () {
      const videoId = 1;
      const expectedReward = ethers.parseEther('4.1');

      await rewardPool.connect(creator).claimEngagementReward(videoId, 10, 5, 3);
      expect(await rewardPool.creatorBalances(creator.address)).to.equal(expectedReward);
    });
  });
});
