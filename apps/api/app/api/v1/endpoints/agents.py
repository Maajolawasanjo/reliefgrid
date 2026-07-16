from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from database.connection import get_db
from app.models.incident import Incident
from app.models.agent import AgentTaskPlan, AgentAssignment, Memory
from app.models.auth import User, AuditLog
from app.api.deps import get_current_user
from agents.coordinator.agent import coordinator_agent
from agents.contracts import AgentTask

router = APIRouter()


@router.post("/{incident_id}/analyze")
async def trigger_agent_orchestration(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Full multi-agent orchestration pipeline:
    1. Coordinator decomposes task into specialist mandates via Bedrock
    2. All 6 specialist agents execute concurrently
    3. Each agent fetches its own live data (GIS, weather, routing)
    4. All findings + memories persisted to CockroachDB
    5. Structured audit log created
    """
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.organization_id == current_user.organization_id,
    ).first()

    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident record not found")

    # ── 1. Pre-fetch shared context (weather + GIS) ─────────────────────────
    from app.services.weather import weather_service
    from app.services.gis import gis_service
    from app.services.embedding import embedding_service, cosine_similarity
    from app.models.memory import MemoryVector

    weather = weather_service.get_live_weather(incident.latitude, incident.longitude)
    hospitals = gis_service.fetch_osm_amenities(incident.latitude, incident.longitude, "hospital")
    shelters = gis_service.fetch_osm_amenities(incident.latitude, incident.longitude, "shelter")
    police = gis_service.fetch_osm_amenities(incident.latitude, incident.longitude, "police")
    fire_stations = gis_service.fetch_osm_amenities(incident.latitude, incident.longitude, "fire_station")

    closest_shelt_route = None
    if shelters.get("data"):
        closest_s = shelters["data"][0]
        closest_shelt_route = gis_service.calculate_route(
            incident.latitude, incident.longitude,
            closest_s["latitude"], closest_s["longitude"],
        )

    # ── 2. Fetch collective memory context ──────────────────────────────────
    try:
        inc_vec = embedding_service.generate_embedding(f"{incident.title} {incident.description}")
        m_vectors = db.query(MemoryVector).all()
        m_ids = [mv.memory_id for mv in m_vectors]
        m_records = db.query(Memory).filter(Memory.id.in_(m_ids)).all() if m_ids else []
        m_map = {m.id: m.content for m in m_records}
        scored = []
        for mv in m_vectors:
            score = cosine_similarity(inc_vec, mv.embedding.get("vec", []))
            content = m_map.get(mv.memory_id)
            if content:
                scored.append((score, content))
        scored.sort(key=lambda x: x[0], reverse=True)
        relevant_memories = [c for _, c in scored[:3]]
    except Exception:
        relevant_memories = []

    # ── 3. Build rich shared task context ───────────────────────────────────
    shared_context: Dict[str, Any] = {
        "incident_id": incident.id,
        "title": incident.title,
        "description": incident.description,
        "severity": incident.severity,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "affected_population": incident.affected_population or 0,
        "weather": weather,
        "nearby_hospitals": hospitals.get("data", []),
        "hospitals_source": hospitals.get("source", "simulated"),
        "nearby_shelters": shelters.get("data", []),
        "shelters_source": shelters.get("source", "simulated"),
        "nearby_police": police.get("data", []),
        "police_source": police.get("source", "simulated"),
        "nearby_fire_stations": fire_stations.get("data", []),
        "fire_source": fire_stations.get("source", "simulated"),
        "closest_shelter_route": closest_shelt_route,
        "collective_memory": relevant_memories,
        # Inject live DB session so memory-aware agents (e.g. ShelterAgent)
        # can query CockroachDB DECISION_RECORD memories directly.
        "_db_session": db,
        "organization_policies": (
            "Prioritize life-safety over property. Stage trauma units within 10km of "
            "high-density affected zones. Verify all routes before convoy dispatch."
        ),
    }


    coordinator_task = AgentTask(
        incident_id=incident.id,
        assigned_agent="CoordinatorAgent",
        instruction=f"Decompose incident '{incident.title}' into specialist operational mandates.",
        context=shared_context,
    )

    # ── 4. Coordinator decomposes task ───────────────────────────────────────
    coordinator_response = await coordinator_agent.execute_task(coordinator_task)
    plan_summary = coordinator_response.findings.get("plan_summary", "")
    specialist_tasks = coordinator_response.findings.get("specialist_tasks", {})

    # Persist coordinator's master plan
    db_plan = AgentTaskPlan(
        incident_id=incident.id,
        plan_summary=plan_summary,
        subtasks_json=specialist_tasks,
        status="EXECUTING",
    )
    db.add(db_plan)
    db.flush()  # get ID without committing

    # ── 5. Run all specialist agents concurrently ────────────────────────────
    specialist_results = await coordinator_agent.orchestrate_all_specialists(
        coordinator_task, coordinator_response
    )

    # ── 6. Persist all specialist findings ──────────────────────────────────
    assignments = []
    specialist_summaries: Dict[str, Any] = {}

    for agent_name, spec_response in specialist_results.items():
        instruction = specialist_tasks.get(agent_name, f"Execute {agent_name} domain tasks.")

        # Create DB assignment record
        assignment = AgentAssignment(
            incident_id=incident.id,
            task_plan_id=db_plan.id,
            agent_name=agent_name,
            instruction=instruction,
            status="SUCCESS",
            result_summary=spec_response.reasoning_summary,
            completed_at=datetime.utcnow(),
        )
        db.add(assignment)

        # Persist agent findings as a memory entry
        findings_content = (
            f"[{agent_name}] {spec_response.reasoning_summary}"
        )
        db.add(Memory(
            incident_id=incident.id,
            memory_type="SPECIALIST_FINDINGS",
            content=findings_content,
            metadata_json={
                "agent": agent_name,
                "confidence_score": spec_response.findings.get("confidence_score", 0),
                "execution_time_ms": spec_response.execution_time_ms,
                "data_provenance": spec_response.findings.get("data_provenance", ""),
            },
        ))

        assignments.append({
            "agent_name": agent_name,
            "instruction": instruction,
            "status": "SUCCESS",
            "summary": spec_response.reasoning_summary,
            "confidence_score": spec_response.findings.get("confidence_score", 0),
            "execution_time_ms": round(spec_response.execution_time_ms, 1),
            "findings": spec_response.findings,
        })

        specialist_summaries[agent_name] = {
            "summary": spec_response.reasoning_summary,
            "confidence": spec_response.findings.get("confidence_score", 0),
        }

    # Mark plan as completed
    db_plan.status = "COMPLETED"

    # Persist master memory + audit log
    db.add(Memory(
        incident_id=incident.id,
        memory_type="ACTION_PLAN",
        content=f"Master Incident Task Plan: {plan_summary}",
        metadata_json={
            "specialist_summaries": specialist_summaries,
            "coordinator_execution_ms": coordinator_response.execution_time_ms,
        },
    ))
    db.add(AuditLog(
        user_id=current_user.id,
        action="TRIGGER_AI_ORCHESTRATION",
        entity_name="Incident",
        entity_id=incident.id,
        details=f"Full multi-agent orchestration completed. {len(specialist_results)} specialists executed.",
    ))

    db.commit()
    db.refresh(db_plan)

    total_execution_ms = coordinator_response.execution_time_ms + sum(
        a["execution_time_ms"] for a in assignments
    )

    return {
        "incident_id": incident.id,
        "plan_id": db_plan.id,
        "plan_summary": plan_summary,
        "specialist_summaries": specialist_summaries,
        "assignments": assignments,
        "execution_time_ms": round(total_execution_ms, 1),
        "agents_executed": len(specialist_results),
        "data_sources": {
            "weather": weather.get("source"),
            "hospitals": hospitals.get("source"),
            "shelters": shelters.get("source"),
            "routing": closest_shelt_route.get("source") if closest_shelt_route else "none",
        },
    }


@router.get("/{incident_id}/agent-timeline")
def get_agent_timeline(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plans = (
        db.query(AgentTaskPlan)
        .filter(AgentTaskPlan.incident_id == incident_id)
        .order_by(AgentTaskPlan.created_at.desc())
        .all()
    )
    assignments = (
        db.query(AgentAssignment)
        .filter(AgentAssignment.incident_id == incident_id)
        .order_by(AgentAssignment.assigned_at.desc())
        .all()
    )
    memories = (
        db.query(Memory)
        .filter(Memory.incident_id == incident_id)
        .order_by(Memory.created_at.desc())
        .all()
    )

    return {
        "plans": [
            {
                "id": p.id,
                "plan_summary": p.plan_summary,
                "status": p.status,
                "specialist_tasks": p.subtasks_json,
                "created_at": p.created_at.isoformat(),
            }
            for p in plans
        ],
        "assignments": [
            {
                "id": a.id,
                "agent_name": a.agent_name,
                "instruction": a.instruction,
                "status": a.status,
                "result_summary": a.result_summary,
                "assigned_at": a.assigned_at.isoformat(),
                "completed_at": a.completed_at.isoformat() if a.completed_at else None,
            }
            for a in assignments
        ],
        "memories": [
            {
                "id": m.id,
                "memory_type": m.memory_type,
                "content": m.content[:300],
                "metadata": m.metadata_json,
                "created_at": m.created_at.isoformat(),
            }
            for m in memories
        ],
    }
