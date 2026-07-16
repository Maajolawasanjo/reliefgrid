import pytest
from apps.api.app.core.security import get_password_hash, verify_password
from apps.api.app.core.jwt import create_access_token, create_refresh_token, decode_token

def test_argon2_password_hashing():
    raw_password = "SecureEmergencyPass123!"
    hashed = get_password_hash(raw_password)
    
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_issuance_and_decoding():
    user_id = "test-user-uuid-1234"
    org_id = "test-org-uuid-5678"
    
    access_token = create_access_token(data={"sub": user_id, "org": org_id})
    payload = decode_token(access_token)
    
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["org"] == org_id
    assert payload["type"] == "access"

def test_jwt_refresh_token_type():
    user_id = "test-user-uuid-1234"
    refresh_token = create_refresh_token(data={"sub": user_id})
    payload = decode_token(refresh_token)
    
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["type"] == "refresh"
