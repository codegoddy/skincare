"""
Public store routes - no auth required.
"""
from fastapi import APIRouter, Request

from app.config import get_settings
from app.shared.rate_limit import limiter
from app.services.admin.store_settings import StoreSettingsResponse
from app.services.admin.repository import StoreSettingsRepository


router = APIRouter(prefix="/store", tags=["Store"])


@router.get(
    "/config",
    response_model=StoreSettingsResponse,
    summary="Get public store configuration",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_public_store_config(request: Request) -> StoreSettingsResponse:
    """
    Get public store configuration (currency, shipping, etc).
    
    No authentication required.
    """
    settings = await StoreSettingsRepository.get_settings()
    
    if not settings:
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
