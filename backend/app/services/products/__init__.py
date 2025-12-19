"""
Products service exports.
"""
from app.services.products.routes import router, admin_router

__all__ = ["router", "admin_router"]
