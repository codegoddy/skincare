"""
Pydantic schemas for admin store settings.
"""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class StoreSettingsBase(BaseModel):
    """Store settings base model."""
    store_name: str | None = None
    store_email: str | None = None
    store_phone: str | None = None
    store_address: str | None = None
    currency: str | None = None
    currency_symbol: str | None = None
    tax_rate: float | None = None
    shipping_fee: float | None = None
    free_shipping_threshold: float | None = None
    maintenance_mode: bool | None = None


class StoreSettingsUpdate(StoreSettingsBase):
    """Store settings update request."""
    pass


class StoreSettingsResponse(BaseModel):
    """Store settings response."""
    id: str
    store_name: str
    store_email: str | None = None
    store_phone: str | None = None
    store_address: str | None = None
    currency: str
    currency_symbol: str
    tax_rate: float
    shipping_fee: float
    free_shipping_threshold: float | None = None
    maintenance_mode: bool
    updated_at: datetime | None = None
