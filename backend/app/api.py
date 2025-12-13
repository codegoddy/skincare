"""
API router registration.
"""
from fastapi import APIRouter

from app.services.auth import router as auth_router
from app.services.orders import router as orders_router
from app.services.wishlist import router as wishlist_router
from app.services.settings import router as settings_router


api_router = APIRouter()

# Register service routers
api_router.include_router(auth_router)
api_router.include_router(orders_router)
api_router.include_router(wishlist_router)
api_router.include_router(settings_router)

