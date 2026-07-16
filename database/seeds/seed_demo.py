"""
ReliefGrid Demo Seed Script
============================
Seeds the exact data needed for the 3-minute demo video.

What this creates:
  1. Prior "Lagos March Flood" incident (RESOLVED) — the historical event
  2. 7 memory types across multiple incidents — for Memory Explorer breadth shot
  3. THE KEY SCENE: Decision Memory recording that Ikeja Community Centre (Shelter B)
     was rejected because its access road (Oba Akran Avenue) flooded during the
     March incident — ShelterAgent now recalls this and recommends Agege Stadium instead
  4. A pre-built stalled agent assignment for watchdog recovery demo
  5. The live "Lekki Flash Flood" incident (ACTIVE) — the incident created on camera

Run from project root:
    cd /home/exploitx/Documents/MA'AJO
    source .venv/bin/activate
    cd apps/api
    python -m database.seeds.seed_demo

Or:
    PYTHONPATH=/home/exploitx/Documents/MA'AJO/apps/api python database/seeds/seed_demo.py
"""

import os
import sys
import uuid
from datetime import datetime, timedelta

# ── Path setup ─────────────────────────────────────────────────────────────────
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API_ROOT = os.path.join(REPO_ROOT, "apps", "api")
sys.path.insert(0, REPO_ROOT)
sys.path.insert(0, API_ROOT)

from sqlalchemy.orm import Session
from database.connection import SessionLocal
from app.models.auth import Organization, User, Role
from app.models.incident import Incident, IncidentTimeline, IncidentStatus, SeverityLevel
from app.models.agent import Memory, AgentTaskPlan, AgentAssignment
from app.models.memory import MemoryVector
from app.services.embedding import embedding_service


# ── Constants ──────────────────────────────────────────────────────────────────

# The shelter that FAILED (will be recalled and avoided in demo)
REJECTED_SHELTER = "Ikeja Community Centre (Shelter B)"
REJECTED_ROAD = "Oba Akran Avenue underpass"

# The shelter that WORKED (will be recommended because of the memory)
PREFERRED_SHELTER = "Agege Stadium Evacuation Hub (Shelter C)"

# Lagos locations for authenticity
LAGOS_ISLAND_LAT = 6.4531
LAGOS_ISLAND_LON = 3.3958
LEKKI_LAT = 6.4698
LEKKI_LON = 3.5852

print("\n" + "="*70)
print("  ReliefGrid Demo Seed Script")
print("  Building guaranteed demo data for 3-minute video")
print("="*70 + "\n")


def embed(text: str) -> list:
    """Generate embedding vector for memory content."""
    return embedding_service.generate_embedding(text)


def add_memory_with_vector(
    db: Session,
    memory_type: str,
    content: str,
    metadata: dict,
    incident_id: str = None,
) -> Memory:
    """Create a Memory record + MemoryVector record."""
    mem = Memory(
        id=str(uuid.uuid4()),
        incident_id=incident_id,
        memory_type=memory_type,
        content=content,
        metadata_json=metadata,
    )
    db.add(mem)
    db.flush()

    vector = embed(content)
    mv = MemoryVector(
        id=str(uuid.uuid4()),
        memory_id=mem.id,
        dimension=len(vector),
        embedding={"vec": vector},
    )
    db.add(mv)
    db.flush()
    return mem


def seed_demo():
    db: Session = SessionLocal()
    try:
        # ── Get organization and admin user ────────────────────────────────────
        org = db.query(Organization).filter(Organization.slug == "nema-core").first()
        if not org:
            print("ERROR: Run seed_auth.py first to create the NEMA-Core organisation.")
            return

        admin = db.query(User).filter(User.email == "admin@reliefgrid.gov").first()
        if not admin:
            print("ERROR: Run seed_auth.py first to create the admin user.")
            return

        # ── Guard: skip if already seeded ─────────────────────────────────────
        existing = db.query(Memory).filter(Memory.memory_type == "DECISION_RECORD").count()
        if existing > 0:
            print(f"Demo data already seeded ({existing} DECISION_RECORD entries found).")
            print("To re-seed, delete DECISION_RECORD memories from the database first.")
            return

        print("Step 1/5 — Creating prior 'Lagos March Coastal Flood' incident (RESOLVED)...")

        # ── 1. Prior historical incident (March, RESOLVED) ────────────────────
        march_incident = Incident(
            id=str(uuid.uuid4()),
            title="Lagos Island Coastal Surge — March Flood",
            description=(
                "A severe tidal surge coinciding with spring tide caused widespread flooding across Lagos Island. "
                "Storm drains overflowed and multiple access roads were submerged. "
                "Over 18,000 residents required evacuation within 4 hours."
            ),
            severity="CRITICAL",
            status="RESOLVED",
            latitude=LAGOS_ISLAND_LAT,
            longitude=LAGOS_ISLAND_LON,
            affected_population=18000,
            organization_id=org.id,
            reporter_id=admin.id,
        )
        # Backdate to 3 months ago
        march_date = datetime.utcnow() - timedelta(days=94)
        db.add(march_incident)
        db.flush()

        # Timeline for the prior incident (creates audit trail visible in demo)
        timeline_events = [
            ("INCIDENT_REPORTED", "Initial flood alert raised by Lagos State Emergency Management Agency.", "SYS-AUTO"),
            ("AGENT_DISPATCH", "CoordinatorAgent decomposed incident into 6 specialist mandates.", "CoordinatorAgent"),
            ("FIELD_UPDATE", f"{REJECTED_SHELTER}: Selected as primary evacuation hub, 1,200 capacity.", "ShelterAgent"),
            ("FIELD_UPDATE", f"CRITICAL: {REJECTED_ROAD} confirmed submerged. {REJECTED_SHELTER} inaccessible by road.", "InfrastructureAgent"),
            ("DECISION_RECORD", f"ShelterAgent revised recommendation: {REJECTED_SHELTER} rejected. Rerouting evacuees to {PREFERRED_SHELTER}.", "ShelterAgent"),
            ("FIELD_UPDATE", f"{PREFERRED_SHELTER} opened. 847 civilians sheltered successfully. Access via Agege Motor Road confirmed clear.", "ShelterAgent"),
            ("STATUS_CHANGED", "Incident contained. All evacuees accounted for. Waters receding.", "CoordinatorAgent"),
            ("INCIDENT_RESOLVED", "After-action review completed. 12 lessons learned captured to collective memory.", "ReliefGrid-AAR"),
        ]
        for evt_type, desc, actor in timeline_events:
            db.add(IncidentTimeline(
                incident_id=march_incident.id,
                event_type=evt_type,
                description=desc,
                actor_id=actor,
            ))
        db.flush()
        print(f"   ✓ Prior incident created: {march_incident.id[:8]}...")

        # ── 2. Seed AgentTaskPlan + assignments for prior incident ─────────────
        print("Step 2/5 — Seeding agent task plans from prior incident...")

        prior_plan = AgentTaskPlan(
            id=str(uuid.uuid4()),
            incident_id=march_incident.id,
            plan_summary=(
                "Autonomous Master Plan: CRITICAL coastal surge. Deploy medical triage to 3 hospitals, "
                f"activate {PREFERRED_SHELTER} as primary hub (overriding initial {REJECTED_SHELTER} selection "
                "due to access road submersion), convoy all supply routes via elevated Apapa-Oshodi Expressway bypass."
            ),
            subtasks_json={
                "WeatherAgent": "Monitor tidal surge predictions every 30 mins. Alert when surge exceeds 2.5m.",
                "MedicalAgent": "Pre-alert Lagos Island General Hospital and LASUTH. Stage 4 ambulances at Eko Bridge.",
                "ShelterAgent": f"Activate {PREFERRED_SHELTER} (Shelter C). Capacity 1,800. Discard Shelter B (road flooded).",
                "LogisticsAgent": "Deploy 6 heavy trucks via Agege Motor Road only. Avoid all low-lying routes.",
                "InfrastructureAgent": f"Confirm {REJECTED_ROAD} submerged. Alert all units. Reroute via elevated expressway.",
                "CommunicationAgent": "Broadcast SMS evacuation alert to 50,000 Lagos Island residents immediately.",
            },
            status="COMPLETED",
        )
        db.add(prior_plan)
        db.flush()

        for agent_name, instruction in prior_plan.subtasks_json.items():
            status = "SUCCESS"
            summary = f"{agent_name} completed assigned tasks with 94.2% confidence."
            if agent_name == "ShelterAgent":
                summary = (
                    f"ShelterAgent recalled prior memory of access road failure at {REJECTED_SHELTER}. "
                    f"Recommendation revised to {PREFERRED_SHELTER}. "
                    f"847 evacuees sheltered successfully. Decision validated."
                )
            db.add(AgentAssignment(
                incident_id=march_incident.id,
                task_plan_id=prior_plan.id,
                agent_name=agent_name,
                instruction=instruction,
                status=status,
                result_summary=summary,
                completed_at=datetime.utcnow() - timedelta(days=93),
            ))
        db.flush()
        print("   ✓ Agent task plans and assignments seeded")

        # ── 3. THE CRITICAL DEMO MEMORIES — 7 types ────────────────────────────
        print("Step 3/5 — Seeding 7 memory types including THE KEY DECISION_RECORD...")

        memories_to_seed = [

            # ── THE KEY MEMORY — this is the one that changes the shelter decision ──
            {
                "type": "DECISION_RECORD",
                "content": (
                    f"SHELTER REJECTION RECORD — Lagos Island Coastal Surge (March). "
                    f"Decision: {REJECTED_SHELTER} (Shelter B, Ikeja) was initially selected as primary evacuation hub "
                    f"(capacity: 1,200, distance: 3.2km from incident). "
                    f"REJECTION REASON: {REJECTED_ROAD} was confirmed submerged at 0.8m depth within 45 minutes of incident onset, "
                    f"making shelter inaccessible to emergency convoys and civilian vehicles. "
                    f"OUTCOME: Rerouted 847 evacuees to {PREFERRED_SHELTER} (Agege Motor Road remained clear). "
                    f"RECOMMENDATION: In future Lagos flooding incidents, avoid low-lying Ikeja access corridors. "
                    f"Prioritise Agege Stadium or elevated-access facilities. "
                    f"Confidence in this decision: 98.7%. Validated by after-action review."
                ),
                "metadata": {
                    "incident_title": "Lagos Island Coastal Surge — March Flood",
                    "decision_type": "SHELTER_SELECTION_OVERRIDE",
                    "rejected_shelter": REJECTED_SHELTER,
                    "rejected_reason": f"{REJECTED_ROAD} submerged — road inaccessible",
                    "preferred_shelter": PREFERRED_SHELTER,
                    "outcome": "847 evacuees sheltered successfully at Shelter C",
                    "confidence": 98.7,
                    "validated": True,
                    "hazard_type": "coastal_flood",
                    "region": "Lagos, Nigeria",
                    "lesson_applies_to": ["flood", "Lagos", "coastal", "surge", "Lekki", "Ikeja", "shelter"],
                },
                "incident_id": march_incident.id,
            },

            # LESSON_LEARNED memories
            {
                "type": "LESSON_LEARNED",
                "content": (
                    "Lagos flooding pattern: During coastal surge events affecting Lagos Island and Mainland, "
                    "Oba Akran Avenue, Lagos-Abeokuta Expressway low points, and Oshodi underpass flood within "
                    "30-60 minutes. All evacuation routes must use Agege Motor Road, Lagos-Ibadan Expressway, "
                    "or Third Mainland Bridge elevated sections only. Never use low-lying underpasses during surge events."
                ),
                "metadata": {
                    "hazard": "Coastal Flood", "year": 2026, "sector": "Infrastructure",
                    "region": "Lagos", "confidence": 97.1
                },
                "incident_id": march_incident.id,
            },
            {
                "type": "LESSON_LEARNED",
                "content": (
                    "During the 2025 Ogun River overflow, emergency supply convoys lost 6 hours "
                    "due to bridge weight restrictions discovered only at arrival. All convoy routes must be "
                    "pre-validated for bridge load capacity (minimum 20-tonne rating) before dispatch. "
                    "OSRM routing should include load-capacity filters for heavy vehicles."
                ),
                "metadata": {
                    "hazard": "River Flood", "year": 2025, "sector": "Logistics", "confidence": 94.2
                },
            },

            # SITUATION_REPORT memories
            {
                "type": "SITUATION_REPORT",
                "content": (
                    "SITREP — Lagos Island Coastal Surge Day 1 (Hour 6): "
                    "Flood waters reached 1.2m in Victoria Island low-lying zones. "
                    "Third Mainland Bridge operational (elevated, unaffected). "
                    "Lagos Island General Hospital at 78% capacity — pre-alert issued. "
                    f"{PREFERRED_SHELTER}: 847 evacuees admitted, 353 capacity remaining. "
                    "Weather forecast: surge expected to peak at H+8, recede by H+18. "
                    "All 6 specialist agents active. CoordinatorAgent confidence: 96.4%."
                ),
                "metadata": {
                    "sitrep_hour": 6, "incident": "March Lagos Flood",
                    "water_level_m": 1.2, "shelter_occupancy": 847, "confidence": 96.4
                },
                "incident_id": march_incident.id,
            },
            {
                "type": "SITUATION_REPORT",
                "content": (
                    "SITREP — Lekki Coastal Zone Standing Assessment: "
                    "Lekki Peninsula flooding risk elevated due to single-road access (Lekki-Epe Expressway). "
                    "During any surge exceeding 1.5m, Lekki becomes semi-isolated. "
                    "Recommend pre-positioning emergency assets on the peninsula during storm watches. "
                    "Eko Atlantic City sea wall rated for 3.5m surge — buffer for adjacent zones."
                ),
                "metadata": {
                    "hazard": "Coastal Flood", "region": "Lekki", "confidence": 89.5
                },
            },

            # WEATHER_OBSERVATION memories
            {
                "type": "WEATHER_OBSERVATION",
                "content": (
                    "Lagos Meteorological Record — March Flood Event: "
                    "Maximum rainfall recorded: 187mm in 6 hours (exceeds 100-year return period). "
                    "Wind gusts peaked at 72 km/h from the southwest. "
                    "Atlantic Intertropical Convergence Zone (ITCZ) positioned directly over Lagos. "
                    "Sea surface temperature elevated by 1.4°C above seasonal mean — amplified surge risk. "
                    "WMO code 82 (violent rain showers) active for 8 consecutive hours."
                ),
                "metadata": {
                    "rainfall_mm": 187, "duration_hours": 6, "wind_kmh": 72,
                    "wmo_code": 82, "region": "Lagos", "confidence": 99.1
                },
                "incident_id": march_incident.id,
            },

            # ACTION_PLAN memory
            {
                "type": "ACTION_PLAN",
                "content": (
                    "Master Action Plan — Lagos Coastal Flood Protocol: "
                    "1. Immediate: Issue SMS evacuation alert to all residents within 3km of coastline. "
                    f"2. Shelter: Activate {PREFERRED_SHELTER} as primary hub (NOT Ikeja — road flood risk). "
                    "3. Medical: Pre-alert LASUTH and Lagos Island General Hospital. Stage ambulances at Eko Bridge. "
                    "4. Logistics: All convoys via Agege Motor Road only. 6 heavy trucks, 10-tonne water payload. "
                    "5. Infrastructure: Deploy road clearance teams to Third Mainland Bridge access. "
                    "6. Communication: Broadcast on Radio Lagos 107.5FM + NTA emergency channel every 15 minutes."
                ),
                "metadata": {
                    "protocol": "Lagos_Coastal_Flood_V2",
                    "confidence": 95.8,
                    "region": "Lagos",
                    "shelter_recommendation": PREFERRED_SHELTER,
                    "shelter_rejection": REJECTED_SHELTER,
                },
                "incident_id": march_incident.id,
            },

            # FIELD_UPDATE memory
            {
                "type": "FIELD_UPDATE",
                "content": (
                    f"FIELD UPDATE — Shelter Status: {PREFERRED_SHELTER} operational. "
                    "Power: Generator online (diesel, 48-hour supply). "
                    "Water: 12,000L tanker delivered. Potable water for 3 days at 500 persons. "
                    "Medical: 2 nurses and 1 doctor on site. Basic triage established. "
                    "Communications: VSAT link to Emergency Operations Centre active. "
                    "Security: 4 police officers deployed. Orderly registration in progress. "
                    "Status: FULLY OPERATIONAL — accepting evacuees."
                ),
                "metadata": {
                    "shelter": PREFERRED_SHELTER,
                    "generator_hours": 48,
                    "water_litres": 12000,
                    "personnel": 7,
                    "confidence": 100.0,
                },
                "incident_id": march_incident.id,
            },
        ]

        created_memories = []
        for mem_data in memories_to_seed:
            mem = add_memory_with_vector(
                db=db,
                memory_type=mem_data["type"],
                content=mem_data["content"],
                metadata=mem_data["metadata"],
                incident_id=mem_data.get("incident_id"),
            )
            created_memories.append(mem)
            print(f"   ✓ [{mem_data['type']}] {mem_data['content'][:70]}...")

        db.commit()
        print(f"\n   Total memories seeded: {len(created_memories)} across 5 types")

        # ── 4. Create the LIVE DEMO INCIDENT (visible on dashboard) ───────────
        print("\nStep 4/5 — Creating live demo incident (Lekki Flash Flood — ACTIVE)...")

        live_incident = Incident(
            id=str(uuid.uuid4()),
            title="Lekki Flash Flood — Coastal Surge",
            description=(
                "Severe flash flooding triggered by Atlantic storm system. "
                "Heavy rainfall of 140mm recorded in 4 hours has caused widespread inundation across "
                "Lekki Phase 1 and Ajah. Lekki-Epe Expressway partially submerged. "
                "Estimated 14,000 residents require immediate evacuation. "
                "Multiple reports of stranded motorists and residential flooding above ground floor."
            ),
            severity="CRITICAL",
            status="ACTIVE",
            latitude=LEKKI_LAT,
            longitude=LEKKI_LON,
            affected_population=14000,
            organization_id=org.id,
            reporter_id=admin.id,
        )
        db.add(live_incident)
        db.flush()

        # Initial timeline event
        db.add(IncidentTimeline(
            incident_id=live_incident.id,
            event_type="INCIDENT_REPORTED",
            description="Flash flood alert received from Lagos State Flood Early Warning System. Auto-triaged as CRITICAL.",
            actor_id=admin.id,
        ))
        db.flush()
        db.commit()
        print(f"   ✓ Live incident created: '{live_incident.title}' [{live_incident.id[:8]}...]")

        # ── 5. Create stalled agent for watchdog demo scene ────────────────────
        print("\nStep 5/5 — Seeding stalled agent assignment for watchdog recovery demo...")

        stall_plan = AgentTaskPlan(
            id=str(uuid.uuid4()),
            incident_id=live_incident.id,
            plan_summary="Pre-staged plan for watchdog recovery demonstration.",
            subtasks_json={"LogisticsAgent": "Deliver emergency supplies to Lekki staging area."},
            status="EXECUTING",
        )
        db.add(stall_plan)
        db.flush()

        # Backdate so watchdog immediately detects it as stalled (>120s old)
        stalled_time = datetime.utcnow() - timedelta(minutes=5)
        stalled_asg = AgentAssignment(
            id=str(uuid.uuid4()),
            incident_id=live_incident.id,
            task_plan_id=stall_plan.id,
            agent_name="LogisticsAgent",
            instruction="Deliver emergency supplies to Lekki staging area.",
            status="IN_PROGRESS",
            assigned_at=stalled_time,
        )
        db.add(stalled_asg)
        db.commit()
        print(f"   ✓ Stalled LogisticsAgent assignment seeded (ID: {stalled_asg.id[:8]}...)")
        print(f"     → Run watchdog at /api/v1/telemetry/watchdog/health-check to recover it")

        # ── Summary ────────────────────────────────────────────────────────────
        print("\n" + "="*70)
        print("  DEMO SEED COMPLETE")
        print("="*70)
        print(f"""
  DEMO SCENES NOW READY:

  Scene 1 — Dashboard Cold Open
    → Live incident ready: '{live_incident.title}'
    → Go to http://localhost:3000/incidents

  Scene 2 — Create New Incident (on camera)
    → Log in as: admin@reliefgrid.gov / AdminPassword123!
    → Click 'File Incident Report'
    → Use Lekki coords: lat=6.4698, lon=3.5852
    → Or select 'Lagos, Nigeria' from sector dropdown

  Scene 3 — THE MEMORY MOMENT (core demo proof)
    → After creating the Lekki flood, click 'Analyze with AI'
    → ShelterAgent will retrieve the DECISION_RECORD memory:
      "Ikeja Community Centre rejected — access road flooded"
    → Recommendation will explicitly show Agege Stadium instead
    → Memory recall visible in recommendations widget

  Scene 4 — Watchdog Recovery
    → Go to http://localhost:3000/telemetry
    → Click 'Run Watchdog Self-Healing Scan'
    → 1 stalled LogisticsAgent will be auto-healed
    → Console shows recovery without data loss

  Scene 5 — Memory Explorer (7 types)
    → Go to http://localhost:3000/memory
    → Search: "shelter Lagos flood access road"
    → DECISION_RECORD will surface with 98.7% confidence label

  Memory types seeded: {set(m.memory_type for m in created_memories)}
        """)

    except Exception as e:
        db.rollback()
        print(f"\nERROR during seed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo()
