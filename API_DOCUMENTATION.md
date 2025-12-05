# 📡 DeadTrendTracker API Documentation

Complete API reference for the DeadTrendTracker platform.

---

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

---

## Authentication

Most endpoints require a connected wallet. Include the wallet address in request bodies where specified.

---

## Video Endpoints

### Upload Video

Upload a new video with metadata and mint an NFT.

**Endpoint:** `POST /api/videos/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```javascript
{
  video: File,              // Video file (MP4, WebM, MOV)
  title: string,            // Max 100 characters
  description: string,      // Max 500 characters (optional)
  duration: number,         // Video duration in seconds (6-60)
  walletAddress: string,    // Creator's wallet address
  userId: string            // User identifier
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "videoId": "abc123",
  "ipfsHash": "QmXxx...",
  "nftTokenId": 42,
  "storageUrl": "https://storage.googleapis.com/...",
  "moderation": {
    "status": "approved",
    "category": "safe",
    "reason": "Content approved"
  }
}
```

**Errors:**
- `400` - Invalid video duration, title, or file type
- `500` - Upload failed, IPFS error, or NFT minting failed

---

### Get Video

Retrieve video metadata by ID.

**Endpoint:** `GET /api/videos/:id`

**Response:** `200 OK`
```json
{
  "id": "abc123",
  "creator": "0x742d35...",
  "creatorWallet": "0x742d35...",
  "title": "My Awesome Video",
  "description": "Check this out!",
  "duration": 30,
  "storageUrl": "https://storage.googleapis.com/...",
  "ipfsHash": "QmXxx...",
  "nftTokenId": 42,
  "thumbnailUrl": "https://...",
  "engagement": {
    "likes": 150,
    "shares": 25,
    "comments": 10,
    "views": 500
  },
  "rewards": {
    "claimed": false,
    "amount": 0,
    "transactionHash": null
  },
  "moderation": {
    "status": "approved",
    "category": "safe",
    "reason": "Content approved"
  },
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

**Errors:**
- `404` - Video not found

---

### Get Video Feed

Retrieve paginated video feed.

**Endpoint:** `GET /api/videos/feed`

**Query Parameters:**
```
offset: number (default: 0)
limit: number (default: 10, max: 50)
filter: string (default: 'recent')
```

**Response:** `200 OK`
```json
{
  "videos": [
    {
      "id": "abc123",
      "title": "Video Title",
      "description": "Description",
      "creator": "0x742d35...",
      "storageUrl": "https://...",
      "thumbnailUrl": "https://...",
      "engagement": {
        "likes": 150,
        "shares": 25,
        "comments": 10,
        "views": 500
      },
      "createdAt": 1234567890
    }
  ],
  "hasMore": true
}
```

---

### Track View

Increment view count for a video.

**Endpoint:** `POST /api/videos/:id/view`

**Response:** `200 OK`
```json
{
  "success": true,
  "views": 501
}
```

---

### Like Video

Like a video and trigger reward allocation.

**Endpoint:** `POST /api/videos/:id/like`

**Request Body:**
```json
{
  "userId": "0x742d35..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "likes": 151
}
```

**Errors:**
- `404` - Video not found

---

### Share Video

Share a video and trigger reward allocation.

**Endpoint:** `POST /api/videos/:id/share`

**Request Body:**
```json
{
  "userId": "0x742d35..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "shares": 26
}
```

---

### Comment on Video

Add a comment to a video and trigger reward allocation.

**Endpoint:** `POST /api/videos/:id/comment`

**Request Body:**
```json
{
  "userId": "0x742d35...",
  "content": "Great video!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "commentId": "comment123",
  "timestamp": 1234567890
}
```

**Errors:**
- `400` - Empty comment content

---

## Blockchain Endpoints

### Get Token Balance

Get Creator Token (DTC) balance for a wallet address.

**Endpoint:** `GET /api/blockchain/balance/:address`

**Response:** `200 OK`
```json
{
  "address": "0x742d35...",
  "balance": "123.45",
  "decimals": 18
}
```

---

### Claim Rewards

Claim engagement rewards for a video.

**Endpoint:** `POST /api/blockchain/claim-rewards`

**Request Body:**
```json
{
  "videoId": "abc123",
  "creatorAddress": "0x742d35..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "amount": "15.3",
  "transactionHash": "0xabc..."
}
```

**Errors:**
- `400` - Missing parameters or rewards already claimed
- `403` - Not the video creator
- `404` - Video not found
- `500` - Blockchain transaction failed

---

## WebSocket Events (Socket.IO)

### Client → Server Events

#### Join Video Room
```javascript
socket.emit('watch_video', videoId);
```

#### Leave Video Room
```javascript
socket.emit('leave_video', videoId);
```

#### Like Video
```javascript
socket.emit('like_video', {
  videoId: 'abc123',
  userId: '0x742d35...'
});
```

#### Share Video
```javascript
socket.emit('share_video', {
  videoId: 'abc123',
  userId: '0x742d35...'
});
```

#### Comment on Video
```javascript
socket.emit('comment_video', {
  videoId: 'abc123',
  userId: '0x742d35...',
  content: 'Great video!'
});
```

---

### Server → Client Events

#### Like Update
```javascript
socket.on('like_update', (data) => {
  // data: { videoId, totalLikes, animate }
});
```

#### Share Update
```javascript
socket.on('share_update', (data) => {
  // data: { videoId, totalShares, animate }
});
```

#### New Comment
```javascript
socket.on('new_comment', (data) => {
  // data: { commentId, videoId, userId, content, timestamp }
});
```

#### Error
```javascript
socket.on('error', (data) => {
  // data: { message }
});
```

---

## Smart Contract Functions

### CreatorToken (ERC-20)

**Address:** Set in environment variables

#### Read Functions

**balanceOf**
```solidity
function balanceOf(address account) public view returns (uint256)
```
Get token balance for an address.

**decimals**
```solidity
function decimals() public pure returns (uint8)
```
Returns 18 (standard ERC-20 decimals).

#### Write Functions

**transfer**
```solidity
function transfer(address to, uint256 amount) public returns (bool)
```
Transfer tokens to another address.

**approve**
```solidity
function approve(address spender, uint256 amount) public returns (bool)
```
Approve spending allowance.

---

### ContentNFT (ERC-721)

**Address:** Set in environment variables

#### Read Functions

**ownerOf**
```solidity
function ownerOf(uint256 tokenId) public view returns (address)
```
Get owner of an NFT.

**tokenURI**
```solidity
function tokenURI(uint256 tokenId) public view returns (string memory)
```
Get IPFS hash for an NFT.

**getCreator**
```solidity
function getCreator(uint256 tokenId) public view returns (address)
```
Get original creator of an NFT.

#### Write Functions

**transferFrom**
```solidity
function transferFrom(address from, address to, uint256 tokenId) public
```
Transfer NFT ownership.

---

### RewardPool

**Address:** Set in environment variables

#### Read Functions

**calculateReward**
```solidity
function calculateReward(
  uint256 videoId,
  uint256 likes,
  uint256 shares,
  uint256 comments
) public pure returns (uint256)
```
Calculate reward amount without claiming.

**hasClaimedReward**
```solidity
function hasClaimedReward(uint256 videoId) public view returns (bool)
```
Check if rewards have been claimed for a video.

**Reward Constants:**
```solidity
LIKE_REWARD = 1e17 (0.1 DTC)
SHARE_REWARD = 5e17 (0.5 DTC)
COMMENT_REWARD = 2e17 (0.2 DTC)
VIRAL_BONUS = 50e18 (50 DTC)
VIRAL_THRESHOLD = 1000 likes
```

#### Write Functions

**claimEngagementReward**
```solidity
function claimEngagementReward(
  uint256 videoId,
  uint256 likes,
  uint256 shares,
  uint256 comments
) external returns (uint256)
```
Claim rewards for a video. Can only be called once per video.

---

## Error Codes

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### Common Error Messages

**Video Upload:**
- "No video file provided"
- "Video must be at least 6 seconds long"
- "Video must be no longer than 60 seconds"
- "Title cannot be empty"
- "Title must be 100 characters or less"
- "Description must be 500 characters or less"
- "Invalid file type. Allowed types: MP4, WebM, MOV"
- "File size must be less than 100MB"
- "Invalid wallet address format"

**Blockchain:**
- "Insufficient MATIC for gas fees"
- "Transaction would fail"
- "Network connection failed"
- "Rewards already claimed for this video"
- "Not the video creator"

**IPFS:**
- "Failed to pin to IPFS"
- "IPFS upload timeout"

---

## Rate Limits

Currently no rate limits are enforced in development. Production deployment should implement:

- **Video Upload:** 10 per hour per wallet
- **API Requests:** 100 per minute per IP
- **WebSocket Events:** 50 per minute per connection

---

## Example Usage

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Upload video
const uploadVideo = async (file: File, title: string, walletAddress: string) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('title', title);
  formData.append('description', 'My video description');
  formData.append('duration', '30');
  formData.append('walletAddress', walletAddress);
  formData.append('userId', walletAddress);

  const response = await axios.post(`${API_BASE}/api/videos/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

// Get video feed
const getFeed = async (offset = 0, limit = 10) => {
  const response = await axios.get(`${API_BASE}/api/videos/feed`, {
    params: { offset, limit }
  });

  return response.data.videos;
};

// Like video
const likeVideo = async (videoId: string, userId: string) => {
  const response = await axios.post(`${API_BASE}/api/videos/${videoId}/like`, {
    userId
  });

  return response.data;
};

// Claim rewards
const claimRewards = async (videoId: string, creatorAddress: string) => {
  const response = await axios.post(`${API_BASE}/api/blockchain/claim-rewards`, {
    videoId,
    creatorAddress
  });

  return response.data;
};
```

### Socket.IO

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join video room
socket.emit('watch_video', 'abc123');

// Listen for updates
socket.on('like_update', (data) => {
  console.log('New likes:', data.totalLikes);
});

socket.on('new_comment', (data) => {
  console.log('New comment:', data.content);
});

// Leave room
socket.emit('leave_video', 'abc123');
```

---

## Testing

### Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Upload Test

```bash
curl -X POST http://localhost:5000/api/videos/upload \
  -F "video=@test-video.mp4" \
  -F "title=Test Video" \
  -F "description=Testing upload" \
  -F "duration=30" \
  -F "walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -F "userId=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

## Support

For issues or questions:
- Check QUICKSTART.md for setup
- Check DEPLOYMENT.md for deployment
- Review code comments for implementation details

---

**API Version:** 1.0.0  
**Last Updated:** 2024  
**Built with 👻 for Kiroween**
