# 🚀 Deployment Guide - ServiceHive CRM

Your app is **100% Docker-ready** for production deployment!

## Quick Start (5 minutes)

### Best Option: Railway.app (FREE)

1. **Create GitHub repo & push code**:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [Railway.app](https://railway.app)**
   - Sign in with GitHub
   - Click "Create Project"
   - Select "Deploy from GitHub repo"
   - Connect your repo

3. **Railway will auto-detect docker-compose.yml** ✅

4. **Add Services**:
   - Railway → "Add Service" → "MongoDB"
   - It auto-fills `MONGO_URI` environment variable

5. **Set Environment Variables** (in Railway Dashboard):
   ```
   NODE_ENV=production
   JWT_ACCESS_SECRET=<generate: openssl rand -base64 32>
   JWT_REFRESH_SECRET=<generate: openssl rand -base64 32>
   CLIENT_URL=https://<your-railway-domain>.up.railway.app
   VITE_API_URL=/api/v1
   ```

6. **Deploy** → Railway auto-builds & runs!

---

## Alternative Options

### Render.com (Similar to Railway)
- Sign up at render.com
- Connect GitHub repo
- Similar setup process
- Free tier available

### AWS / GCP / Azure (More Control)
- More complex setup
- Pay-per-use pricing
- Requires more configuration

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Production flag | `production` |
| `MONGO_URI` | Database connection | `mongodb+srv://user:pass@...` |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) | `a1b2c3d4...` |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | `x9y8z7w6...` |
| `CLIENT_URL` | Frontend domain | `https://yourapp.com` |
| `VITE_API_URL` | Frontend API URL | `/api/v1` |

**Generate Secrets** (Run this):
```bash
openssl rand -base64 32
openssl rand -base64 32
```

---

## How Deployment Works

```
1. You push code to GitHub
2. Railway detects docker-compose.yml
3. Railway builds Docker images:
   - Frontend (React + Nginx)
   - Backend (Node.js)
   - MongoDB (managed by Railway)
4. Services start and connect automatically
5. Your app is LIVE! 🎉
```

---

## Production Checklist

- [ ] Update `CLIENT_URL` to your production domain
- [ ] Generate 32-char JWT secrets
- [ ] Set `NODE_ENV=production`
- [ ] Use managed MongoDB (not local)
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Test all features before going live
- [ ] Set up error monitoring (optional: Sentry)

---

## Common Issues & Fixes

### "Cannot POST /api/v1/leads"
- ✅ **Fixed**: Nginx proxy configured correctly

### "Database connection failed"
- Add MongoDB service in Railway
- Verify `MONGO_URI` is set

### "CORS errors"
- Backend has CORS enabled for all origins
- Should work with any frontend domain

### Frontend shows 404
- ✅ **Fixed**: React Router fallback to index.html in nginx.conf

---

## After Deployment

1. **Get your domain**:
   - Railway automatically assigns: `https://servicehive-xxx.up.railway.app`
   - Or use custom domain in Railway settings

2. **Test**:
   - Register a new user
   - Create, edit, delete leads
   - Export CSV
   - Test logout

3. **Monitor**:
   - Railway dashboard shows logs & metrics
   - Set up alerts for errors

---

## Cost Estimate

| Service | Cost |
|---------|------|
| Railway (app + MongoDB) | $5-15/month |
| Render | Free-$20/month |
| AWS | $10-50+/month |

**Recommendation**: Start with Railway free tier, upgrade as you grow.

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Docker Docs: https://docs.docker.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
