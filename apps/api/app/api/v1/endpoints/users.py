from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from app.models.auth import User, Role, Organization, AuditLog
from app.schemas.auth import UserCreate, UserUpdate, UserResponse
from app.core.security import get_password_hash
from app.api.deps import get_current_user
from app.core.rbac import require_roles

router = APIRouter()

@router.post("/", response_model=UserResponse, dependencies=[Depends(require_roles(["ADMIN"]))])
def create_user(payload: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    roles = db.query(Role).filter(Role.name.in_(payload.roles)).all()
    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        organization_id=payload.organization_id,
        roles=roles
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    db.add(AuditLog(user_id=current_user.id, action="CREATE_USER", entity_name="User", entity_id=user.id))
    db.commit()

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        organization_id=user.organization_id,
        is_active=user.is_active,
        roles=[r.name for r in user.roles]
    )

@router.get("/", response_model=List[UserResponse], dependencies=[Depends(require_roles(["ADMIN", "COORDINATOR"]))])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    return [
        UserResponse(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            organization_id=u.organization_id,
            is_active=u.is_active,
            roles=[r.name for r in u.roles]
        ) for u in users
    ]

@router.patch("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_roles(["ADMIN"]))])
def update_user(user_id: str, payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.full_name:
        user.full_name = payload.full_name
    if payload.email:
        user.email = payload.email
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.roles:
        roles = db.query(Role).filter(Role.name.in_(payload.roles)).all()
        user.roles = roles

    db.commit()
    db.refresh(user)
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        organization_id=user.organization_id,
        is_active=user.is_active,
        roles=[r.name for r in user.roles]
    )
