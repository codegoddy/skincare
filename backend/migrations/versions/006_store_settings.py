"""Create store_settings table

Revision ID: 006_store_settings
Revises: 005_user_status
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '006_store_settings'
down_revision: Union[str, None] = '005_user_status'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create store_settings table."""
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.store_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            store_name TEXT DEFAULT 'ZenGlow',
            store_email TEXT,
            store_phone TEXT,
            store_address TEXT,
            currency TEXT DEFAULT 'USD',
            currency_symbol TEXT DEFAULT '$',
            tax_rate NUMERIC(5, 2) DEFAULT 0,
            shipping_fee NUMERIC(10, 2) DEFAULT 0,
            free_shipping_threshold NUMERIC(10, 2),
            maintenance_mode BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.store_settings IS 'Global store configuration';
        
        -- Insert default settings
        INSERT INTO public.store_settings (id, store_name, currency, currency_symbol)
        VALUES (gen_random_uuid(), 'ZenGlow', 'USD', '$')
        ON CONFLICT DO NOTHING;
    """)
    
    # Trigger for updated_at
    op.execute("""
        CREATE TRIGGER update_store_settings_updated_at
            BEFORE UPDATE ON public.store_settings
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    """)


def downgrade() -> None:
    """Drop store_settings table."""
    op.execute("DROP TRIGGER IF EXISTS update_store_settings_updated_at ON public.store_settings;")
    op.execute("DROP TABLE IF EXISTS public.store_settings;")
