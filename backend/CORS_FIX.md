# 🔴 CORS Error Fix

## Problem

Your frontend on Vercel (`https://skincare-smoky.vercel.app`) cannot access your backend on Render because of CORS policy blocking.

**Error:**
```
Access to fetch at 'https://backend-skincare-i027.onrender.com/...' 
from origin 'https://skincare-smoky.vercel.app' has been blocked by CORS policy
```

## Root Cause

The backend's `FRONTEND_URL` environment variable doesn't match your actual Vercel deployment URL.

## Quick Fix (5 minutes)

### Step 1: Update Render Environment Variable

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **zenglow-backend** service
3. Click **"Environment"** tab
4. Find or add `FRONTEND_URL` variable
5. Set it to: `https://skincare-smoky.vercel.app`
   
   ⚠️ **Important:**
   - Include `https://`
   - NO trailing slash
   - Must match exactly

### Step 2: Redeploy Backend

After updating the environment variable:
- Render will automatically redeploy
- OR manually click **"Manual Deploy" → "Deploy latest commit"**

### Step 3: Verify

Wait for deployment to complete (~2-3 minutes), then test:

```bash
# Test health endpoint (should work without CORS)
curl https://backend-skincare-i027.onrender.com/health

# Expected response:
{"status":"healthy","service":"zenglow-api"}
```

Then refresh your frontend at `https://skincare-smoky.vercel.app` - CORS errors should be gone!

## Detailed Steps with Screenshots

### 1. Access Render Dashboard

- Go to: https://dashboard.render.com/
- Find your backend service: **zenglow-backend** (or similar name)
- Click on it

### 2. Navigate to Environment Tab

- In the left sidebar or top tabs, click **"Environment"**
- You'll see a list of environment variables

### 3. Update FRONTEND_URL

Look for the `FRONTEND_URL` variable:

**If it exists:**
- Click the **Edit** icon
- Change value to: `https://skincare-smoky.vercel.app`
- Click **Save**

**If it doesn't exist:**
- Click **"Add Environment Variable"**
- Key: `FRONTEND_URL`
- Value: `https://skincare-smoky.vercel.app`
- Click **Save**

### 4. Wait for Auto-Deploy

Render will automatically redeploy when you change environment variables.

Check the **"Logs"** tab to monitor deployment progress:
```
✓ Installing dependencies
✓ Running migrations
✓ Starting service
```

## Verification Checklist

- [ ] `FRONTEND_URL` set to `https://skincare-smoky.vercel.app`
- [ ] No trailing slash in URL
- [ ] Backend redeployed successfully
- [ ] Health endpoint responds: `https://backend-skincare-i027.onrender.com/health`
- [ ] Frontend can fetch data (refresh browser)
- [ ] No CORS errors in browser console

## Still Not Working?

### Check Backend Logs

1. Go to Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for startup messages:
   ```
   🚀 Starting ZenGlow API (debug=False)
   ```
4. Verify CORS origins in logs (if visible)

### Check Current Environment

In Render, go to Environment tab and verify:

```
FRONTEND_URL=https://skincare-smoky.vercel.app
DEBUG=false
BACKEND_URL=https://backend-skincare-i027.onrender.com
```

### Test CORS Manually

Use curl to test CORS headers:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://skincare-smoky.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  https://backend-skincare-i027.onrender.com/products

# Should include:
# Access-Control-Allow-Origin: https://skincare-smoky.vercel.app
```

### Common Issues

**Issue 1: Trailing Slash**
❌ `https://skincare-smoky.vercel.app/`
✅ `https://skincare-smoky.vercel.app`

**Issue 2: Wrong Protocol**
❌ `http://skincare-smoky.vercel.app`
✅ `https://skincare-smoky.vercel.app`

**Issue 3: Wrong Domain**
❌ `https://skincare-smoky.vercel.com`
✅ `https://skincare-smoky.vercel.app`

**Issue 4: Multiple Domains**
If you have multiple frontend URLs (e.g., preview deployments), you may need to update the backend code to accept multiple origins.

## Backend Code Reference

The CORS configuration is in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # Uses FRONTEND_URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[...],
)
```

The `settings.cors_origins` comes from `backend/app/config.py`:

```python
@property
def cors_origins(self) -> list[str]:
    origins = [self.frontend_url]  # FRONTEND_URL env var
    if self.debug:
        origins.extend([
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ])
    return origins
```

## Prevention

To avoid this in the future:

1. **Always update `FRONTEND_URL`** when deploying to new domains
2. **Test immediately** after deployment
3. **Document your URLs** in a deployment checklist
4. **Use environment variable templates** to track all required vars

## Need More Help?

If CORS errors persist after following these steps:

1. Check Render service logs for errors
2. Verify all environment variables are set correctly
3. Ensure backend deployment succeeded
4. Try a hard refresh (Ctrl+Shift+R) on frontend
5. Clear browser cache

The issue is almost always the `FRONTEND_URL` not matching your actual frontend URL exactly.
