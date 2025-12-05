# DeadTrendTracker Deployment Guide

## Project Status

### ✅ Completed Components

#### 1. Project Structure & Configuration
- ✅ Monorepo setup with frontend and backend workspaces
- ✅ TypeScript configuration for both frontend and backend
- ✅ Package.json files with all dependencies
- ✅ Environment variable templates
- ✅ ESLint and Prettier configuration
- ✅ Tailwind CSS with custom spooky theme
- ✅ Vite configuration for frontend
- ✅ Jest configuration for backend testing

#### 2. Smart Contracts (Solidity)
- ✅ CreatorToken (ERC-20) contract
- ✅ ContentNFT (ERC-721) contract
- ✅ RewardPool contract with engagement rewards
- ✅ Property-based tests for all contracts
- ✅ Unit tests for all contracts
- ✅ Hardhat configuration
- ✅ Deployment scripts

#### 3. Firebase Configuration
- ✅ Firebase Admin SDK setup (backend)
- ✅ Firebase Client SDK setup (frontend)
- ✅ Firestore security rules
- ✅ Storage security rules
- ✅ Firestore indexes configuration

#### 4. Backend API Foundation
- ✅ Express server with middleware
- ✅ Socket.IO for real-time communication
- ✅ Error handling middleware
- ✅ Blockchain utility modules
- ✅ IPFS integration (Pinata)
- ✅ Web3 contract instances

### 🚧 Remaining Implementation Tasks

The following tasks need to be completed to have a fully functional MVP:

#### 5. Video Upload & Validation (Tasks 5.1-5.5)
- Video validation utilities
- Upload endpoint
- Property tests for validation
- Unit tests

#### 6. Content Moderation (Tasks 6.1-6.3)
- Gemini API integration
- Moderation workflow
- Property tests

#### 7. Video Retrieval & Feed (Tasks 7.1-7.4)
- Video retrieval endpoints
- Feed pagination
- View tracking
- Property tests

#### 8. Real-time Engagement (Tasks 8.1-8.7)
- Socket.IO event handlers (partially done)
- Like/share/comment endpoints
- Engagement synchronization
- Property tests

#### 9. Blockchain Rewards (Tasks 9.1-9.5)
- Reward claiming endpoint
- Balance query endpoint
- NFT minting integration
- Property tests

#### 10. Frontend Components (Tasks 11-17)
- Wallet connection
- Video upload UI
- Video feed
- Video player
- Creator dashboard
- Routing and navigation
- Spooky UI theme application

#### 11. Testing & Deployment (Tasks 18-19)
- Integration tests
- End-to-end tests
- Production deployment

## Quick Start (Current State)

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install dependencies
npm run install:all
```

### Environment Setup

1. **Backend (.env)**:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials:
# - Firebase Admin SDK credentials
# - Polygon RPC URL
# - Private key for deployment
# - Pinata API keys
# - Gemini API key
```

2. **Frontend (.env)**:
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with:
# - Firebase client config
# - Contract addresses (after deployment)
# - API URLs
```

### Deploy Smart Contracts

```bash
cd backend

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Mumbai testnet
npm run deploy:mumbai

# Copy contract addresses to .env files
```

### Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TS)                    │
│  - Wallet Connection (Web3.js)                              │
│  - Video Upload/Feed/Player                                 │
│  - Real-time Updates (Socket.io-client)                     │
│  - Spooky UI Theme (Tailwind)                               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│  - REST API Endpoints                                        │
│  - Socket.IO Server                                          │
│  - Firebase Admin SDK                                        │
│  - Blockchain Integration (Web3.js)                          │
│  - IPFS Integration (Pinata)                                 │
│  - AI Moderation (Gemini)                                    │
└──────────────┬──────────────────┬──────────────────────────┘
               │                  │
    ┌──────────┴────────┐  ┌─────┴──────────┐
    │  Firebase Cloud   │  │ Polygon Network │
    │  - Firestore      │  │ - CreatorToken  │
    │  - Storage        │  │ - ContentNFT    │
    │  - Auth           │  │ - RewardPool    │
    └───────────────────┘  └─────┬───────────┘
                                 │
                          ┌──────┴────────┐
                          │ IPFS (Pinata) │
                          └───────────────┘
```

## Smart Contract Addresses

After deployment, update these in your `.env` files:

```
# Mumbai Testnet
CREATOR_TOKEN_ADDRESS=0x...
CONTENT_NFT_ADDRESS=0x...
REWARD_POOL_ADDRESS=0x...
```

## Testing

```bash
# Smart contract tests
cd backend
npx hardhat test

# Backend tests (when implemented)
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## Token Economics

### Reward Structure
- **Like**: 0.1 DTC per like
- **Share**: 0.5 DTC per share
- **Comment**: 0.2 DTC per comment
- **Viral Bonus**: 50 DTC at 1000 likes

### Example Calculation
Video with 1500 likes, 100 shares, 50 comments:
- Base: (1500 × 0.1) + (100 × 0.5) + (50 × 0.2) = 150 + 50 + 10 = 210 DTC
- Viral Bonus: +50 DTC
- **Total: 260 DTC**

## Security Considerations

### Smart Contracts
- ✅ OpenZeppelin battle-tested contracts
- ✅ Reentrancy protection
- ✅ Access control (Ownable)
- ✅ Duplicate claim prevention

### Backend
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling
- ✅ Firebase security rules

### Frontend
- Wallet signature verification
- Input sanitization
- XSS protection

## Production Deployment Checklist

- [ ] Deploy contracts to Polygon mainnet
- [ ] Verify contracts on PolygonScan
- [ ] Set up production Firebase project
- [ ] Configure production environment variables
- [ ] Deploy backend to Vercel/Railway
- [ ] Deploy frontend to Vercel
- [ ] Set up custom domain
- [ ] Configure CDN for video delivery
- [ ] Set up monitoring and logging
- [ ] Perform security audit
- [ ] Load testing
- [ ] Create backup strategy

## Troubleshooting

### Common Issues

**Contract deployment fails:**
- Check MATIC balance in deployer wallet
- Verify RPC URL is correct
- Ensure private key is properly formatted

**Firebase connection errors:**
- Verify service account credentials
- Check Firebase project ID
- Ensure Firestore and Storage are enabled

**IPFS upload fails:**
- Verify Pinata API keys
- Check file size limits
- Test Pinata connection

**Web3 connection issues:**
- Verify Polygon RPC URL
- Check network ID (80001 for Mumbai, 137 for mainnet)
- Ensure wallet has MATIC for gas

## Next Steps

1. Complete remaining backend endpoints (Tasks 5-9)
2. Implement frontend components (Tasks 11-17)
3. Write comprehensive tests
4. Deploy to testnet for testing
5. Conduct security audit
6. Deploy to mainnet
7. Launch! 🚀

## Support

For issues or questions:
- Check the README.md
- Review the spec documents in `.kiro/specs/`
- Consult the design document for architecture details

## License

MIT License - See LICENSE file for details
