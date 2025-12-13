"""
Orders API routes.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request

from app.config import get_settings
from app.shared.security import get_current_user
from app.shared.rate_limit import limiter
from app.services.orders.schemas import (
    OrderCreate,
    OrderResponse,
    OrderListResponse,
)
from app.services.orders.service import OrdersService


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get(
    "",
    response_model=OrderListResponse,
    summary="List user orders",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def list_orders(
    request: Request,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> OrderListResponse:
    """
    Get all orders for the current user.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await OrdersService.list_orders(user_id)


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    summary="Get order details",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_order(
    request: Request,
    order_id: str,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> OrderResponse:
    """
    Get a single order with its items.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await OrdersService.get_order(order_id, user_id)


@router.post(
    "",
    response_model=OrderResponse,
    summary="Create order",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def create_order(
    request: Request,
    data: OrderCreate,
    current_user: dict[str, Any] = Depends(get_current_user)
) -> OrderResponse:
    """
    Create a new order.
    
    Requires authentication.
    """
    user_id = current_user.get("id")
    return await OrdersService.create_order(user_id, data)
