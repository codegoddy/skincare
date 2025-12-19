"""
Orders API routes.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request, Query

from app.config import get_settings
from app.shared.security import get_current_user, require_admin
from app.shared.rate_limit import limiter
from app.services.orders.schemas import (
    OrderCreate,
    OrderResponse,
    OrderListResponse,
    AdminOrderListResponse,
    AdminOrderDetailResponse,
    OrderStatusUpdate,
)
from app.services.orders.service import OrdersService, AdminOrdersService


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


# Admin routes
admin_router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])


@admin_router.get(
    "",
    response_model=AdminOrderListResponse,
    summary="List all orders (admin)",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def admin_list_orders(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminOrderListResponse:
    """
    Get all orders with pagination and filters.
    
    Requires admin role.
    """
    return await AdminOrdersService.list_orders(page, page_size, status)


@admin_router.get(
    "/{order_id}",
    response_model=AdminOrderDetailResponse,
    summary="Get order details (admin)",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def admin_get_order(
    request: Request,
    order_id: str,
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminOrderDetailResponse:
    """
    Get a single order with full details.
    
    Requires admin role.
    """
    return await AdminOrdersService.get_order(order_id)


@admin_router.patch(
    "/{order_id}/status",
    response_model=AdminOrderDetailResponse,
    summary="Update order status",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def admin_update_order_status(
    request: Request,
    order_id: str,
    data: OrderStatusUpdate,
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminOrderDetailResponse:
    """
    Update order status.
    
    Requires admin role.
    """
    return await AdminOrdersService.update_order_status(order_id, data.status)

