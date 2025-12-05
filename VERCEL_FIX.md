# 🔧 Quick Fix for Vercel "vite_api_url doesn't exist" Error

## The Problem
You're trying to deploy the entire project to Vercel, but Vercel is looking for environment variables that don't exist as secrets.

## The Solution
You need to deploy **frontend only** to Vercel, and deploy the **backend separately** to Render.

---

## 🚀 Quick Steps

### Option 1: Deploy Frontend Only to Vercel (Recommended)

1. **In Vercel Dashboard** (during initial setup):
   - Click "Edit" next to Root Directory
   - Type: `frontend` ← THIS IS THE KEY!
   - Framework Preset: `Vite` (auto-detected)
   - Build Command: `npm run build` (leave default)
   - Output Directory: `dist` (leave default)
   - Install Command: `npm install` (leave default)

2. **Add Environment Variables** (in Vercel dashboard):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
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

3. **Redeploy**

---

### Option 2: Use Vercel CLI

```bash
cd frontend
vercel --prod
```

When prompted, answer:
- Set up and deploy? **Y**
- Which scope? (your account)
- Link to existing project? **N**
- Project name? **deadtrendtracker**
- Directory? **./frontend** (or just press Enter if already in frontend)
- Override settings? **N**

---

## ⚠️ Important: Deploy Backend First!

Before your frontend works, you need a backend URL. Deploy backend to Render:

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Add all environment variables from `backend/.env`
8. Deploy!

Then use the Render URL in your Vercel environment variables.

---

## 🎯 The Correct Architecture

```
┌─────────────────┐
│   Vercel        │  ← Frontend (React + Vite)
│   (Static)      │     https://your-app.vercel.app
└────────┬────────┘
         │
         │ API Calls
         ↓
┌─────────────────┐
│   Render        │  ← Backend (Node.js + Express)
│   (Server)      │     https://your-backend.onrender.com
└─────────────────┘
```

---

## 📝 Summary

**Don't deploy backend to Vercel!** 
- Vercel = Frontend only
- Render = Backend only

Your current `vercel.json` has been updated to deploy frontend only.

---

**Need more help?** Check `VERCEL_DEPLOYMENT.md` for the complete guide!
