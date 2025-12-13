"""Create wishlist_items table

Revision ID: 003_wishlist
Revises: 002_orders
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '003_wishlist'
down_revision: Union[str, None] = '002_orders'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create wishlist_items table with RLS."""
    
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.wishlist_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            product_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT,
            price NUMERIC(10, 2) NOT NULL,
            image TEXT,
            in_stock BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, product_id)
        );
        
        COMMENT ON TABLE public.wishlist_items IS 'User wishlist items';
    """)
    
    # Enable RLS
    op.execute("ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;")
    
    op.execute("""
        CREATE POLICY "Users can read own wishlist"
            ON public.wishlist_items
            FOR SELECT
            USING (auth.uid() = user_id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can add to own wishlist"
            ON public.wishlist_items
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can remove from own wishlist"
            ON public.wishlist_items
            FOR DELETE
            USING (auth.uid() = user_id);
    """)
    
    # Index
    op.execute("CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist_items(user_id);")


def downgrade() -> None:
    """Drop wishlist_items table."""
    
    op.execute('DROP POLICY IF EXISTS "Users can read own wishlist" ON public.wishlist_items;')
    op.execute('DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlist_items;')
    op.execute('DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlist_items;')
    op.execute("DROP TABLE IF EXISTS public.wishlist_items;")
