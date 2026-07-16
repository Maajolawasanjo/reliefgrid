from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.models.incident import SeverityLevel, IncidentStatus

class TimelineCreate(BaseModel):
    event_type: str = "STATUS_UPDATE"
    description: str

class TimelineResponse(BaseModel):
    id: str
    incident_id: str
    event_type: str
    description: str
    actor_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str
    severity: SeverityLevel = SeverityLevel.HIGH
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    affected_population: int = Field(default=0, ge=0)

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    status: Optional[IncidentStatus] = None
    affected_population: Optional[int] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    severity: SeverityLevel
    status: IncidentStatus
    latitude: float
    longitude: float
    affected_population: int
    organization_id: str
    reporter_id: str
    created_at: datetime
    updated_at: datetime
    timeline_events: List[TimelineResponse] = []

    class Config:
        from_attributes = True

class IncidentListResponse(BaseModel):
    total: int
    items: List[IncidentResponse]
