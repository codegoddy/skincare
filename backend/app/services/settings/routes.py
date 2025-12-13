"""
Settings API routes.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request

from app.config import get_settings
from app.shared.security import get_current_user
from app.shared.rate_limit import limiter
from app.services.settings.schemas import (
    NotificationSettingsUpdate,
    SettingsResponse,
    PasswordChange,
    PasswordChangeResponse,
)
from app.services.settings.service import SettingsService


router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get(
    "",
    response_model=SettingsResponse,
    summary="Get user settings",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_user_settings(
    request: Request,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> SettingsResponse:
    """
    Get current user's settings.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await SettingsService.get_settings(user_id)


@router.patch(
    "",
    response_model=SettingsResponse,
    summary="Update notification settings",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_user_settings(
    request: Request,
    data: NotificationSettingsUpdate,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> SettingsResponse:
    """
    Update notification preferences.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await SettingsService.update_settings(user_id, data)


@router.post(
    "/password",
    response_model=PasswordChangeResponse,
    summary="Change password",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_auth}/minute")
async def change_password(
    request: Request,
    data: PasswordChange,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> PasswordChangeResponse:
    """
    Change the current user's password.
    
    Requires authentication.
    Rate limited for security.
    """
    user_id = current_user.get("id")
    email = current_user.get("email")
    return await SettingsService.change_password(user_id, email, data)
