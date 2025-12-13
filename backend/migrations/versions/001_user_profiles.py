"""Create user_profiles table

Revision ID: 001_user_profiles
Revises: 
Create Date: 2024-12-13

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_user_profiles'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create user_profiles table with RLS and triggers."""
    
    # Create user_profiles table
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT,
            phone TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        COMMENT ON TABLE public.user_profiles IS 'Extended user profile information';
    """)
    
    # Enable Row Level Security
    op.execute("ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;")
    
    # RLS Policies
    op.execute("""
        CREATE POLICY "Users can read own profile"
            ON public.user_profiles
            FOR SELECT
            USING (auth.uid() = id);
    """)
    
    op.execute("""
        CREATE POLICY "Users can update own profile"
            ON public.user_profiles
            FOR UPDATE
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    """)
    
    op.execute("""
        CREATE POLICY "Service role can insert profiles"
            ON public.user_profiles
            FOR INSERT
            WITH CHECK (true);
    """)
    
    # Updated_at trigger function
    op.execute("""
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Trigger to auto-update updated_at
    op.execute("""
        CREATE TRIGGER update_user_profiles_updated_at
            BEFORE UPDATE ON public.user_profiles
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    """)
    
    # Auto-create profile on signup
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.user_profiles (id, full_name)
            VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)
    
    # Trigger on auth.users
    op.execute("""
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    """)
    
    # Index for role lookups
    op.execute("CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);")


def downgrade() -> None:
    """Drop user_profiles table and related objects."""
    
    # Drop triggers
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;")
    op.execute("DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;")
    
    # Drop functions
    op.execute("DROP FUNCTION IF EXISTS public.handle_new_user();")
    op.execute("DROP FUNCTION IF EXISTS public.update_updated_at_column();")
    
    # Drop policies (must drop before table)
    op.execute("DROP POLICY IF EXISTS \"Users can read own profile\" ON public.user_profiles;")
    op.execute("DROP POLICY IF EXISTS \"Users can update own profile\" ON public.user_profiles;")
    op.execute("DROP POLICY IF EXISTS \"Service role can insert profiles\" ON public.user_profiles;")
    op.execute("DROP POLICY IF EXISTS \"Admins can read all profiles\" ON public.user_profiles;")
    
    # Drop table
    op.execute("DROP TABLE IF EXISTS public.user_profiles;")
