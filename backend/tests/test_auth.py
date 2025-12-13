"""
Tests for authentication endpoints.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


class TestHealthEndpoint:
    """Test health check endpoint."""

    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test health endpoint returns healthy status."""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "zenglow-api"


class TestSignupEndpoint:
    """Test user registration endpoint."""

    @pytest.mark.asyncio
    async def test_signup_validation_missing_email(self, client):
        """Test signup fails without email."""
        response = await client.post("/auth/signup", json={
            "password": "testpassword123",
            "full_name": "Test User"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_signup_validation_invalid_email(self, client):
        """Test signup fails with invalid email format."""
        response = await client.post("/auth/signup", json={
            "email": "not-an-email",
            "password": "testpassword123",
            "full_name": "Test User"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_signup_validation_short_password(self, client):
        """Test signup fails with password less than 8 characters."""
        response = await client.post("/auth/signup", json={
            "email": "test@example.com",
            "password": "short",
            "full_name": "Test User"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_signup_validation_missing_name(self, client):
        """Test signup fails without full_name."""
        response = await client.post("/auth/signup", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("app.services.auth.service.get_supabase_client")
    @patch("app.services.auth.service.UserRepository.get_profile_by_id")
    async def test_signup_success(self, mock_get_profile, mock_supabase, client, test_user_data):
        """Test successful user registration."""
        # Mock Supabase response
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = test_user_data["email"]
        mock_user.user_metadata = {"full_name": test_user_data["full_name"]}
        mock_user.created_at = "2024-01-01T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "test-access-token"
        mock_session.refresh_token = "test-refresh-token"
        mock_session.expires_in = 3600

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        mock_client = MagicMock()
        mock_client.auth.sign_up.return_value = mock_response
        mock_supabase.return_value = mock_client

        mock_get_profile.return_value = {"role": "customer"}

        response = await client.post("/auth/signup", json=test_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == test_user_data["email"]


class TestLoginEndpoint:
    """Test user login endpoint."""

    @pytest.mark.asyncio
    async def test_login_validation_missing_email(self, client):
        """Test login fails without email."""
        response = await client.post("/auth/login", json={
            "password": "testpassword123"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_login_validation_missing_password(self, client):
        """Test login fails without password."""
        response = await client.post("/auth/login", json={
            "email": "test@example.com"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("app.services.auth.service.get_supabase_client")
    @patch("app.services.auth.service.UserRepository.get_profile_by_id")
    async def test_login_success(self, mock_get_profile, mock_supabase, client, test_login_data):
        """Test successful login."""
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = test_login_data["email"]
        mock_user.user_metadata = {"full_name": "Test User"}
        mock_user.created_at = "2024-01-01T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "test-access-token"
        mock_session.refresh_token = "test-refresh-token"
        mock_session.expires_in = 3600

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        mock_client = MagicMock()
        mock_client.auth.sign_in_with_password.return_value = mock_response
        mock_supabase.return_value = mock_client

        mock_get_profile.return_value = {"role": "customer"}

        response = await client.post("/auth/login", json=test_login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"


class TestMeEndpoint:
    """Test current user endpoint."""

    @pytest.mark.asyncio
    async def test_me_without_auth(self, client):
        """Test /me endpoint requires authentication."""
        response = await client.get("/auth/me")
        assert response.status_code == 401  # Missing auth header

    @pytest.mark.asyncio
    @patch("app.shared.security.get_supabase_client")
    @patch("app.services.auth.service.UserRepository.get_profile_by_id")
    async def test_me_with_valid_token(self, mock_get_profile, mock_supabase, client):
        """Test /me endpoint with valid token."""
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"full_name": "Test User"}
        mock_user.created_at = "2024-01-01T00:00:00Z"

        mock_response = MagicMock()
        mock_response.user = mock_user

        mock_client = MagicMock()
        mock_client.auth.get_user.return_value = mock_response
        mock_supabase.return_value = mock_client

        mock_get_profile.return_value = {"role": "customer"}

        response = await client.get(
            "/auth/me",
            headers={"Authorization": "Bearer test-valid-token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"


class TestLogoutEndpoint:
    """Test logout endpoint."""

    @pytest.mark.asyncio
    async def test_logout_without_auth(self, client):
        """Test logout requires authentication."""
        response = await client.post("/auth/logout")
        assert response.status_code == 401

    @pytest.mark.asyncio
    @patch("app.shared.security.get_supabase_client")
    @patch("app.services.auth.service.get_supabase_client")
    async def test_logout_success(self, mock_service_client, mock_security_client, client):
        """Test successful logout."""
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {}
        mock_user.created_at = "2024-01-01T00:00:00Z"

        mock_response = MagicMock()
        mock_response.user = mock_user

        mock_client = MagicMock()
        mock_client.auth.get_user.return_value = mock_response
        mock_client.auth.sign_out.return_value = None
        mock_security_client.return_value = mock_client
        mock_service_client.return_value = mock_client

        response = await client.post(
            "/auth/logout",
            headers={"Authorization": "Bearer test-valid-token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Successfully logged out"


class TestPasswordResetEndpoints:
    """Test password reset endpoints."""

    @pytest.mark.asyncio
    async def test_forgot_password_validation(self, client):
        """Test forgot-password requires valid email."""
        response = await client.post("/auth/forgot-password", json={
            "email": "not-an-email"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("app.services.auth.service.get_supabase_client")
    async def test_forgot_password_success(self, mock_supabase, client):
        """Test forgot-password returns success regardless of email existence."""
        mock_client = MagicMock()
        mock_client.auth.reset_password_for_email.return_value = None
        mock_supabase.return_value = mock_client

        response = await client.post("/auth/forgot-password", json={
            "email": "test@example.com"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "reset link" in data["message"].lower()

    @pytest.mark.asyncio
    async def test_reset_password_validation(self, client):
        """Test reset-password requires valid data."""
        response = await client.post("/auth/reset-password", json={
            "access_token": "token",
            "new_password": "short"  # Too short
        })
        assert response.status_code == 422


class TestRefreshTokenEndpoint:
    """Test token refresh endpoint."""

    @pytest.mark.asyncio
    async def test_refresh_validation(self, client):
        """Test refresh requires refresh_token."""
        response = await client.post("/auth/refresh", json={})
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("app.services.auth.service.get_supabase_client")
    @patch("app.services.auth.service.UserRepository.get_profile_by_id")
    async def test_refresh_success(self, mock_get_profile, mock_supabase, client):
        """Test successful token refresh."""
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"full_name": "Test User"}
        mock_user.created_at = "2024-01-01T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "new-access-token"
        mock_session.refresh_token = "new-refresh-token"
        mock_session.expires_in = 3600

        mock_response = MagicMock()
        mock_response.user = mock_user
        mock_response.session = mock_session

        mock_client = MagicMock()
        mock_client.auth.refresh_session.return_value = mock_response
        mock_supabase.return_value = mock_client

        mock_get_profile.return_value = {"role": "customer"}

        response = await client.post("/auth/refresh", json={
            "refresh_token": "valid-refresh-token"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "new-access-token"
        assert data["refresh_token"] == "new-refresh-token"
