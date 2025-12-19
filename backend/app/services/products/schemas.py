"""
Pydantic schemas for products.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Category options
PRODUCT_TYPES = [
    "Cleanser", "Moisturizer", "Serum", "Toner", 
    "Mask", "Sunscreen", "Eye Care", "Treatment"
]

SKIN_CONCERNS = [
    "Acne", "Aging", "Dryness", "Oiliness", 
    "Sensitivity", "Hyperpigmentation", "Pores"
]

SKIN_TYPES = [
    "Oily", "Dry", "Combination", "Normal", "Sensitive"
]

KEY_INGREDIENTS = [
    "Hyaluronic Acid", "Vitamin C", "Retinol", "Niacinamide",
    "Salicylic Acid", "AHA/BHA", "Peptides", "Ceramides"
]

USAGE_TIMES = ["Morning", "Evening", "Both"]


class ProductBase(BaseModel):
    """Product base model."""
    name: str
    description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    images: list[str] = []
    product_type: Optional[str] = None
    skin_concerns: list[str] = []
    skin_types: list[str] = []
    key_ingredients: list[str] = []
    usage_time: Optional[str] = None
    stock: int = 0
    in_stock: bool = True
    is_active: bool = True


class ProductCreate(ProductBase):
    """Product create request."""
    pass


class ProductUpdate(BaseModel):
    """Product update request."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    compare_price: Optional[float] = None
    images: Optional[list[str]] = None
    product_type: Optional[str] = None
    skin_concerns: Optional[list[str]] = None
    skin_types: Optional[list[str]] = None
    key_ingredients: Optional[list[str]] = None
    usage_time: Optional[str] = None
    stock: Optional[int] = None
    in_stock: Optional[bool] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    """Product response."""
    id: str
    name: str
    description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    images: list[str] = []
    product_type: Optional[str] = None
    skin_concerns: list[str] = []
    skin_types: list[str] = []
    key_ingredients: list[str] = []
    usage_time: Optional[str] = None
    stock: int = 0
    in_stock: bool = True
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProductListResponse(BaseModel):
    """Product list response."""
    products: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ProductFilters(BaseModel):
    """Product filter options."""
    product_types: list[str] = PRODUCT_TYPES
    skin_concerns: list[str] = SKIN_CONCERNS
    skin_types: list[str] = SKIN_TYPES
    key_ingredients: list[str] = KEY_INGREDIENTS
    usage_times: list[str] = USAGE_TIMES
