"""
Test configuration and fixtures.
"""
import os
import pytest
from httpx import AsyncClient, ASGITransport

# Set test environment variables before importing app
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("user", "test")
os.environ.setdefault("password", "test")
os.environ.setdefault("host", "localhost")
os.environ.setdefault("port", "5432")
os.environ.setdefault("dbname", "test")
os.environ.setdefault("DEBUG", "true")

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Create async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def test_user_data():
    """Test user data for signup/login."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }


@pytest.fixture
def test_login_data():
    """Test login credentials."""
    return {
        "email": "test@example.com",
        "password": "testpassword123"
    }
