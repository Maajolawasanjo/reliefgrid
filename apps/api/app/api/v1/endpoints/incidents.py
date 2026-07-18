from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database.connection import get_db
from app.models.incident import Incident, IncidentTimeline, SeverityLevel, IncidentStatus
from app.models.auth import User, AuditLog
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse, IncidentListResponse, TimelineCreate, TimelineResponse
from app.api.deps import get_current_user
from app.core.rbac import require_roles

router = APIRouter()

@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = Incident(
        title=payload.title,
        description=payload.description,
        severity=payload.severity,
        status=IncidentStatus.REPORTED,
        latitude=payload.latitude,
        longitude=payload.longitude,
        affected_population=payload.affected_population,
        organization_id=current_user.organization_id,
        reporter_id=current_user.id
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Initial timeline entry
    initial_event = IncidentTimeline(
        incident_id=incident.id,
        event_type="INCIDENT_REPORTED",
        description=f"Incident initial report filed by {current_user.full_name}",
        actor_id=current_user.id
    )
    db.add(initial_event)
    db.add(AuditLog(user_id=current_user.id, action="CREATE_INCIDENT", entity_name="Incident", entity_id=incident.id))
    db.commit()
    db.refresh(incident)

    return incident

@router.get("/", response_model=IncidentListResponse)
def list_incidents(
    severity: Optional[SeverityLevel] = Query(None),
    status_filter: Optional[IncidentStatus] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Incident).filter(Incident.organization_id == current_user.organization_id)

    if severity:
        query = query.filter(Incident.severity == severity)
    if status_filter:
        query = query.filter(Incident.status == status_filter)
    if search:
        query = query.filter(Incident.title.ilike(f"%{search}%") | Incident.description.ilike(f"%{search}%"))

    total = query.count()
    items = query.order_by(Incident.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return IncidentListResponse(total=total, items=items)

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident_detail(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.organization_id == current_user.organization_id
    ).first()

    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident record not found")

    return incident

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: str,
    payload: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.organization_id == current_user.organization_id
    ).first()

    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident record not found")

    if payload.title:
        incident.title = payload.title
    if payload.description:
        incident.description = payload.description
    if payload.severity:
        incident.severity = payload.severity
    if payload.affected_population is not None:
        incident.affected_population = payload.affected_population
    
    if payload.status and payload.status != incident.status:
        old_status = incident.status
        incident.status = payload.status
        db.add(IncidentTimeline(
            incident_id=incident.id,
            event_type="STATUS_CHANGED",
            description=f"Status updated from {old_status.value} to {payload.status.value}",
            actor_id=current_user.id
        ))

    db.commit()
    db.refresh(incident)
    return incident

@router.post("/{incident_id}/timeline", response_model=TimelineResponse)
def add_timeline_event(
    incident_id: str,
    payload: TimelineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.organization_id == current_user.organization_id
    ).first()

    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident record not found")

    timeline_event = IncidentTimeline(
        incident_id=incident.id,
        event_type=payload.event_type,
        description=payload.description,
        actor_id=current_user.id
    )
    db.add(timeline_event)
    db.commit()
    db.refresh(timeline_event)
    return timeline_event

@router.delete("/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.organization_id == current_user.organization_id
    ).first()

    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident record not found")

    # Delete dependent timelines and tasks
    db.query(IncidentTimeline).filter(IncidentTimeline.incident_id == incident_id).delete()
    db.delete(incident)
    db.commit()
    return None

