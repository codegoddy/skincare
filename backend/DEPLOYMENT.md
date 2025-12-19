# 🚀 Deployment Guide - Render Free Tier

This guide will help you deploy the ZenGlow backend API to Render's free tier.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A [Render account](https://render.com) (free)
- ✅ A [Supabase project](https://supabase.com) with database setup
- ✅ Your code pushed to a GitHub repository
- ✅ (Optional) A [Cloudinary account](https://cloudinary.com) for image uploads

## 🎯 Quick Deploy

### Option 1: Deploy with Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New" → "Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Click **"Apply"**

3. **Configure Environment Variables** (see below)

### Option 2: Manual Deploy

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New" → "Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `zenglow-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - **Plan**: `Free`

5. Add environment variables (see below)
6. Click **"Create Web Service"**

## 🔐 Environment Variables Configuration

In your Render service dashboard, go to **"Environment"** and add these variables:

### Required Variables

#### Supabase Configuration
Get from: https://app.supabase.com/project/_/settings/api

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### Database Connection
Get from: https://app.supabase.com/project/_/settings/database
**Important**: Use **Transaction Pooler** settings (port 6543)

```
user=postgres.xxxxx
password=your-password
host=aws-0-us-west-1.pooler.supabase.com
port=6543
dbname=postgres
```

#### Application Settings

```
DEBUG=false
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com
```

### Optional Variables

#### Rate Limiting (uses defaults if not set)
```
RATE_LIMIT_DEFAULT=60
RATE_LIMIT_AUTH=10
RATE_LIMIT_STRICT=5
```

#### Cloudinary (for image uploads)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🔄 Update Frontend Configuration

After deploying the backend, update your frontend environment variables on Vercel:

1. Go to your Vercel project settings
2. Update the API URL environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
3. Redeploy your frontend

## ⚙️ Render Free Tier Limitations

Be aware of these limitations on Render's free tier:

- 🔋 **Spin Down**: Services sleep after 15 minutes of inactivity
- ⏱️ **Cold Start**: First request after sleep takes ~30-60 seconds
- 💾 **Memory**: 512 MB RAM limit
- 🔄 **Hours**: 750 hours/month free (resets monthly)
- 🌐 **Bandwidth**: Limited to 100 GB/month

### Dealing with Spin Down

The free tier spins down after inactivity. To improve UX:

1. **Show loading state** in frontend during cold starts
2. **Ping endpoint** (optional): Use a cron service to ping `/health` every 14 minutes
   - Example: [Cron-job.org](https://cron-job.org) (free)
   - URL: `https://your-backend.onrender.com/health`
   - Schedule: Every 14 minutes
   - **Note**: This keeps your service warm but uses more of your 750 free hours

## 🗄️ Database Migrations

Migrations run automatically during build via `build.sh`. To run manually:

```bash
# SSH into Render shell (via dashboard)
alembic upgrade head
```

## 🔍 Health Check

Your service includes a health check endpoint at `/health`:

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "zenglow-api"
}
```

## 📊 Monitoring

### View Logs
- Go to your service in Render Dashboard
- Click **"Logs"** tab
- View real-time logs and errors

### Check Service Status
- Dashboard shows service status (Running/Sleeping)
- Monitor response times and errors
- Check health endpoint regularly

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build script fails
```bash
# Check build.sh has execution permissions
chmod +x build.sh
git add build.sh
git commit -m "Fix build script permissions"
git push
```

**Issue**: Migration errors
- Ensure database connection variables are correct
- Check Supabase database is accessible
- Verify you're using Transaction Pooler (port 6543)

### Service Won't Start

**Issue**: Port binding errors
- Render automatically sets `$PORT` environment variable
- Ensure start command uses `0.0.0.0:$PORT`

**Issue**: Import errors
- Check all dependencies are in `requirements.txt`
- Verify Python version compatibility

### CORS Errors

**Issue**: Frontend can't connect
- Verify `FRONTEND_URL` matches your Vercel deployment URL exactly
- Include protocol (https://)
- No trailing slash

### Database Connection Issues

**Issue**: Can't connect to Supabase
- Use Transaction Pooler settings (port 6543), not Direct Connection (port 5432)
- Check connection pooler is enabled in Supabase
- Verify password is correct (no special characters causing issues)

## 🔄 Redeployment

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Manual redeploy:
- Go to your service dashboard
- Click **"Manual Deploy" → "Deploy latest commit"**

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Python Guide](https://render.com/docs/deploy-fastapi)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/concepts/)

## ✅ Deployment Checklist

Use this checklist to ensure everything is configured:

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] All required environment variables added
- [ ] Database migrations completed successfully
- [ ] Health check endpoint responding
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] CORS configured correctly
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Monitor logs for errors

## 🎉 Success!

Your backend should now be live at:
```
https://your-backend.onrender.com
```

API documentation (if DEBUG=true):
```
https://your-backend.onrender.com/docs
```

---

Need help? Check the logs in Render dashboard or review the troubleshooting section above.
