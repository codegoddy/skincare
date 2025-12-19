"""Create products table

Revision ID: 007_products
Revises: 006_store_settings
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '007_products'
down_revision: Union[str, None] = '006_store_settings'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create products table."""
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            compare_price NUMERIC(10, 2),
            images TEXT[] DEFAULT '{}',
            
            -- Categories
            product_type TEXT,
            skin_concerns TEXT[] DEFAULT '{}',
            skin_types TEXT[] DEFAULT '{}',
            key_ingredients TEXT[] DEFAULT '{}',
            usage_time TEXT,
            
            -- Inventory
            stock INTEGER DEFAULT 0,
            in_stock BOOLEAN DEFAULT true,
            is_active BOOLEAN DEFAULT true,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.products IS 'Store products catalog';
        
        -- Indexes for filtering
        CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
        CREATE INDEX IF NOT EXISTS idx_products_usage_time ON public.products(usage_time);
        CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
        CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
    """)
    
    # Trigger for updated_at
    op.execute("""
        CREATE TRIGGER update_products_updated_at
            BEFORE UPDATE ON public.products
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    """)


def downgrade() -> None:
    """Drop products table."""
    op.execute("DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;")
    op.execute("DROP TABLE IF EXISTS public.products;")
