"""
Repository layer for settings database operations.
"""
from typing import Any

from app.database import get_supabase_client, get_supabase_admin_client


class SettingsRepository:
    """Data access layer for user settings."""

    @staticmethod
    async def get_settings(user_id: str) -> dict[str, Any] | None:
        """Get user settings."""
        client = get_supabase_client()
        
        response = (
            client.table("user_settings")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None

    @staticmethod
    async def create_settings(user_id: str) -> dict[str, Any]:
        """Create default settings for a user."""
        # Use admin client to bypass RLS for server-side creation
        client = get_supabase_admin_client()
        
        response = (
            client.table("user_settings")
            .insert({
                "user_id": user_id,
                "notification_order_updates": True,
                "notification_promotions": False,
                "notification_newsletter": True,
                "notification_product_alerts": False,
            })
            .execute()
        )
        
        return response.data[0]

    @staticmethod
    async def update_settings(user_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update user settings."""
        client = get_supabase_client()
        
        # Map the field names
        update_data = {}
        if "order_updates" in data:
            update_data["notification_order_updates"] = data["order_updates"]
        if "promotions" in data:
            update_data["notification_promotions"] = data["promotions"]
        if "newsletter" in data:
            update_data["notification_newsletter"] = data["newsletter"]
        if "product_alerts" in data:
            update_data["notification_product_alerts"] = data["product_alerts"]
        
        if not update_data:
            # Nothing to update, return current settings
            return await SettingsRepository.get_settings(user_id)
        
        response = (
            client.table("user_settings")
            .update(update_data)
            .eq("user_id", user_id)
            .execute()
        )
        
        return response.data[0] if response.data else None
