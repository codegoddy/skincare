# 🔧 Render Deployment Fix

## Issue
```
ModuleNotFoundError: No module named 'cloudinary'
```

## Solution
Added missing dependencies to `requirements.txt`:
- `cloudinary>=1.41.0` - For image upload functionality
- `python-multipart>=0.0.9` - For handling file uploads

## How to Deploy

### 1. Commit and Push
```bash
git add backend/requirements.txt
git commit -m "Fix: Add cloudinary and python-multipart dependencies"
git push origin main
```

### 2. Render Auto-Deploy
Render will automatically detect the changes and redeploy.

### 3. Verify Deployment
Check the deployment logs in Render dashboard:
- Build should complete successfully
- App should start without import errors

## Cloudinary Configuration (Optional)

Cloudinary is **optional**. The API will work without it.

### If Using Cloudinary:
Add these environment variables in Render dashboard:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### If NOT Using Cloudinary:
Leave these as empty strings or don't set them:
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Note:** Without Cloudinary, the `/admin/products/upload-image` endpoint won't work, but all other endpoints will function normally. You can manually add image URLs when creating products.

## Testing After Deploy

1. **Health Check:**
   ```bash
   curl https://your-backend.onrender.com/health
   ```

2. **API Docs:**
   ```bash
   # If DEBUG=true
   open https://your-backend.onrender.com/docs
   ```

3. **Test Product Listing:**
   ```bash
   curl https://your-backend.onrender.com/products
   ```

## Common Issues

### Build Still Fails
- Check Render logs for specific error
- Ensure `build.sh` has execute permissions
- Verify all environment variables are set

### App Starts But Crashes
- Check database connection (use port 6543 for Supabase pooler)
- Verify Supabase credentials are correct
- Check logs for specific errors

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel deployment
- Include `https://` protocol
- No trailing slash

## Updated Files

- ✅ `backend/requirements.txt` - Added cloudinary and python-multipart
- ✅ All other deployment files remain unchanged

Your deployment should now succeed! 🚀
