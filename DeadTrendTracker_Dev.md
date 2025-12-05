# DeadTrendTracker - Complete Development Guide

## Project Overview

**DeadTrendTracker** is a **Resurrection Category** hackathon project that resurrects dead social media platforms (Vine, Clubhouse, Quora Spaces) in modern Web3 form with engagement metrics, creator monetization, and decentralized content verification.

---

## 🎯 Project Vision

### Problem Statement
Dead social media platforms like Vine, Clubhouse, and Quora Spaces had passionate communities that disappeared. Meanwhile, modern creators struggle to find platforms that:
- Truly reward content creators (not just algorithm games)
- Enable community-owned governance
- Preserve content ownership
- Allow transparent, verifiable engagement

### Solution
**DeadTrendTracker** resurrects the essence of dead platforms by combining:
- **Vine's core**: Short-form video creation (6-60 seconds)
- **Modern tech**: Web3, blockchain, NFTs
- **Creator economy**: Token-based rewards and royalties
- **Engagement verification**: Immutable on-chain metrics

---

## 🏗️ Technical Architecture

### Tech Stack

```
Frontend:
├── React 18 + TypeScript
├── Tailwind CSS + Spooky theme
├── Vimeo/HLS.js for video streaming
├── Web3.js for blockchain interaction
└── Socket.io for real-time notifications

Backend:
├── Node.js + Express
├── Firebase Firestore (metadata, user profiles)
├── Firebase Storage (video uploads)
├── Polygon (blockchain for tokens/NFTs)
└── IPFS (decentralized video backup)

Smart Contracts:
├── Creator Token (ERC-20)
├── Content NFT (ERC-721)
├── Engagement Reward Pool
└── DAO Governance (optional)

APIs:
├── Gemini API (content moderation)
├── Polygon RPC (blockchain transactions)
├── Pinata (IPFS gateway)
└── Vimeo API (video processing)
```

---

## 📁 Project Structure

```
dead-trend-tracker/
├── .kiro/
│   ├── specs.md                    # Kiro specs document
│   ├── hooks.js                    # Kiro agent hooks
│   └── steering.md                 # Development steering
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoUpload.jsx
│   │   │   ├── VideoFeed.jsx
│   │   │   ├── CreatorProfile.jsx
│   │   │   ├── TokenRewards.jsx
│   │   │   └── EngagementStats.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Creator.jsx
│   │   │   ├── Explore.jsx
│   │   │   └── Wallet.jsx
│   │   ├── hooks/
│   │   │   ├── useWeb3.js
│   │   │   ├── useVideo.js
│   │   │   └── useTokens.js
│   │   ├── styles/
│   │   │   └── spooky-theme.css
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── videos.js
│   │   │   ├── creators.js
│   │   │   ├── rewards.js
│   │   │   └── blockchain.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   │   ├── ipfs.js
│   │   │   ├── blockchain.js
│   │   │   └── moderation.js
│   │   ├── config/
│   │   └── server.js
│   ├── contracts/
│   │   ├── CreatorToken.sol
│   │   ├── ContentNFT.sol
│   │   └── RewardPool.sol
│   ├── package.json
│   └── .env.example
├── README.md
├── LICENSE                         # MIT or Apache 2.0
└── DEPLOYMENT.md
```

---

## 🚀 Core Features

### 1. **Vine-Like Video Creation**
```javascript
// Feature: Upload & Share 6-60 second videos
- Video recording (browser-based)
- Upload from device
- Video trimming/editing
- Spooky filter effects (ghost overlays, darkness)
- Automatic thumbnail generation
- Real-time upload progress
```

**Implementation**:
```javascript
// frontend/src/components/VideoUpload.jsx
const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (file) => {
    setUploading(true);
    // 1. Upload to Firebase Storage
    const fileRef = ref(storage, `videos/${user.id}/${Date.now()}`);
    await uploadBytes(fileRef, file);
    
    // 2. Mint NFT for video on Polygon
    const nftTx = await contractInstance.mintContentNFT(
      videoIpfsHash,
      user.address,
      videoMetadata
    );
    
    // 3. Store metadata in Firestore
    await addDoc(collection(db, 'videos'), {
      userId: user.id,
      videoHash: videoIpfsHash,
      nftTokenId: nftTx.tokenId,
      timestamp: Date.now(),
      likes: 0,
      shares: 0
    });
    
    setUploading(false);
  };
  
  return (
    <div className="upload-container spooky-theme">
      <input type="file" accept="video/*" onChange={e => handleUpload(e.target.files[0])} />
      {uploading && <ProgressBar />}
    </div>
  );
};
```

---

### 2. **Creator Monetization**
```
Token Rewards Mechanism:
├── Like = 0.1 creator tokens
├── Share = 0.5 creator tokens
├── Comment = 0.2 creator tokens
├── Viral video (>1000 likes) = 50 bonus tokens
└── Creator tier bonuses (Bronze → Gold)

Token Uses:
├── Trade on DEX (Uniswap)
├── Tips to other creators
├── Unlock premium features
└── DAO voting (future)
```

**Smart Contract** (Solidity):
```solidity
// contracts/RewardPool.sol
pragma solidity ^0.8.0;

interface ICreatorToken {
    function mint(address to, uint256 amount) external;
}

contract RewardPool {
    ICreatorToken public creatorToken;
    
    mapping(address => uint256) public creatorBalances;
    mapping(uint256 => bool) public rewardClaimed;
    
    event RewardClaimed(address indexed creator, uint256 amount);
    
    function claimEngagementReward(
        uint256 videoId,
        uint256 likes,
        uint256 shares,
        uint256 comments
    ) external {
        require(!rewardClaimed[videoId], "Already claimed");
        
        uint256 rewardAmount = (likes * 1e16) + (shares * 5e16) + (comments * 2e16);
        
        creatorToken.mint(msg.sender, rewardAmount);
        rewardClaimed[videoId] = true;
        
        emit RewardClaimed(msg.sender, rewardAmount);
    }
}
```

---

### 3. **Real-Time Engagement Feed**
```javascript
// Feature: Live engagement notifications
- Real-time likes/shares as they happen
- Creator notifications
- Trending videos sidebar
- Related video recommendations
- User feed personalization
```

**Implementation with Socket.io**:
```javascript
// backend/src/routes/engagement.js
io.on('connection', (socket) => {
  socket.on('watch_video', (videoId) => {
    socket.join(`video_${videoId}`);
  });
  
  socket.on('like_video', async (videoId, userId) => {
    // Update Firestore
    await updateDoc(doc(db, 'videos', videoId), {
      likes: increment(1)
    });
    
    // Broadcast to all watching
    io.to(`video_${videoId}`).emit('like_update', {
      videoId,
      totalLikes: newLikesCount,
      animator: true // Trigger ghost animation
    });
    
    // Claim rewards
    await claimRewards(videoId, userId);
  });
});
```

---

### 4. **Spooky UI Theme**
```css
/* Costume Contest vibes */
:root {
  --color-bg-dark: #0a0e27;
  --color-ghost: #e0e0e0;
  --color-accent-purple: #8b5cf6;
  --color-accent-green: #10b981;
}

.video-card {
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%);
  border: 2px solid #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  animation: ghost-float 3s ease-in-out infinite;
}

@keyframes ghost-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.engagement-stat {
  font-family: 'Courier New', monospace;
  color: #10b981;
  text-shadow: 0 0 10px #10b981;
}
```

---

### 5. **Content Moderation via AI**
```javascript
// Use Gemini API for automated content moderation
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function moderateContent(videoMetadata, description) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Review this social media content for policy violations.
  Title: ${videoMetadata.title}
  Description: ${description}
  
  Return: {"safe": true/false, "reason": "...", "category": "violence|hate|explicit|spam"}`;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

---

## 🛠️ Kiro Integration Strategy

### Using Kiro Features

#### 1. **Specs** (Structure-Driven Development)
Create `.kiro/specs.md`:
```markdown
# DeadTrendTracker Specs

## API Endpoints
- POST /api/videos/upload → Upload video
- GET /api/videos/:id → Fetch video
- POST /api/videos/:id/like → Like video
- GET /api/rewards/balance → Get creator balance
- POST /api/blockchain/claim-rewards → Claim tokens

## Data Models
### Video Document
{
  id: string,
  creator: address,
  ipfsHash: string,
  title: string,
  description: string,
  duration: number,
  likes: number,
  shares: number,
  nftTokenId: number,
  createdAt: timestamp
}

## Smart Contract Functions
- mintContentNFT(ipfsHash, creator, metadata)
- claimRewards(videoId, amount)
- transferTokens(from, to, amount)
```

#### 2. **Vibe Code** (Rapid Prototyping)
Use Kiro to rapidly generate:
- React component boilerplates
- Firebase integration helpers
- Web3 utility functions
- API endpoint stubs

**Example prompt for Kiro**:
> "Generate a React component for uploading videos to Firebase Storage with progress tracking and spooky UI styling"

#### 3. **Agent Hooks** (Automation)
Set up hooks for:
- Auto-generate video thumbnails after upload
- Auto-claim rewards periodically
- Auto-notify creators when videos go viral
- Auto-moderate content on upload

```javascript
// .kiro/hooks.js
module.exports = {
  afterVideoUpload: async (videoId) => {
    // Generate thumbnail
    // Store IPFS hash
    // Mint NFT
    // Notify user
  },
  
  onEngagementMilestone: async (videoId, likes) => {
    if (likes === 1000) {
      // Award viral bonus
      // Send notification
    }
  }
};
```

#### 4. **MCP** (Model Context Protocol)
Integrate external services:
- Vimeo/Mux for video processing
- Polygon RPC for blockchain queries
- IPFS gateway for decentralized storage

---

## 📊 Database Schema (Firestore)

```
/users/{userId}
├── address (Polygon wallet)
├── username
├── avatar
├── tokenBalance
├── totalEarnings
├── createdAt
└── tier (bronze/silver/gold)

/videos/{videoId}
├── creator
├── title
├── description
├── ipfsHash
├── nftTokenId
├── duration
├── engagement
│   ├── likes
│   ├── shares
│   ├── comments
│   └── views
├── rewards
│   ├── claimed
│   └── amount
└── createdAt

/comments/{commentId}
├── videoId
├── creator
├── content
├── likes
└── createdAt

/transactions/{txId}
├── from
├── to
├── amount
├── type (transfer/reward/tip)
├── hash (blockchain tx hash)
└── timestamp
```

---

## 🔐 Blockchain Integration

### Smart Contracts to Deploy (Polygon Mumbai Testnet First)

#### Contract 1: Creator Token (ERC-20)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorToken is ERC20, Ownable {
    constructor() ERC20("DeadTrendCreator", "DTC") {}
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

#### Contract 2: Content NFT (ERC-721)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    
    mapping(uint256 => string) public tokenURIs;
    
    constructor() ERC721("DeadTrendContent", "DTC-NFT") {}
    
    function mintContentNFT(
        address creator,
        string memory ipfsHash
    ) public returns (uint256) {
        tokenURIs[tokenCounter] = ipfsHash;
        _safeMint(creator, tokenCounter);
        return tokenCounter++;
    }
}
```

---

## 🚀 Deployment Guide

### Phase 1: Local Development
```bash
# Clone repo
git clone https://github.com/yourusername/dead-trend-tracker.git
cd dead-trend-tracker

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

### Phase 2: Deploy Smart Contracts
```bash
# Install Hardhat
npm install --save-dev hardhat

# Deploy to Polygon Mumbai Testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### Phase 3: Production Deployment
```bash
# Backend: Deploy to Vercel or Railway
vercel deploy

# Frontend: Deploy to Vercel
npm run build
vercel deploy --prod

# Contracts: Deploy to Polygon Mainnet
npx hardhat run scripts/deploy.js --network polygon
```

---

## 📈 Monetization Strategy

### Revenue Streams (Future)
1. **Platform Fee**: 5% on token transfers
2. **Premium Creator Tier**: $5/month for advanced analytics
3. **NFT Royalties**: 2.5% commission on secondary sales
4. **Partnerships**: Brand integrations with native ads

---

## 🎬 MVP Launch Checklist

- [ ] Video upload/download functionality
- [ ] Creator profile system with wallet integration
- [ ] Real-time engagement feed with Socket.io
- [ ] Token reward claiming system
- [ ] Content moderation via Gemini API
- [ ] NFT minting on video upload
- [ ] Creator dashboard with analytics
- [ ] Spooky UI theme (Costume Contest ready)
- [ ] Mobile responsive design
- [ ] GitHub repo with /.kiro directory
- [ ] README with deployment instructions
- [ ] Testnet deployment (Polygon Mumbai)

---

## 🧟 Why This Wins Kiroween

✅ **Resurrection**: Brings back the ghost of dead platforms (Vine, Clubhouse)  
✅ **Creativity**: Web3 + short-form video + spooky UI = unique combo  
✅ **Kiro Integration**: Uses specs, vibe code, hooks, MCP  
✅ **Real Value**: Actual creator monetization that Web2 platforms don't offer  
✅ **Portfolio Power**: Full-stack (React, Node, Solidity, blockchain)  
✅ **Technical Depth**: Smart contracts, IPFS, real-time notifications, AI moderation  

---

## 📚 Resources & APIs

| Resource | Purpose | Link |
|----------|---------|------|
| Vimeo API | Video processing | https://developer.vimeo.com |
| Polygon | Blockchain network | https://polygon.technology |
| Firebase | Backend + Storage | https://firebase.google.com |
| Pinata | IPFS gateway | https://pinata.cloud |
| Gemini API | Content moderation | https://ai.google.dev |
| Web3.js | Blockchain interaction | https://web3js.readthedocs.io |
| Socket.io | Real-time updates | https://socket.io |

---

## 🎯 Timeline

| Week | Milestone |
|------|-----------|
| **Week 1** | Project setup, Kiro specs, API design |
| **Week 2** | Backend APIs, smart contracts, Firestore schema |
| **Week 3** | React components, Web3 integration, token system |
| **Week 4** | UI polish (spooky theme), testing, deployment |

---

**Ready to resurrect dead trends and haunt the hackathon? 🎃👻 Deploy it and let's go!**