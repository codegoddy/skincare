"""
Products service - business logic layer.
"""
import asyncio
import math
from typing import Optional

from app.shared.exceptions import NotFoundError
from app.shared.websocket import manager
from app.services.products.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from app.services.products.repository import ProductRepository


class ProductService:
    """Products business logic."""

    @staticmethod
    async def list_products(
        page: int = 1,
        page_size: int = 20,
        product_type: Optional[str] = None,
        skin_concern: Optional[str] = None,
        skin_type: Optional[str] = None,
        usage_time: Optional[str] = None,
        search: Optional[str] = None,
        active_only: bool = True,
    ) -> ProductListResponse:
        """Get paginated list of products with filters."""
        products_data, total = await ProductRepository.get_all(
            page=page,
            page_size=page_size,
            product_type=product_type,
            skin_concern=skin_concern,
            skin_type=skin_type,
            usage_time=usage_time,
            search=search,
            active_only=active_only,
        )
        
        products = [
            ProductResponse(
                id=p["id"],
                name=p["name"],
                description=p.get("description"),
                price=float(p.get("price", 0)),
                compare_price=float(p["compare_price"]) if p.get("compare_price") else None,
                images=p.get("images", []),
                product_type=p.get("product_type"),
                skin_concerns=p.get("skin_concerns", []),
                skin_types=p.get("skin_types", []),
                key_ingredients=p.get("key_ingredients", []),
                usage_time=p.get("usage_time"),
                stock=p.get("stock", 0),
                in_stock=p.get("in_stock", True),
                is_active=p.get("is_active", True),
                created_at=p.get("created_at"),
                updated_at=p.get("updated_at"),
            )
            for p in products_data
        ]
        
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        
        return ProductListResponse(
            products=products,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_product(product_id: str) -> ProductResponse:
        """Get a single product by ID."""
        product = await ProductRepository.get_by_id(product_id)
        
        if not product:
            raise NotFoundError("Product")
        
        return ProductResponse(
            id=product["id"],
            name=product["name"],
            description=product.get("description"),
            price=float(product.get("price", 0)),
            compare_price=float(product["compare_price"]) if product.get("compare_price") else None,
            images=product.get("images", []),
            product_type=product.get("product_type"),
            skin_concerns=product.get("skin_concerns", []),
            skin_types=product.get("skin_types", []),
            key_ingredients=product.get("key_ingredients", []),
            usage_time=product.get("usage_time"),
            stock=product.get("stock", 0),
            in_stock=product.get("in_stock", True),
            is_active=product.get("is_active", True),
            created_at=product.get("created_at"),
            updated_at=product.get("updated_at"),
        )

    @staticmethod
    async def create_product(data: ProductCreate) -> ProductResponse:
        """Create a new product."""
        product_data = data.model_dump()
        product = await ProductRepository.create(product_data)
        
        result = await ProductService.get_product(product["id"])
        
        # Broadcast to WebSocket clients
        asyncio.create_task(manager.broadcast({
            "type": "product_created",
            "product": result.model_dump(mode="json"),
        }, "products"))
        
        return result

    @staticmethod
    async def update_product(product_id: str, data: ProductUpdate) -> ProductResponse:
        """Update a product."""
        # Check exists
        existing = await ProductRepository.get_by_id(product_id)
        if not existing:
            raise NotFoundError("Product")
        
        # Update
        update_data = data.model_dump(exclude_none=True)
        if update_data:
            await ProductRepository.update(product_id, update_data)
        
        result = await ProductService.get_product(product_id)
        
        # Broadcast to WebSocket clients
        asyncio.create_task(manager.broadcast({
            "type": "product_updated",
            "product": result.model_dump(mode="json"),
        }, "products"))
        
        return result

    @staticmethod
    async def delete_product(product_id: str) -> bool:
        """Delete a product."""
        existing = await ProductRepository.get_by_id(product_id)
        if not existing:
            raise NotFoundError("Product")
        
        result = await ProductRepository.delete(product_id)
        
        # Broadcast to WebSocket clients
        asyncio.create_task(manager.broadcast({
            "type": "product_deleted",
            "product_id": product_id,
        }, "products"))
        
        return result

