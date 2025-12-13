"""
Supabase client configuration.
"""
from supabase import create_client, Client
from supabase._async.client import AsyncClient, create_client as create_async_client

from app.config import get_settings


_supabase_client: Client | None = None
_supabase_async_client: AsyncClient | None = None


def get_supabase_client() -> Client:
    """Get synchronous Supabase client (singleton)."""
    global _supabase_client
    if _supabase_client is None:
        settings = get_settings()
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_anon_key
        )
    return _supabase_client


async def get_supabase_async_client() -> AsyncClient:
    """Get async Supabase client (singleton)."""
    global _supabase_async_client
    if _supabase_async_client is None:
        settings = get_settings()
        _supabase_async_client = await create_async_client(
            settings.supabase_url,
            settings.supabase_anon_key
        )
    return _supabase_async_client


def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations."""
    settings = get_settings()
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key
    )
