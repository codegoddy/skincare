"""
Pydantic schemas for authentication.
"""
from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.shared.password_validator import validate_password_strength


# Request schemas
class UserSignup(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(
        ..., 
        min_length=8, 
        description="Must be at least 8 characters with uppercase, lowercase, number, and special character"
    )
    full_name: str = Field(..., min_length=2, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        error = validate_password_strength(v)
        if error:
            raise ValueError(error)
        return v


class UserLogin(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    """Request password reset email."""
    email: EmailStr


class PasswordUpdate(BaseModel):
    """Update password with reset token."""
    access_token: str
    new_password: str = Field(
        ..., 
        min_length=8,
        description="Must be at least 8 characters with uppercase, lowercase, number, and special character"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        error = validate_password_strength(v)
        if error:
            raise ValueError(error)
        return v


class TokenRefresh(BaseModel):
    """Refresh token request."""
    refresh_token: str


class ProfileUpdate(BaseModel):
    """Profile update request."""
    full_name: str | None = Field(None, min_length=2, max_length=100)
    phone: str | None = Field(None, max_length=20)
    avatar_url: str | None = None


# Response schemas
class UserResponse(BaseModel):
    """User information response."""
    id: str
    email: str
    full_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    role: str = "customer"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @classmethod
    def from_supabase_user(cls, user: Any, profile: dict | None = None) -> "UserResponse":
        """Create from Supabase user object."""
        return cls(
            id=user.id,
            email=user.email or "",
            full_name=profile.get("full_name") if profile else (user.user_metadata.get("full_name") if user.user_metadata else None),
            phone=profile.get("phone") if profile else None,
            avatar_url=profile.get("avatar_url") if profile else None,
            role=profile.get("role", "customer") if profile else "customer",
            created_at=user.created_at,
            updated_at=profile.get("updated_at") if profile else None,
        )


class TokenResponse(BaseModel):
    """Authentication token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str
    success: bool = True

