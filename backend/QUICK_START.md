# 🚀 Quick Start - Deploy to Render in 5 Minutes

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

## Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select your repository
5. Click **"Apply"**

## Step 3: Add Environment Variables

In Render dashboard, go to your service → **"Environment"** tab and add:

### Supabase (from https://app.supabase.com/project/_/settings/api)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Database (from https://app.supabase.com/project/_/settings/database)
**⚠️ Use Transaction Pooler (port 6543), NOT Direct Connection**
```
user=postgres.xxxxx
password=your-password
host=aws-0-us-west-1.pooler.supabase.com
port=6543
dbname=postgres
```

### Frontend URL
```
FRONTEND_URL=https://your-app.vercel.app
```

## Step 4: Deploy!

Render will automatically:
- ✅ Install dependencies
- ✅ Run database migrations
- ✅ Start your API server

Your API will be live at: `https://your-backend.onrender.com`

## Step 5: Update Frontend

In your Vercel project settings, update:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

Then redeploy your frontend.

## ✅ Test Deployment

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy", "service": "zenglow-api"}
```

---

## 📚 Need More Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Detailed instructions
- Troubleshooting guide
- Free tier limitations
- Advanced configuration

## 🐛 Common Issues

**Build fails?** Check that `build.sh` has execute permissions
**Can't connect to database?** Verify you're using Transaction Pooler (port 6543)
**CORS errors?** Ensure `FRONTEND_URL` exactly matches your Vercel URL
**Service sleeps?** Free tier sleeps after 15 min inactivity (30-60s cold start)
