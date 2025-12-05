import express, { Request, Response } from 'express';
import multer from 'multer';
import { db } from '../config/firebase.js';
import { validateVideoUpload } from '../utils/validation.js';
import { pinFileToIPFS } from '../utils/ipfs.js';
import { mintContentNFT } from '../utils/blockchain.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { moderateContent } from '../utils/moderation.js';
import { saveVideoLocally } from '../utils/localStorage.js';
import { io } from '../server.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

/**
 * POST /api/videos/upload
 * Upload a new video with metadata
 */
router.post(
  '/upload',
  upload.single('video'),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, description, duration, walletAddress, userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Validate all input data
    const validation = validateVideoUpload({
      title,
      description: description || '',
      duration: parseFloat(duration),
      fileSize: file.size,
      mimetype: file.mimetype,
      walletAddress,
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // 1. Save video to local storage
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.originalname}`;
    
    const storageResult = await saveVideoLocally(file.buffer, filename, userId);
    
    if (!storageResult.success) {
      return res.status(500).json({ 
        error: 'Failed to save video', 
        details: storageResult.error 
      });
    }

    // Generate full URL for the video
    const storageUrl = `${process.env.API_URL || 'http://localhost:5000'}${storageResult.url}`;

    // 2. Generate IPFS hash (optional - skip if Pinata not configured)
    let ipfsHash = '';
    const ipfsResult = await pinFileToIPFS(file.buffer, filename);
    if (ipfsResult.success) {
      ipfsHash = ipfsResult.ipfsHash!;
      console.log('✅ Video pinned to IPFS:', ipfsHash);
    } else {
      console.log('⚠️ IPFS pinning skipped (Pinata not configured)');
    }

    // 3. Moderate content (optional - skip if Gemini not configured)
    const moderationResult = await moderateContent(title, description || '');

    // 4. Mint Content NFT (optional - skip if no IPFS hash or wallet key not configured)
    let nftTokenId = null;
    if (ipfsHash) {
      const nftResult = await mintContentNFT(walletAddress, ipfsHash);
      if (nftResult.success) {
        nftTokenId = nftResult.tokenId;
        console.log('✅ NFT minted:', nftTokenId);
      } else {
        console.log('⚠️ NFT minting skipped:', nftResult.error);
      }
    } else {
      console.log('⚠️ NFT minting skipped (no IPFS hash)');
    }

    // 5. Store metadata in Firestore
    const videoData = {
      creator: userId,
      creatorWallet: walletAddress,
      title,
      description: description || '',
      duration: parseFloat(duration),
      storageUrl,
      ipfsHash: ipfsHash || null,
      nftTokenId: nftTokenId || null,
      thumbnailUrl: '', // Will be generated later
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0,
      },
      rewards: {
        claimed: false,
        amount: 0,
        transactionHash: null,
      },
      moderation: {
        status: moderationResult.safe ? 'approved' : 'flagged',
        category: moderationResult.category,
        reason: moderationResult.reason,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const videoRef = await db.collection('videos').add(videoData);

    // Send notification if flagged
    if (!moderationResult.safe) {
      // TODO: Send notification to creator
      console.log(`Video ${videoRef.id} flagged: ${moderationResult.reason}`);
    }

    res.status(201).json({
      success: true,
      videoId: videoRef.id,
      ipfsHash: ipfsHash || null,
      nftTokenId: nftTokenId || null,
      storageUrl,
      moderation: videoData.moderation,
      message: 'Video uploaded successfully! IPFS and NFT features are optional.',
    });
  })
);

/**
 * GET /api/videos/feed
 * Get paginated video feed
 * NOTE: This route MUST come before /:id to avoid route conflicts
 */
router.get(
  '/feed',
  asyncHandler(async (req: Request, res: Response) => {
    const { offset = 0, limit = 10, filter = 'recent' } = req.query;

    // Simplified query - no index required
    // Note: In production, you should create the Firestore index and filter by moderation status
    let query = db
      .collection('videos')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string));

    if (parseInt(offset as string) > 0) {
      const lastDoc = await db
        .collection('videos')
        .orderBy('createdAt', 'desc')
        .limit(parseInt(offset as string))
        .get();

      if (!lastDoc.empty) {
        query = query.startAfter(lastDoc.docs[lastDoc.docs.length - 1]);
      }
    }

    const snapshot = await query.get();

    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      videos,
      hasMore: videos.length === parseInt(limit as string),
    });
  })
);

/**
 * POST /api/videos/:id/view
 * Increment view count
 */
router.post(
  '/:id/view',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const videoRef = db.collection('videos').doc(id);
    await videoRef.update({
      'engagement.views': (await videoRef.get()).data()?.engagement?.views + 1 || 1,
    });

    const updatedDoc = await videoRef.get();
    const viewCount = updatedDoc.data()?.engagement?.views || 0;

    res.json({ success: true, views: viewCount });
  })
);

/**
 * POST /api/videos/:id/like
 * Like a video
 */
router.post(
  '/:id/like',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    const videoRef = db.collection('videos').doc(id);
    const videoDoc = await videoRef.get();

    if (!videoDoc.exists) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await videoRef.update({
      'engagement.likes': (videoDoc.data()?.engagement?.likes || 0) + 1,
    });

    const updatedDoc = await videoRef.get();
    const likeCount = updatedDoc.data()?.engagement?.likes || 0;

    res.json({ success: true, likes: likeCount });
  })
);

/**
 * POST /api/videos/:id/share
 * Share a video
 */
router.post(
  '/:id/share',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    const videoRef = db.collection('videos').doc(id);
    const videoDoc = await videoRef.get();

    if (!videoDoc.exists) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await videoRef.update({
      'engagement.shares': (videoDoc.data()?.engagement?.shares || 0) + 1,
    });

    const updatedDoc = await videoRef.get();
    const shareCount = updatedDoc.data()?.engagement?.shares || 0;

    res.json({ success: true, shares: shareCount });
  })
);

/**
 * GET /api/videos/:id/comments
 * Get all comments for a video
 * NOTE: This route MUST come before /:id to avoid route conflicts
 */
router.get(
  '/:id/comments',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get comments without orderBy to avoid needing a Firestore index
    const snapshot = await db
      .collection('comments')
      .where('videoId', '==', id)
      .get();

    // Sort by createdAt in memory
    const sortedDocs = snapshot.docs.sort((a, b) => {
      const aTime = a.data().createdAt || 0;
      const bTime = b.data().createdAt || 0;
      return aTime - bTime; // Ascending order (oldest first)
    });

    const comments = sortedDocs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        text: data.content,
        timestamp: data.createdAt,
      };
    });

    res.json({ comments });
  })
);

/**
 * POST /api/videos/:id/comment
 * Comment on a video
 */
router.post(
  '/:id/comment',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    // Store comment
    const commentRef = await db.collection('comments').add({
      videoId: id,
      userId,
      content: content.trim(),
      likes: 0,
      createdAt: Date.now(),
    });

    // Update comment count
    const videoRef = db.collection('videos').doc(id);
    const videoDoc = await videoRef.get();

    if (videoDoc.exists) {
      await videoRef.update({
        'engagement.comments': (videoDoc.data()?.engagement?.comments || 0) + 1,
      });
    }

    const timestamp = Date.now();

    // Broadcast new comment via Socket.IO
    if (io) {
      io.to(`video_${id}`).emit('new_comment', {
        id: commentRef.id,
        userId,
        text: content.trim(),
        timestamp,
      });
    }

    res.json({
      success: true,
      commentId: commentRef.id,
      timestamp,
    });
  })
);

/**
 * GET /api/videos/:id
 * Get video metadata by ID
 * NOTE: This route MUST come AFTER specific routes like /feed, /:id/comments, etc.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const videoDoc = await db.collection('videos').doc(id).get();

    if (!videoDoc.exists) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = videoDoc.data();

    res.json({
      id: videoDoc.id,
      ...videoData,
    });
  })
);

/**
 * GET /api/videos/creator/:address
 * Get all videos by creator wallet address
 */
router.get(
  '/creator/:address',
  asyncHandler(async (req: Request, res: Response) => {
    const { address } = req.params;

    // Get all videos and filter by creator (no index required)
    const snapshot = await db
      .collection('videos')
      .where('creatorWallet', '==', address)
      .get();
    
    // Sort by createdAt in memory
    const sortedDocs = snapshot.docs.sort((a, b) => {
      const aTime = a.data().createdAt || 0;
      const bTime = b.data().createdAt || 0;
      return bTime - aTime; // Descending order
    });

    const videos = sortedDocs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        likes: data.engagement?.likes || 0,
        shares: data.engagement?.shares || 0,
        comments: data.engagement?.comments || 0,
        views: data.engagement?.views || 0,
        nftTokenId: data.nftTokenId,
        rewardsClaimed: data.rewards?.claimed || false,
        createdAt: data.createdAt,
        ipfsHash: data.ipfsHash,
      };
    });

    res.json({ videos });
  })
);

export default router;
