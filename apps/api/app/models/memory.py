import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, DateTime, Float, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.connection import Base
from database.schemas.base import TimestampMixin

class MemoryVector(Base):
    __tablename__ = "memory_vectors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memory_id: Mapped[str] = mapped_column(String(36), ForeignKey("memories.id", ondelete="CASCADE"), nullable=False)
    dimension: Mapped[int] = mapped_column(Integer, default=1024, nullable=False)
    embedding: Mapped[dict] = mapped_column(JSON, nullable=False) # Stores float vector array [0.012, -0.441, ...]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
