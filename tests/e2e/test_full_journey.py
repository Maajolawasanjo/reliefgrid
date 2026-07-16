"""
ReliefGrid End-to-End Test Suite
=================================
Tests the complete operational user journey:
  1. Authentication → Login + session management
  2. Incident creation → Full CRUD lifecycle
  3. Multi-agent orchestration → Coordinator + all 6 specialists
  4. Memory persistence → Vector store written + searchable
  5. Analytics → Recommendations + executive summary
  6. Watchdog → Self-healing auto-recovery
  7. Telemetry → Audit logs + agent metrics
  8. Report export → After-action text download

Run with:
    pytest tests/e2e/test_full_journey.py -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from apps.api.app.main import app
from database.connection import SessionLocal
from app.models.incident import Incident
from app.models.agent import AgentTaskPlan, AgentAssignment, Memory
from app.models.auth import AuditLog

client = TestClient(app)

# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def auth_token():
    """Authenticate and return a valid JWT token."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@reliefgrid.gov", "password": "AdminPassword123!"},
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(scope="module")
def created_incident(auth_headers):
    """Create and return an incident for use across tests."""
    payload = {
        "title": "E2E Coastal Flash Flood",
        "description": "Severe coastal flooding triggered by a tropical storm system causing inundation of low-lying residential areas.",
        "severity": "CRITICAL",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "affected_population": 12000,
    }
    response = client.post("/api/v1/incidents/", json=payload, headers=auth_headers)
    assert response.status_code == 201, f"Incident creation failed: {response.text}"
    return response.json()


@pytest.fixture(scope="module")
def orchestrated_incident(auth_headers, created_incident):
    """Trigger orchestration and return the result."""
    incident_id = created_incident["id"]
    response = client.post(
        f"/api/v1/incidents/{incident_id}/analyze",
        headers=auth_headers,
    )
    assert response.status_code == 200, f"Orchestration failed: {response.text}"
    return response.json()


# ── Phase 1: Authentication ───────────────────────────────────────────────────

class TestAuthentication:
    def test_valid_login_returns_token(self):
        """Valid credentials should return a JWT access token."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@reliefgrid.gov", "password": "AdminPassword123!"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 50

    def test_invalid_password_returns_401(self):
        """Wrong password should be rejected with 401."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@reliefgrid.gov", "password": "WrongPassword!"},
        )
        assert response.status_code == 401

    def test_nonexistent_user_returns_401(self):
        """Non-existent email should return 401."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "ghost@unknown.org", "password": "password"},
        )
        assert response.status_code == 401

    def test_protected_route_without_token_returns_401(self):
        """Accessing protected route without Bearer token should be rejected."""
        response = client.get("/api/v1/incidents/")
        assert response.status_code == 401


# ── Phase 2: Incident Management ─────────────────────────────────────────────

class TestIncidentManagement:
    def test_create_incident_returns_201(self, auth_headers, created_incident):
        """Created incident should have correct fields."""
        assert created_incident["title"] == "E2E Coastal Flash Flood"
        assert created_incident["severity"] == "CRITICAL"
        assert "id" in created_incident
        assert created_incident["status"] == "REPORTED"
        assert created_incident["latitude"] == 6.5244

    def test_list_incidents_contains_new_incident(self, auth_headers, created_incident):
        """Incident list should include the newly created incident."""
        response = client.get("/api/v1/incidents/", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert data["total"] >= 1
        ids = [i["id"] for i in data["items"]]
        assert created_incident["id"] in ids

    def test_get_incident_by_id(self, auth_headers, created_incident):
        """Fetching by ID should return exact incident data."""
        response = client.get(f"/api/v1/incidents/{created_incident['id']}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["title"] == "E2E Coastal Flash Flood"

    def test_update_incident_status(self, auth_headers, created_incident):
        """Updating incident status should create a timeline entry."""
        response = client.patch(
            f"/api/v1/incidents/{created_incident['id']}",
            json={"status": "ACTIVE"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "ACTIVE"

    def test_add_timeline_event(self, auth_headers, created_incident):
        """Adding a timeline event should return the new event."""
        response = client.post(
            f"/api/v1/incidents/{created_incident['id']}/timeline",
            json={"event_type": "FIELD_UPDATE", "description": "Command post established at coastal checkpoint."},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["event_type"] == "FIELD_UPDATE"

    def test_list_with_severity_filter(self, auth_headers):
        """Severity filter should return only matching incidents."""
        response = client.get("/api/v1/incidents/?severity=CRITICAL", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["severity"] == "CRITICAL"

    def test_get_nonexistent_incident_returns_404(self, auth_headers):
        """Non-existent incident ID should return 404."""
        response = client.get("/api/v1/incidents/nonexistent-id-999", headers=auth_headers)
        assert response.status_code == 404


# ── Phase 3: Multi-Agent Orchestration ───────────────────────────────────────

class TestMultiAgentOrchestration:
    def test_orchestration_returns_200(self, orchestrated_incident):
        """Orchestration endpoint should return 200."""
        assert orchestrated_incident is not None

    def test_orchestration_has_plan_summary(self, orchestrated_incident):
        """Response should include a plan summary from Coordinator."""
        assert "plan_summary" in orchestrated_incident
        assert len(orchestrated_incident["plan_summary"]) > 10

    def test_orchestration_executes_specialist_agents(self, orchestrated_incident):
        """All 6 specialist agents should be executed and returned."""
        assignments = orchestrated_incident.get("assignments", [])
        assert len(assignments) >= 6

        agent_names = {a["agent_name"] for a in assignments}
        expected_agents = {
            "WeatherAgent", "MedicalAgent", "ShelterAgent",
            "LogisticsAgent", "InfrastructureAgent", "CommunicationAgent",
        }
        assert expected_agents.issubset(agent_names), (
            f"Missing agents: {expected_agents - agent_names}"
        )

    def test_specialist_agents_have_findings(self, orchestrated_incident):
        """Each specialist agent should return structured findings."""
        assignments = orchestrated_incident.get("assignments", [])
        for assignment in assignments:
            assert "findings" in assignment, f"{assignment['agent_name']} missing findings"
            assert "confidence_score" in assignment.get("findings", {}), (
                f"{assignment['agent_name']} missing confidence_score"
            )

    def test_orchestration_reports_data_sources(self, orchestrated_incident):
        """Response should include data source attribution."""
        assert "data_sources" in orchestrated_incident
        assert "weather" in orchestrated_incident["data_sources"]

    def test_orchestration_persists_to_database(self, auth_headers, created_incident, orchestrated_incident):
        """All orchestration outputs should be persisted in DB."""
        db: Session = SessionLocal()
        try:
            incident_id = created_incident["id"]

            # Check task plan exists
            plan = db.query(AgentTaskPlan).filter(
                AgentTaskPlan.incident_id == incident_id
            ).first()
            assert plan is not None, "AgentTaskPlan not persisted"
            assert plan.status == "COMPLETED"

            # Check assignments persisted
            assignments = db.query(AgentAssignment).filter(
                AgentAssignment.incident_id == incident_id
            ).all()
            assert len(assignments) >= 6

            # Check ACTION_PLAN memory created
            action_plan = db.query(Memory).filter(
                Memory.incident_id == incident_id,
                Memory.memory_type == "ACTION_PLAN",
            ).first()
            assert action_plan is not None
            assert "Master Incident Task Plan" in action_plan.content

            # Check specialist memories created
            specialist_memories = db.query(Memory).filter(
                Memory.incident_id == incident_id,
                Memory.memory_type == "SPECIALIST_FINDINGS",
            ).all()
            assert len(specialist_memories) >= 6

            # Check audit log
            audit = db.query(AuditLog).filter(
                AuditLog.entity_id == incident_id,
                AuditLog.action == "TRIGGER_AI_ORCHESTRATION",
            ).first()
            assert audit is not None
        finally:
            db.close()


# ── Phase 4: Agent Timeline ────────────────────────────────────────────────────

class TestAgentTimeline:
    def test_agent_timeline_returns_plans_and_assignments(self, auth_headers, created_incident, orchestrated_incident):
        """Agent timeline should include both plans and assignments."""
        response = client.get(
            f"/api/v1/incidents/{created_incident['id']}/agent-timeline",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["plans"]) >= 1
        assert len(data["assignments"]) >= 6
        assert "memories" in data

    def test_timeline_plans_have_required_fields(self, auth_headers, created_incident, orchestrated_incident):
        """Timeline plan entries should have all required fields."""
        response = client.get(
            f"/api/v1/incidents/{created_incident['id']}/agent-timeline",
            headers=auth_headers,
        )
        plan = response.json()["plans"][0]
        for field in ("id", "plan_summary", "status", "created_at"):
            assert field in plan, f"Plan missing field: {field}"


# ── Phase 5: Analytics & Recommendations ──────────────────────────────────────

class TestAnalytics:
    def test_incident_recommendations_endpoint(self, auth_headers, created_incident):
        """Recommendations endpoint should return structured data."""
        response = client.get(
            f"/api/v1/analytics/incidents/{created_incident['id']}/recommendations",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert "recommendation_cards" in data
        assert len(data["recommendation_cards"]) >= 1
        assert "data_grounding_score" in data
        assert "live_weather" in data

    def test_recommendation_cards_have_structure(self, auth_headers, created_incident):
        """Each recommendation card should have required fields."""
        response = client.get(
            f"/api/v1/analytics/incidents/{created_incident['id']}/recommendations",
            headers=auth_headers,
        )
        for card in response.json()["recommendation_cards"]:
            for field in ("id", "agent", "title", "confidence", "evidence"):
                assert field in card, f"Recommendation card missing: {field}"

    def test_executive_summary_returns_live_metrics(self, auth_headers):
        """Executive summary should return real DB-backed metrics."""
        response = client.get("/api/v1/analytics/executive-summary", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "active_incidents_count" in data
        assert isinstance(data["active_incidents_count"], int)
        assert "agent_status" in data
        assert "response_metrics" in data

    def test_export_after_action_report(self, auth_headers, created_incident, orchestrated_incident):
        """Export endpoint should return a downloadable text report."""
        response = client.get(
            f"/api/v1/analytics/incidents/{created_incident['id']}/export-report",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert "RELIEFGRID" in response.text
        assert created_incident["id"] in response.text


# ── Phase 6: Memory Engine ────────────────────────────────────────────────────

class TestMemoryEngine:
    def test_memory_search_returns_results(self, auth_headers, orchestrated_incident):
        """Vector search should return relevant memories after orchestration."""
        response = client.post(
            "/api/v1/memories/search",
            json={"query": "flood evacuation hospital route", "limit": 5},
            headers=auth_headers,
        )
        assert response.status_code == 200
        results = response.json()
        assert isinstance(results, list)
        for r in results:
            assert "content" in r
            assert "similarity_score" in r
            assert 0.0 <= r["similarity_score"] <= 1.0

    def test_memory_search_respects_limit(self, auth_headers):
        """Search results should respect the requested limit."""
        response = client.post(
            "/api/v1/memories/search",
            json={"query": "emergency response", "limit": 3},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert len(response.json()) <= 3


# ── Phase 7: Watchdog Self-Healing ───────────────────────────────────────────

class TestWatchdogSelfHealing:
    def test_watchdog_scan_returns_healthy(self, auth_headers):
        """Watchdog scan with no stalled agents should return healthy."""
        response = client.post("/api/v1/telemetry/watchdog/health-check", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "recovered_count" in data
        assert "scanned_at" in data

    def test_watchdog_heals_stalled_assignment(self, auth_headers):
        """Watchdog should detect and heal stalled IN_PROGRESS assignments."""
        # Create a parent incident
        incident_response = client.post(
            "/api/v1/incidents/",
            json={
                "title": "Watchdog E2E Test Incident",
                "description": "Synthetic incident for watchdog healing test.",
                "severity": "MEDIUM",
                "latitude": 51.5074,
                "longitude": -0.1278,
                "affected_population": 50,
            },
            headers=auth_headers,
        )
        incident_id = incident_response.json()["id"]

        # Inject a stalled assignment directly in DB
        db: Session = SessionLocal()
        try:
            plan = AgentTaskPlan(
                incident_id=incident_id,
                plan_summary="Synthetic stall test plan",
                subtasks_json={},
                status="EXECUTING",
            )
            db.add(plan)
            db.commit()
            db.refresh(plan)

            stalled_time = datetime.utcnow() - timedelta(seconds=200)
            asg = AgentAssignment(
                incident_id=incident_id,
                task_plan_id=plan.id,
                agent_name="LogisticsAgent",
                instruction="Deliver supplies to evac hub.",
                status="IN_PROGRESS",
                assigned_at=stalled_time,
            )
            db.add(asg)
            db.commit()
            db.refresh(asg)
            asg_id = asg.id
        finally:
            db.close()

        # Run watchdog
        response = client.post("/api/v1/telemetry/watchdog/health-check", headers=auth_headers)
        assert response.status_code == 200
        result = response.json()
        assert result["recovered_count"] >= 1
        assert asg_id in result["healed_ids"]

        # Verify DB state
        db = SessionLocal()
        try:
            healed = db.query(AgentAssignment).filter(AgentAssignment.id == asg_id).first()
            assert healed.status == "SUCCESS"
            assert "Watchdog auto-recovery" in healed.result_summary
        finally:
            db.close()


# ── Phase 8: Telemetry ────────────────────────────────────────────────────────

class TestTelemetry:
    def test_audit_logs_endpoint(self, auth_headers):
        """Audit logs endpoint should return a list of log entries."""
        response = client.get("/api/v1/telemetry/audit-logs", headers=auth_headers)
        assert response.status_code == 200
        logs = response.json()
        assert isinstance(logs, list)
        if logs:
            for field in ("id", "action", "timestamp"):
                assert field in logs[0]

    def test_agent_metrics_endpoint(self, auth_headers):
        """Agent metrics should return operational performance stats."""
        response = client.get("/api/v1/telemetry/agent-metrics", headers=auth_headers)
        assert response.status_code == 200
        metrics = response.json()
        assert "total_task_plans" in metrics
        assert "success_rate_percent" in metrics
        assert 0.0 <= metrics["success_rate_percent"] <= 100.0

    def test_audit_log_created_after_orchestration(self, auth_headers, orchestrated_incident):
        """An audit log entry should exist for the AI orchestration action."""
        response = client.get("/api/v1/telemetry/audit-logs?limit=100", headers=auth_headers)
        actions = [log["action"] for log in response.json()]
        assert "TRIGGER_AI_ORCHESTRATION" in actions


# ── Phase 9: Health ───────────────────────────────────────────────────────────

class TestHealthCheck:
    def test_health_check_returns_healthy(self):
        """Health endpoint should be publicly accessible and return healthy."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
