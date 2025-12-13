"""
Pydantic schemas for settings.
"""
from datetime import datetime

from pydantic import BaseModel, Field


class NotificationSettings(BaseModel):
    """Notification preferences."""
    order_updates: bool = True
    promotions: bool = False
    newsletter: bool = True
    product_alerts: bool = False


class NotificationSettingsUpdate(BaseModel):
    """Notification preferences update."""
    order_updates: bool | None = None
    promotions: bool | None = None
    newsletter: bool | None = None
    product_alerts: bool | None = None


class SettingsResponse(BaseModel):
    """Settings response."""
    notifications: NotificationSettings
    updated_at: datetime | None = None


class PasswordChange(BaseModel):
    """Password change request."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)


class PasswordChangeResponse(BaseModel):
    """Password change response."""
    message: str
