# 🚀 Deploy DeadTrendTracker NOW - Quick Reference

## ⚡ TL;DR - Just Do This

### 1️⃣ Deploy Backend to Render (5 minutes)

**Go to**: https://render.com

**Settings**:
```
Repository: https://github.com/2ukus37/kiroween
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables** (copy-paste all):
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

**After deployment**, add one more variable:
```
API_URL=https://your-backend-name.onrender.com
```
(Replace with your actual Render URL)

---

### 2️⃣ Deploy Frontend to Vercel (2 minutes)

**Go to**: https://vercel.com

**Settings**:
```
Repository: https://github.com/2ukus37/kiroween
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

**Environment Variables** (copy-paste all):
```
VITE_API_URL=https://your-backend-name.onrender.com
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

**Important**: Replace `VITE_API_URL` with your actual Render backend URL!

---

## ✅ That's It!

Your app will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend-name.onrender.com`

---

## 🐛 Common Issues

### "Module not found"
- Make sure Root Directory is set correctly
- Frontend: `frontend`
- Backend: `backend`

### "CORS error"
After deployment, update `backend/src/server.ts`:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app', // Add your Vercel URL
  ],
  credentials: true,
};
```

Then push to GitHub - Render will auto-redeploy.

### "Backend sleeping"
Render free tier sleeps after 15 minutes. First request takes ~30 seconds to wake up. This is normal!

---

## 📚 More Help

- **Full Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Troubleshooting**: [VERCEL_FIX.md](VERCEL_FIX.md)
- **Project Docs**: [README.md](README.md)

---

**Let's go! 🎃👻**
