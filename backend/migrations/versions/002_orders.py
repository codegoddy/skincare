"""Create orders and order_items tables

Revision ID: 002_orders
Revises: 001_user_profiles
Create Date: 2024-12-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002_orders'
down_revision: Union[str, None] = '001_user_profiles'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create orders and order_items tables with RLS."""
    
    # Create orders table
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
            subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
            shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
            tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
            total NUMERIC(10, 2) NOT NULL DEFAULT 0,
            shipping_address JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.orders IS 'Customer orders';
    """)
    
    # Create order_items table
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.order_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
            product_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT,
            price NUMERIC(10, 2) NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            image TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.order_items IS 'Items within an order';
    """)
    
    # Enable RLS on orders
    op.execute("ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;")
    
    op.execute("""
        CREATE POLICY "Users can read own orders"
            ON public.orders
            FOR SELECT
            USING (auth.uid() = user_id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can create own orders"
            ON public.orders
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    """)
    
    # Enable RLS on order_items
    op.execute("ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;")
    
    op.execute("""
        CREATE POLICY "Users can read own order items"
            ON public.order_items
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.orders
                    WHERE orders.id = order_items.order_id
                    AND orders.user_id = auth.uid()
                )
            );
    """)
    
    op.execute("""
        CREATE POLICY "Users can create own order items"
            ON public.order_items
            FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.orders
                    WHERE orders.id = order_items.order_id
                    AND orders.user_id = auth.uid()
                )
            );
    """)
    
    # Triggers for updated_at
    op.execute("""
        CREATE TRIGGER update_orders_updated_at
            BEFORE UPDATE ON public.orders
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    """)
    
    # Indexes
    op.execute("CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);")
    op.execute("CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);")
    op.execute("CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);")


def downgrade() -> None:
    """Drop orders and order_items tables."""
    
    # Drop triggers
    op.execute("DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;")
    
    # Drop policies
    op.execute('DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;')
    op.execute('DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;')
    op.execute('DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;')
    op.execute('DROP POLICY IF EXISTS "Users can create own order items" ON public.order_items;')
    
    # Drop tables
    op.execute("DROP TABLE IF EXISTS public.order_items;")
    op.execute("DROP TABLE IF EXISTS public.orders;")
