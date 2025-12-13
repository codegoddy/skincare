# Database Migrations

Migrations are managed with **Alembic**.

## Commands

```bash
# View current migration status
alembic current

# Run all pending migrations
alembic upgrade head

# Run next migration only
alembic upgrade +1

# Rollback last migration
alembic downgrade -1

# Rollback all migrations
alembic downgrade base

# Create new migration
alembic revision -m "description"

# View migration history
alembic history
```

## Migration Files

Located in `migrations/versions/`:

| File | Description |
|------|-------------|
| `001_user_profiles.py` | Creates user_profiles table with RLS |

## Notes

- Migrations use raw SQL via `op.execute()` for Supabase compatibility
- RLS policies and triggers are included in migrations
- Database credentials are loaded from `.env`
