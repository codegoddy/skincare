"""
Repository layer for wishlist database operations.
"""
from typing import Any

from app.database import get_supabase_client


class WishlistRepository:
    """Data access layer for wishlist."""

    @staticmethod
    async def get_wishlist(user_id: str) -> list[dict[str, Any]]:
        """Get all wishlist items for a user."""
        client = get_supabase_client()
        
        response = (
            client.table("wishlist_items")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        return response.data or []

    @staticmethod
    async def add_item(user_id: str, item_data: dict[str, Any]) -> dict[str, Any]:
        """Add an item to the wishlist."""
        client = get_supabase_client()
        
        response = (
            client.table("wishlist_items")
            .insert({
                "user_id": user_id,
                "product_id": item_data["product_id"],
                "name": item_data["name"],
                "type": item_data.get("type"),
                "price": item_data["price"],
                "image": item_data.get("image"),
                "in_stock": item_data.get("in_stock", True),
            })
            .execute()
        )
        
        return response.data[0]

    @staticmethod
    async def remove_item(user_id: str, product_id: str) -> bool:
        """Remove an item from the wishlist."""
        client = get_supabase_client()
        
        response = (
            client.table("wishlist_items")
            .delete()
            .eq("user_id", user_id)
            .eq("product_id", product_id)
            .execute()
        )
        
        return len(response.data) > 0 if response.data else False

    @staticmethod
    async def item_exists(user_id: str, product_id: str) -> bool:
        """Check if an item exists in the wishlist."""
        client = get_supabase_client()
        
        response = (
            client.table("wishlist_items")
            .select("id")
            .eq("user_id", user_id)
            .eq("product_id", product_id)
            .execute()
        )
        
        return len(response.data) > 0 if response.data else False
