# Cookie-Based Authentication Migration

## Overview
Successfully migrated authentication from localStorage to secure HTTP-only cookies to prevent XSS attacks.

## Changes Made

### Backend Changes (`backend/app/services/auth/routes.py`)

#### 1. Updated Signup Endpoint
- Added `Response` parameter to set cookies
- Sets `access_token` and `refresh_token` as HTTP-only cookies
- Cookie settings:
  - `httponly=True` - Prevents JavaScript access
  - `secure=is_production` - HTTPS only in production
  - `samesite="lax"` - CSRF protection
  - `max_age` - 1 hour for access_token, 30 days for refresh_token

#### 2. Updated Login Endpoint
- Same cookie implementation as signup
- Tokens returned in response body AND set as cookies

#### 3. Updated Logout Endpoint
- Clears both cookies using `delete_cookie()`

#### 4. Updated Refresh Token Endpoint
- Reads refresh token from cookie first, then falls back to request body
- Sets new tokens as cookies

### Backend Security (`backend/app/shared/security.py`)

#### Updated `get_current_user` Function
- Now accepts tokens from cookies OR Authorization header
- Priority: cookie > Authorization header
- Backwards compatible with existing API clients

### Frontend Changes

#### 1. API Client (`frontend/src/lib/api/client.ts`)
- Removed localStorage token management
- Added `credentials: 'include'` to fetch requests
- Cleanup functions remove old localStorage tokens if present
- Token getter functions return null (cookies are inaccessible to JS)

#### 2. Auth Service (`frontend/src/lib/api/auth.ts`)
- Updated `refreshToken()` to rely on cookies
- Removed manual token passing in request body

#### 3. Auth Store (`frontend/src/stores/auth.ts`)
- Updated logout to only cleanup old localStorage tokens
- No longer stores tokens in state

### CORS Configuration (`backend/app/main.py`)
- Already configured with `allow_credentials=True` ✓
- Properly configured origins for cookie support

## Security Improvements

### Before
❌ Tokens stored in localStorage
❌ Vulnerable to XSS attacks
❌ Tokens accessible via JavaScript

### After
✅ Tokens in HTTP-only cookies
✅ Protected from XSS attacks
✅ Tokens NOT accessible via JavaScript
✅ CSRF protection with SameSite=lax
✅ Secure flag in production (HTTPS only)

## Testing

### Manual Testing Steps

1. **Clear existing storage:**
   ```javascript
   localStorage.clear()
   document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"));
   ```

2. **Login and verify cookies:**
   - Login via frontend
   - Open DevTools → Application → Cookies
   - Verify `access_token` and `refresh_token` exist
   - Verify HttpOnly flag is set

3. **Test authenticated requests:**
   - Navigate to protected pages
   - Verify requests succeed
   - Check Network tab - cookies sent automatically

4. **Test logout:**
   - Click logout
   - Verify cookies are cleared
   - Verify protected pages redirect to login

### API Testing (curl)

```bash
# Test login sets cookies
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt -v

# Test authenticated request with cookies
curl -X GET http://localhost:8000/auth/me \
  -b cookies.txt

# Test logout clears cookies
curl -X POST http://localhost:8000/auth/logout \
  -b cookies.txt -c cookies.txt -v
```

## Backwards Compatibility

The implementation maintains backwards compatibility:
- API clients using Authorization headers still work
- Old tokens in localStorage are cleaned up on next login/logout
- No breaking changes to API responses

## Production Considerations

1. **HTTPS Required:** The `secure` flag is enabled in production, requiring HTTPS
2. **Cookie Domain:** Ensure frontend and backend are on same domain or properly configured CORS
3. **SameSite Policy:** Set to "lax" for balance between security and usability

## Migration Checklist

- [x] Backend endpoints set HTTP-only cookies
- [x] Backend reads tokens from cookies
- [x] Frontend sends credentials with requests
- [x] Frontend stops storing tokens in localStorage
- [x] CORS configured for credentials
- [x] Backwards compatibility maintained
- [x] Old localStorage tokens cleaned up
- [ ] Manual testing in development
- [ ] Testing in production environment

## Next Steps

1. **Test in development:** Run both frontend and backend locally and test login/logout flow
2. **Monitor:** Check browser console for any cookie-related errors
3. **Deploy:** Deploy backend first, then frontend
4. **Verify:** Test in production after deployment

## Rollback Plan

If issues occur, the system maintains backwards compatibility. To rollback:

1. Revert frontend changes to use Authorization headers
2. Backend will continue working with header-based auth
3. Cookies can be ignored until issues are resolved
