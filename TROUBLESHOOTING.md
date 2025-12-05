# 🔧 DeadTrendTracker - Troubleshooting Guide

Common issues and solutions for the DeadTrendTracker platform.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Smart Contract Issues](#smart-contract-issues)
3. [Backend Issues](#backend-issues)
4. [Frontend Issues](#frontend-issues)
5. [Wallet Issues](#wallet-issues)
6. [Upload Issues](#upload-issues)
7. [Blockchain Issues](#blockchain-issues)
8. [Firebase Issues](#firebase-issues)
9. [IPFS Issues](#ipfs-issues)
10. [General Tips](#general-tips)

---

## Installation Issues

### "npm install" fails

**Problem:** Dependencies fail to install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### "Module not found" errors

**Problem:** TypeScript can't find modules

**Solutions:**
```bash
# Rebuild TypeScript
npm run build

# Check tsconfig.json paths
# Ensure moduleResolution is set correctly

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Smart Contract Issues

### "Compilation failed"

**Problem:** Solidity contracts won't compile

**Solutions:**
```bash
# Clean artifacts
npx hardhat clean

# Recompile
npx hardhat compile

# Check Solidity version in hardhat.config.ts
# Should be 0.8.20
```

### "Test failed"

**Problem:** Contract tests are failing

**Solutions:**
```bash
# Run tests with verbose output
npx hardhat test --verbose

# Run specific test file
npx hardhat test test/CreatorToken.test.ts

# Check for:
# - Correct contract addresses
# - Proper test setup
# - Gas limits
```

### "Deployment failed"

**Problem:** Can't deploy to Mumbai

**Solutions:**
```bash
# Check wallet has MATIC
# Get from: https://faucet.polygon.technology

# Verify RPC URL
echo $POLYGON_RPC_URL

# Check private key format
# Should start with 0x

# Try with more gas
# Edit hardhat.config.ts gas settings
```

---

## Backend Issues

### "Server won't start"

**Problem:** `npm run dev` fails

**Solutions:**
```bash
# Check port 5000 is available
lsof -i :5000
# Kill process if needed
kill -9 <PID>

# Check .env file exists
ls backend/.env

# Check all required env vars are set
cat backend/.env

# Check for syntax errors
npm run lint
```

### "Firebase connection error"

**Problem:** Can't connect to Firebase

**Solutions:**
```bash
# Verify credentials in .env
# Check FIREBASE_PROJECT_ID
# Check FIREBASE_PRIVATE_KEY (must have \n)
# Check FIREBASE_CLIENT_EMAIL

# Test Firebase connection
# Add console.log in src/config/firebase.ts

# Verify Firebase project exists
# Check Firebase Console
```

### "Module import errors"

**Problem:** ES modules not working

**Solutions:**
```bash
# Ensure package.json has:
"type": "module"

# Use .js extensions in imports
import { db } from './config/firebase.js';

# Check tsconfig.json:
"module": "ESNext"
"moduleResolution": "node"
```

---

## Frontend Issues

### "Vite won't start"

**Problem:** `npm run dev` fails

**Solutions:**
```bash
# Check port 3000 is available
lsof -i :3000

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules
npm install

# Check vite.config.ts syntax
```

### "React component errors"

**Problem:** Components won't render

**Solutions:**
```bash
# Check imports
# Ensure .tsx extension for JSX

# Check for missing dependencies
npm install react react-dom react-router-dom

# Clear browser cache
# Hard refresh: Cmd/Ctrl + Shift + R

# Check console for errors
# Open DevTools → Console
```

### "Tailwind styles not working"

**Problem:** CSS classes not applying

**Solutions:**
```bash
# Verify tailwind.config.js content paths
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']

# Check postcss.config.js exists

# Restart dev server
# Tailwind needs restart for config changes

# Check index.css imports Tailwind
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Wallet Issues

### "MetaMask not detected"

**Problem:** Can't connect wallet

**Solutions:**
```bash
# Install MetaMask extension
# https://metamask.io

# Refresh page after installing

# Check window.ethereum exists
console.log(window.ethereum)

# Try different browser
# Chrome, Firefox, or Brave
```

### "Wrong network"

**Problem:** Not on Polygon/Mumbai

**Solutions:**
```bash
# Click "Switch to Polygon" button in app

# Or manually in MetaMask:
# 1. Click network dropdown
# 2. Click "Add Network"
# 3. Add Mumbai testnet:
#    - Network Name: Polygon Mumbai
#    - RPC URL: https://rpc-mumbai.maticvigil.com
#    - Chain ID: 80001
#    - Currency: MATIC
#    - Explorer: https://mumbai.polygonscan.com
```

### "Insufficient funds"

**Problem:** Not enough MATIC for gas

**Solutions:**
```bash
# Get test MATIC from faucet
https://faucet.polygon.technology

# Enter your wallet address
# Wait 1-2 minutes

# Check balance in MetaMask

# If faucet is down, try:
https://mumbaifaucet.com
```

### "Transaction rejected"

**Problem:** User rejected transaction

**Solutions:**
```bash
# Click "Confirm" in MetaMask popup

# If popup doesn't appear:
# - Check MetaMask is unlocked
# - Look for notification icon
# - Click MetaMask extension

# If gas is too high:
# - Wait for lower gas prices
# - Adjust gas limit in MetaMask
```

---

## Upload Issues

### "Video duration invalid"

**Problem:** Video rejected for duration

**Solutions:**
```bash
# Check video is 6-60 seconds
# Use video editor to trim if needed

# Verify duration with:
ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 video.mp4

# Common tools:
# - iMovie (Mac)
# - Windows Video Editor
# - Online: https://online-video-cutter.com
```

### "File type not supported"

**Problem:** Video format rejected

**Solutions:**
```bash
# Convert to supported format:
# - MP4 (recommended)
# - WebM
# - MOV

# Use ffmpeg to convert:
ffmpeg -i input.avi -c:v libx264 -c:a aac output.mp4

# Or online converter:
https://cloudconvert.com/video-converter
```

### "File too large"

**Problem:** Video exceeds 100MB

**Solutions:**
```bash
# Compress video:
ffmpeg -i input.mp4 -vcodec h264 -acodec aac \
  -b:v 1000k -b:a 128k output.mp4

# Or use online compressor:
https://www.freeconvert.com/video-compressor

# Reduce resolution:
# - 720p is usually enough
# - Lower bitrate
```

### "Upload timeout"

**Problem:** Upload takes too long

**Solutions:**
```bash
# Check internet connection
# Speed test: https://fast.com

# Try smaller file
# Compress video first

# Check Firebase Storage quota
# Firebase Console → Storage

# Increase timeout in axios config:
timeout: 300000 // 5 minutes
```

---

## Blockchain Issues

### "NFT minting failed"

**Problem:** Can't mint NFT

**Solutions:**
```bash
# Check contract is deployed
echo $CONTENT_NFT_ADDRESS

# Verify contract on PolygonScan
https://mumbai.polygonscan.com/address/YOUR_ADDRESS

# Check wallet has MATIC
# Need ~0.01 MATIC for minting

# Check contract ownership
# Backend wallet must own ContentNFT contract

# Test contract directly:
npx hardhat console --network mumbai
```

### "Reward claim failed"

**Problem:** Can't claim rewards

**Solutions:**
```bash
# Check rewards not already claimed
# Each video can only claim once

# Verify you're the video creator
# Must use same wallet as upload

# Check engagement metrics
# Must have likes, shares, or comments

# Verify RewardPool has minting permission
# RewardPool must own CreatorToken

# Check transaction on PolygonScan
# Look for revert reason
```

### "Gas estimation failed"

**Problem:** Can't estimate gas

**Solutions:**
```bash
# Transaction would fail
# Check contract state

# Verify parameters are correct
# Check video ID, wallet address

# Try with manual gas limit:
gas: 500000

# Check contract is not paused
# Verify contract is deployed
```

---

## Firebase Issues

### "Permission denied"

**Problem:** Can't read/write Firestore

**Solutions:**
```bash
# Check security rules are deployed
firebase deploy --only firestore:rules

# Verify rules in Firebase Console
# Firestore → Rules

# Check authentication
# User must be authenticated for writes

# Test rules:
# Firestore → Rules → Playground
```

### "Storage upload failed"

**Problem:** Can't upload to Firebase Storage

**Solutions:**
```bash
# Check Storage is enabled
# Firebase Console → Storage

# Verify storage rules
firebase deploy --only storage

# Check quota
# Storage → Usage

# Verify bucket name in .env
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Check CORS configuration
# May need to configure CORS for web uploads
```

### "Firestore query slow"

**Problem:** Queries taking too long

**Solutions:**
```bash
# Create indexes
firebase deploy --only firestore:indexes

# Check indexes in Console
# Firestore → Indexes

# Verify indexes in firestore.indexes.json

# Limit query results
.limit(10)

# Use pagination
.startAfter(lastDoc)
```

---

## IPFS Issues

### "IPFS upload failed"

**Problem:** Can't pin to IPFS

**Solutions:**
```bash
# Verify Pinata API keys
echo $PINATA_API_KEY
echo $PINATA_SECRET_KEY

# Test Pinata connection:
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "pinata_api_key: YOUR_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET"

# Check Pinata quota
# https://app.pinata.cloud

# Try smaller file first
# Test with 1MB file

# Check Pinata status
# https://status.pinata.cloud
```

### "IPFS hash invalid"

**Problem:** Hash format incorrect

**Solutions:**
```bash
# Verify hash format:
# CIDv0: Qm... (46 characters)
# CIDv1: bafy... (variable length)

# Check hash in response
console.log(ipfsResult.ipfsHash)

# Test hash on gateway:
https://gateway.pinata.cloud/ipfs/YOUR_HASH

# Regenerate if needed
# Re-upload file to Pinata
```

---

## General Tips

### Debugging

```bash
# Enable verbose logging
NODE_ENV=development

# Check all logs
# Backend: console.log
# Frontend: DevTools Console
# Smart Contracts: console.log in tests

# Use debugger
debugger; // in JavaScript
console.log('Debug:', variable);

# Check network requests
# DevTools → Network tab

# Monitor blockchain transactions
https://mumbai.polygonscan.com
```

### Performance

```bash
# Optimize images/videos
# Compress before upload

# Use pagination
# Don't load all videos at once

# Cache data
# Use React state/context

# Lazy load components
const Component = lazy(() => import('./Component'));

# Monitor bundle size
npm run build
# Check dist/ folder size
```

### Security

```bash
# Never commit .env files
# Add to .gitignore

# Use environment variables
# Never hardcode API keys

# Validate all inputs
# Client and server side

# Use HTTPS in production
# Enable CORS properly

# Keep dependencies updated
npm audit
npm audit fix
```

### Testing

```bash
# Test locally first
# Before deploying to production

# Use Mumbai testnet
# Never test on mainnet

# Test all user flows
# Upload → View → Engage → Claim

# Test error cases
# Invalid inputs, network errors

# Test on different devices
# Desktop, mobile, different browsers
```

---

## Still Having Issues?

### Check Documentation
- README.md - Project overview
- QUICKSTART.md - Setup guide
- DEPLOYMENT.md - Deployment guide
- API_DOCUMENTATION.md - API reference

### Check Code
- Review error messages carefully
- Check console logs
- Look at stack traces
- Read code comments

### Common Mistakes
- ❌ Forgot to add .env files
- ❌ Wrong network in MetaMask
- ❌ No test MATIC in wallet
- ❌ Contracts not deployed
- ❌ Wrong contract addresses
- ❌ API keys not set
- ❌ Firebase not configured

### Debug Checklist
- [ ] All dependencies installed
- [ ] .env files configured
- [ ] Contracts deployed
- [ ] Contract addresses in .env
- [ ] Wallet has test MATIC
- [ ] On correct network (Mumbai)
- [ ] Firebase configured
- [ ] API keys valid
- [ ] Servers running
- [ ] No console errors

---

## Emergency Fixes

### Nuclear Option (Start Fresh)

```bash
# 1. Stop all servers
# Ctrl+C in all terminals

# 2. Clean everything
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf backend/artifacts
rm -rf backend/cache
rm -rf frontend/dist
rm -rf frontend/.vite

# 3. Reinstall
npm run install:all

# 4. Recompile contracts
cd backend
npx hardhat clean
npx hardhat compile

# 5. Restart servers
npm run dev
```

### Reset Database

```bash
# Clear Firestore (if needed)
# Firebase Console → Firestore → Delete collection

# Clear Storage (if needed)
# Firebase Console → Storage → Delete files

# Redeploy rules
firebase deploy --only firestore:rules,storage
```

### Redeploy Contracts

```bash
cd backend

# Clean
npx hardhat clean

# Compile
npx hardhat compile

# Deploy
npm run deploy:mumbai

# Update .env with new addresses
# Update both backend/.env and frontend/.env
```

---

**Still stuck? Check the code comments or review the spec documents!**

🎃 Happy debugging! 👻
