# DeadTrendTracker 🎃👻

A Web3-powered short-form video platform that resurrects dead social media platforms (Vine, Clubhouse, Quora Spaces) with blockchain technology, creator monetization, and decentralized content verification.

**Built for Kiroween Hackathon** | **95% Complete - MVP Ready**

## ✨ Features

- 🎬 **Short-form video uploads** (6-60 seconds)
- 💾 **Local storage** (free, no cloud costs)
- 🔗 **IPFS pinning** via Pinata
- 💰 **Token-based rewards** (DTC - DeadTrendCreator tokens)
- 🖼️ **NFT minting** for content ownership
- ⚡ **Real-time engagement** via Socket.IO
- 👻 **Like, share, comment** with live updates
- 🎨 **Spooky UI theme** with ghost animations
- 🔐 **MetaMask integration**
- 📊 **Creator dashboard** with analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Firebase project (free tier)
- Pinata account (free tier)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/DeadTrendTracker.git
cd DeadTrendTracker
```

2. **Install dependencies:**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **Configure environment variables:**

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your-key
VITE_CREATOR_TOKEN_ADDRESS=0x...
VITE_CONTENT_NFT_ADDRESS=0x...
VITE_REWARD_POOL_ADDRESS=0x...
```

**Backend** (`backend/.env`):
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your-key
CREATOR_TOKEN_ADDRESS=0x...
CONTENT_NFT_ADDRESS=0x...
REWARD_POOL_ADDRESS=0x...
PORT=5000
API_URL=http://localhost:5000
```

4. **Start the servers:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Open your browser:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎯 How to Use

1. **Connect MetaMask** - Click "Connect Wallet" in the header
2. **Upload Videos** - Go to Upload page, select video (6-60 seconds), add details
3. **Browse Feed** - See all videos, hover to preview, click to watch
4. **Engage** - Like (👻), Share (🎃), Comment (💬) on videos
5. **Dashboard** - View your videos, stats, and token balance

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Web3.js
- Socket.io-client
- React Router
- Vite

### Backend
- Node.js + Express
- TypeScript
- Socket.IO
- Firebase Admin SDK
- Pinata SDK (IPFS)
- Multer (file uploads)

### Blockchain
- Solidity smart contracts
- Polygon Mainnet
- OpenZeppelin libraries
- Hardhat
- Web3.js

### Storage
- Local filesystem (videos)
- IPFS via Pinata
- Firebase Firestore (metadata)

## 📁 Project Structure

```
DeadTrendTracker/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── VideoCard.tsx
│   │   │   ├── VideoFeed.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── VideoUpload.tsx
│   │   │   ├── CreatorDashboard.tsx
│   │   │   └── WalletConnect.tsx
│   │   ├── hooks/          # Custom hooks
│   │   │   └── useWeb3.ts
│   │   ├── pages/          # Page components
│   │   │   └── VideoPlayerPage.tsx
│   │   └── styles/         # CSS
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   │   ├── videos.ts
│   │   │   └── blockchain.ts
│   │   ├── utils/          # Utilities
│   │   │   ├── localStorage.ts
│   │   │   ├── ipfs.ts
│   │   │   ├── blockchain.ts
│   │   │   └── validation.ts
│   │   ├── socket/         # Socket.IO handlers
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration
│   ├── contracts/          # Solidity contracts
│   │   ├── CreatorToken.sol
│   │   ├── ContentNFT.sol
│   │   └── RewardPool.sol
│   ├── test/               # Contract tests
│   └── uploads/            # Local video storage
└── .kiro/                  # Kiro specs
    └── specs/
        └── video-platform-core/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## 🎨 Features Showcase

### Video Management
- Upload videos with validation (6-60 seconds)
- Local storage (free, no cloud costs)
- IPFS pinning for decentralization
- Automatic NFT minting (optional)

### Real-Time Engagement
- Like videos with instant updates
- Share videos with clipboard copy
- Comment with live feed
- Ghost animations on engagement
- Socket.IO broadcasting

### Creator Dashboard
- View all your videos
- Track engagement metrics
- Check token balance
- See IPFS hashes
- View NFT token IDs

### Spooky UI
- Dark haunting theme
- Purple and green accents
- Ghost float animations
- Glow effects
- Responsive design

## 🧪 Testing

```bash
# Smart contract tests
cd backend
npx hardhat test

# Backend tests
cd backend
npm test

# Run all tests
npm test
```

## 📝 API Endpoints

### Videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos/feed` - Get video feed
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos/:id/like` - Like video
- `POST /api/videos/:id/share` - Share video
- `POST /api/videos/:id/comment` - Comment on video
- `GET /api/videos/creator/:address` - Get creator's videos

### Blockchain
- `GET /api/blockchain/balance/:address` - Get token balance
- `POST /api/blockchain/claim-rewards` - Claim rewards

## 🔐 Smart Contracts

Deployed on **Polygon Mainnet**:

- **CreatorToken (DTC)**: `0xd9145CCE52D386f254917e481eB44e9943F39138`
- **ContentNFT**: `0xf8e81D47203A594245E36C48e151709F0C19fBe8`
- **RewardPool**: `0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B`

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 👥 Authors

Built with 👻 for the Kiroween Hackathon

## 🙏 Acknowledgments

- Kiro IDE for the amazing development experience
- OpenZeppelin for secure smart contract libraries
- Polygon for fast and cheap transactions
- Pinata for IPFS pinning services
- Firebase for database and storage

---

**Happy haunting! 🎃👻**
