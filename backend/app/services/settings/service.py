"""
Settings service - business logic layer.
"""
from app.database import get_supabase_client
from app.shared.exceptions import ValidationError
from app.services.settings.schemas import (
    NotificationSettings,
    NotificationSettingsUpdate,
    SettingsResponse,
    PasswordChange,
    PasswordChangeResponse,
)
from app.services.settings.repository import SettingsRepository


class SettingsService:
    """Settings business logic."""

    @staticmethod
    async def get_settings(user_id: str) -> SettingsResponse:
        """Get user settings, creating defaults if not exists."""
        settings = await SettingsRepository.get_settings(user_id)
        
        if not settings:
            settings = await SettingsRepository.create_settings(user_id)
        
        return SettingsResponse(
            notifications=NotificationSettings(
                order_updates=settings.get("notification_order_updates", True),
                promotions=settings.get("notification_promotions", False),
                newsletter=settings.get("notification_newsletter", True),
                product_alerts=settings.get("notification_product_alerts", False),
            ),
            updated_at=settings.get("updated_at"),
        )

    @staticmethod
    async def update_settings(user_id: str, data: NotificationSettingsUpdate) -> SettingsResponse:
        """Update notification settings."""
        # Ensure settings exist
        settings = await SettingsRepository.get_settings(user_id)
        if not settings:
            await SettingsRepository.create_settings(user_id)
        
        # Update with provided values
        update_data = data.model_dump(exclude_none=True)
        settings = await SettingsRepository.update_settings(user_id, update_data)
        
        return SettingsResponse(
            notifications=NotificationSettings(
                order_updates=settings.get("notification_order_updates", True),
                promotions=settings.get("notification_promotions", False),
                newsletter=settings.get("notification_newsletter", True),
                product_alerts=settings.get("notification_product_alerts", False),
            ),
            updated_at=settings.get("updated_at"),
        )

    @staticmethod
    async def change_password(user_id: str, email: str, data: PasswordChange) -> PasswordChangeResponse:
        """Change user password."""
        client = get_supabase_client()
        
        # Verify current password by attempting to sign in
        try:
            client.auth.sign_in_with_password({
                "email": email,
                "password": data.current_password,
            })
        except Exception:
            raise ValidationError("Current password is incorrect")
        
        # Update password using admin client
        try:
            client.auth.admin.update_user_by_id(
                user_id,
                {"password": data.new_password}
            )
        except Exception as e:
            raise ValidationError(f"Failed to update password: {str(e)}")
        
        return PasswordChangeResponse(message="Password changed successfully")
