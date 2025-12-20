"""
Authentication API routes with rate limiting.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request, Response, status

from app.config import get_settings
from app.shared.security import get_current_user
from app.shared.rate_limit import limiter
from app.services.auth.schemas import (
    UserSignup,
    UserLogin,
    UserResponse,
    TokenResponse,
    MessageResponse,
    PasswordResetRequest,
    PasswordUpdate,
    TokenRefresh,
    ProfileUpdate,
)
from app.services.auth.service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_auth}/minute")
async def signup(request: Request, data: UserSignup, response: Response) -> TokenResponse:
    """
    Register a new user account.
    
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    - **full_name**: User's full name
    """
    result = await AuthService.signup(data)
    
    # Set tokens as HTTP-only cookies
    settings = get_settings()
    is_production = not settings.debug
    
    response.set_cookie(
        key="access_token",
        value=result.access_token,
        httponly=True,
        secure=is_production,  # HTTPS only in production
        samesite="lax",
        max_age=result.expires_in,
    )
    
    response.set_cookie(
        key="refresh_token",
        value=result.refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,  # 30 days
    )
    
    return result


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login user",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_auth}/minute")
async def login(request: Request, data: UserLogin, response: Response) -> TokenResponse:
    """
    Authenticate user and return access tokens.
    
    - **email**: Registered email address
    - **password**: Account password
    """
    result = await AuthService.login(data)
    
    # Set tokens as HTTP-only cookies
    settings = get_settings()
    is_production = not settings.debug
    
    response.set_cookie(
        key="access_token",
        value=result.access_token,
        httponly=True,
        secure=is_production,  # HTTPS only in production
        samesite="lax",
        max_age=result.expires_in,
    )
    
    response.set_cookie(
        key="refresh_token",
        value=result.refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,  # 30 days
    )
    
    return result


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout user",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def logout(
    request: Request,
    response: Response,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> MessageResponse:
    """
    Logout current user and invalidate session.
    
    Requires authentication.
    """
    await AuthService.logout("")
    
    # Clear cookies
    response.delete_cookie(key="access_token", samesite="lax")
    response.delete_cookie(key="refresh_token", samesite="lax")
    
    return MessageResponse(message="Successfully logged out")


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_auth}/minute")
async def refresh_token(request: Request, response: Response, data: TokenRefresh = None) -> TokenResponse:
    """
    Get new access token using refresh token.
    
    Token can be provided either in request body or from cookies.
    """
    # Try to get refresh token from cookie first, then from body
    refresh_token_value = request.cookies.get("refresh_token")
    if not refresh_token_value and data:
        refresh_token_value = data.refresh_token
    
    if not refresh_token_value:
        from app.shared.exceptions import AuthenticationError
        raise AuthenticationError("No refresh token provided")
    
    # Create TokenRefresh object
    token_data = TokenRefresh(refresh_token=refresh_token_value)
    result = await AuthService.refresh_token(token_data)
    
    # Set new tokens as HTTP-only cookies
    settings = get_settings()
    is_production = not settings.debug
    
    response.set_cookie(
        key="access_token",
        value=result.access_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=result.expires_in,
    )
    
    response.set_cookie(
        key="refresh_token",
        value=result.refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,  # 30 days
    )
    
    return result


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_me(
    request: Request,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> UserResponse:
    """
    Get current authenticated user's profile.
    
    Requires authentication.
    """
    return await AuthService.get_current_user(current_user)


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request password reset",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_strict}/minute")
async def forgot_password(request: Request, data: PasswordResetRequest) -> MessageResponse:
    """
    Send password reset email.
    
    - **email**: Email address to send reset link
    """
    await AuthService.request_password_reset(data)
    return MessageResponse(
        message="If the email exists, a reset link has been sent"
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_strict}/minute")
async def reset_password(request: Request, data: PasswordUpdate) -> MessageResponse:
    """
    Reset password using token from email link.
    
    - **access_token**: Token from reset email link
    - **new_password**: New password (minimum 8 characters)
    """
    await AuthService.reset_password(data)
    return MessageResponse(message="Password updated successfully")


@router.patch(
    "/profile",
    response_model=UserResponse,
    summary="Update user profile",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_profile(
    request: Request,
    data: ProfileUpdate,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> UserResponse:
    """
    Update current user's profile information.
    
    - **full_name**: User's full name
    - **phone**: Phone number
    - **avatar_url**: URL to avatar image
    
    Requires authentication.
    """
    return await AuthService.update_profile(current_user, data)

