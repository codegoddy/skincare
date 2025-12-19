# ZenGlow Backend API

FastAPI backend with Supabase authentication for the ZenGlow skincare e-commerce platform.

## Quick Start

### 1. Set up environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
cp example.env .env
# Edit .env with your Supabase credentials
```

### 3. Run database migrations

```bash
alembic upgrade head
```

### 4. Run the development server

```bash
uvicorn app.main:app --reload
```

API available at: http://localhost:8000  
Docs available at: http://localhost:8000/docs

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI entry point
│   ├── config.py         # Environment settings
│   ├── database.py       # Supabase client
│   ├── api.py            # Route registration
│   ├── dependencies.py   # Global dependencies
│   ├── shared/
│   │   ├── security.py   # JWT validation
│   │   ├── exceptions.py # Custom exceptions
│   │   ├── constants.py  # App constants
│   │   └── rate_limit.py # Rate limiter setup
│   └── services/auth/    # Auth module
├── requirements.txt
└── example.env
```

## Security

### CORS Configuration
- Only allows requests from configured `FRONTEND_URL`
- Exposes rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Preflight cache: 10 minutes

### Rate Limiting (per IP)
| Endpoint Type | Limit | Example |
|--------------|-------|---------|
| Default | 60/min | `/auth/me`, `/auth/logout` |
| Auth | 10/min | `/auth/login`, `/auth/signup` |
| Strict | 5/min | `/auth/forgot-password`, `/auth/reset-password` |

Configure in `.env`:
```bash
RATE_LIMIT_DEFAULT=60
RATE_LIMIT_AUTH=10
RATE_LIMIT_STRICT=5
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/auth/signup` | Register new user | 10/min |
| POST | `/auth/login` | Login | 10/min |
| POST | `/auth/logout` | Logout (auth required) | 60/min |
| POST | `/auth/refresh` | Refresh tokens | 10/min |
| GET | `/auth/me` | Get current user (auth required) | 60/min |
| POST | `/auth/forgot-password` | Request password reset | 5/min |
| POST | `/auth/reset-password` | Reset password | 5/min |

## Supabase Setup

Run this SQL in your Supabase SQL Editor to create the user profiles table:

```sql
-- User profiles table
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies
create policy "Users can read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Tech Stack

- **FastAPI** - Async web framework
- **Supabase** - Auth & database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Gunicorn** - Production WSGI server

## 🚀 Deployment

### Deploy to Render (Free Tier)

This backend is configured for easy deployment to Render's free tier.

**Quick Deploy:**
1. Push your code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml` configuration
4. Add environment variables in Render dashboard
5. Deploy!

**Detailed Instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Step-by-step deployment guide
- Environment variables configuration
- Troubleshooting tips
- Free tier limitations and best practices

**Required Environment Variables:**
- Supabase credentials (URL, keys)
- Database connection (use Transaction Pooler - port 6543)
- Frontend URL (your Vercel deployment)
- Optional: Cloudinary for image uploads

### Deploy Files

- `render.yaml` - Render Blueprint configuration
- `build.sh` - Build script (installs deps, runs migrations)
- `start.sh` - Production start script with gunicorn
- `.env.production.example` - Environment variables template
