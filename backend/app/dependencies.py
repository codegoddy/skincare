"""
Global dependencies for dependency injection.
"""
from typing import Annotated, Any

from fastapi import Depends

from app.shared.security import get_current_user, require_admin


# Type aliases for dependency injection
CurrentUser = Annotated[dict[str, Any], Depends(get_current_user)]
AdminUser = Annotated[dict[str, Any], Depends(require_admin)]
