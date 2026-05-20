# 🚀 Deploy to Railway in 5 Minutes

## Step 1: Generate Secrets (2 min)

Run this in your terminal to generate random secrets:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

You'll get two outputs like:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789=
xYzAbCdEfGhIjKlMnOpQrStUvWx1234567890=
```

Save these for later.

---

## Step 2: Push to GitHub (1 min)

```bash
cd c:\Large_files\ServiceHiveProject
git init
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

---

## Step 3: Deploy on Railway (2 min)

1. Go to **[railway.app](https://railway.app)**
2. Click **"Create Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway & select your repo
5. Railway auto-detects `docker-compose.yml` ✅

---

## Step 4: Add MongoDB Database (30 sec)

In Railway Dashboard:
1. Click **"+ New"** → **"Database"** → **"MongoDB"**
2. Railway automatically adds `MONGO_URI` variable
3. Wait ~30 seconds for MongoDB to start

---

## Step 5: Set Environment Variables (2 min)

In Railway Dashboard, go to **Variables** for Backend service:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `JWT_ACCESS_SECRET` | Paste first secret from Step 1 |
| `JWT_REFRESH_SECRET` | Paste second secret from Step 1 |
| `CLIENT_URL` | Will get this later |
| `VITE_API_URL` | `/api/v1` |

**Note**: `MONGO_URI` is auto-filled by Railway ✅

---

## Step 6: Deploy (1 min)

1. Railway automatically detects changes
2. Wait for build to complete (~3 min)
3. Watch the **Deployments** tab

---

## Step 7: Get Your URL

Once deployed:
1. Frontend service → Click domain URL (e.g., `https://servicehive-prod-xyz.up.railway.app`)
2. Copy this URL

Update the `CLIENT_URL` variable:
- Backend Variables → `CLIENT_URL` → paste your URL
- Save → Railway auto-redeploys

---

## Step 8: Test Your App! 🎉

1. Open your Railway URL in browser
2. Register a new user
3. Create a lead
4. Test all features
5. Export CSV

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Wait 2 minutes for MongoDB to initialize
- Check `MONGO_URI` is set correctly

### "Cannot POST /api/v1/leads"
- Make sure `CLIENT_URL` matches your Railway domain
- Restart the backend service

### "Blank page"
- Check Frontend build logs in Railway dashboard
- Clear browser cache (Ctrl+Shift+Delete)

---

## Custom Domain (Optional)

In Railway:
1. Backend service → **Settings**
2. **Custom Domain** → Add your domain
3. Update DNS records (Railway shows instructions)

---

## Monitor Your App

In Railway Dashboard:
- **Logs**: See real-time errors
- **Metrics**: CPU, memory, network usage
- **Deploy**: Trigger redeploy or rollback

---

## Cost

- **Free tier**: Perfect for testing/small projects
- **Pay-as-you-go**: ~$5-15/month for production
- Cancel anytime!

---

## Next Steps

1. ✅ App is live!
2. 📊 Monitor logs in Railway
3. 🔒 Set up custom domain
4. 📈 Invite team members
5. 🎯 Add more features!

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Join Railway Discord: https://discord.gg/railway
