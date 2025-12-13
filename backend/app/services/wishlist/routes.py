"""
Wishlist API routes.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request

from app.config import get_settings
from app.shared.security import get_current_user
from app.shared.rate_limit import limiter
from app.services.wishlist.schemas import (
    WishlistItemCreate,
    WishlistItemResponse,
    WishlistResponse,
)
from app.services.wishlist.service import WishlistService


router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get(
    "",
    response_model=WishlistResponse,
    summary="Get wishlist",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_wishlist(
    request: Request,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> WishlistResponse:
    """
    Get all items in the user's wishlist.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await WishlistService.list_items(user_id)


@router.post(
    "",
    response_model=WishlistItemResponse,
    summary="Add to wishlist",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def add_to_wishlist(
    request: Request,
    data: WishlistItemCreate,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> WishlistItemResponse:
    """
    Add an item to the wishlist.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await WishlistService.add_item(user_id, data)


@router.delete(
    "/{product_id}",
    summary="Remove from wishlist",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def remove_from_wishlist(
    request: Request,
    product_id: str,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> dict:
    """
    Remove an item from the wishlist.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await WishlistService.remove_item(user_id, product_id)
