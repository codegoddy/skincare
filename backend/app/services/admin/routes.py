"""
Admin API routes.
"""
from typing import Any

from fastapi import APIRouter, Depends, Request, Query

from app.config import get_settings
from app.shared.security import require_admin
from app.shared.rate_limit import limiter
from app.services.admin.schemas import (
    AdminUserResponse,
    AdminUserListResponse,
    UserRoleUpdate,
    UserStatusUpdate,
    DashboardResponse,
)
from app.services.admin.store_settings import (
    StoreSettingsResponse,
    StoreSettingsUpdate,
)
from app.services.admin.service import AdminService, StoreSettingsService, DashboardService


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="Get dashboard stats",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_dashboard(
    request: Request,
    current_user: dict[str, Any] = Depends(require_admin)
) -> DashboardResponse:
    """
    Get dashboard statistics and recent orders.
    
    Requires admin role.
    """
    return await DashboardService.get_dashboard()


@router.get(
    "/users",
    response_model=AdminUserListResponse,
    summary="List all users",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def list_users(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminUserListResponse:
    """
    Get paginated list of all users.
    
    Requires admin role.
    """
    return await AdminService.list_users(page, page_size)


@router.get(
    "/users/{user_id}",
    response_model=AdminUserResponse,
    summary="Get user details",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_user(
    request: Request,
    user_id: str,
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminUserResponse:
    """
    Get a single user's details.
    
    Requires admin role.
    """
    return await AdminService.get_user(user_id)


@router.patch(
    "/users/{user_id}/role",
    response_model=AdminUserResponse,
    summary="Update user role",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_user_role(
    request: Request,
    user_id: str,
    data: UserRoleUpdate,
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminUserResponse:
    """
    Update a user's role.
    
    Requires admin role.
    """
    return await AdminService.update_user_role(user_id, data)


@router.patch(
    "/users/{user_id}/status",
    response_model=AdminUserResponse,
    summary="Update user status",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_user_status(
    request: Request,
    user_id: str,
    data: UserStatusUpdate,
    current_user: dict[str, Any] = Depends(require_admin)
) -> AdminUserResponse:
    """
    Update a user's status (active/inactive).
    
    Requires admin role.
    """
    return await AdminService.update_user_status(user_id, data)


# Store Settings Routes
@router.get(
    "/settings",
    response_model=StoreSettingsResponse,
    summary="Get store settings",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_store_settings(
    request: Request,
    current_user: dict[str, Any] = Depends(require_admin)
) -> StoreSettingsResponse:
    """
    Get store configuration settings.
    
    Requires admin role.
    """
    return await StoreSettingsService.get_settings()


@router.patch(
    "/settings",
    response_model=StoreSettingsResponse,
    summary="Update store settings",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_store_settings(
    request: Request,
    data: StoreSettingsUpdate,
    current_user: dict[str, Any] = Depends(require_admin)
) -> StoreSettingsResponse:
    """
    Update store configuration settings.
    
    Requires admin role.
    """
    return await StoreSettingsService.update_settings(data)
