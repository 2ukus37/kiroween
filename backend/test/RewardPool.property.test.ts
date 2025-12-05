import { expect } from 'chai';
import { ethers } from 'hardhat';
import fc from 'fast-check';
import { CreatorToken, RewardPool } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('RewardPool Property-Based Tests', function () {
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

  // Feature: video-platform-core, Property 6: Like reward calculation
  // Feature: video-platform-core, Property 7: Share reward calculation
  // Feature: video-platform-core, Property 8: Comment reward calculation
  it('Property 6, 7, 8: Reward calculation for likes, shares, and comments', async function () {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 999 }), // likes (below viral threshold)
        fc.integer({ min: 0, max: 100 }), // shares
        fc.integer({ min: 0, max: 100 }), // comments
        async (likes, shares, comments) => {
          const videoId = Math.floor(Math.random() * 1000000);

          const LIKE_REWARD = ethers.parseEther('0.1');
          const SHARE_REWARD = ethers.parseEther('0.5');
          const COMMENT_REWARD = ethers.parseEther('0.2');

          const expectedReward =
            BigInt(likes) * LIKE_REWARD +
            BigInt(shares) * SHARE_REWARD +
            BigInt(comments) * COMMENT_REWARD;

          const calculatedReward = await rewardPool.calculateReward(
            videoId,
            likes,
            shares,
            comments
          );

          expect(calculatedReward).to.equal(expectedReward);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: video-platform-core, Property 9: Viral bonus threshold
  it('Property 9: Awards 50 DTC bonus at exactly 1000 likes', async function () {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 2000 }), // likes range around threshold
        fc.integer({ min: 0, max: 50 }), // shares
        fc.integer({ min: 0, max: 50 }), // comments
        async (likes, shares, comments) {
          const videoId = Math.floor(Math.random() * 1000000);

          const LIKE_REWARD = ethers.parseEther('0.1');
          const SHARE_REWARD = ethers.parseEther('0.5');
          const COMMENT_REWARD = ethers.parseEther('0.2');
          const VIRAL_BONUS = ethers.parseEther('50');

          const baseReward =
            BigInt(likes) * LIKE_REWARD +
            BigInt(shares) * SHARE_REWARD +
            BigInt(comments) * COMMENT_REWARD;

          const viralBonus = likes >= 1000 ? VIRAL_BONUS : 0n;
          const expectedReward = baseReward + viralBonus;

          const calculatedReward = await rewardPool.calculateReward(
            videoId,
            likes,
            shares,
            comments
          );

          expect(calculatedReward).to.equal(expectedReward);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: video-platform-core, Property 10: Reward claim idempotence
  it('Property 10: Prevents duplicate reward claims', async function () {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // likes
        fc.integer({ min: 0, max: 50 }), // shares
        fc.integer({ min: 0, max: 50 }), // comments
        async (likes, shares, comments) => {
          const videoId = Math.floor(Math.random() * 1000000);

          // First claim should succeed
          const tx = await rewardPool
            .connect(creator)
            .claimEngagementReward(videoId, likes, shares, comments);
          await tx.wait();

          const claimed = await rewardPool.hasClaimedReward(videoId);
          expect(claimed).to.be.true;

          // Second claim should fail
          await expect(
            rewardPool.connect(creator).claimEngagementReward(videoId, likes, shares, comments)
          ).to.be.revertedWith('Rewards already claimed');
        }
      ),
      { numRuns: 100 }
    );
  });
});
