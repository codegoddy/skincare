"""
Orders service - business logic layer.
"""
from typing import Any

from app.shared.exceptions import NotFoundError
from app.services.orders.schemas import (
    OrderCreate,
    OrderResponse,
    OrderListResponse,
    OrderItemResponse,
)
from app.services.orders.repository import OrdersRepository


class OrdersService:
    """Orders business logic."""

    @staticmethod
    async def list_orders(user_id: str) -> OrderListResponse:
        """
        Get all orders for a user.
        
        Args:
            user_id: User ID
            
        Returns:
            List of orders with items
        """
        orders_data = await OrdersRepository.get_orders_by_user(user_id)
        
        orders = [
            OrderResponse(
                id=order["id"],
                user_id=order["user_id"],
                status=order["status"],
                subtotal=float(order["subtotal"]),
                shipping=float(order["shipping"]),
                tax=float(order["tax"]),
                total=float(order["total"]),
                shipping_address=order.get("shipping_address"),
                items=[
                    OrderItemResponse(
                        id=item["id"],
                        product_id=item["product_id"],
                        name=item["name"],
                        type=item.get("type"),
                        price=float(item["price"]),
                        quantity=item["quantity"],
                        image=item.get("image"),
                    )
                    for item in order.get("items", [])
                ],
                created_at=order.get("created_at"),
                updated_at=order.get("updated_at"),
            )
            for order in orders_data
        ]
        
        return OrderListResponse(orders=orders, total=len(orders))

    @staticmethod
    async def get_order(order_id: str, user_id: str) -> OrderResponse:
        """
        Get a single order.
        
        Args:
            order_id: Order ID
            user_id: User ID
            
        Returns:
            Order with items
            
        Raises:
            NotFoundError: If order not found
        """
        order = await OrdersRepository.get_order_by_id(order_id, user_id)
        
        if not order:
            raise NotFoundError("Order")
        
        return OrderResponse(
            id=order["id"],
            user_id=order["user_id"],
            status=order["status"],
            subtotal=float(order["subtotal"]),
            shipping=float(order["shipping"]),
            tax=float(order["tax"]),
            total=float(order["total"]),
            shipping_address=order.get("shipping_address"),
            items=[
                OrderItemResponse(
                    id=item["id"],
                    product_id=item["product_id"],
                    name=item["name"],
                    type=item.get("type"),
                    price=float(item["price"]),
                    quantity=item["quantity"],
                    image=item.get("image"),
                )
                for item in order.get("items", [])
            ],
            created_at=order.get("created_at"),
            updated_at=order.get("updated_at"),
        )

    @staticmethod
    async def create_order(user_id: str, data: OrderCreate) -> OrderResponse:
        """
        Create a new order.
        
        Args:
            user_id: User ID
            data: Order creation data
            
        Returns:
            Created order
        """
        order_data = {
            "items": [item.model_dump() for item in data.items],
            "shipping_address": data.shipping_address,
        }
        
        order = await OrdersRepository.create_order(user_id, order_data)
        
        return OrderResponse(
            id=order["id"],
            user_id=order["user_id"],
            status=order["status"],
            subtotal=float(order["subtotal"]),
            shipping=float(order["shipping"]),
            tax=float(order["tax"]),
            total=float(order["total"]),
            shipping_address=order.get("shipping_address"),
            items=[
                OrderItemResponse(
                    id=item["id"],
                    product_id=item["product_id"],
                    name=item["name"],
                    type=item.get("type"),
                    price=float(item["price"]),
                    quantity=item["quantity"],
                    image=item.get("image"),
                )
                for item in order.get("items", [])
            ],
            created_at=order.get("created_at"),
            updated_at=order.get("updated_at"),
        )


class AdminOrdersService:
    """Admin orders business logic."""

    @staticmethod
    async def list_orders(
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
    ) -> "AdminOrderListResponse":
        """Get all orders with pagination."""
        import math
        from app.services.orders.schemas import AdminOrderResponse, AdminOrderListResponse
        from app.services.orders.repository import AdminOrdersRepository
        
        orders_data, total = await AdminOrdersRepository.get_all_orders(
            page=page,
            page_size=page_size,
            status=status,
        )
        
        orders = []
        for order in orders_data:
            # Format date
            created_at = order.get("created_at")
            
            orders.append(AdminOrderResponse(
                id=order["id"],
                user_id=order["user_id"],
                customer_name=order.get("customer_name"),
                status=order.get("status", "pending"),
                subtotal=float(order.get("subtotal", 0)),
                shipping=float(order.get("shipping", 0)),
                tax=float(order.get("tax", 0)),
                total=float(order.get("total", 0)),
                items_count=order.get("items_count", 0),
                shipping_address=order.get("shipping_address"),
                created_at=created_at,
                updated_at=order.get("updated_at"),
            ))
        
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        
        return AdminOrderListResponse(
            orders=orders,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_order(order_id: str) -> "AdminOrderDetailResponse":
        """Get a single order with full details."""
        from app.services.orders.schemas import AdminOrderDetailResponse, OrderItemResponse
        from app.services.orders.repository import AdminOrdersRepository
        
        order = await AdminOrdersRepository.get_order_by_id(order_id)
        
        if not order:
            raise NotFoundError("Order")
        
        return AdminOrderDetailResponse(
            id=order["id"],
            user_id=order["user_id"],
            customer_name=order.get("customer_name"),
            customer_email=order.get("customer_email"),
            customer_phone=order.get("customer_phone"),
            status=order.get("status", "pending"),
            subtotal=float(order.get("subtotal", 0)),
            shipping=float(order.get("shipping", 0)),
            tax=float(order.get("tax", 0)),
            total=float(order.get("total", 0)),
            items_count=len(order.get("items", [])),
            shipping_address=order.get("shipping_address"),
            items=[
                OrderItemResponse(
                    id=item["id"],
                    product_id=item["product_id"],
                    name=item["name"],
                    type=item.get("type"),
                    price=float(item["price"]),
                    quantity=item["quantity"],
                    image=item.get("image"),
                )
                for item in order.get("items", [])
            ],
            created_at=order.get("created_at"),
            updated_at=order.get("updated_at"),
        )

    @staticmethod
    async def update_order_status(order_id: str, status: str) -> "AdminOrderDetailResponse":
        """Update order status."""
        from app.services.orders.repository import AdminOrdersRepository
        
        # Check order exists
        order = await AdminOrdersRepository.get_order_by_id(order_id)
        if not order:
            raise NotFoundError("Order")
        
        # Update status
        await AdminOrdersRepository.update_order_status(order_id, status)
        
        # Return updated order
        return await AdminOrdersService.get_order(order_id)

