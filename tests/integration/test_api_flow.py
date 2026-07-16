import pytest
from fastapi.testclient import TestClient
from apps.api.app.main import app
from database.connection import SessionLocal
from app.models.incident import Incident
from app.models.agent import AgentAssignment, Memory
from app.models.auth import AuditLog
from app.services.watchdog import watchdog_service

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data

def test_invalid_login_returns_401():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@reliefgrid.gov", "password": "BadPassword123!"}
    )
    assert response.status_code == 401
    res_data = response.json()
    assert "error" in res_data or "detail" in res_data


def test_full_incident_and_agent_flow():
    # 1. Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@reliefgrid.gov", "password": "AdminPassword123!"}
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    token = login_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Incident
    incident_payload = {
        "title": "Storm Surge Inundation",
        "description": "High tide storm surge causing severe flooding near the coast.",
        "severity": "HIGH",
        "latitude": 25.7617,
        "longitude": -80.1918,
        "affected_population": 5000
    }
    
    create_response = client.post(
        "/api/v1/incidents/",
        json=incident_payload,
        headers=headers
    )
    assert create_response.status_code == 201
    incident_data = create_response.json()
    incident_id = incident_data["id"]
    assert incident_data["title"] == "Storm Surge Inundation"
    
    # 3. Analyze Incident with Coordinator Agent
    analyze_response = client.post(
        f"/api/v1/incidents/{incident_id}/analyze",
        headers=headers
    )
    assert analyze_response.status_code == 200
    analyze_data = analyze_response.json()
    assert analyze_data["incident_id"] == incident_id
    assert "plan_id" in analyze_data
    assert "plan_summary" in analyze_data
    assert len(analyze_data["assignments"]) > 0
    
    # Check that it assigned tasks to specialist agents
    agents_assigned = [a["agent_name"] for a in analyze_data["assignments"]]
    assert "WeatherAgent" in agents_assigned
    assert "InfrastructureAgent" in agents_assigned
    
    # 4. Get Agent Timeline
    timeline_response = client.get(
        f"/api/v1/incidents/{incident_id}/agent-timeline",
        headers=headers
    )
    assert timeline_response.status_code == 200
    timeline_data = timeline_response.json()
    assert len(timeline_data["plans"]) > 0
    assert len(timeline_data["assignments"]) > 0
    
    # 5. Verify database matches
    db = SessionLocal()
    try:
        db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
        assert db_incident is not None
        assert db_incident.title == "Storm Surge Inundation"
        
        # Verify action plan memory exists
        db_memory = db.query(Memory).filter(
            Memory.incident_id == incident_id,
            Memory.memory_type == "ACTION_PLAN"
        ).first()
        assert db_memory is not None
        assert "Master Incident Task Plan" in db_memory.content
        
        # Verify audit log exists
        db_audit = db.query(AuditLog).filter(
            AuditLog.entity_id == incident_id,
            AuditLog.action == "TRIGGER_AI_ORCHESTRATION"
        ).first()
        assert db_audit is not None
    finally:
        db.close()

def test_watchdog_auto_healing_via_endpoint():
    # Login to get authorization
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@reliefgrid.gov", "password": "AdminPassword123!"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Incident
    create_response = client.post(
        "/api/v1/incidents/",
        json={
            "title": "Stalled Agent Incident",
            "description": "Incident for testing self-healing watchdog.",
            "severity": "MEDIUM",
            "latitude": 34.0522,
            "longitude": -118.2437,
            "affected_population": 100
        },
        headers=headers
    )
    incident_id = create_response.json()["id"]
    
    # Insert a stalled assignment in database
    db = SessionLocal()
    from datetime import datetime, timedelta
    from app.models.agent import AgentTaskPlan
    
    # Create the parent plan first
    plan = AgentTaskPlan(
        incident_id=incident_id,
        plan_summary="Simulation plan summary",
        subtasks_json={},
        status="COMPLETED"
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    
    # Backdate assignment so watchdog detects it as stalled (> 120 seconds old)
    stalled_time = datetime.utcnow() - timedelta(seconds=150)
    
    asg = AgentAssignment(
        incident_id=incident_id,
        task_plan_id=plan.id,
        agent_name="LogisticsAgent",
        instruction="Deliver medicine kits to location.",
        status="IN_PROGRESS",
        assigned_at=stalled_time
    )
    db.add(asg)
    db.commit()
    db.refresh(asg)
    asg_id = asg.id
    db.close()
    
    # Trigger watchdog scan endpoint
    scan_response = client.post(
        "/api/v1/telemetry/watchdog/health-check",
        headers=headers
    )
    assert scan_response.status_code == 200
    result = scan_response.json()
    assert result["recovered_count"] >= 1
    assert asg_id in result["healed_ids"]
    
    # Verify status in database is now SUCCESS
    db = SessionLocal()
    healed_asg = db.query(AgentAssignment).filter(AgentAssignment.id == asg_id).first()
    assert healed_asg.status == "SUCCESS"
    assert "Watchdog auto-recovery" in healed_asg.result_summary
    db.close()

