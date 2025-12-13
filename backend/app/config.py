"""
Application configuration using Pydantic Settings.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    
    # Database Connection (lowercase to match Supabase format)
    user: str
    password: str
    host: str
    port: str = "6543"
    dbname: str = "postgres"
    
    @property
    def database_url(self) -> str:
        """Build database URL from individual params."""
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.dbname}"
    
    # Application
    debug: bool = False
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    
    # Rate Limiting (requests per minute)
    rate_limit_default: int = 60  # General endpoints
    rate_limit_auth: int = 10     # Auth endpoints (login, signup)
    rate_limit_strict: int = 5    # Sensitive endpoints (password reset)
    
    @property
    def cors_origins(self) -> list[str]:
        """Allowed CORS origins."""
        origins = [self.frontend_url]
        if self.debug:
            origins.extend([
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ])
        return origins


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
