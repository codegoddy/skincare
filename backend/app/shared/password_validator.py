"""
Password validation utilities for strong password requirements.
"""
import re
from typing import Optional


class PasswordStrength:
    """Password strength validator with detailed feedback."""
    
    MIN_LENGTH = 8
    MIN_UPPERCASE = 1
    MIN_LOWERCASE = 1
    MIN_DIGITS = 1
    MIN_SPECIAL = 1
    
    COMMON_PASSWORDS = [
        "password", "12345678", "qwerty", "abc123", "letmein",
        "welcome", "monkey", "1234567890", "password123", "admin",
        "admin123", "root", "test", "user", "guest"
    ]
    
    @classmethod
    def validate(cls, password: str) -> tuple[bool, list[str]]:
        """
        Validate password strength.
        
        Returns:
            tuple[bool, list[str]]: (is_valid, list of error messages)
        """
        errors = []
        
        # Check length
        if len(password) < cls.MIN_LENGTH:
            errors.append(f"Password must be at least {cls.MIN_LENGTH} characters long")
        
        # Check for uppercase
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        # Check for lowercase
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        # Check for digits
        if not re.search(r'[0-9]', password):
            errors.append("Password must contain at least one number")
        
        # Check for special characters
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;~`]', password):
            errors.append("Password must contain at least one special character (!@#$%^&* etc.)")
        
        # Check for common passwords
        if password.lower() in cls.COMMON_PASSWORDS:
            errors.append("This password is too common. Please choose a more unique password")
        
        # Check for sequential characters
        if cls._has_sequential_chars(password):
            errors.append("Password should not contain sequential characters (e.g., 'abc', '123')")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def _has_sequential_chars(password: str, length: int = 3) -> bool:
        """Check if password contains sequential characters."""
        password_lower = password.lower()
        
        # Check for sequential letters
        for i in range(len(password_lower) - length + 1):
            substring = password_lower[i:i + length]
            if substring.isalpha():
                # Check if characters are sequential
                if all(ord(substring[j]) == ord(substring[j-1]) + 1 for j in range(1, len(substring))):
                    return True
        
        # Check for sequential numbers
        for i in range(len(password) - length + 1):
            substring = password[i:i + length]
            if substring.isdigit():
                if all(int(substring[j]) == int(substring[j-1]) + 1 for j in range(1, len(substring))):
                    return True
        
        return False
    
    @classmethod
    def get_strength_score(cls, password: str) -> tuple[int, str]:
        """
        Calculate password strength score.
        
        Returns:
            tuple[int, str]: (score 0-5, description)
        """
        score = 0
        
        # Length bonus
        if len(password) >= 8:
            score += 1
        if len(password) >= 12:
            score += 1
        if len(password) >= 16:
            score += 1
        
        # Character variety
        if re.search(r'[A-Z]', password) and re.search(r'[a-z]', password):
            score += 1
        if re.search(r'[0-9]', password):
            score += 1
        if re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;~`]', password):
            score += 1
        
        # Penalty for common patterns
        if password.lower() in cls.COMMON_PASSWORDS:
            score = max(0, score - 2)
        if cls._has_sequential_chars(password):
            score = max(0, score - 1)
        
        # Cap at 5
        score = min(5, score)
        
        # Description
        descriptions = {
            0: "Very Weak",
            1: "Weak",
            2: "Fair",
            3: "Good",
            4: "Strong",
            5: "Very Strong"
        }
        
        return score, descriptions[score]


def validate_password_strength(password: str) -> Optional[str]:
    """
    Validate password and return error message if invalid.
    
    Args:
        password: Password to validate
        
    Returns:
        Optional[str]: Error message if invalid, None if valid
    """
    is_valid, errors = PasswordStrength.validate(password)
    
    if not is_valid:
        return "; ".join(errors)
    
    return None
