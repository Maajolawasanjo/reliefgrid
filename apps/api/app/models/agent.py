import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, DateTime, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.connection import Base
from database.schemas.base import TimestampMixin

class Memory(Base, TimestampMixin):
    __tablename__ = "memories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=True)
    memory_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. SITUATION_REPORT, LESSON_LEARNED, ACTION_PLAN
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class AgentTaskPlan(Base):
    __tablename__ = "agent_task_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id: Mapped[str] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    plan_summary: Mapped[str] = mapped_column(Text, nullable=False)
    subtasks_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="GENERATED", nullable=False) # GENERATED, EXECUTING, COMPLETED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class AgentAssignment(Base):
    __tablename__ = "agent_assignments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id: Mapped[str] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    task_plan_id: Mapped[str] = mapped_column(String(36), ForeignKey("agent_task_plans.id", ondelete="CASCADE"), nullable=False)
    agent_name: Mapped[str] = mapped_column(String(50), nullable=False) # WeatherAgent, MedicalAgent, etc.
    instruction: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="DISPATCHED", nullable=False) # DISPATCHED, IN_PROGRESS, SUCCESS, FAILED
    result_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
