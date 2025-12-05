# 🎯 Vercel Deployment - Step by Step (With Screenshots Guide)

## The Error You're Getting

```
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && npm install" exited with 1
```

**Why?** Vercel is trying to run commands from the root directory, but your frontend code is in the `frontend/` folder.

**Solution:** Tell Vercel to use `frontend` as the Root Directory!

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** button (top right)
4. Select **"Project"**

---

### Step 2: Import Your Repository

1. Find your repository: `2ukus37/kiroween`
2. Click **"Import"**

---

### Step 3: Configure Project Settings ⚠️ MOST IMPORTANT!

You'll see a screen titled **"Configure Project"**. Here's what to do:

#### A. Framework Preset
- Should auto-detect as **"Vite"**
- If not, select "Vite" from dropdown

#### B. Root Directory ⚠️ THIS IS THE KEY!
Look for a section that says:
```
Root Directory
./
```

**DO THIS:**
1. Click the **"Edit"** button next to Root Directory
2. A text field will appear
3. Type: `frontend`
4. Press Enter or click outside the field

It should now show:
```
Root Directory
./frontend
```

#### C. Build and Output Settings
Leave these as default:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

### Step 4: Add Environment Variables

Click **"Environment Variables"** section and add these:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyArEEM5F29Jl8CBECyEWCoIAECz3gmiZSg` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `kiro-ab068.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `kiro-ab068` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `kiro-ab068.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `496338114030` |
| `VITE_FIREBASE_APP_ID` | `1:496338114030:web:ae23e5b95788c375836aff` |
| `VITE_POLYGON_RPC_URL` | `https://polygon-mainnet.g.alchemy.com/v2/-UnbUxiY53bLFObnzInah` |
| `VITE_CREATOR_TOKEN_ADDRESS` | `0xd9145CCE52D386f254917e481eB44e9943F39138` |
| `VITE_CONTENT_NFT_ADDRESS` | `0xf8e81D47203A594245E36C48e151709F0C19fBe8` |
| `VITE_REWARD_POOL_ADDRESS` | `0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B` |

**Note:** Replace `VITE_API_URL` with your actual Render backend URL!

---

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. Your site will be live! 🎉

---

## 🔧 If You Already Deployed (And Got Error)

If you already tried to deploy and got the error, here's how to fix it:

### Option A: Redeploy with Correct Settings

1. Go to your project in Vercel dashboard
2. Click **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Click **"Edit"**
5. Type: `frontend`
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on the latest deployment

### Option B: Delete and Start Over

1. Go to project settings
2. Scroll to bottom
3. Click **"Delete Project"**
4. Start from Step 1 above

---

## ✅ How to Verify It's Working

After deployment, you should see:

```
✓ Build completed successfully
✓ Deployment ready
```

Your site will be at: `https://your-project-name.vercel.app`

---

## 🐛 Still Getting Errors?

### Error: "Module not found"
- Make sure Root Directory is set to `frontend`
- Check that `frontend/package.json` exists in your repo

### Error: "Build failed"
- Check environment variables are set correctly
- Make sure `VITE_API_URL` points to your backend

### Error: "CORS policy"
- Your backend needs to allow your Vercel URL
- Update `backend/src/server.ts` CORS settings
- Redeploy backend

---

## 📸 Visual Checklist

When configuring your project, you should see:

```
✓ Framework Preset: Vite
✓ Root Directory: ./frontend  ← MUST BE SET!
✓ Build Command: npm run build
✓ Output Directory: dist
✓ Install Command: npm install
✓ Environment Variables: 11 variables added
```

If you see this, you're good to go! Click Deploy!

---

## 🎯 Quick Reference

**The ONE thing that fixes your error:**
```
Root Directory = frontend
```

That's it! Everything else can be default.

---

**Need more help?** Check:
- [DEPLOY_NOW.md](DEPLOY_NOW.md) - Quick reference
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Full guide
- [VERCEL_FIX.md](VERCEL_FIX.md) - Troubleshooting

---

**Let's deploy! 🚀👻**
