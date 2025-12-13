"""
Pydantic schemas for wishlist.
"""
from datetime import datetime

from pydantic import BaseModel


class WishlistItemBase(BaseModel):
    """Base wishlist item."""
    product_id: str
    name: str
    type: str | None = None
    price: float
    image: str | None = None
    in_stock: bool = True


class WishlistItemCreate(WishlistItemBase):
    """Wishlist item creation request."""
    pass


class WishlistItemResponse(WishlistItemBase):
    """Wishlist item response."""
    id: str
    created_at: datetime | None = None


class WishlistResponse(BaseModel):
    """Wishlist response."""
    items: list[WishlistItemResponse]
    total: int
