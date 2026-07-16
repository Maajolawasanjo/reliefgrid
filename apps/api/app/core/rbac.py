from typing import List
from fastapi import Depends
from app.models.auth import User
from app.exceptions.base import PermissionDeniedError

def require_roles(allowed_roles: List[str]):
    def dependency(user: User = Depends(get_current_user_from_request)):
        user_role_names = [role.name for role in user.roles]
        if not any(role in allowed_roles for role in user_role_names):
            raise PermissionDeniedError(f"Role in {allowed_roles} required")
        return user
    return dependency

# Helper import container
from app.api.deps import get_current_user as get_current_user_from_request
