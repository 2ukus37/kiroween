# DeadTrendTracker Deployment Guide 🚀

This guide will help you deploy your DeadTrendTracker video platform to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ Firebase project set up (kiro-ab068)
- ✅ Pinata account for IPFS
- ✅ Smart contracts deployed on Polygon Mainnet
- ✅ All environment variables configured

## Deployment Options

### Option 1: Vercel (Recommended for Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Prepare Frontend for Production**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add these environment variables:
     - `VITE_API_URL` = Your backend URL (e.g., https://your-backend.railway.app)
     - `VITE_FIREBASE_API_KEY` = Your Firebase API key
     - `VITE_FIREBASE_AUTH_DOMAIN` = kiro-ab068.firebaseapp.com
     - `VITE_FIREBASE_PROJECT_ID` = kiro-ab068
     - `VITE_FIREBASE_STORAGE_BUCKET` = kiro-ab068.appspot.com
     - `VITE_FIREBASE_MESSAGING_SENDER_ID` = Your sender ID
     - `VITE_FIREBASE_APP_ID` = Your app ID
     - `VITE_POLYGON_RPC_URL` = https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Set Environment Variables in Railway**
   Add all variables from `backend/.env`:
   ```
   FIREBASE_PROJECT_ID=kiro-ab068
   FIREBASE_STORAGE_BUCKET=kiro-ab068.appspot.com
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kiro-ab068.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=<your-private-key>
   PINATA_API_KEY=ba09562a2a88ffd6f3b1
   PINATA_SECRET_KEY=9a2bca8d4a7cf983cb4f110d19c00f11fd07b4687ff98b9600592a0cff8ac76b
   POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/-UnbUxiY53bLFObnzInah
   CREATOR_TOKEN_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138
   CONTENT_NFT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8
   REWARD_POOL_ADDRESS=0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
   PORT=5000
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL (e.g., https://your-app.railway.app)

6. **Update Frontend Environment**
   - Update `VITE_API_URL` in Vercel to point to your Railway backend URL
   - Redeploy frontend

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend on Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all `VITE_*` variables

#### Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set FIREBASE_PROJECT_ID=kiro-ab068
   heroku config:set PINATA_API_KEY=ba09562a2a88ffd6f3b1
   # ... set all other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Full Stack on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - New > Web Service
   - Connect your repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add all environment variables

3. **Deploy Frontend**
   - New > Static Site
   - Connect your repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add all environment variables

## Post-Deployment Checklist

### 1. Update CORS Settings
Update `backend/src/server.ts` to allow your production frontend URL:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app', // Add your production URL
  ],
  credentials: true,
};
```

### 2. Update API URLs
- Update `API_URL` in `backend/.env` to your production backend URL
- Update `VITE_API_URL` in frontend environment to production backend URL

### 3. Configure Firebase Security Rules
Update Firestore rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Set Up File Storage
Since you're using local file storage, you need to:
- Use a cloud storage service (AWS S3, Google Cloud Storage, or Cloudinary)
- Or keep using local storage but ensure your backend has persistent storage

**Recommended: Switch to Cloud Storage**

For Railway/Render, add cloud storage:
```bash
npm install @aws-sdk/client-s3
```

Update `backend/src/utils/localStorage.ts` to use S3 or similar.

### 5. Configure Domain (Optional)
- Purchase a domain from Namecheap, GoDaddy, etc.
- Point domain to your hosting service
- Update environment variables with new domain

## Environment Variables Summary

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=kiro-ab068.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kiro-ab068
VITE_FIREBASE_STORAGE_BUCKET=kiro-ab068.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Backend (.env)
```env
FIREBASE_PROJECT_ID=kiro-ab068
FIREBASE_STORAGE_BUCKET=kiro-ab068.appspot.com
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kiro-ab068.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=<your-private-key>
PINATA_API_KEY=ba09562a2a88ffd6f3b1
PINATA_SECRET_KEY=9a2bca8d4a7cf983cb4f110d19c00f11fd07b4687ff98b9600592a0cff8ac76b
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/-UnbUxiY53bLFObnzInah
CREATOR_TOKEN_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138
CONTENT_NFT_ADDRESS=0xf8e81D47203A594245E36C48e151709F0C19fBe8
REWARD_POOL_ADDRESS=0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
PORT=5000
API_URL=https://your-backend-url.railway.app
```

## Testing Production Deployment

1. **Test Video Upload**
   - Upload a test video
   - Verify it appears in feed

2. **Test Engagement Features**
   - Like, share, comment on videos
   - Verify real-time updates work

3. **Test Wallet Connection**
   - Connect MetaMask
   - Check dashboard loads correctly

4. **Test Cross-Origin Requests**
   - Ensure frontend can communicate with backend
   - Check browser console for CORS errors

## Monitoring & Maintenance

### Set Up Monitoring
- Use Railway/Render built-in monitoring
- Set up error tracking with Sentry
- Monitor Firebase usage

### Regular Maintenance
- Check logs for errors
- Monitor storage usage
- Update dependencies regularly
- Backup Firebase data

## Troubleshooting

### CORS Errors
- Ensure backend CORS settings include your frontend URL
- Check environment variables are set correctly

### Video Upload Fails
- Check file size limits on hosting platform
- Verify Pinata API keys are correct
- Check backend logs for errors

### Wallet Connection Issues
- Ensure MetaMask is on correct network
- Check RPC URL is accessible
- Verify smart contract addresses

## Cost Estimates

### Free Tier Options
- **Vercel**: Free for personal projects
- **Railway**: $5/month with free trial
- **Render**: Free tier available
- **Firebase**: Free tier (Spark plan)
- **Pinata**: Free tier (1GB storage)

### Recommended Setup (Monthly)
- Frontend (Vercel): Free
- Backend (Railway): $5-10
- Firebase: Free - $25
- Pinata: Free - $20
- **Total**: $5-55/month

## Need Help?

If you encounter issues during deployment:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally first with production environment variables
4. Check Firebase console for errors

---

**Your DeadTrendTracker platform is ready for deployment! 🎃👻**
