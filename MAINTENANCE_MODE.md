# 🔧 Maintenance Mode Feature

## Overview

The maintenance mode feature allows administrators to temporarily disable customer access to the site while performing updates, fixes, or maintenance. Admins can still access the site to manage settings and content.

---

## ✨ Features

### 1. **Easy Toggle** (Admin Dashboard)
- Simple on/off switch in Admin → Settings
- Instant activation/deactivation
- Visual indicator (amber/orange color) when enabled

### 2. **Smart Access Control** (Backend)
- Blocks all customer requests when enabled
- Allows admin users full access
- Permits essential endpoints (health, auth, admin)
- Returns 503 status with maintenance message

### 3. **Beautiful Maintenance Page** (Frontend)
- Professional maintenance message
- Animated loading indicators
- Refresh and contact options
- Responsive design

### 4. **Automatic Redirection** (Middleware)
- Checks maintenance status on every request
- Redirects customers to maintenance page
- Admins bypass and access normally

---

## 🎯 How It Works

### Backend (FastAPI)

**Middleware:** `backend/app/shared/maintenance.py`

1. **Checks database** for maintenance mode status
2. **Allows these paths** always:
   - `/health` - Health check
   - `/auth/*` - Authentication endpoints
   - `/admin/*` - Admin endpoints
   - `/store/config` - Store configuration
   - `/ws` - WebSocket connections

3. **For other paths:**
   - If maintenance mode ON → Check if user is admin
   - If admin → Allow access
   - If not admin → Return 503 error with maintenance message

**Response when blocked:**
```json
{
  "detail": "The site is currently under maintenance. Please check back later.",
  "maintenance": true
}
```

### Frontend (Next.js)

**Middleware:** `frontend/src/middleware.ts`

1. **Checks maintenance status** by calling `/store/config`
2. **Redirects customers** to `/maintenance` page
3. **Allows these paths:**
   - `/maintenance` - Maintenance page itself
   - `/admin/*` - Admin routes
   - `/login` - Login page
   - `/_next/*` - Next.js assets

**Maintenance Page:** `frontend/src/app/maintenance/page.tsx`
- Clean, professional design
- Animated icons and indicators
- Refresh and contact buttons
- Responsive layout

---

## 📋 Usage Guide

### Enabling Maintenance Mode

**As Admin:**

1. Login to admin dashboard
2. Navigate to **Admin → Settings**
3. Scroll to **"Maintenance Mode"** section (amber/orange box)
4. Click the toggle switch to **enable** maintenance mode
5. Click **"Save Settings"** button
6. ✅ Maintenance mode is now active!

**What happens:**
- Customers see maintenance page immediately
- You (admin) can still access everything normally
- All customer API requests return 503 error

### Disabling Maintenance Mode

1. Go to **Admin → Settings**
2. Toggle maintenance mode **off**
3. Click **"Save Settings"**
4. ✅ Site is back to normal!

**What happens:**
- Customers can access the site normally
- All features work as expected

---

## 🔍 Testing

### Test as Admin

1. Enable maintenance mode in settings
2. Open site in **incognito/private window** (or logout)
3. Try to access the shop page
4. ✅ Should see maintenance page
5. Login as admin
6. ✅ Should access everything normally

### Test API Directly

**Check maintenance status:**
```bash
curl https://backend-skincare-i027.onrender.com/store/config
```

**Response when enabled:**
```json
{
  "maintenance_mode": true,
  ...
}
```

**Try to access products (as customer):**
```bash
curl https://backend-skincare-i027.onrender.com/products
```

**Response:**
```json
{
  "detail": "The site is currently under maintenance. Please check back later.",
  "maintenance": true
}
```

**Try as admin:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  https://backend-skincare-i027.onrender.com/products
```

**Response:** Normal product list (admin bypasses maintenance)

---

## 🎨 Customization

### Change Maintenance Page Content

Edit `frontend/src/app/maintenance/page.tsx`:

```tsx
// Change title
<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
  Your Custom Title
</h1>

// Change message
<p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
  Your custom maintenance message
</p>

// Change contact email
<a href="mailto:your-email@domain.com">
  your-email@domain.com
</a>
```

### Change Allowed Paths (Backend)

Edit `backend/app/shared/maintenance.py`:

```python
allowed_paths = [
    "/health",
    "/auth/login",
    "/your/custom/path",  # Add custom paths
]
```

### Change Maintenance Toggle Style

Edit `frontend/src/app/admin/settings/page.tsx`:

```tsx
// Line ~237-263
className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
  formData.maintenance_mode
    ? 'bg-red-500 justify-end'    // Change color when enabled
    : 'bg-gray-300 justify-start'
}`}
```

---

## 🚀 Deployment

### Backend Changes

**Files added/modified:**
- ✅ `app/shared/maintenance.py` - Maintenance middleware
- ✅ `app/main.py` - Added middleware
- ✅ `app/services/admin/store_settings.py` - Already had maintenance_mode field

**Deploy:**
```bash
git add backend/
git commit -m "feat: Add maintenance mode feature"
git push origin main
```

Render will auto-deploy.

### Frontend Changes

**Files added/modified:**
- ✅ `src/app/maintenance/page.tsx` - Maintenance page
- ✅ `src/lib/api/maintenance.ts` - Maintenance utilities
- ✅ `src/lib/api/client.ts` - Updated error handling
- ✅ `src/middleware.ts` - Maintenance check middleware

**Deploy:**
```bash
git add frontend/
git commit -m "feat: Add maintenance mode UI and middleware"
git push origin main
```

Vercel will auto-deploy.

---

## ⚠️ Important Notes

### Database Must Have Default Row

The `store_settings` table should have at least one row. Check by running migration:

```bash
cd backend
alembic upgrade head
```

This creates a default row with `maintenance_mode = false`.

### Cache Considerations

The frontend middleware checks maintenance status on **every request**. This is intentional to ensure immediate updates when toggling maintenance mode.

If you want to add caching (for performance), consider:
- Cache for 30-60 seconds
- Clear cache when admin saves settings

### Admin Authentication

Admins are identified by:
1. Valid JWT token in Authorization header
2. User role = "admin" in database

Make sure your admin account has role set correctly in `user_profiles` table.

### SEO Considerations

When in maintenance mode:
- Returns **503 Service Unavailable** status
- Search engines understand this is temporary
- No negative SEO impact if brief (< 24 hours)

For longer maintenance:
- Consider adding a `Retry-After` header
- Add estimated downtime to maintenance page

---

## 🐛 Troubleshooting

### Issue: Maintenance page not showing

**Check:**
1. Is maintenance mode enabled in admin settings?
2. Did you save settings after enabling?
3. Clear browser cache and reload
4. Check `/store/config` endpoint returns `maintenance_mode: true`

### Issue: Admin can't access site

**Check:**
1. Is user logged in with admin account?
2. Does user have role="admin" in database?
3. Is JWT token valid and not expired?
4. Check browser console for errors

### Issue: Middleware not running

**Check:**
1. Is `middleware.ts` in the correct location? (frontend/src/)
2. Restart Next.js dev server
3. Check middleware logs in terminal
4. Verify API URL is correct in environment variables

### Issue: API returns 503 for admin

**Check:**
1. Authorization header is present
2. Token is valid (not expired)
3. User role is "admin" in database
4. Backend logs for errors

---

## 📊 Database Schema

**Table:** `store_settings`

```sql
CREATE TABLE store_settings (
  id UUID PRIMARY KEY,
  store_name TEXT,
  store_email TEXT,
  ...
  maintenance_mode BOOLEAN DEFAULT false,  -- Maintenance flag
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Check current status:**
```sql
SELECT maintenance_mode FROM store_settings LIMIT 1;
```

**Manually enable:**
```sql
UPDATE store_settings SET maintenance_mode = true;
```

**Manually disable:**
```sql
UPDATE store_settings SET maintenance_mode = false;
```

---

## 🔮 Future Enhancements

### Possible Improvements:
- [ ] Scheduled maintenance (auto-enable at specific time)
- [ ] Custom maintenance message (editable in admin)
- [ ] Maintenance countdown timer
- [ ] Email notifications when maintenance starts/ends
- [ ] Maintenance mode history/logs
- [ ] Whitelist specific IPs (allow certain users during maintenance)

---

## ✅ Summary

### What You Get:

1. **Simple Toggle** - One-click enable/disable in admin settings
2. **Smart Protection** - Blocks customers, allows admins
3. **Professional UI** - Beautiful maintenance page
4. **Automatic Handling** - Middleware redirects customers
5. **API Protection** - Backend blocks non-admin requests
6. **Zero Downtime for Admins** - You can work while site is "down"

### Use Cases:

- **Updates & Fixes** - Deploy critical updates safely
- **Data Migration** - Prevent customer access during migrations
- **Emergency Issues** - Quickly disable site if problems occur
- **Scheduled Maintenance** - Regular maintenance windows
- **Testing** - Test features without customer impact

---

## 🎉 You're Ready!

Your maintenance mode feature is fully implemented and ready to use!

**Next Steps:**
1. ✅ Deploy backend and frontend changes
2. ✅ Test enabling/disabling maintenance mode
3. ✅ Test as customer (incognito window)
4. ✅ Test as admin (should work normally)
5. ✅ Customize maintenance page if desired

---

*Last Updated: December 19, 2025*
