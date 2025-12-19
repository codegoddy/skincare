"""
Security utilities for authentication and authorization.
"""
from datetime import datetime, timezone
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_supabase_client


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict[str, Any]:
    """
    Validate JWT token and return current user.
    
    Raises:
        HTTPException: If token is invalid or expired.
    """
    token = credentials.credentials
    
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
    credentials: HTTPAuthorizationCredentials | None = Depends(HTTPBearer(auto_error=False))
) -> dict[str, Any] | None:
    """Get current user if token provided, otherwise return None."""
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
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
