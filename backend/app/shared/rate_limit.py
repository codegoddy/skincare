"""
Rate limiting configuration using SlowAPI.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import get_settings


def get_limiter() -> Limiter:
    """Create and return the rate limiter instance."""
    return Limiter(key_func=get_remote_address)


# Global limiter instance
limiter = get_limiter()


def rate_limit_key_func(request):
    """
    Custom key function that considers both IP and user ID.
    Falls back to IP address for unauthenticated requests.
    """
    # Try to get user from request state (set by auth middleware)
    user = getattr(request.state, "user", None)
    if user and isinstance(user, dict) and "id" in user:
        return f"user:{user['id']}"
    return get_remote_address(request)
