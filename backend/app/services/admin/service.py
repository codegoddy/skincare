"""
Admin service - business logic layer.
"""
import math
from typing import Any

from app.shared.exceptions import NotFoundError
from app.services.admin.schemas import (
    AdminUserResponse,
    AdminUserListResponse,
    UserRoleUpdate,
    UserStatusUpdate,
)
from app.services.admin.store_settings import (
    StoreSettingsResponse,
    StoreSettingsUpdate,
)
from app.services.admin.repository import AdminRepository, StoreSettingsRepository


class AdminService:
    """Admin business logic."""

    @staticmethod
    async def list_users(page: int = 1, page_size: int = 20) -> AdminUserListResponse:
        """Get paginated list of all users."""
        users_data, total = await AdminRepository.get_all_users(page, page_size)
        
        users = []
        for user in users_data:
            # Get orders count for each user
            orders_count = await AdminRepository.get_user_orders_count(user["id"])
            
            users.append(AdminUserResponse(
                id=user["id"],
                email=user.get("email") or "",
                full_name=user.get("full_name"),
                phone=user.get("phone"),
                avatar_url=user.get("avatar_url"),
                role=user.get("role", "customer"),
                status=user.get("status", "active"),
                created_at=user.get("auth_created_at") or user.get("created_at"),
                updated_at=user.get("updated_at"),
                orders_count=orders_count,
            ))
        
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        
        return AdminUserListResponse(
            users=users,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_user(user_id: str) -> AdminUserResponse:
        """Get a single user by ID."""
        user = await AdminRepository.get_user_by_id(user_id)
        
        if not user:
            raise NotFoundError("User")
        
        orders_count = await AdminRepository.get_user_orders_count(user_id)
        
        return AdminUserResponse(
            id=user["id"],
            email=user.get("email") or "",
            full_name=user.get("full_name"),
            phone=user.get("phone"),
            avatar_url=user.get("avatar_url"),
            role=user.get("role", "customer"),
            status=user.get("status", "active"),
            created_at=user.get("auth_created_at") or user.get("created_at"),
            updated_at=user.get("updated_at"),
            orders_count=orders_count,
        )

    @staticmethod
    async def update_user_role(user_id: str, data: UserRoleUpdate) -> AdminUserResponse:
        """Update a user's role."""
        # Check user exists
        user = await AdminRepository.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User")
        
        # Update role
        await AdminRepository.update_user_role(user_id, data.role)
        
        # Return updated user
        return await AdminService.get_user(user_id)

    @staticmethod
    async def update_user_status(user_id: str, data: UserStatusUpdate) -> AdminUserResponse:
        """Update a user's status."""
        # Check user exists
        user = await AdminRepository.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User")
        
        # Update status
        await AdminRepository.update_user_status(user_id, data.status)
        
        # Return updated user
        return await AdminService.get_user(user_id)


class StoreSettingsService:
    """Store settings business logic."""

    @staticmethod
    async def get_settings() -> StoreSettingsResponse:
        """Get store settings."""
        settings = await StoreSettingsRepository.get_settings()
        
        if not settings:
            # Return defaults
            return StoreSettingsResponse(
                id="default",
                store_name="ZenGlow",
                currency="USD",
                currency_symbol="$",
                tax_rate=0,
                shipping_fee=0,
                maintenance_mode=False,
            )
        
        return StoreSettingsResponse(
            id=settings["id"],
            store_name=settings.get("store_name", "ZenGlow"),
            store_email=settings.get("store_email"),
            store_phone=settings.get("store_phone"),
            store_address=settings.get("store_address"),
            currency=settings.get("currency", "USD"),
            currency_symbol=settings.get("currency_symbol", "$"),
            tax_rate=float(settings.get("tax_rate", 0)),
            shipping_fee=float(settings.get("shipping_fee", 0)),
            free_shipping_threshold=float(settings["free_shipping_threshold"]) if settings.get("free_shipping_threshold") else None,
            maintenance_mode=settings.get("maintenance_mode", False),
            updated_at=settings.get("updated_at"),
        )

    @staticmethod
    async def update_settings(data: StoreSettingsUpdate) -> StoreSettingsResponse:
        """Update store settings."""
        update_data = data.model_dump(exclude_none=True)
        
        if update_data:
            await StoreSettingsRepository.update_settings(update_data)
        
        return await StoreSettingsService.get_settings()


class DashboardService:
    """Dashboard business logic."""

    @staticmethod
    async def get_dashboard() -> "DashboardResponse":
        """Get dashboard stats and recent orders."""
        from app.services.admin.schemas import DashboardStat, RecentOrderResponse, DashboardResponse
        from app.services.admin.repository import DashboardRepository
        
        # Fetch all stats
        total_revenue = await DashboardRepository.get_total_revenue()
        active_orders = await DashboardRepository.get_orders_count(status="pending")
        total_customers = await DashboardRepository.get_customers_count()
        total_products = await DashboardRepository.get_products_count()
        
        # Format currency - get store settings for currency symbol
        settings = await StoreSettingsService.get_settings()
        currency_symbol = settings.currency_symbol
        
        stats = [
            DashboardStat(
                name="Total Revenue",
                value=f"{currency_symbol}{total_revenue:,.2f}",
                change="+0%",  # Would need historical data for real change
                change_positive=True,
            ),
            DashboardStat(
                name="Active Orders",
                value=str(active_orders),
                change="+0",
                change_positive=True,
            ),
            DashboardStat(
                name="Total Customers",
                value=f"{total_customers:,}",
                change="+0",
                change_positive=True,
            ),
            DashboardStat(
                name="Products",
                value=str(total_products),
                change="+0",
                change_positive=True,
            ),
        ]
        
        # Get recent orders
        recent_orders_data = await DashboardRepository.get_recent_orders(limit=5)
        
        recent_orders = []
        for order in recent_orders_data:
            created_at = order.get("created_at", "")
            # Format date
            if created_at:
                from datetime import datetime
                try:
                    dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                    date_str = dt.strftime("%b %d, %Y")
                except Exception:
                    date_str = created_at[:10] if len(created_at) >= 10 else created_at
            else:
                date_str = "Unknown"
            
            recent_orders.append(RecentOrderResponse(
                id=f"#ORD-{order['id'][:8].upper()}",
                customer=order.get("customer_name") or "Unknown",
                date=date_str,
                total=order.get("total", 0),
                status=order.get("status", "pending").capitalize(),
                items=order.get("items_count", 0),
            ))
        
        return DashboardResponse(
            stats=stats,
            recent_orders=recent_orders,
        )

