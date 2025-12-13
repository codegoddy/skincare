"""
Wishlist service - business logic layer.
"""
from app.shared.exceptions import ConflictError, NotFoundError
from app.services.wishlist.schemas import (
    WishlistItemCreate,
    WishlistItemResponse,
    WishlistResponse,
)
from app.services.wishlist.repository import WishlistRepository


class WishlistService:
    """Wishlist business logic."""

    @staticmethod
    async def list_items(user_id: str) -> WishlistResponse:
        """Get all wishlist items for a user."""
        items_data = await WishlistRepository.get_wishlist(user_id)
        
        items = [
            WishlistItemResponse(
                id=item["id"],
                product_id=item["product_id"],
                name=item["name"],
                type=item.get("type"),
                price=float(item["price"]),
                image=item.get("image"),
                in_stock=item.get("in_stock", True),
                created_at=item.get("created_at"),
            )
            for item in items_data
        ]
        
        return WishlistResponse(items=items, total=len(items))

    @staticmethod
    async def add_item(user_id: str, data: WishlistItemCreate) -> WishlistItemResponse:
        """Add an item to the wishlist."""
        # Check if already exists
        exists = await WishlistRepository.item_exists(user_id, data.product_id)
        if exists:
            raise ConflictError("Item already in wishlist")
        
        item = await WishlistRepository.add_item(user_id, data.model_dump())
        
        return WishlistItemResponse(
            id=item["id"],
            product_id=item["product_id"],
            name=item["name"],
            type=item.get("type"),
            price=float(item["price"]),
            image=item.get("image"),
            in_stock=item.get("in_stock", True),
            created_at=item.get("created_at"),
        )

    @staticmethod
    async def remove_item(user_id: str, product_id: str) -> dict:
        """Remove an item from the wishlist."""
        removed = await WishlistRepository.remove_item(user_id, product_id)
        
        if not removed:
            raise NotFoundError("Wishlist item")
        
        return {"message": "Item removed from wishlist"}
