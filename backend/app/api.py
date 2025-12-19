"""
API router registration.
"""
from fastapi import APIRouter

from app.services.auth import router as auth_router
from app.services.orders import router as orders_router
from app.services.orders.routes import admin_router as orders_admin_router
from app.services.wishlist import router as wishlist_router
from app.services.settings import router as settings_router
from app.services.admin import router as admin_router
from app.services.store import router as store_router
from app.services.products import router as products_router
from app.services.products import admin_router as products_admin_router


api_router = APIRouter()

# Register service routers
api_router.include_router(auth_router)
api_router.include_router(orders_router)
api_router.include_router(orders_admin_router)
api_router.include_router(wishlist_router)
api_router.include_router(settings_router)
api_router.include_router(admin_router)
api_router.include_router(store_router)
api_router.include_router(products_router)
api_router.include_router(products_admin_router)

