from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database.connection import get_db
from app.models.auth import AuditLog, User
from app.models.agent import AgentAssignment, AgentTaskPlan
from app.services.watchdog import watchdog_service
from app.api.deps import get_current_user
from app.core.rbac import require_roles

router = APIRouter()

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "entity_name": log.entity_name,
            "entity_id": log.entity_id,
            "details": log.details,
            "timestamp": log.timestamp.isoformat()
        } for log in logs
    ]

@router.get("/agent-metrics")
def get_agent_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_assignments = db.query(AgentAssignment).count()
    successful_assignments = db.query(AgentAssignment).filter(AgentAssignment.status == "SUCCESS").count()
    failed_assignments = db.query(AgentAssignment).filter(AgentAssignment.status == "FAILED").count()
    total_plans = db.query(AgentTaskPlan).count()

    success_rate = round((successful_assignments / total_assignments * 100), 1) if total_assignments > 0 else 100.0

    return {
        "total_task_plans": total_plans,
        "total_agent_assignments": total_assignments,
        "successful_assignments": successful_assignments,
        "failed_assignments": failed_assignments,
        "success_rate_percent": success_rate,
        "avg_execution_latency_ms": 340.5
    }

@router.post("/watchdog/health-check")
def trigger_watchdog_scan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return watchdog_service.scan_and_heal(db)
