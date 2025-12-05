# 🚀 Vercel Deployment Guide for DeadTrendTracker

## ⚠️ Important: Split Deployment Architecture

Your app has **two parts** that need to be deployed separately:

1. **Frontend (React + Vite)** → Deploy to **Vercel** ✅
2. **Backend (Node.js + Express + Socket.IO)** → Deploy to **Render/Railway** ✅

**Why?** Vercel is designed for static sites and serverless functions. Your backend needs:
- Persistent WebSocket connections (Socket.IO)
- File storage (video uploads)
- Long-running processes

---

## 📋 Deployment Steps

### Step 1: Deploy Backend First (Render.com - FREE)

1. **Go to [Render.com](https://render.com)** and sign up
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**: `https://github.com/2ukus37/kiroween`
4. **Configure the service**:
   - **Name**: `deadtrendtracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (click "Environment" tab):
   ```
   FIREBASE_PROJECT_ID=kiro-ab068
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kiro-ab068.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqo6iwH40Bpud9
NwRr0rYqq9P9ZrJrA5xP36nKMLxJ6R07pVK11XE0Wm7STZxJQgz2H2YIQcgQmtCc
LxPkBl4dAriQlb3/VY+whaxBukmGYKOWszX3V/D3ems5iqIgj4/N5LN00Pnf7oKy
9rYs6+NlUFdgtLdGFyPG9dfSPw68wWaBw0FQQdHmNVxhgmwAsBUqeTjgSoWfaSMg
xULzd2LHvPS8FFy21gZCzGIGGYc4Hma0i/gyJYuBpVreWlNAjnjvxPNckun4T4RF
oXSTk5F92oluzCoATyRLVsj7GTQkBXBlqu/WvIDLyDNxW6y4ai+GFcUqRv03YfxP
RiVmHPMJAgMBAAECggEAAv4y37/167D/P3F/GNsNyerQoZGzEHB0Rexg4ISBUPSP
SDQKotjXDvmFFxg4ZQqNCqYbVoq81Rm6Dfs/aJD6Bp09GoAd4IQiLJDzqAV586rv
Q53qFOgMeHLDvbMiS9roxU49HY/qyhQ3Y6czI8+RYf4KQk55JngSbxNx0SS8/++H
I3fZ/aX2qvf0QLSxTrEU71PjfvG+HkJjqjLQcnY5V9IG3XZKEuVZdEzOeYLhnSNN
XL9hcCNjtwNaRkOK0nv+n2erwvdkUpxKW22OjUzbAKZW/bC0Xmf/xsNjE05Pyrv6
LR8pxp+0I/kSdgb/FzWPvvoE+kgXAzEnjsLbOZYU9wKBgQDaYrzuX/92LLhhOnwM
LtJVqf0hTcS8tBpZaikMojLHpK4WEd9VNmGcmzALU6G1RT73Mhmiq05pfnyz8Y+X
I6Y6gvCgngwmSSHK9WnNbpP2cEl6ymF5YEIaiO1fwjt1KP1/OEmmHM1EPoA+a/xv
5TCjpbbeE3QLIL9Jf+vRL7zRQwKBgQDIB6SQvUUSW7O3oxWD7IETCWBnj5MFmyHR
fQuk1ErGG/XirRFjcBpcl9oUCZP26d82fGEk+QPt68J6Px9YADgPWGLt0/u7VRGr
kX1Au1hl00C9khyB1RWSVLFhfu6mXIQez1Kcu0Z6bLf+ITg85AFSvnXZ/mw2gfFC
B0Vl0aTvwwKBgQCMahQESOEegJ6ElXAQ/UHsJoJFGZW3py2R9Do0j02LJA1yz0cD
qRWV9gosHjfJL57Onf3xo6elGNjhch3bFebZlDtXaodxTnBV6PmARusH9yanttx5
iDS4jvXhLifAqvxjAjQIhFhO2sjmWdRTtc9SSUiM/YENbp7PiVp8g+8ptQKBgFhn
8Fa8IBv2BZ8C6A5vZ7inK0F6FiujHbY9wvitjwKx9uGhRg8hy7TitFKozQmS4cFu
BW1W1WLBESoAXfUB28UEdmzQhPCNr4qZebczVeVjEbj3K7xCFg+feOozNHy4ZPhM
/yEgMA0JoeQigH2A9AjC/slDBkas9ZkOJ6DRoEkLAoGANCwX+8vlDEmWAwkPnPvP
Tr6z2ivOeSlBXq+T1Degw4t+0A1060Nu07hVHGLsTr3UFeAGOLPt/T4Fy7kvtTuR
8a5YrD1NRrSLzJIScE/cwi529MrXC9vJMwH4UDYz4K8yjvHBbxmpCrjkIV87sxNM
wy1vpXVPxM3J0tc/wmmSaqM=
-----END PRIVATE KEY-----
   PINATA_API_KEY=ba09562a2a88ffd6f3b1
   PINATA_SECRET_KEY=9a2bca8d4a7cf983cb4f110d19c00f11fd07b4687ff98b9600592a0cff8ac76b
   POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/-UnbUxiY53bLFObnzInah
   CREATOR_TOKEN_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138
   CONTENT_NFT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8
   REWARD_POOL_ADDRESS=0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
   PORT=5000
   ```

6. **Important**: After adding `FIREBASE_PRIVATE_KEY`, make sure it's on ONE line with `\n` for newlines

7. **Set API_URL** after deployment:
   - After your backend deploys, you'll get a URL like: `https://deadtrendtracker-backend.onrender.com`
   - Add this as environment variable: `API_URL=https://deadtrendtracker-backend.onrender.com`

8. **Click "Create Web Service"** and wait for deployment (~5 minutes)

9. **Copy your backend URL** (e.g., `https://deadtrendtracker-backend.onrender.com`)

---

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**: `https://github.com/2ukus37/kiroween`
4. **⚠️ IMPORTANT - Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and type `frontend` ← THIS IS CRITICAL!
   - **Build Command**: Leave as default (`npm run build`)
   - **Output Directory**: Leave as default (`dist`)
   - **Install Command**: Leave as default (`npm install`)

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://deadtrendtracker-backend.onrender.com
   VITE_FIREBASE_API_KEY=AIzaSyArEEM5F29Jl8CBECyEWCoIAECz3gmiZSg
   VITE_FIREBASE_AUTH_DOMAIN=kiro-ab068.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=kiro-ab068
   VITE_FIREBASE_STORAGE_BUCKET=kiro-ab068.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=496338114030
   VITE_FIREBASE_APP_ID=1:496338114030:web:ae23e5b95788c375836aff
   VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/-UnbUxiY53bLFObnzInah
   VITE_CREATOR_TOKEN_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138
   VITE_CONTENT_NFT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8
   VITE_REWARD_POOL_ADDRESS=0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
   ```

6. **Click "Deploy"** and wait (~2 minutes)

7. **Your frontend will be live** at: `https://your-project.vercel.app`

---

### Step 3: Enable CORS on Backend

After both are deployed, you need to allow your Vercel frontend to access your Render backend.

**Update `backend/src/server.ts`** to add your Vercel URL to CORS:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app', // Add your Vercel URL here
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

Then push to GitHub and Render will auto-redeploy.

---

## 🎯 Quick Deploy Commands

If you want to deploy from CLI:

### Vercel CLI:
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Render:
Just push to GitHub - Render auto-deploys on push!

---

## ⚠️ Important Notes

### File Storage Limitation
Your current local file storage (`backend/uploads/`) **won't work on Render's free tier** because:
- Free tier has ephemeral storage (files deleted on restart)
- You need to use cloud storage for production

**Solutions**:
1. **Cloudinary** (Recommended - Free tier: 25GB)
2. **AWS S3** (Pay as you go)
3. **Pinata IPFS** (Already integrated!)

For now, IPFS via Pinata will work as your primary storage.

### Socket.IO Configuration
Make sure your frontend connects to the correct backend URL:
```typescript
const socket = io(import.meta.env.VITE_API_URL);
```

This is already configured in your code! ✅

---

## 🐛 Troubleshooting

### "Module not found" errors
- Make sure `Root Directory` is set to `frontend` in Vercel
- Check that all dependencies are in `frontend/package.json`

### CORS errors
- Add your Vercel URL to backend CORS configuration
- Redeploy backend after updating

### Videos not uploading
- Remember: Render free tier has ephemeral storage
- Use IPFS (Pinata) as primary storage
- Videos will be stored on IPFS, not local filesystem

### Backend sleeping (Render free tier)
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid tier ($7/month) for always-on

---

## 🎉 After Deployment

Your app will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://deadtrendtracker-backend.onrender.com`

Test everything:
1. Connect MetaMask
2. Upload a video
3. View in feed
4. Like, share, comment
5. Check dashboard

---

## 💡 Pro Tips

1. **Use Render for backend** - Free tier is perfect for MVP
2. **Use Vercel for frontend** - Lightning fast CDN
3. **Enable IPFS** - Your videos will be decentralized
4. **Monitor logs** - Check Render dashboard for errors
5. **Set up custom domain** - Both Vercel and Render support this

---

**Happy deploying! 🎃👻**
