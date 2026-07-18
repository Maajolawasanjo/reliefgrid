import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
try:
    from app.core.config import settings
except ImportError:
    from apps.api.app.core.config import settings

db_url = os.getenv("DATABASE_URL", settings.DATABASE_URL)
if ("postgresql://" in db_url or "postgres://" in db_url) and "cockroach" in db_url:
    db_url = db_url.replace("postgresql://", "cockroachdb://", 1).replace("postgres://", "cockroachdb://", 1)

if "sslmode=verify-full" in db_url:
    db_url = db_url.replace("sslmode=verify-full", "sslmode=require")

if "sqlite" in db_url:
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        db_url,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True
    )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
