"""
Security utilities for authentication and authorization.
"""
from datetime import datetime, timezone
from typing import Any

from fastapi import Cookie, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_supabase_client


security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    access_token: str | None = Cookie(default=None)
) -> dict[str, Any]:
    """
    Validate JWT token and return current user.
    Token can come from either Authorization header or cookie.
    
    Raises:
        HTTPException: If token is invalid or expired.
    """
    # Try to get token from cookie first, then from Authorization header
    token = access_token
    if not token and credentials:
        token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        client = get_supabase_client()
        response = client.auth.get_user(token)
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return {
            "id": response.user.id,
            "email": response.user.email,
            "user_metadata": response.user.user_metadata,
            "created_at": response.user.created_at,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


async def get_current_user_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    access_token: str | None = Cookie(default=None)
) -> dict[str, Any] | None:
    """Get current user if token provided, otherwise return None."""
    if not access_token and not credentials:
        return None
    
    try:
        return await get_current_user(request, credentials, access_token)
    except HTTPException:
        return None


async def require_admin(
    current_user: dict[str, Any] = Depends(get_current_user)
) -> dict[str, Any]:
    """
    Require that the current user has admin role.
    
    Raises:
        HTTPException: If user is not an admin.
    """
    from app.database import get_supabase_admin_client
    
    # Fetch role from user_profiles table
    client = get_supabase_admin_client()
    response = (
        client.table("user_profiles")
        .select("role")
        .eq("id", current_user.get("id"))
        .execute()
    )
    
    role = "customer"
    if response.data and len(response.data) > 0:
        role = response.data[0].get("role", "customer")
    
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    current_user["role"] = role
    return current_user
