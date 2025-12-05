# Design Document

## Overview

DeadTrendTracker is a full-stack Web3 application that combines traditional web technologies with blockchain infrastructure to create a decentralized short-form video platform. The system architecture follows a three-tier model: a React-based frontend for user interaction, a Node.js/Express backend for business logic and API services, and Polygon blockchain smart contracts for tokenomics and content ownership.

The platform resurrects the essence of Vine by enabling 6-60 second video uploads while adding modern Web3 features: automatic NFT minting for content ownership, cryptocurrency rewards for engagement, and decentralized storage via IPFS. Real-time engagement updates are powered by Socket.io, while AI-based content moderation ensures platform safety.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React 18 + TypeScript + Tailwind CSS + Web3.js + Socket.io │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                        Backend Layer                         │
│         Node.js + Express + Socket.io + Firebase SDK         │
├──────────────────────┬──────────────────┬───────────────────┤
│   Video Processing   │   Moderation     │   Blockchain      │
│   Firebase Storage   │   Gemini API     │   Web3 Utils      │
└──────────────────────┴──────────────────┴───────────────────┘
                         │                 │
                         │                 │
        ┌────────────────┴────┐    ┌──────┴──────────┐
        │   Firebase Cloud    │    │  Polygon Network │
        │  - Firestore (DB)   │    │  - CreatorToken  │
        │  - Storage (Videos) │    │  - ContentNFT    │
        │  - Auth             │    │  - RewardPool    │
        └─────────────────────┘    └──────────────────┘
                                            │
                                    ┌───────┴────────┐
                                    │  IPFS Network  │
                                    │  (Pinata)      │
                                    └────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript for type-safe component development
- Tailwind CSS for responsive, utility-first styling with custom spooky theme
- Web3.js for blockchain wallet connection and transaction signing
- Socket.io-client for real-time engagement updates
- React Router for client-side navigation
- Vimeo Player or HLS.js for video playback

**Backend:**
- Node.js with Express for RESTful API endpoints
- Socket.io for WebSocket-based real-time communication
- Firebase Admin SDK for Firestore and Storage operations
- Web3.js for smart contract interaction
- Gemini API SDK for AI-powered content moderation
- Pinata SDK for IPFS pinning and gateway access

**Blockchain:**
- Solidity 0.8.x for smart contract development
- Hardhat for contract compilation, testing, and deployment
- OpenZeppelin contracts for secure ERC-20 and ERC-721 implementations
- Polygon (Mumbai testnet for development, mainnet for production)

**Storage & Database:**
- Firebase Firestore for user profiles, video metadata, and engagement data
- Firebase Storage for video file hosting
- IPFS (via Pinata) for decentralized content backup and verification

## Components and Interfaces

### Frontend Components

#### 1. VideoUpload Component
**Purpose:** Handle video file selection, validation, upload progress, and metadata input.

**Props:**
```typescript
interface VideoUploadProps {
  userId: string;
  walletAddress: string;
  onUploadComplete: (videoId: string) => void;
  onUploadError: (error: Error) => void;
}
```

**State:**
- `selectedFile: File | null` - Currently selected video file
- `uploading: boolean` - Upload in progress flag
- `progress: number` - Upload progress percentage (0-100)
- `title: string` - Video title input
- `description: string` - Video description input
- `validationError: string | null` - Validation error message

**Key Methods:**
- `validateVideo(file: File): boolean` - Validates duration (6-60s) and file type
- `handleUpload(): Promise<void>` - Orchestrates upload to Firebase, IPFS, and NFT minting
- `generateThumbnail(file: File): Promise<string>` - Creates video thumbnail

#### 2. VideoFeed Component
**Purpose:** Display scrollable feed of videos with infinite scroll and engagement metrics.

**Props:**
```typescript
interface VideoFeedProps {
  userId?: string;
  filterBy?: 'trending' | 'recent' | 'following';
}
```

**State:**
- `videos: VideoMetadata[]` - Array of video objects
- `loading: boolean` - Loading state for pagination
- `hasMore: boolean` - Flag for infinite scroll

**Key Methods:**
- `fetchVideos(offset: number, limit: number): Promise<VideoMetadata[]>` - Loads video batch
- `handleScroll(): void` - Triggers pagination on scroll threshold

#### 3. VideoPlayer Component
**Purpose:** Play video content with engagement controls and real-time updates.

**Props:**
```typescript
interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  metadata: VideoMetadata;
  onLike: () => void;
  onShare: () => void;
  onComment: (text: string) => void;
}
```

**State:**
- `likes: number` - Current like count (updated via Socket.io)
- `shares: number` - Current share count
- `comments: Comment[]` - Array of comments
- `isLiked: boolean` - User's like status

**Key Methods:**
- `subscribeToEngagement(): void` - Connects to Socket.io room for real-time updates
- `handleLike(): Promise<void>` - Sends like event and updates UI
- `animateEngagement(type: 'like' | 'share'): void` - Triggers ghost animation

#### 4. CreatorDashboard Component
**Purpose:** Display creator analytics, token balance, and video performance.

**Props:**
```typescript
interface CreatorDashboardProps {
  creatorId: string;
  walletAddress: string;
}
```

**State:**
- `tokenBalance: number` - Current DTC token balance from blockchain
- `totalEarnings: number` - Cumulative earnings
- `videos: VideoAnalytics[]` - Array of video performance data
- `nftTokenIds: number[]` - List of minted NFT IDs

**Key Methods:**
- `fetchTokenBalance(): Promise<number>` - Queries blockchain for token balance
- `fetchVideoAnalytics(): Promise<VideoAnalytics[]>` - Retrieves engagement data from Firestore

#### 5. WalletConnect Component
**Purpose:** Handle Web3 wallet connection and network validation.

**Props:**
```typescript
interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}
```

**State:**
- `connected: boolean` - Connection status
- `address: string | null` - Connected wallet address
- `networkId: number | null` - Current network ID

**Key Methods:**
- `connectWallet(): Promise<void>` - Initiates MetaMask connection
- `validateNetwork(): boolean` - Ensures Polygon network
- `switchNetwork(): Promise<void>` - Prompts network switch if needed

### Backend API Endpoints

#### Video Routes (`/api/videos`)

**POST /api/videos/upload**
- **Purpose:** Handle video upload orchestration
- **Request Body:**
  ```typescript
  {
    userId: string;
    walletAddress: string;
    title: string;
    description: string;
    file: File; // multipart/form-data
  }
  ```
- **Response:**
  ```typescript
  {
    videoId: string;
    ipfsHash: string;
    nftTokenId: number;
    storageUrl: string;
  }
  ```
- **Process Flow:**
  1. Validate video duration and metadata
  2. Upload to Firebase Storage
  3. Generate IPFS hash via Pinata
  4. Call Moderation System
  5. Mint Content NFT via smart contract
  6. Store metadata in Firestore
  7. Return video ID and blockchain references

**GET /api/videos/:id**
- **Purpose:** Retrieve video metadata and playback URL
- **Response:**
  ```typescript
  {
    id: string;
    creator: string;
    title: string;
    description: string;
    videoUrl: string;
    ipfsHash: string;
    nftTokenId: number;
    engagement: {
      likes: number;
      shares: number;
      comments: number;
      views: number;
    };
    createdAt: number;
  }
  ```

**GET /api/videos/feed**
- **Purpose:** Fetch paginated video feed
- **Query Parameters:** `offset: number, limit: number, filter: string`
- **Response:** Array of video metadata objects

**POST /api/videos/:id/like**
- **Purpose:** Record like engagement and trigger reward allocation
- **Request Body:** `{ userId: string }`
- **Response:** `{ success: boolean, newLikeCount: number }`
- **Side Effects:**
  - Increment like count in Firestore
  - Emit Socket.io event to video room
  - Trigger reward allocation (0.1 DTC)

**POST /api/videos/:id/share**
- **Purpose:** Record share engagement
- **Request Body:** `{ userId: string }`
- **Response:** `{ success: boolean, newShareCount: number }`
- **Side Effects:**
  - Increment share count in Firestore
  - Emit Socket.io event
  - Trigger reward allocation (0.5 DTC)

**POST /api/videos/:id/comment**
- **Purpose:** Add comment to video
- **Request Body:** `{ userId: string, content: string }`
- **Response:** `{ commentId: string, timestamp: number }`
- **Side Effects:**
  - Store comment in Firestore
  - Emit Socket.io event
  - Trigger reward allocation (0.2 DTC)

#### Blockchain Routes (`/api/blockchain`)

**POST /api/blockchain/claim-rewards**
- **Purpose:** Claim accumulated Creator Tokens for a video
- **Request Body:**
  ```typescript
  {
    videoId: string;
    creatorAddress: string;
    likes: number;
    shares: number;
    comments: number;
  }
  ```
- **Response:**
  ```typescript
  {
    success: boolean;
    transactionHash: string;
    rewardAmount: string; // in wei
  }
  ```
- **Process:**
  1. Verify video ownership
  2. Check if rewards already claimed
  3. Call RewardPool.claimEngagementReward()
  4. Mark rewards as claimed in Firestore
  5. Return transaction hash

**GET /api/blockchain/balance/:address**
- **Purpose:** Query Creator Token balance
- **Response:** `{ balance: string, decimals: number }`

**POST /api/blockchain/mint-nft**
- **Purpose:** Mint Content NFT for uploaded video
- **Request Body:**
  ```typescript
  {
    creatorAddress: string;
    ipfsHash: string;
    metadata: {
      title: string;
      description: string;
      duration: number;
    };
  }
  ```
- **Response:**
  ```typescript
  {
    tokenId: number;
    transactionHash: string;
  }
  ```

#### Moderation Routes (`/api/moderation`)

**POST /api/moderation/analyze**
- **Purpose:** Analyze content using Gemini API
- **Request Body:**
  ```typescript
  {
    title: string;
    description: string;
  }
  ```
- **Response:**
  ```typescript
  {
    safe: boolean;
    reason: string;
    category: 'violence' | 'hate' | 'explicit' | 'spam' | 'safe';
    confidence: number;
  }
  ```

### Smart Contracts

#### 1. CreatorToken (ERC-20)

**Contract Address:** Deployed on Polygon Network

**Key Functions:**
```solidity
function mint(address to, uint256 amount) public onlyOwner
function transfer(address to, uint256 amount) public returns (bool)
function balanceOf(address account) public view returns (uint256)
function approve(address spender, uint256 amount) public returns (bool)
```

**Access Control:**
- Only RewardPool contract can mint new tokens
- Standard ERC-20 transfer permissions

#### 2. ContentNFT (ERC-721)

**Contract Address:** Deployed on Polygon Network

**Key Functions:**
```solidity
function mintContentNFT(address creator, string memory ipfsHash) public returns (uint256)
function tokenURI(uint256 tokenId) public view returns (string memory)
function ownerOf(uint256 tokenId) public view returns (address)
function transferFrom(address from, address to, uint256 tokenId) public
```

**Metadata Structure:**
```json
{
  "name": "DeadTrendTracker Video #123",
  "description": "Video description",
  "image": "ipfs://QmHash/thumbnail.jpg",
  "properties": {
    "ipfsHash": "QmVideoHash",
    "creator": "0xCreatorAddress",
    "duration": 30,
    "createdAt": 1234567890
  }
}
```

#### 3. RewardPool

**Contract Address:** Deployed on Polygon Network

**Key Functions:**
```solidity
function claimEngagementReward(
    uint256 videoId,
    uint256 likes,
    uint256 shares,
    uint256 comments
) external returns (uint256)

function hasClaimedReward(uint256 videoId) public view returns (bool)
function calculateReward(uint256 likes, uint256 shares, uint256 comments) public pure returns (uint256)
```

**Reward Calculation:**
```
rewardAmount = (likes × 0.1 DTC) + (shares × 0.5 DTC) + (comments × 0.2 DTC)
if (likes >= 1000) rewardAmount += 50 DTC // Viral bonus
```

**State Variables:**
```solidity
mapping(uint256 => bool) public rewardClaimed;
mapping(address => uint256) public creatorBalances;
ICreatorToken public creatorToken;
```

### Real-Time Communication (Socket.io)

**Server-Side Events:**

```javascript
// Connection handling
io.on('connection', (socket) => {
  // User joins video room
  socket.on('watch_video', (videoId) => {
    socket.join(`video_${videoId}`);
  });
  
  // User leaves video room
  socket.on('leave_video', (videoId) => {
    socket.leave(`video_${videoId}`);
  });
  
  // Like event
  socket.on('like_video', async (videoId, userId) => {
    // Update Firestore
    // Broadcast to room
    io.to(`video_${videoId}`).emit('like_update', {
      videoId,
      totalLikes: newCount,
      animate: true
    });
  });
  
  // Share event
  socket.on('share_video', async (videoId, userId) => {
    // Similar to like
  });
  
  // Comment event
  socket.on('comment_video', async (videoId, userId, content) => {
    // Store comment
    // Broadcast to room
    io.to(`video_${videoId}`).emit('new_comment', {
      commentId,
      userId,
      content,
      timestamp
    });
  });
});
```

**Client-Side Subscriptions:**

```javascript
// Subscribe to video engagement
socket.emit('watch_video', videoId);

socket.on('like_update', (data) => {
  setLikes(data.totalLikes);
  if (data.animate) triggerGhostAnimation();
});

socket.on('new_comment', (comment) => {
  setComments(prev => [...prev, comment]);
});
```

## Data Models

### Firestore Collections

#### Users Collection (`/users/{userId}`)

```typescript
interface UserDocument {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  avatar: string; // URL to profile image
  tokenBalance: number; // Cached from blockchain
  totalEarnings: number; // Cumulative DTC earned
  tier: 'bronze' | 'silver' | 'gold'; // Creator tier
  createdAt: number; // Unix timestamp
  updatedAt: number;
}
```

**Indexes:**
- `walletAddress` (unique)
- `username` (unique)
- `createdAt` (descending)

#### Videos Collection (`/videos/{videoId}`)

```typescript
interface VideoDocument {
  id: string;
  creator: string; // User ID
  creatorWallet: string; // Blockchain address
  title: string; // Max 100 characters
  description: string; // Max 500 characters
  duration: number; // Seconds (6-60)
  storageUrl: string; // Firebase Storage URL
  ipfsHash: string; // IPFS content hash
  nftTokenId: number; // ERC-721 token ID
  thumbnailUrl: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  rewards: {
    claimed: boolean;
    amount: number; // DTC tokens
    transactionHash: string | null;
  };
  moderation: {
    status: 'pending' | 'approved' | 'flagged';
    category: 'safe' | 'violence' | 'hate' | 'explicit' | 'spam';
    reason: string;
  };
  createdAt: number;
  updatedAt: number;
}
```

**Indexes:**
- `creator` (ascending)
- `createdAt` (descending)
- `engagement.likes` (descending) - for trending
- `moderation.status` (ascending)

#### Comments Collection (`/comments/{commentId}`)

```typescript
interface CommentDocument {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  content: string; // Max 300 characters
  likes: number;
  createdAt: number;
}
```

**Indexes:**
- `videoId` (ascending) + `createdAt` (descending)

#### Transactions Collection (`/transactions/{txId}`)

```typescript
interface TransactionDocument {
  id: string;
  from: string; // Wallet address
  to: string; // Wallet address
  amount: string; // Token amount in wei
  type: 'reward' | 'transfer' | 'tip';
  videoId: string | null; // If reward type
  blockchainHash: string; // Polygon tx hash
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}
```

**Indexes:**
- `from` (ascending) + `timestamp` (descending)
- `to` (ascending) + `timestamp` (descending)
- `blockchainHash` (unique)

### Blockchain Data Models

#### Creator Token (ERC-20)

```solidity
struct TokenInfo {
    string name; // "DeadTrendCreator"
    string symbol; // "DTC"
    uint8 decimals; // 18
    uint256 totalSupply; // Dynamic based on minting
}
```

#### Content NFT (ERC-721)

```solidity
struct NFTMetadata {
    uint256 tokenId;
    address creator;
    string ipfsHash;
    string tokenURI; // Points to JSON metadata
    uint256 mintedAt;
}
```

#### Reward Pool

```solidity
struct VideoReward {
    uint256 videoId;
    address creator;
    uint256 likes;
    uint256 shares;
    uint256 comments;
    uint256 rewardAmount;
    bool claimed;
}
```

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Video duration validation
*For any* video file uploaded to the platform, the validation function should accept the video if and only if its duration is between 6 and 60 seconds inclusive.
**Validates: Requirements 1.1**

### Property 2: Unique video identifiers
*For any* set of video uploads, each video should receive a unique identifier, and no two videos should share the same ID.
**Validates: Requirements 1.2**

### Property 3: IPFS hash generation
*For any* uploaded video, the platform should generate a valid IPFS hash (starting with "Qm" or "bafy" and having appropriate length).
**Validates: Requirements 1.3, 8.1**

### Property 4: NFT ownership assignment
*For any* video upload with a creator wallet address, the minted Content NFT should have the creator as the owner when queried from the blockchain.
**Validates: Requirements 1.4**

### Property 5: Complete metadata storage
*For any* uploaded video, the Firestore document should contain all required fields: creator ID, IPFS hash, NFT token ID, timestamp, title, and description.
**Validates: Requirements 1.5, 8.5, 10.5**

### Property 6: Like reward calculation
*For any* video like event, the reward allocation should be exactly 0.1 Creator Tokens (1e17 wei).
**Validates: Requirements 2.1**

### Property 7: Share reward calculation
*For any* video share event, the reward allocation should be exactly 0.5 Creator Tokens (5e17 wei).
**Validates: Requirements 2.2**

### Property 8: Comment reward calculation
*For any* video comment event, the reward allocation should be exactly 0.2 Creator Tokens (2e17 wei).
**Validates: Requirements 2.3**

### Property 9: Viral bonus threshold
*For any* video that reaches exactly 1000 likes, the reward pool should allocate an additional 50 Creator Tokens (5e19 wei) as a bonus.
**Validates: Requirements 2.4**

### Property 10: Reward claim idempotence
*For any* video, attempting to claim rewards multiple times should only succeed on the first attempt, and subsequent attempts should be rejected with the rewardClaimed flag set to true.
**Validates: Requirements 2.5**

### Property 11: Engagement state synchronization
*For any* user joining a video viewing session, the initial engagement metrics sent to that user should match the current values stored in Firestore.
**Validates: Requirements 3.5**

### Property 12: Moderation invocation
*For any* video upload, the moderation system should be invoked with the video's title and description before the video is made publicly available.
**Validates: Requirements 4.1**

### Property 13: Unsafe content blocking
*For any* video flagged as unsafe by the moderation system, the video's moderation status should be set to "flagged" and it should not appear in public feed queries.
**Validates: Requirements 4.2**

### Property 14: Safe content availability
*For any* video approved by the moderation system, the video's moderation status should be set to "approved" and it should be included in feed queries.
**Validates: Requirements 4.3**

### Property 15: Violation categorization
*For any* video flagged as unsafe, the moderation category should be one of: "violence", "hate", "explicit", or "spam".
**Validates: Requirements 4.4**

### Property 16: Flagging notification
*For any* video flagged by the moderation system, a notification should be created containing the video ID, creator ID, and the reason for flagging.
**Validates: Requirements 4.5**

### Property 17: Token balance accuracy
*For any* creator wallet address, the token balance displayed in the dashboard should match the balance returned by the CreatorToken smart contract's balanceOf function.
**Validates: Requirements 5.1**

### Property 18: Earnings aggregation
*For any* creator, the total earnings displayed should equal the sum of all claimed reward amounts across all their videos.
**Validates: Requirements 5.2**

### Property 19: Complete engagement display
*For any* video in the creator dashboard, the engagement metrics should include all four fields: likes, shares, comments, and views.
**Validates: Requirements 5.3**

### Property 20: NFT ID display completeness
*For any* creator with minted NFTs, the dashboard should display all NFT token IDs associated with their videos.
**Validates: Requirements 5.4**

### Property 21: Wallet address persistence
*For any* successful wallet connection, the wallet address should be stored in the user's Firestore profile and retrievable on subsequent queries.
**Validates: Requirements 6.2**

### Property 22: Network validation
*For any* wallet connection attempt, if the wallet is not on the Polygon network (chain ID 137 for mainnet or 80001 for Mumbai), the connection should be rejected.
**Validates: Requirements 6.3**

### Property 23: Upload wallet requirement
*For any* upload attempt without a connected wallet, the upload should fail with an error indicating wallet connection is required.
**Validates: Requirements 6.4**

### Property 24: Session cleanup on disconnect
*For any* wallet disconnection event, the wallet address should be removed from the active session state.
**Validates: Requirements 6.5**

### Property 25: Feed recency ordering
*For any* feed query, the returned videos should be sorted in descending order by their createdAt timestamp (most recent first).
**Validates: Requirements 7.1**

### Property 26: Pagination batch size
*For any* feed pagination request with available videos, the response should contain exactly 10 videos, or fewer if fewer than 10 videos remain.
**Validates: Requirements 7.2**

### Property 27: View count increment
*For any* video watch event, the view count in Firestore should increase by exactly 1.
**Validates: Requirements 7.3**

### Property 28: Feed item completeness
*For any* video displayed in the feed, the video object should contain thumbnail URL, title, creator name, and all engagement metrics (likes, shares, comments, views).
**Validates: Requirements 7.4**

### Property 29: Video playback initiation
*For any* video click event, the platform should retrieve the video URL from Firebase Storage and initiate playback.
**Validates: Requirements 7.5**

### Property 30: NFT metadata IPFS inclusion
*For any* minted Content NFT, the token metadata should include the IPFS hash of the video content.
**Validates: Requirements 8.2**

### Property 31: NFT token URI completeness
*For any* minted Content NFT, the token URI should contain the IPFS hash, creator wallet address, title, description, and duration.
**Validates: Requirements 8.3**

### Property 32: NFT IPFS query
*For any* Content NFT token ID, querying the NFT should return the IPFS hash stored in its metadata.
**Validates: Requirements 8.4**

### Property 33: Blockchain error handling
*For any* blockchain transaction that fails (reverts or times out), the platform should return an error response with a descriptive message to the user.
**Validates: Requirements 9.5**

### Property 34: Empty title rejection
*For any* video submission with an empty string or whitespace-only title, the validation should fail and prevent the upload.
**Validates: Requirements 10.2**

### Property 35: Title length validation
*For any* video submission, if the title exceeds 100 characters, the validation should fail and prevent the upload.
**Validates: Requirements 10.3**

### Property 36: Description length validation
*For any* video submission, if the description exceeds 500 characters, the validation should fail and prevent the upload.
**Validates: Requirements 10.4**

## Error Handling

### Frontend Error Handling

**Video Upload Errors:**
- **Duration validation failure:** Display toast notification: "Video must be between 6 and 60 seconds"
- **File size too large:** Display error: "Video file exceeds maximum size of 100MB"
- **Upload timeout:** Display error with retry option: "Upload timed out. Please try again."
- **Wallet not connected:** Display modal prompting wallet connection before upload

**Blockchain Errors:**
- **Transaction rejected:** Display: "Transaction was rejected. Please try again."
- **Insufficient gas:** Display: "Insufficient funds for gas. Please add MATIC to your wallet."
- **Network mismatch:** Display modal: "Please switch to Polygon network" with switch button
- **Contract call failure:** Display: "Blockchain operation failed. Please try again later."

**API Errors:**
- **401 Unauthorized:** Redirect to login page
- **403 Forbidden:** Display: "You don't have permission to perform this action"
- **404 Not Found:** Display: "Content not found"
- **500 Server Error:** Display: "Server error. Please try again later."
- **Network timeout:** Display error with retry button

### Backend Error Handling

**Video Processing Errors:**
```javascript
try {
  const videoRef = await uploadToFirebase(file);
  const ipfsHash = await pinToIPFS(file);
  const nftTx = await mintNFT(ipfsHash, creator);
} catch (error) {
  if (error.code === 'storage/unauthorized') {
    return res.status(403).json({ error: 'Unauthorized upload' });
  }
  if (error.code === 'IPFS_TIMEOUT') {
    return res.status(504).json({ error: 'IPFS upload timeout' });
  }
  if (error.message.includes('revert')) {
    return res.status(400).json({ error: 'NFT minting failed', details: error.message });
  }
  // Generic error
  logger.error('Video upload failed', error);
  return res.status(500).json({ error: 'Upload failed' });
}
```

**Blockchain Transaction Errors:**
```javascript
async function executeBlockchainTx(txFunction, params) {
  try {
    const tx = await txFunction(...params);
    const receipt = await tx.wait();
    return { success: true, hash: receipt.transactionHash };
  } catch (error) {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient MATIC for gas fees');
    }
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error('Transaction would fail. Please check parameters.');
    }
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network connection failed. Please try again.');
    }
    throw new Error(`Blockchain error: ${error.message}`);
  }
}
```

**Database Errors:**
```javascript
try {
  await setDoc(doc(db, 'videos', videoId), videoData);
} catch (error) {
  if (error.code === 'permission-denied') {
    throw new Error('Database permission denied');
  }
  if (error.code === 'unavailable') {
    throw new Error('Database temporarily unavailable');
  }
  throw new Error('Database operation failed');
}
```

**Moderation API Errors:**
```javascript
try {
  const result = await moderateContent(title, description);
  return result;
} catch (error) {
  // If moderation fails, default to manual review
  logger.error('Moderation API failed', error);
  return {
    safe: false,
    reason: 'Pending manual review',
    category: 'pending',
    requiresReview: true
  };
}
```

### Smart Contract Error Handling

**RewardPool Contract:**
```solidity
function claimEngagementReward(
    uint256 videoId,
    uint256 likes,
    uint256 shares,
    uint256 comments
) external returns (uint256) {
    require(!rewardClaimed[videoId], "Rewards already claimed");
    require(likes > 0 || shares > 0 || comments > 0, "No engagement to reward");
    
    uint256 rewardAmount = calculateReward(likes, shares, comments);
    require(rewardAmount > 0, "Reward amount must be positive");
    
    rewardClaimed[videoId] = true;
    
    try creatorToken.mint(msg.sender, rewardAmount) {
        emit RewardClaimed(msg.sender, videoId, rewardAmount);
        return rewardAmount;
    } catch {
        rewardClaimed[videoId] = false; // Rollback claim status
        revert("Token minting failed");
    }
}
```

**ContentNFT Contract:**
```solidity
function mintContentNFT(
    address creator,
    string memory ipfsHash
) public returns (uint256) {
    require(creator != address(0), "Invalid creator address");
    require(bytes(ipfsHash).length > 0, "IPFS hash required");
    
    uint256 tokenId = tokenCounter;
    tokenCounter++;
    
    tokenURIs[tokenId] = ipfsHash;
    _safeMint(creator, tokenId);
    
    emit ContentMinted(tokenId, creator, ipfsHash);
    return tokenId;
}
```

## Testing Strategy

### Unit Testing

**Frontend Unit Tests (Jest + React Testing Library):**

1. **Component Tests:**
   - VideoUpload: Test file selection, validation, progress display
   - VideoPlayer: Test play/pause, engagement button clicks
   - CreatorDashboard: Test data display, loading states
   - WalletConnect: Test connection flow, network validation

2. **Hook Tests:**
   - useWeb3: Test wallet connection, network switching
   - useVideo: Test video fetching, pagination
   - useTokens: Test balance queries, reward claiming

3. **Utility Tests:**
   - Video validation functions
   - Duration calculation
   - IPFS hash validation
   - Token amount formatting

**Backend Unit Tests (Jest + Supertest):**

1. **API Endpoint Tests:**
   - POST /api/videos/upload: Test with valid/invalid files
   - GET /api/videos/:id: Test retrieval and 404 handling
   - POST /api/videos/:id/like: Test engagement recording
   - POST /api/blockchain/claim-rewards: Test reward claiming

2. **Service Layer Tests:**
   - Firebase Storage upload/download
   - Firestore CRUD operations
   - IPFS pinning via Pinata
   - Gemini API moderation calls

3. **Utility Tests:**
   - Blockchain transaction helpers
   - Error handling utilities
   - Validation functions

**Smart Contract Unit Tests (Hardhat + Chai):**

1. **CreatorToken Tests:**
   - Minting tokens
   - Transfer functionality
   - Balance queries
   - Access control

2. **ContentNFT Tests:**
   - NFT minting
   - Metadata storage
   - Ownership queries
   - Token URI retrieval

3. **RewardPool Tests:**
   - Reward calculation
   - Claim functionality
   - Duplicate claim prevention
   - Viral bonus allocation

### Property-Based Testing

**Testing Framework:** We will use **fast-check** for JavaScript/TypeScript property-based testing. Fast-check is a mature, well-documented library that integrates seamlessly with Jest and provides powerful generators for complex data types.

**Configuration:** Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Property Test Implementation Guidelines:**

1. Each property test MUST include a comment tag in this format:
   ```javascript
   // Feature: video-platform-core, Property X: [property description]
   ```

2. Each correctness property from the design document MUST be implemented as a SINGLE property-based test.

3. Property tests should be co-located with unit tests in `.test.ts` files.

**Example Property Tests:**

```javascript
import fc from 'fast-check';

// Feature: video-platform-core, Property 1: Video duration validation
test('validates video duration between 6 and 60 seconds', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 120 }), // Generate durations from 0 to 120
      (duration) => {
        const isValid = validateVideoDuration(duration);
        const shouldBeValid = duration >= 6 && duration <= 60;
        expect(isValid).toBe(shouldBeValid);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: video-platform-core, Property 2: Unique video identifiers
test('generates unique identifiers for all videos', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        creator: fc.hexaString({ minLength: 40, maxLength: 40 })
      }), { minLength: 2, maxLength: 50 }),
      async (videos) => {
        const ids = await Promise.all(
          videos.map(v => generateVideoId(v))
        );
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: video-platform-core, Property 6: Like reward calculation
test('allocates exactly 0.1 DTC per like', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 10000 }), // Number of likes
      (likes) => {
        const reward = calculateLikeReward(likes);
        const expected = BigInt(likes) * BigInt(1e17); // 0.1 DTC in wei
        expect(reward).toBe(expected);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: video-platform-core, Property 10: Reward claim idempotence
test('prevents duplicate reward claims', () => {
  fc.assert(
    fc.property(
      fc.record({
        videoId: fc.integer({ min: 1, max: 100000 }),
        likes: fc.integer({ min: 1, max: 1000 }),
        shares: fc.integer({ min: 0, max: 100 }),
        comments: fc.integer({ min: 0, max: 100 })
      }),
      async (engagement) => {
        // First claim should succeed
        const firstClaim = await claimRewards(engagement.videoId, engagement);
        expect(firstClaim.success).toBe(true);
        
        // Second claim should fail
        const secondClaim = await claimRewards(engagement.videoId, engagement);
        expect(secondClaim.success).toBe(false);
        expect(secondClaim.error).toContain('already claimed');
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: video-platform-core, Property 25: Feed recency ordering
test('returns videos in descending timestamp order', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          id: fc.uuid(),
          createdAt: fc.integer({ min: 1000000000, max: 2000000000 })
        }),
        { minLength: 5, maxLength: 50 }
      ),
      async (videos) => {
        // Insert videos in random order
        await Promise.all(videos.map(v => insertVideo(v)));
        
        // Fetch feed
        const feed = await getFeed({ limit: 100 });
        
        // Verify descending order
        for (let i = 0; i < feed.length - 1; i++) {
          expect(feed[i].createdAt).toBeGreaterThanOrEqual(feed[i + 1].createdAt);
        }
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: video-platform-core, Property 35: Title length validation
test('rejects titles exceeding 100 characters', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 0, maxLength: 200 }),
      (title) => {
        const isValid = validateTitle(title);
        const shouldBeValid = title.length > 0 && title.length <= 100;
        expect(isValid).toBe(shouldBeValid);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Smart Contract Property Tests (Hardhat + fast-check):**

```javascript
// Feature: video-platform-core, Property 9: Viral bonus threshold
it('awards 50 DTC bonus at exactly 1000 likes', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.integer({ min: 0, max: 2000 }),
      async (likes) => {
        const videoId = Math.floor(Math.random() * 1000000);
        const reward = await rewardPool.calculateReward(videoId, likes, 0, 0);
        
        const baseReward = BigInt(likes) * BigInt(1e17);
        const expectedBonus = likes >= 1000 ? BigInt(50e18) : BigInt(0);
        const expected = baseReward + expectedBonus;
        
        expect(reward).to.equal(expected);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

1. **End-to-End Video Upload Flow:**
   - Upload video → Firebase Storage → IPFS → NFT minting → Firestore storage
   - Verify all components work together

2. **Engagement Flow:**
   - Like video → Update Firestore → Broadcast via Socket.io → Allocate rewards
   - Verify real-time updates and reward calculation

3. **Wallet Connection Flow:**
   - Connect wallet → Verify network → Store address → Enable uploads
   - Test with different wallet providers

4. **Moderation Flow:**
   - Upload video → Gemini API analysis → Flag/approve → Feed visibility
   - Test with various content types

### Test Coverage Goals

- **Frontend:** 80% code coverage minimum
- **Backend:** 85% code coverage minimum
- **Smart Contracts:** 95% code coverage minimum (critical financial logic)
- **Property Tests:** All 36 correctness properties must have corresponding property-based tests

### Continuous Integration

- Run all tests on every pull request
- Deploy to testnet (Mumbai) on merge to develop branch
- Run property tests with extended iterations (1000+) in CI
- Monitor gas costs for smart contract operations
- Automated security scanning for smart contracts (Slither, MythX)
