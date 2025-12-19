"""
FastAPI application entry point.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.api import api_router
from app.shared.rate_limit import limiter
from app.shared.websocket import manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    settings = get_settings()
    print(f"🚀 Starting ZenGlow API (debug={settings.debug})")
    yield
    # Shutdown
    print("👋 Shutting down ZenGlow API")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title="ZenGlow API",
        description="Backend API for ZenGlow Skincare E-commerce",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
    )
    
    # Rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # CORS middleware - configured for security
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
        ],
        expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
        max_age=600,  # Cache preflight for 10 minutes
    )
    
    # Health check (no rate limit)
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": "zenglow-api"}
    
    # WebSocket endpoint for real-time updates
    @app.websocket("/ws/products")
    async def websocket_products(websocket: WebSocket):
        """WebSocket for real-time product updates."""
        await manager.connect(websocket, "products")
        try:
            while True:
                # Keep connection alive - client can send ping
                await websocket.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(websocket, "products")
    
    # Register API routes
    app.include_router(api_router)
    
    return app


app = create_app()

