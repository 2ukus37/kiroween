import express, { Request, Response } from 'express';
import { getTokenBalance, claimRewards } from '../utils/blockchain.js';
import { db } from '../config/firebase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * GET /api/blockchain/balance/:address
 * Get Creator Token balance for an address
 */
router.get(
  '/balance/:address',
  asyncHandler(async (req: Request, res: Response) => {
    const { address } = req.params;

    try {
      const balance = await getTokenBalance(address);

      res.json({
        address,
        balance,
        decimals: 18,
      });
    } catch (error: any) {
      console.error('Error getting token balance:', error.message);
      // Return 0 balance if blockchain call fails
      res.json({
        address,
        balance: '0',
        decimals: 18,
        error: 'Unable to fetch balance from blockchain',
      });
    }
  })
);

/**
 * POST /api/blockchain/claim-rewards
 * Claim engagement rewards for a video
 */
router.post(
  '/claim-rewards',
  asyncHandler(async (req: Request, res: Response) => {
    const { videoId, creatorAddress } = req.body;

    if (!videoId || !creatorAddress) {
      return res.status(400).json({ error: 'videoId and creatorAddress are required' });
    }

    // Get video data
    const videoDoc = await db.collection('videos').doc(videoId).get();

    if (!videoDoc.exists) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = videoDoc.data();

    // Verify ownership
    if (videoData?.creatorWallet !== creatorAddress) {
      return res.status(403).json({ error: 'Not the video creator' });
    }

    // Check if already claimed
    if (videoData?.rewards?.claimed) {
      return res.status(400).json({ error: 'Rewards already claimed for this video' });
    }

    // Get engagement metrics
    const { likes = 0, shares = 0, comments = 0 } = videoData?.engagement || {};

    // Calculate potential rewards
    const potentialRewards = likes * 0.1 + shares * 0.5 + comments * 0.2;
    
    if (potentialRewards === 0) {
      return res.status(400).json({ 
        error: 'No rewards to claim yet. Get more engagement on your video!' 
      });
    }

    // Claim rewards from smart contract
    const result = await claimRewards(
      parseInt(videoId, 36), // Convert videoId to number
      likes,
      shares,
      comments,
      creatorAddress
    );

    if (!result.success) {
      // Provide more helpful error message
      const errorMessage = result.error || 'Blockchain transaction failed';
      console.error('Claim rewards error:', errorMessage);
      
      return res.status(500).json({ 
        error: `Unable to claim rewards: ${errorMessage}. This feature requires a wallet private key to be configured in the backend.`,
        details: result.error
      });
    }

    // Update Firestore
    await db
      .collection('videos')
      .doc(videoId)
      .update({
        'rewards.claimed': true,
        'rewards.amount': parseFloat(result.amount || '0'),
        'rewards.transactionHash': result.hash,
      });

    // Store transaction record
    await db.collection('transactions').add({
      from: '0x0000000000000000000000000000000000000000', // Reward pool
      to: creatorAddress,
      amount: result.amount,
      type: 'reward',
      videoId,
      blockchainHash: result.hash,
      status: 'confirmed',
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      amount: result.amount,
      transactionHash: result.hash,
    });
  })
);

export default router;
