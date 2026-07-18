from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from database.connection import get_db
from app.models.auth import User, RefreshToken, AuditLog
from app.schemas.auth import LoginRequest, TokenResponse, RefreshTokenRequest, UserResponse
from app.core.security import verify_password
from app.core.jwt import create_access_token, create_refresh_token, decode_token
from app.api.deps import get_current_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/demo-token", response_model=TokenResponse)
def demo_token(db: Session = Depends(get_db)):
    """Public Instant Demo Endpoint: returns a valid signed JWT for admin@reliefgrid.gov."""
    user = db.query(User).filter(User.email == "admin@reliefgrid.gov").first()
    if not user:
        from app.models.auth import Organization
        from app.core.security import get_password_hash
        import uuid
        org = db.query(Organization).filter(Organization.slug == "nema-core").first()
        if not org:
            org = Organization(id=str(uuid.uuid4()), name="National Emergency Management Agency", slug="nema-core")
            db.add(org)
            db.commit()
            db.refresh(org)
        user = User(
            id=str(uuid.uuid4()),
            email="admin@reliefgrid.gov",
            hashed_password=get_password_hash("AdminPassword123!"),
            full_name="ReliefGrid System Administrator",
            organization_id=org.id
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.id, "org": user.organization_id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    roles_list = [r.name for r in user.roles] if hasattr(user, 'roles') and user.roles else ["ADMIN", "COORDINATOR"]

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        roles=roles_list
    )

@router.post("/login", response_model=TokenResponse)
def login(
    request: Request,
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.email == payload.email).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )

        access_token = create_access_token(data={"sub": user.id, "org": user.organization_id})
        refresh_token = create_refresh_token(data={"sub": user.id})

        from datetime import datetime, timedelta
        db_refresh = RefreshToken(
            token=refresh_token,
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        db.add(db_refresh)

        # Audit log
        try:
            db.add(AuditLog(user_id=user.id, action="USER_LOGIN", entity_name="User", entity_id=user.id))
            db.commit()
        except Exception as audit_err:
            print(f"⚠️ Audit log write warning: {audit_err}")
            db.rollback()

        roles_list = ["ADMIN"]
        try:
            if hasattr(user, 'roles') and user.roles:
                roles_list = [r.name for r in user.roles]
        except Exception:
            roles_list = ["ADMIN"]

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            roles=roles_list
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ LOGIN EXCEPTION: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Login Backend Error: {type(e).__name__} - {str(e)}"
        )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    token_record = db.query(RefreshToken).filter(
        RefreshToken.token == payload.refresh_token,
        RefreshToken.revoked == False
    ).first()

    if not token_record:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Revoked or invalid refresh token")

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")

    new_access_token = create_access_token(data={"sub": user.id, "org": user.organization_id})
    roles_list = [r.name for r in user.roles] if hasattr(user, 'roles') and user.roles else ["RESPONDER"]
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=payload.refresh_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        roles=roles_list
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    roles_list = [r.name for r in current_user.roles] if hasattr(current_user, 'roles') and current_user.roles else ["RESPONDER"]
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        organization_id=current_user.organization_id,
        is_active=current_user.is_active,
        roles=roles_list
    )

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    token_record = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if token_record:
        token_record.revoked = True
        db.commit()
    return None
