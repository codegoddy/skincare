"""
Repository layer for products database operations.
"""
import math
from typing import Any, Optional

from app.database import get_supabase_admin_client


class ProductRepository:
    """Data access layer for products."""

    @staticmethod
    async def get_all(
        page: int = 1,
        page_size: int = 20,
        product_type: Optional[str] = None,
        skin_concern: Optional[str] = None,
        skin_type: Optional[str] = None,
        usage_time: Optional[str] = None,
        search: Optional[str] = None,
        active_only: bool = True,
    ) -> tuple[list[dict[str, Any]], int]:
        """Get all products with filters."""
        client = get_supabase_admin_client()
        
        # Build query
        query = client.table("products").select("*", count="exact")
        
        # Apply filters
        if active_only:
            query = query.eq("is_active", True)
        
        if product_type:
            query = query.eq("product_type", product_type)
        
        if usage_time:
            query = query.eq("usage_time", usage_time)
        
        if skin_concern:
            query = query.contains("skin_concerns", [skin_concern])
        
        if skin_type:
            query = query.contains("skin_types", [skin_type])
        
        if search:
            query = query.ilike("name", f"%{search}%")
        
        # Pagination
        offset = (page - 1) * page_size
        query = query.order("created_at", desc=True).range(offset, offset + page_size - 1)
        
        response = query.execute()
        
        return response.data or [], response.count or 0

    @staticmethod
    async def get_by_id(product_id: str) -> dict[str, Any] | None:
        """Get a single product by ID."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("products")
            .select("*")
            .eq("id", product_id)
            .execute()
        )
        
        return response.data[0] if response.data else None

    @staticmethod
    async def create(data: dict[str, Any]) -> dict[str, Any]:
        """Create a new product."""
        client = get_supabase_admin_client()
        
        response = client.table("products").insert(data).execute()
        
        return response.data[0] if response.data else {}

    @staticmethod
    async def update(product_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update a product."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("products")
            .update(data)
            .eq("id", product_id)
            .execute()
        )
        
        return response.data[0] if response.data else None

    @staticmethod
    async def delete(product_id: str) -> bool:
        """Delete a product."""
        client = get_supabase_admin_client()
        
        response = (
            client.table("products")
            .delete()
            .eq("id", product_id)
            .execute()
        )
        
        return len(response.data) > 0 if response.data else False
