"""
Maintenance mode middleware and utilities.
"""
from typing import Callable, Any

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse

from app.database import get_supabase_admin_client


async def is_maintenance_mode() -> bool:
    """Check if maintenance mode is enabled."""
    try:
        client = get_supabase_admin_client()
        response = client.table("store_settings").select("maintenance_mode").limit(1).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0].get("maintenance_mode", False)
        return False
    except Exception:
        # If unable to check, allow access
        return False


async def check_maintenance_mode(request: Request, call_next: Callable) -> Any:
    """
    Middleware to check maintenance mode.
    
    Allows:
    - Admin users (authenticated with admin role)
    - Health check endpoint
    - Auth endpoints (login, logout)
    - Admin endpoints
    - WebSocket connections
    
    Blocks all other requests if maintenance mode is enabled.
    """
    path = request.url.path
    
    # Always allow these paths
    allowed_paths = [
        "/health",
        "/auth/login",
        "/auth/logout", 
        "/auth/refresh",
        "/auth/me",
        "/admin",
        "/store/config",  # Allow checking store config
        "/ws",  # WebSocket
        "/docs",
        "/openapi.json",
        "/redoc",
    ]
    
    # Check if path is allowed
    if any(path.startswith(allowed_path) for allowed_path in allowed_paths):
        return await call_next(request)
    
    # Check if maintenance mode is enabled
    if await is_maintenance_mode():
        # Check if user is admin
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            try:
                from app.shared.security import get_current_user
                from app.database import get_supabase_admin_client
                from fastapi.security import HTTPAuthorizationCredentials
                
                # Validate token
                creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
                user = await get_current_user(creds)
                
                # Check if user is admin
                client = get_supabase_admin_client()
                profile_response = (
                    client.table("user_profiles")
                    .select("role")
                    .eq("id", user.get("id"))
                    .execute()
                )
                
                if profile_response.data and len(profile_response.data) > 0:
                    role = profile_response.data[0].get("role", "customer")
                    if role == "admin":
                        # Admin user, allow access
                        return await call_next(request)
            except Exception:
                pass  # Not authenticated or not admin
        
        # Return maintenance response
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "detail": "The site is currently under maintenance. Please check back later.",
                "maintenance": True,
            }
        )
    
    # Not in maintenance mode, continue
    return await call_next(request)
