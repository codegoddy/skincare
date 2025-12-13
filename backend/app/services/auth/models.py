"""
User profile model for database operations.
"""
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class UserProfile(BaseModel):
    """User profile database model."""
    id: str
    full_name: str | None = None
    phone: str | None = None
    role: str = "customer"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @classmethod
    def from_db_row(cls, row: dict[str, Any]) -> "UserProfile":
        """Create from database row."""
        return cls(**row)
