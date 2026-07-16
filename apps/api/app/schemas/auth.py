from pydantic import BaseModel, EmailStr
from typing import List, Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    roles: List[str]

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization_id: str
    roles: List[str] = ["RESPONDER"]

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    roles: Optional[List[str]] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    organization_id: str
    is_active: bool
    roles: List[str]

    class Config:
        from_attributes = True
