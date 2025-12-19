"""
Track failed login attempts and implement account lockout.
"""
from datetime import datetime, timedelta
from typing import Optional
import asyncio


class LoginAttemptTracker:
    """Track failed login attempts per email address."""
    
    # In-memory storage (for production, use Redis or database)
    _attempts: dict[str, list[datetime]] = {}
    _lockouts: dict[str, datetime] = {}
    
    # Configuration
    MAX_ATTEMPTS = 5  # Maximum failed attempts
    LOCKOUT_DURATION = timedelta(minutes=15)  # Lockout duration
    ATTEMPT_WINDOW = timedelta(minutes=10)  # Time window to track attempts
    
    @classmethod
    async def record_failed_attempt(cls, email: str) -> None:
        """Record a failed login attempt."""
        now = datetime.utcnow()
        
        # Initialize if not exists
        if email not in cls._attempts:
            cls._attempts[email] = []
        
        # Add current attempt
        cls._attempts[email].append(now)
        
        # Clean old attempts outside the window
        cls._attempts[email] = [
            attempt for attempt in cls._attempts[email]
            if now - attempt < cls.ATTEMPT_WINDOW
        ]
        
        # Check if should lock account
        if len(cls._attempts[email]) >= cls.MAX_ATTEMPTS:
            cls._lockouts[email] = now + cls.LOCKOUT_DURATION
    
    @classmethod
    async def is_locked_out(cls, email: str) -> tuple[bool, Optional[int]]:
        """
        Check if account is locked out.
        
        Returns:
            tuple[bool, Optional[int]]: (is_locked, seconds_remaining)
        """
        if email not in cls._lockouts:
            return False, None
        
        now = datetime.utcnow()
        lockout_until = cls._lockouts[email]
        
        if now >= lockout_until:
            # Lockout expired, clean up
            del cls._lockouts[email]
            if email in cls._attempts:
                del cls._attempts[email]
            return False, None
        
        seconds_remaining = int((lockout_until - now).total_seconds())
        return True, seconds_remaining
    
    @classmethod
    async def reset_attempts(cls, email: str) -> None:
        """Reset attempts after successful login."""
        if email in cls._attempts:
            del cls._attempts[email]
        if email in cls._lockouts:
            del cls._lockouts[email]
    
    @classmethod
    async def get_remaining_attempts(cls, email: str) -> int:
        """Get number of remaining attempts before lockout."""
        if email not in cls._attempts:
            return cls.MAX_ATTEMPTS
        
        now = datetime.utcnow()
        
        # Clean old attempts
        cls._attempts[email] = [
            attempt for attempt in cls._attempts[email]
            if now - attempt < cls.ATTEMPT_WINDOW
        ]
        
        current_attempts = len(cls._attempts[email])
        return max(0, cls.MAX_ATTEMPTS - current_attempts)
    
    @classmethod
    async def cleanup_old_data(cls) -> None:
        """Periodic cleanup of old data."""
        now = datetime.utcnow()
        
        # Clean expired lockouts
        expired_lockouts = [
            email for email, lockout_time in cls._lockouts.items()
            if now >= lockout_time
        ]
        for email in expired_lockouts:
            del cls._lockouts[email]
        
        # Clean old attempts
        for email in list(cls._attempts.keys()):
            cls._attempts[email] = [
                attempt for attempt in cls._attempts[email]
                if now - attempt < cls.ATTEMPT_WINDOW
            ]
            if not cls._attempts[email]:
                del cls._attempts[email]


# Global instance
login_tracker = LoginAttemptTracker()


# Background cleanup task (optional - for production with long-running processes)
async def start_cleanup_task():
    """Start background task to clean up old data."""
    while True:
        await asyncio.sleep(300)  # Run every 5 minutes
        await LoginAttemptTracker.cleanup_old_data()
