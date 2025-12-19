"""
Pydantic schemas for admin operations.
"""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class AdminUserResponse(BaseModel):
    """User info for admin view."""
    id: str
    email: str
    full_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    role: str = "customer"
    status: str = "active"  # active, inactive
    created_at: datetime | None = None
    updated_at: datetime | None = None
    orders_count: int = 0


class AdminUserListResponse(BaseModel):
    """Paginated list of users."""
    users: list[AdminUserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class UserRoleUpdate(BaseModel):
    """Update user role request."""
    role: str = Field(..., pattern="^(customer|admin)$")


class UserStatusUpdate(BaseModel):
    """Update user status request."""
    status: str = Field(..., pattern="^(active|inactive)$")


# Dashboard schemas
class DashboardStat(BaseModel):
    """Single dashboard stat."""
    name: str
    value: str
    change: str
    change_positive: bool = True


class RecentOrderResponse(BaseModel):
    """Recent order for dashboard."""
    id: str
    customer: str
    date: str
    total: float
    status: str
    items: int


class DashboardResponse(BaseModel):
    """Dashboard data response."""
    stats: list[DashboardStat]
    recent_orders: list[RecentOrderResponse]

