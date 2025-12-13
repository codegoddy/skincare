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
