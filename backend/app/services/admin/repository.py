"""
Repository layer for admin database operations.
"""
from typing import Any

from app.database import get_supabase_admin_client


class AdminRepository:
    """Data access layer for admin operations."""

    @staticmethod
    async def get_all_users(page: int = 1, page_size: int = 20) -> tuple[list[dict[str, Any]], int]:
        """
        Get all users with their profiles.
        Returns (users, total_count).
        """
        client = get_supabase_admin_client()
        
        # Get total count
        count_response = client.table("user_profiles").select("id", count="exact").execute()
        total = count_response.count or 0
        
        # Get paginated users with profiles
        offset = (page - 1) * page_size
        response = (
            client.table("user_profiles")
            .select("*")
            .order("created_at", desc=True)
            .range(offset, offset + page_size - 1)
            .execute()
        )
        
        profiles = response.data or []
        
        # Get auth users to get emails
        users_with_emails = []
        for profile in profiles:
            try:
                auth_user = client.auth.admin.get_user_by_id(profile["id"])
                users_with_emails.append({
                    **profile,
                    "email": auth_user.user.email if auth_user.user else None,
                    "auth_created_at": auth_user.user.created_at if auth_user.user else None,
                })
            except Exception:
                # If user not found in auth, skip
                users_with_emails.append({
                    **profile,
                    "email": None,
                    "auth_created_at": None,
                })
        
        return users_with_emails, total

    @staticmethod
    async def get_user_by_id(user_id: str) -> dict[str, Any] | None:
        """Get a single user with profile."""
        client = get_supabase_admin_client()
        
        # Get profile
        profile_response = (
            client.table("user_profiles")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        
        if not profile_response.data or len(profile_response.data) == 0:
            return None
        
        profile = profile_response.data[0]
        
        # Get auth user for email
        try:
            auth_user = client.auth.admin.get_user_by_id(user_id)
            profile["email"] = auth_user.user.email if auth_user.user else None
            profile["auth_created_at"] = auth_user.user.created_at if auth_user.user else None
        except Exception:
            profile["email"] = None
            profile["auth_created_at"] = None
        
        return profile

    @staticmethod
    async def get_user_orders_count(user_id: str) -> int:
        """Get count of orders for a user."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("orders")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )
        
        return response.count or 0

    @staticmethod
    async def update_user_role(user_id: str, role: str) -> dict[str, Any] | None:
        """Update user role."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("user_profiles")
            .update({"role": role})
            .eq("id", user_id)
            .execute()
        )
        
        return response.data[0] if response.data else None

    @staticmethod
    async def update_user_status(user_id: str, status: str) -> dict[str, Any] | None:
        """Update user status."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("user_profiles")
            .update({"status": status})
            .eq("id", user_id)
            .execute()
        )
        
        return response.data[0] if response.data else None


class StoreSettingsRepository:
    """Data access layer for store settings."""

    @staticmethod
    async def get_settings() -> dict[str, Any] | None:
        """Get store settings (first row)."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("store_settings")
            .select("*")
            .limit(1)
            .execute()
        )
        
        return response.data[0] if response.data else None

    @staticmethod
    async def update_settings(data: dict[str, Any]) -> dict[str, Any] | None:
        """Update store settings."""
        client = get_supabase_admin_client()
        
        # Get current settings ID
        current = await StoreSettingsRepository.get_settings()
        if not current:
            # Create if not exists
            response = client.table("store_settings").insert(data).execute()
            return response.data[0] if response.data else None
        
        # Update
        response = (
            client.table("store_settings")
            .update(data)
            .eq("id", current["id"])
            .execute()
        )
        
        return response.data[0] if response.data else None


class DashboardRepository:
    """Data access layer for dashboard statistics."""

    @staticmethod
    async def get_total_revenue() -> float:
        """Get total revenue from completed orders."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("orders")
            .select("total")
            .eq("status", "completed")
            .execute()
        )
        
        orders = response.data or []
        return sum(order.get("total", 0) for order in orders)

    @staticmethod
    async def get_orders_count(status: str | None = None) -> int:
        """Get count of orders, optionally filtered by status."""
        client = get_supabase_admin_client()
        
        query = client.table("orders").select("id", count="exact")
        if status:
            query = query.eq("status", status)
        
        response = query.execute()
        return response.count or 0

    @staticmethod
    async def get_customers_count() -> int:
        """Get total count of customers (users with customer role)."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("user_profiles")
            .select("id", count="exact")
            .eq("role", "customer")
            .execute()
        )
        
        return response.count or 0

    @staticmethod
    async def get_products_count() -> int:
        """Get total count of active products."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("products")
            .select("id", count="exact")
            .eq("is_active", True)
            .execute()
        )
        
        return response.count or 0

    @staticmethod
    async def get_recent_orders(limit: int = 5) -> list[dict]:
        """Get most recent orders with customer info."""
        client = get_supabase_admin_client()
        
        # Get recent orders
        orders_response = (
            client.table("orders")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        
        orders = orders_response.data or []
        
        # Enrich with customer info and item count
        for order in orders:
            # Get customer name
            try:
                profile_response = (
                    client.table("user_profiles")
                    .select("full_name")
                    .eq("id", order["user_id"])
                    .single()
                    .execute()
                )
                order["customer_name"] = profile_response.data.get("full_name") if profile_response.data else "Unknown"
            except Exception:
                order["customer_name"] = "Unknown"
            
            # Get item count
            items_response = (
                client.table("order_items")
                .select("id", count="exact")
                .eq("order_id", order["id"])
                .execute()
            )
            order["items_count"] = items_response.count or 0
        
        return orders

