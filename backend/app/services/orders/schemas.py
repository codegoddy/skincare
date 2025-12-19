"""
Pydantic schemas for orders.
"""
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class OrderItemBase(BaseModel):
    """Base order item."""
    product_id: str
    name: str
    type: str | None = None
    price: float
    quantity: int = 1
    image: str | None = None


class OrderItemCreate(OrderItemBase):
    """Order item creation request."""
    pass


class OrderItemResponse(OrderItemBase):
    """Order item response."""
    id: str


class OrderBase(BaseModel):
    """Base order."""
    status: str = "pending"
    subtotal: float = 0
    shipping: float = 0
    tax: float = 0
    total: float = 0
    shipping_address: dict[str, Any] | None = None


class OrderCreate(BaseModel):
    """Order creation request."""
    items: list[OrderItemCreate]
    shipping_address: dict[str, Any] | None = None


class OrderResponse(OrderBase):
    """Order response."""
    id: str
    user_id: str
    items: list[OrderItemResponse] = []
    created_at: datetime | None = None
    updated_at: datetime | None = None


class OrderListResponse(BaseModel):
    """List of orders response."""
    orders: list[OrderResponse]
    total: int


# Admin schemas
class AdminOrderResponse(BaseModel):
    """Order response for admin with customer info."""
    id: str
    user_id: str
    customer_name: str | None = None
    customer_email: str | None = None
    status: str = "pending"
    subtotal: float = 0
    shipping: float = 0
    tax: float = 0
    total: float = 0
    items_count: int = 0
    payment_method: str | None = None
    shipping_address: dict[str, Any] | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AdminOrderDetailResponse(AdminOrderResponse):
    """Detailed order response for admin."""
    items: list[OrderItemResponse] = []
    customer_phone: str | None = None


class AdminOrderListResponse(BaseModel):
    """Paginated list of orders for admin."""
    orders: list[AdminOrderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class OrderStatusUpdate(BaseModel):
    """Update order status."""
    status: str = Field(..., pattern="^(pending|processing|completed|cancelled)$")

