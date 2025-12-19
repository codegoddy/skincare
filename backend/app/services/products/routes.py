"""
Products API routes.
"""
from typing import Any, Optional

from fastapi import APIRouter, Depends, Request, Query, UploadFile, File

from app.config import get_settings
from app.shared.security import require_admin
from app.shared.rate_limit import limiter
from app.shared.cloudinary import upload_image
from app.services.products.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductFilters,
    PRODUCT_TYPES,
    SKIN_CONCERNS,
    SKIN_TYPES,
    KEY_INGREDIENTS,
    USAGE_TIMES,
)
from app.services.products.service import ProductService


router = APIRouter(prefix="/products", tags=["Products"])


# Public routes
@router.get(
    "",
    response_model=ProductListResponse,
    summary="List products",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def list_products(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    product_type: Optional[str] = None,
    skin_concern: Optional[str] = None,
    skin_type: Optional[str] = None,
    usage_time: Optional[str] = None,
    search: Optional[str] = None,
) -> ProductListResponse:
    """Get paginated list of products with optional filters."""
    return await ProductService.list_products(
        page=page,
        page_size=page_size,
        product_type=product_type,
        skin_concern=skin_concern,
        skin_type=skin_type,
        usage_time=usage_time,
        search=search,
        active_only=True,
    )


@router.get(
    "/filters",
    response_model=ProductFilters,
    summary="Get filter options",
)
async def get_filter_options(request: Request) -> ProductFilters:
    """Get available filter options for products."""
    return ProductFilters()


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Get product",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def get_product(
    request: Request,
    product_id: str,
) -> ProductResponse:
    """Get a single product by ID."""
    return await ProductService.get_product(product_id)


# Admin routes
admin_router = APIRouter(prefix="/admin/products", tags=["Admin Products"])


@admin_router.get(
    "",
    response_model=ProductListResponse,
    summary="List all products (admin)",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def admin_list_products(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: dict[str, Any] = Depends(require_admin),
) -> ProductListResponse:
    """Get all products including inactive (admin only)."""
    return await ProductService.list_products(
        page=page,
        page_size=page_size,
        search=search,
        active_only=False,
    )


@admin_router.post(
    "",
    response_model=ProductResponse,
    summary="Create product",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def create_product(
    request: Request,
    data: ProductCreate,
    current_user: dict[str, Any] = Depends(require_admin),
) -> ProductResponse:
    """Create a new product (admin only)."""
    return await ProductService.create_product(data)


@admin_router.patch(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update product",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def update_product(
    request: Request,
    product_id: str,
    data: ProductUpdate,
    current_user: dict[str, Any] = Depends(require_admin),
) -> ProductResponse:
    """Update a product (admin only)."""
    return await ProductService.update_product(product_id, data)


@admin_router.delete(
    "/{product_id}",
    summary="Delete product",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def delete_product(
    request: Request,
    product_id: str,
    current_user: dict[str, Any] = Depends(require_admin),
) -> dict[str, str]:
    """Delete a product (admin only)."""
    await ProductService.delete_product(product_id)
    return {"message": "Product deleted"}


@admin_router.post(
    "/upload-image",
    summary="Upload product image",
)
@limiter.limit(lambda: f"{get_settings().rate_limit_default}/minute")
async def upload_product_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: dict[str, Any] = Depends(require_admin),
) -> dict[str, Any]:
    """Upload image to Cloudinary (admin only)."""
    result = await upload_image(file, folder="products")
    return result

