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
