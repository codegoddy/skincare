"""
Application constants.
"""

# User roles
ROLE_CUSTOMER = "customer"
ROLE_ADMIN = "admin"
VALID_ROLES = [ROLE_CUSTOMER, ROLE_ADMIN]

# Token settings
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Pagination defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
