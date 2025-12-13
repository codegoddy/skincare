"""
Authentication service - business logic layer.
"""
from typing import Any

from app.config import get_settings
from app.database import get_supabase_client
from app.shared.exceptions import AuthenticationError, ConflictError, ValidationError
from app.services.auth.schemas import (
    UserSignup,
    UserLogin,
    UserResponse,
    TokenResponse,
    PasswordResetRequest,
    PasswordUpdate,
    TokenRefresh,
    ProfileUpdate,
)
from app.services.auth.repository import UserRepository


class AuthService:
    """Authentication business logic."""

    @staticmethod
    async def signup(data: UserSignup) -> TokenResponse:
        """
        Register a new user.
        
        Args:
            data: User signup data
            
        Returns:
            Token response with access and refresh tokens
            
        Raises:
            ConflictError: If email already exists
            ValidationError: If signup fails
        """
        client = get_supabase_client()
        
        try:
            response = client.auth.sign_up({
                "email": data.email,
                "password": data.password,
                "options": {
                    "data": {
                        "full_name": data.full_name,
                    }
                }
            })
            
            # Check if email confirmation is required
            if response.user and not response.session:
                # User created but needs email confirmation
                # We still need to return something - create a minimal response
                # The frontend will need to handle this case
                raise ValidationError("Please check your email to confirm your account")
            
            if not response.user or not response.session:
                raise ValidationError("Signup failed. Please try again.")
            
            # Fetch or create profile
            profile = await UserRepository.get_profile_by_id(response.user.id)
            
            user_response = UserResponse.from_supabase_user(response.user, profile)
            
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                expires_in=response.session.expires_in or 3600,
                user=user_response,
            )
            
        except ValidationError:
            raise
        except Exception as e:
            error_msg = str(e).lower()
            if "already registered" in error_msg or "already exists" in error_msg:
                raise ConflictError("Email already registered")
            raise ValidationError(str(e))

    @staticmethod
    async def login(data: UserLogin) -> TokenResponse:
        """
        Authenticate user and return tokens.
        
        Args:
            data: User login credentials
            
        Returns:
            Token response with access and refresh tokens
            
        Raises:
            AuthenticationError: If credentials are invalid
        """
        client = get_supabase_client()
        
        try:
            response = client.auth.sign_in_with_password({
                "email": data.email,
                "password": data.password,
            })
            
            if not response.user or not response.session:
                raise AuthenticationError("Invalid email or password")
            
            # Fetch profile for role
            profile = await UserRepository.get_profile_by_id(response.user.id)
            
            user_response = UserResponse.from_supabase_user(response.user, profile)
            
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                expires_in=response.session.expires_in or 3600,
                user=user_response,
            )
            
        except Exception:
            raise AuthenticationError("Invalid email or password")

    @staticmethod
    async def logout(access_token: str) -> None:
        """
        Invalidate user session.
        
        Args:
            access_token: Current access token
        """
        client = get_supabase_client()
        try:
            client.auth.sign_out()
        except Exception:
            pass  # Ignore logout errors

    @staticmethod
    async def refresh_token(data: TokenRefresh) -> TokenResponse:
        """
        Refresh access token using refresh token.
        
        Args:
            data: Refresh token data
            
        Returns:
            New token response
            
        Raises:
            AuthenticationError: If refresh token is invalid
        """
        client = get_supabase_client()
        
        try:
            response = client.auth.refresh_session(data.refresh_token)
            
            if not response.user or not response.session:
                raise AuthenticationError("Invalid refresh token")
            
            profile = await UserRepository.get_profile_by_id(response.user.id)
            user_response = UserResponse.from_supabase_user(response.user, profile)
            
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                expires_in=response.session.expires_in or 3600,
                user=user_response,
            )
            
        except Exception:
            raise AuthenticationError("Invalid or expired refresh token")

    @staticmethod
    async def get_current_user(user_data: dict[str, Any]) -> UserResponse:
        """
        Get current user details.
        
        Args:
            user_data: User data from JWT validation
            
        Returns:
            User response with profile data
        """
        profile = await UserRepository.get_profile_by_id(user_data["id"])
        
        # Auto-create profile if it doesn't exist
        if not profile:
            full_name = user_data.get("user_metadata", {}).get("full_name")
            profile = await UserRepository.create_profile(user_data["id"], full_name)
        
        return UserResponse(
            id=user_data["id"],
            email=user_data["email"],
            full_name=profile.get("full_name") if profile else user_data.get("user_metadata", {}).get("full_name"),
            phone=profile.get("phone") if profile else None,
            avatar_url=profile.get("avatar_url") if profile else None,
            role=profile.get("role", "customer") if profile else "customer",
            created_at=user_data.get("created_at"),
            updated_at=profile.get("updated_at") if profile else None,
        )

    @staticmethod
    async def request_password_reset(data: PasswordResetRequest) -> None:
        """
        Send password reset email.
        
        Args:
            data: Email for password reset
        """
        client = get_supabase_client()
        settings = get_settings()
        
        try:
            client.auth.reset_password_for_email(
                data.email,
                options={
                    "redirect_to": f"{settings.frontend_url}/reset-password",
                }
            )
        except Exception:
            pass  # Don't reveal if email exists

    @staticmethod
    async def reset_password(data: PasswordUpdate) -> None:
        """
        Update password using reset token.
        
        Args:
            data: New password and access token
            
        Raises:
            AuthenticationError: If token is invalid
        """
        client = get_supabase_client()
        
        try:
            # Set session with the access token from email link
            client.auth.set_session(data.access_token, "")
            client.auth.update_user({"password": data.new_password})
        except Exception:
            raise AuthenticationError("Invalid or expired reset token")

    @staticmethod
    async def update_profile(current_user: dict[str, Any], data: ProfileUpdate) -> UserResponse:
        """
        Update user profile.
        
        Args:
            current_user: Current authenticated user data
            data: Profile update data
            
        Returns:
            Updated user profile
        """
        user_id = current_user.get("id")
        
        # Build update dict with only provided fields
        update_data = {}
        if data.full_name is not None:
            update_data["full_name"] = data.full_name
        if data.phone is not None:
            update_data["phone"] = data.phone
        if data.avatar_url is not None:
            update_data["avatar_url"] = data.avatar_url
        
        if update_data:
            await UserRepository.update_profile(user_id, update_data)
        
        # Return updated profile
        profile = await UserRepository.get_profile_by_id(user_id)
        
        return UserResponse(
            id=user_id,
            email=current_user.get("email", ""),
            full_name=profile.get("full_name") if profile else None,
            phone=profile.get("phone") if profile else None,
            avatar_url=profile.get("avatar_url") if profile else None,
            role=profile.get("role", "customer") if profile else "customer",
            created_at=profile.get("created_at") if profile else None,
            updated_at=profile.get("updated_at") if profile else None,
        )
