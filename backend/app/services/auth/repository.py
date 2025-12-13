"""
Repository layer for user profile database operations.
"""
from typing import Any

from app.database import get_supabase_client, get_supabase_admin_client
from app.services.auth.models import UserProfile


class UserRepository:
    """Data access layer for user profiles."""

    @staticmethod
    async def get_profile_by_id(user_id: str) -> dict[str, Any] | None:
        """Get user profile by ID."""
        # Use admin client to bypass RLS for server-side operations
        client = get_supabase_admin_client()
        response = client.table("user_profiles").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data and len(response.data) > 0 else None

    @staticmethod
    async def create_profile(user_id: str, full_name: str | None = None) -> dict[str, Any]:
        """Create or update a user profile."""
        client = get_supabase_admin_client()
        data = {
            "id": user_id,
            "full_name": full_name,
            "role": "customer",
        }
        # Use upsert to handle race conditions / existing profiles
        response = client.table("user_profiles").upsert(data, on_conflict="id").execute()
        return response.data[0] if response.data else {}

    @staticmethod
    async def update_profile(user_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update user profile."""
        client = get_supabase_client()
        # Remove None values and id
        update_data = {k: v for k, v in data.items() if v is not None and k != "id"}
        if not update_data:
            return await UserRepository.get_profile_by_id(user_id)
        
        response = (
            client.table("user_profiles")
            .update(update_data)
            .eq("id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    @staticmethod
    async def set_user_role(user_id: str, role: str) -> dict[str, Any] | None:
        """Set user role (admin operation)."""
        client = get_supabase_admin_client()
        response = (
            client.table("user_profiles")
            .update({"role": role})
            .eq("id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None
