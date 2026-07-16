import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Float, Integer, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.connection import Base
from database.schemas.base import TimestampMixin
import enum

class SeverityLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class IncidentStatus(str, enum.Enum):
    REPORTED = "REPORTED"
    TRIAGED = "TRIAGED"
    ACTIVE = "ACTIVE"
    CONTAINED = "CONTAINED"
    RESOLVED = "RESOLVED"

class Incident(Base, TimestampMixin):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[SeverityLevel] = mapped_column(String(20), default=SeverityLevel.HIGH, nullable=False)
    status: Mapped[IncidentStatus] = mapped_column(String(20), default=IncidentStatus.REPORTED, nullable=False)
    
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    affected_population: Mapped[int] = mapped_column(Integer, default=0)
    
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False)
    reporter_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)

    timeline_events: Mapped[List["IncidentTimeline"]] = relationship("IncidentTimeline", back_populates="incident", cascade="all, delete-orphan", order_by="IncidentTimeline.created_at.desc()")
    attachments: Mapped[List["IncidentAttachment"]] = relationship("IncidentAttachment", back_populates="incident", cascade="all, delete-orphan")

class IncidentTimeline(Base):
    __tablename__ = "incident_timeline"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id: Mapped[str] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. STATUS_CHANGE, DISPATCH, AGENT_ACTION
    description: Mapped[str] = mapped_column(Text, nullable=False)
    actor_id: Mapped[str] = mapped_column(String(36), nullable=False) # User ID or Agent Name
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    incident: Mapped["Incident"] = relationship("Incident", back_populates="timeline_events")

class IncidentAttachment(Base):
    __tablename__ = "incident_attachments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id: Mapped[str] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(512), nullable=False)
    s3_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    incident: Mapped["Incident"] = relationship("Incident", back_populates="attachments")
