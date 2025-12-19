"""Add status column to user_profiles

Revision ID: 005_user_status
Revises: 004_settings
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '005_user_status'
down_revision: Union[str, None] = '004_settings'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add status column to user_profiles."""
    op.execute("""
        ALTER TABLE public.user_profiles 
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive'));
    """)


def downgrade() -> None:
    """Remove status column from user_profiles."""
    op.execute("ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS status;")
