from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from apps.api.app.core.config import settings

db_url = settings.DATABASE_URL
if "sqlite" in db_url:
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    try:
        engine = create_engine(
            db_url,
            pool_size=settings.DATABASE_POOL_SIZE,
            max_overflow=settings.DATABASE_MAX_OVERFLOW,
            pool_pre_ping=True
        )
        # Test connection
        with engine.connect() as conn:
            pass
    except Exception:
        # Fallback to local SQLite for instant developer setup without CockroachDB dependency
        fallback_url = "sqlite:///./reliefgrid_dev.db"
        engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
