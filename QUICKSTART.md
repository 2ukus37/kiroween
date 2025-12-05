# 🚀 DeadTrendTracker - Quick Start Guide

Get your Web3 video platform running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Firebase account (free tier)
- Pinata account (free tier)
- Gemini API key (free tier)

## Step 1: Clone & Install (2 minutes)

```bash
# Navigate to your project directory
cd dead-trend-tracker

# Install all dependencies
npm run install:all
```

## Step 2: Configure Backend (3 minutes)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (Get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Polygon (Get free RPC from Alchemy or Infura)
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_wallet_private_key_for_deployment

# Pinata (Get from https://pinata.cloud)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# Gemini API (Get from https://ai.google.dev)
GEMINI_API_KEY=your_gemini_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

## Step 3: Configure Frontend (2 minutes)

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Firebase Client Config (Get from Firebase Console > Project Settings > General)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Polygon
VITE_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

# API
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Contract addresses (will be filled after deployment)
VITE_CREATOR_TOKEN_ADDRESS=
VITE_CONTENT_NFT_ADDRESS=
VITE_REWARD_POOL_ADDRESS=
```

## Step 4: Deploy Smart Contracts (2 minutes)

```bash
cd ../backend

# Compile contracts
npx hardhat compile

# Run tests (optional but recommended)
npx hardhat test

# Deploy to Mumbai testnet
npm run deploy:mumbai
```

**Copy the contract addresses from the output and update both `.env` files!**

## Step 5: Start Development Servers (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm run dev
```

## Step 6: Test the App! 🎉

1. Open http://localhost:3000
2. Click "Connect Wallet" in the header
3. Connect MetaMask (switch to Mumbai testnet)
4. Get test MATIC from https://faucet.polygon.technology
5. Click "Upload" in the navigation
6. Select a video (6-60 seconds)
7. Add title and description
8. Click "Upload Video"
9. Approve the NFT minting transaction
10. View your video in the feed!

## Common Issues & Solutions

### "MetaMask not detected"
- Install MetaMask browser extension
- Refresh the page

### "Wrong network"
- Click "Switch to Polygon" button
- Or manually switch to Mumbai testnet in MetaMask

### "Insufficient funds for gas"
- Get test MATIC from https://faucet.polygon.technology
- Wait a few minutes for the faucet to process

### "Upload failed"
- Check video duration (must be 6-60 seconds)
- Check file size (max 100MB)
- Check file type (MP4, WebM, or MOV)
- Verify all API keys are correct

### "Firebase error"
- Verify Firebase credentials in `.env`
- Enable Firestore and Storage in Firebase Console
- Check Firebase security rules are deployed

### "IPFS upload timeout"
- Verify Pinata API keys
- Check internet connection
- Try again (Pinata can be slow sometimes)

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Network switches to Mumbai
- [ ] Video upload works
- [ ] NFT mints successfully
- [ ] Video appears in feed
- [ ] Engagement metrics display
- [ ] No console errors

## What's Next?

### For Development:
- Add more videos to test the feed
- Test engagement features (like, share, comment)
- Try claiming rewards
- Test on mobile devices

### For Production:
1. Deploy contracts to Polygon mainnet
2. Update RPC URLs to mainnet
3. Deploy backend to Vercel/Railway
4. Deploy frontend to Vercel
5. Configure custom domain
6. Set up monitoring

## Useful Commands

```bash
# Backend
npm run dev          # Start dev server
npm test            # Run tests
npm run lint        # Lint code
npm run format      # Format code

# Frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm test           # Run tests
npm run lint       # Lint code

# Smart Contracts
npx hardhat compile        # Compile contracts
npx hardhat test          # Run tests
npx hardhat run scripts/deploy.ts --network mumbai  # Deploy
```

## Getting Help

1. Check DEPLOYMENT.md for detailed setup
2. Check PROJECT_STATUS.md for feature status
3. Check FINAL_STATUS.md for completion details
4. Review the spec documents in `.kiro/specs/`

## 🎃 You're Ready!

Your DeadTrendTracker platform is now running locally. Start uploading videos and earning tokens! 👻

**Happy haunting!** 🎃👻
