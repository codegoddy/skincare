"""Create user_settings table

Revision ID: 004_settings
Revises: 003_wishlist
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '004_settings'
down_revision: Union[str, None] = '003_wishlist'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create user_settings table with RLS."""
    
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.user_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
            notification_order_updates BOOLEAN DEFAULT true,
            notification_promotions BOOLEAN DEFAULT false,
            notification_newsletter BOOLEAN DEFAULT true,
            notification_product_alerts BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.user_settings IS 'User notification and app settings';
    """)
    
    # Enable RLS
    op.execute("ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;")
    
    op.execute("""
        CREATE POLICY "Users can read own settings"
            ON public.user_settings
            FOR SELECT
            USING (auth.uid() = user_id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can update own settings"
            ON public.user_settings
            FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can insert own settings"
            ON public.user_settings
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    """)
    
    # Trigger for updated_at
    op.execute("""
        CREATE TRIGGER update_user_settings_updated_at
            BEFORE UPDATE ON public.user_settings
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    """)
    
    # Index
    op.execute("CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);")


def downgrade() -> None:
    """Drop user_settings table."""
    
    op.execute("DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;")
    op.execute('DROP POLICY IF EXISTS "Users can read own settings" ON public.user_settings;')
    op.execute('DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;')
    op.execute('DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;')
    op.execute("DROP TABLE IF EXISTS public.user_settings;")
