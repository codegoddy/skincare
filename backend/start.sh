#!/usr/bin/env bash
# Production start script for Render

# Use Render's PORT environment variable (defaults to 10000)
PORT=${PORT:-10000}

echo "🚀 Starting ZenGlow API on port $PORT..."

# Start gunicorn with uvicorn workers
# --workers 1: Free tier has limited resources
# --worker-class: Use uvicorn worker for async support
# --bind: Bind to all interfaces on Render's PORT
# --timeout: Increase timeout for slow connections
# --access-logfile: Log access to stdout
# --error-logfile: Log errors to stderr
exec gunicorn app.main:app \
  --workers 1 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:$PORT \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  --log-level info
