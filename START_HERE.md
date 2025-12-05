# 🎃 START HERE - DeadTrendTracker Setup Guide

Welcome to DeadTrendTracker! This guide will get you up and running in minutes.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run Setup Script

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Or manually:**
```bash
npm run setup
```

### Step 2: Configure API Keys

Edit `backend/.env` and add your API keys:
- Firebase credentials (get from Firebase Console)
- Pinata API keys (get from pinata.cloud)
- Gemini API key (get from ai.google.dev)
- Polygon RPC URL (get from alchemy.com or infura.io)

Edit `frontend/.env` and add:
- Firebase client config
- API URLs

### Step 3: Deploy & Run

```bash
# Deploy smart contracts
cd backend
npm run deploy:mumbai

# Copy contract addresses to both .env files

# Start backend (new terminal)
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev

# Open http://localhost:3000
```

---

## ✅ Validation

Check if everything is set up correctly:

```bash
npm run validate
```

This will check:
- ✅ Node.js version
- ✅ Required files
- ✅ Dependencies installed
- ✅ Environment files
- ✅ Smart contracts compiled

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | 10-minute setup guide |
| **DEPLOYMENT.md** | Full deployment guide |
| **API_DOCUMENTATION.md** | Complete API reference |
| **TROUBLESHOOTING.md** | Common issues & solutions |
| **SUCCESS_SUMMARY.md** | What's been built |
| **FINAL_STATUS.md** | Project completion details |

---

## 🎯 What You're Building

A Web3 video platform that:
- ✅ Uploads 6-60 second videos
- ✅ Mints NFTs automatically
- ✅ Rewards creators with DTC tokens
- ✅ Moderates content with AI
- ✅ Stores videos on IPFS
- ✅ Provides real-time engagement

---

## 🔧 Prerequisites

Before starting, make sure you have:

- [x] **Node.js 18+** - [Download](https://nodejs.org)
- [x] **MetaMask** - [Install](https://metamask.io)
- [x] **Firebase Account** - [Sign up](https://firebase.google.com)
- [x] **Pinata Account** - [Sign up](https://pinata.cloud)
- [x] **Gemini API Key** - [Get key](https://ai.google.dev)
- [x] **Polygon RPC** - [Get from Alchemy](https://alchemy.com)

---

## 🎓 Getting API Keys

### Firebase (Free)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Firestore and Storage
4. Go to Project Settings → Service Accounts
5. Generate new private key
6. Copy credentials to `backend/.env`

### Pinata (Free)
1. Go to [Pinata](https://pinata.cloud)
2. Sign up for free account
3. Go to API Keys
4. Create new key
5. Copy to `backend/.env`

### Gemini API (Free)
1. Go to [Google AI Studio](https://ai.google.dev)
2. Get API key
3. Copy to `backend/.env`

### Polygon RPC (Free)
1. Go to [Alchemy](https://alchemy.com) or [Infura](https://infura.io)
2. Create free account
3. Create new app (Polygon Mumbai)
4. Copy RPC URL to `backend/.env`

---

## 🎮 Testing the App

### 1. Get Test MATIC
```
https://faucet.polygon.technology
```
Enter your wallet address and wait 1-2 minutes.

### 2. Connect Wallet
- Open http://localhost:3000
- Click "Connect Wallet"
- Approve MetaMask connection
- Switch to Mumbai testnet if prompted

### 3. Upload Video
- Click "Upload" in navigation
- Select a 6-60 second video
- Add title and description
- Click "Upload Video"
- Approve NFT minting transaction
- Wait for upload to complete

### 4. View Feed
- Go back to home page
- See your video in the feed
- Check engagement metrics

---

## 🐛 Common Issues

### "MetaMask not detected"
- Install MetaMask extension
- Refresh the page

### "Wrong network"
- Click "Switch to Polygon" button
- Or manually switch to Mumbai in MetaMask

### "Insufficient funds"
- Get test MATIC from faucet
- Wait a few minutes

### "Upload failed"
- Check video is 6-60 seconds
- Check file size < 100MB
- Check file type (MP4, WebM, MOV)

### More issues?
Check **TROUBLESHOOTING.md** for detailed solutions.

---

## 📊 Project Structure

```
dead-trend-tracker/
├── backend/              # Node.js + Express
│   ├── contracts/       # Smart contracts
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── utils/      # Utilities
│   │   └── config/     # Configuration
│   └── test/           # Tests
├── frontend/            # React + TypeScript
│   └── src/
│       ├── components/ # React components
│       ├── hooks/      # Custom hooks
│       └── styles/     # CSS
└── .kiro/specs/        # Specifications
```

---

## 🎯 What's Implemented

### Backend (100%)
- ✅ 3 Smart Contracts
- ✅ 9 API Endpoints
- ✅ Firebase Integration
- ✅ IPFS Integration
- ✅ AI Moderation
- ✅ Real-time Updates
- ✅ Property-based Tests

### Frontend (85%)
- ✅ Wallet Connection
- ✅ Video Upload
- ✅ Video Feed
- ✅ Spooky Theme
- ✅ Routing

---

## 🚀 Deployment

When ready for production:

1. Deploy contracts to Polygon mainnet
2. Update RPC URLs to mainnet
3. Deploy backend to Vercel/Railway
4. Deploy frontend to Vercel
5. Configure custom domain

See **DEPLOYMENT.md** for detailed instructions.

---

## 💡 Pro Tips

- **Test on Mumbai first** - Always test on testnet before mainnet
- **Keep API keys secret** - Never commit .env files
- **Monitor transactions** - Use PolygonScan to track transactions
- **Check logs** - Look at console for errors
- **Read docs** - Check documentation files for help

---

## 🎉 You're Ready!

Everything is set up and ready to go. Follow the Quick Start steps above and you'll have a working Web3 video platform in minutes!

**Questions?** Check the documentation files or review the code comments.

---

## 📞 Support

- **Setup issues?** → QUICKSTART.md
- **Deployment help?** → DEPLOYMENT.md
- **API questions?** → API_DOCUMENTATION.md
- **Bugs or errors?** → TROUBLESHOOTING.md
- **Want to understand the code?** → Check .kiro/specs/

---

**Built with 👻 for Kiroween Hackathon**

*Resurrecting dead social media platforms, one video at a time!*

🎃 **Happy Haunting!** 👻
