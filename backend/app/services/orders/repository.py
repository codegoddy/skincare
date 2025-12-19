"""
Repository layer for orders database operations.
"""
from typing import Any

from app.database import get_supabase_client


class OrdersRepository:
    """Data access layer for orders."""

    @staticmethod
    async def get_orders_by_user(user_id: str) -> list[dict[str, Any]]:
        """Get all orders for a user with their items."""
        client = get_supabase_client()
        
        # Get orders
        response = (
            client.table("orders")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        orders = response.data or []
        
        # Get items for each order
        for order in orders:
            items_response = (
                client.table("order_items")
                .select("*")
                .eq("order_id", order["id"])
                .execute()
            )
            order["items"] = items_response.data or []
        
        return orders

    @staticmethod
    async def get_order_by_id(order_id: str, user_id: str) -> dict[str, Any] | None:
        """Get a single order with items."""
        client = get_supabase_client()
        
        response = (
            client.table("orders")
            .select("*")
            .eq("id", order_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        
        if not response.data:
            return None
        
        order = response.data
        
        # Get items
        items_response = (
            client.table("order_items")
            .select("*")
            .eq("order_id", order_id)
            .execute()
        )
        order["items"] = items_response.data or []
        
        return order

    @staticmethod
    async def create_order(user_id: str, order_data: dict[str, Any]) -> dict[str, Any]:
        """Create a new order with items."""
        client = get_supabase_client()
        
        items = order_data.pop("items", [])
        
        # Calculate totals
        subtotal = sum(item["price"] * item["quantity"] for item in items)
        shipping = 0  # Could be calculated based on address
        tax = subtotal * 0.08  # 8% tax example
        total = subtotal + shipping + tax
        
        # Create order
        order_response = (
            client.table("orders")
            .insert({
                "user_id": user_id,
                "subtotal": subtotal,
                "shipping": shipping,
                "tax": tax,
                "total": total,
                "shipping_address": order_data.get("shipping_address"),
                "status": "pending",
            })
            .execute()
        )
        
        order = order_response.data[0]
        
        # Create order items
        if items:
            items_data = [
                {
                    "order_id": order["id"],
                    "product_id": item["product_id"],
                    "name": item["name"],
                    "type": item.get("type"),
                    "price": item["price"],
                    "quantity": item["quantity"],
                    "image": item.get("image"),
                }
                for item in items
            ]
            items_response = client.table("order_items").insert(items_data).execute()
            order["items"] = items_response.data
        else:
            order["items"] = []
        
        return order


class AdminOrdersRepository:
    """Data access layer for admin order operations."""

    @staticmethod
    async def get_all_orders(
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
        search: str | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        """Get all orders with pagination and filters."""
        from app.database import get_supabase_admin_client
        
        client = get_supabase_admin_client()
        
        # Build query
        query = client.table("orders").select("*", count="exact")
        
        if status:
            query = query.eq("status", status)
        
        # Get total count
        count_query = client.table("orders").select("id", count="exact")
        if status:
            count_query = count_query.eq("status", status)
        count_response = count_query.execute()
        total = count_response.count or 0
        
        # Get paginated orders
        offset = (page - 1) * page_size
        orders_response = (
            query
            .order("created_at", desc=True)
            .range(offset, offset + page_size - 1)
            .execute()
        )
        
        orders = orders_response.data or []
        
        # Enrich with customer info and items count
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
            
            # Get items count
            items_response = (
                client.table("order_items")
                .select("id", count="exact")
                .eq("order_id", order["id"])
                .execute()
            )
            order["items_count"] = items_response.count or 0
        
        return orders, total

    @staticmethod
    async def get_order_by_id(order_id: str) -> dict[str, Any] | None:
        """Get a single order with items (admin - no user check)."""
        from app.database import get_supabase_admin_client
        
        client = get_supabase_admin_client()
        
        response = (
            client.table("orders")
            .select("*")
            .eq("id", order_id)
            .single()
            .execute()
        )
        
        if not response.data:
            return None
        
        order = response.data
        
        # Get customer info
        try:
            profile_response = (
                client.table("user_profiles")
                .select("full_name, phone")
                .eq("id", order["user_id"])
                .single()
                .execute()
            )
            if profile_response.data:
                order["customer_name"] = profile_response.data.get("full_name")
                order["customer_phone"] = profile_response.data.get("phone")
            
            # Get email
            auth_user = client.auth.admin.get_user_by_id(order["user_id"])
            order["customer_email"] = auth_user.user.email if auth_user.user else None
        except Exception:
            order["customer_name"] = "Unknown"
            order["customer_email"] = None
            order["customer_phone"] = None
        
        # Get items
        items_response = (
            client.table("order_items")
            .select("*")
            .eq("order_id", order_id)
            .execute()
        )
        order["items"] = items_response.data or []
        
        return order

    @staticmethod
    async def update_order_status(order_id: str, status: str) -> dict[str, Any] | None:
        """Update order status."""
        from app.database import get_supabase_admin_client
        
        client = get_supabase_admin_client()
        
        response = (
            client.table("orders")
            .update({"status": status})
            .eq("id", order_id)
            .execute()
        )
        
        return response.data[0] if response.data else None

