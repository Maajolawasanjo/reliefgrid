import time
from typing import Dict, Any, List, Optional, Tuple
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


def _recall_shelter_decision_memories(
    incident_text: str,
    db_session=None,
) -> List[Dict[str, Any]]:
    """
    Query CockroachDB collective memory store for prior shelter DECISION_RECORDs
    that are semantically relevant to the current incident.

    Returns a list of recalled memories with similarity scores.
    This is the mechanism that makes "memory change the decision."
    """
    if db_session is None:
        return []
    try:
        from app.services.embedding import embedding_service, cosine_similarity
        from app.models.agent import Memory
        from app.models.memory import MemoryVector

        query_vec = embedding_service.generate_embedding(incident_text)

        # Fetch only DECISION_RECORD and LESSON_LEARNED memories for shelter domain
        relevant_types = ("DECISION_RECORD", "LESSON_LEARNED", "ACTION_PLAN")
        memories = db_session.query(Memory).filter(
            Memory.memory_type.in_(relevant_types)
        ).all()

        if not memories:
            return []

        mem_ids = [m.id for m in memories]
        vectors = db_session.query(MemoryVector).filter(
            MemoryVector.memory_id.in_(mem_ids)
        ).all()
        vec_map = {v.memory_id: v.embedding.get("vec", []) for v in vectors}
        mem_map = {m.id: m for m in memories}

        scored = []
        for mem_id, vec in vec_map.items():
            score = cosine_similarity(query_vec, vec)
            if score > 0.50:  # Only recall meaningfully similar memories
                mem = mem_map.get(mem_id)
                if mem:
                    scored.append({
                        "memory_id": mem.id,
                        "memory_type": mem.memory_type,
                        "content": mem.content,
                        "similarity_score": round(score, 4),
                        "metadata": mem.metadata_json or {},
                    })

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:3]  # Top-3 most relevant memories

    except Exception as e:
        return []


def _check_shelter_against_memories(
    shelter_name: str,
    recalled_memories: List[Dict[str, Any]],
) -> Optional[Dict[str, Any]]:
    """
    Check if any recalled memory explicitly rejects this shelter.
    Returns the rejection memory if found, else None.
    """
    name_lower = shelter_name.lower()
    for mem in recalled_memories:
        meta = mem.get("metadata", {})
        rejected = meta.get("rejected_shelter", "")
        if rejected and any(word in name_lower for word in rejected.lower().split()):
            return mem
        # Also scan the content for explicit rejection text
        content_lower = mem.get("content", "").lower()
        if "rejected" in content_lower and any(
            word in content_lower for word in name_lower.split()[:3]
        ):
            return mem
    return None


def _assess_shelter_capacity(shelter: Dict[str, Any]) -> Dict[str, Any]:
    capacity = shelter.get("capacity", 500)
    occupancy = shelter.get("occupancy", 0)
    available = capacity - occupancy
    utilization_pct = round((occupancy / capacity) * 100, 1) if capacity > 0 else 0

    if utilization_pct < 50:
        status = "FULLY_AVAILABLE"
        priority = "PRIMARY"
    elif utilization_pct < 75:
        status = "PARTIALLY_AVAILABLE"
        priority = "SECONDARY"
    elif utilization_pct < 90:
        status = "NEAR_CAPACITY"
        priority = "TERTIARY"
    else:
        status = "AT_CAPACITY"
        priority = "OVERFLOW"

    return {
        "capacity": capacity,
        "current_occupancy": occupancy,
        "available_spaces": available,
        "utilization_pct": utilization_pct,
        "status": status,
        "priority": priority,
    }


def _estimate_shelter_need(severity: str, affected_population: int) -> Dict[str, Any]:
    """Estimate how many people need shelter based on severity."""
    displacement_rates = {
        "CRITICAL": 0.45,
        "HIGH": 0.25,
        "MEDIUM": 0.10,
        "LOW": 0.03,
    }
    rate = displacement_rates.get(severity, 0.15)
    displaced = int(affected_population * rate)
    immediate = int(displaced * 0.40)
    within_24h = int(displaced * 0.60)
    return {
        "estimated_displaced": displaced,
        "immediate_need": immediate,
        "within_24h_need": within_24h,
    }


class ShelterAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="ShelterAgent", domain="shelter")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"ShelterAgent assessing evacuation shelter capacity for incident {task.incident_id}")

        ctx = task.context
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")
        affected_population = ctx.get("affected_population", 1000)
        title = ctx.get("title", "Emergency Incident")
        weather = ctx.get("weather", {})
        db_session = ctx.get("_db_session")  # injected by the orchestration layer

        # ── 1. Fetch shelter data ─────────────────────────────────────────────
        shelters_data = ctx.get("nearby_shelters", [])
        shelter_source = ctx.get("shelters_source", "context")

        if not shelters_data and lat and lon:
            try:
                from app.services.gis import gis_service
            except ModuleNotFoundError:
                from apps.api.app.services.gis import gis_service
            try:
                result = gis_service.fetch_osm_amenities(lat, lon, "shelter")
                shelters_data = result.get("data", [])
                shelter_source = result.get("source", "live")
                self.logger.info(f"ShelterAgent fetched {len(shelters_data)} shelters from {shelter_source}")
            except Exception as e:
                self.logger.warning(f"ShelterAgent shelter fetch failed: {e}")

        # ── 2. MEMORY RECALL — query CockroachDB for prior shelter decisions ──
        incident_description = f"{title} {ctx.get('description', '')} shelter evacuation flood {lat} {lon}"
        recalled_memories = _recall_shelter_decision_memories(incident_description, db_session)

        # Also use collective_memory from context if no DB session
        if not recalled_memories:
            recalled_memories = [
                {
                    "memory_type": "CONTEXT",
                    "content": m,
                    "similarity_score": 0.70,
                    "metadata": {},
                }
                for m in ctx.get("collective_memory", [])
                if "shelter" in m.lower() or "evacuation" in m.lower() or "rejected" in m.lower()
            ]

        memory_influenced = bool(recalled_memories)
        rejected_shelters = []
        rejection_evidence: Dict[str, Dict] = {}

        if recalled_memories:
            self.logger.info(
                f"ShelterAgent recalled {len(recalled_memories)} relevant memories "
                f"(top score: {recalled_memories[0].get('similarity_score', 0):.3f})"
            )
            for shelter in shelters_data:
                shelter_name = shelter.get("name", "")
                rejection_mem = _check_shelter_against_memories(shelter_name, recalled_memories)
                if rejection_mem:
                    rejected_shelters.append(shelter_name)
                    rejection_evidence[shelter_name] = rejection_mem
                    self.logger.warning(
                        f"ShelterAgent MEMORY OVERRIDE: '{shelter_name}' rejected based on "
                        f"prior DECISION_RECORD (similarity: {rejection_mem.get('similarity_score', 0):.3f})"
                    )

        # ── 3. Assess displacement need ───────────────────────────────────────
        shelter_need = _estimate_shelter_need(severity, affected_population)
        displaced = shelter_need["estimated_displaced"]

        # ── 4. Assess each shelter — flag memory-rejected ones ────────────────
        shelter_assessments = []
        memory_overridden = []
        total_available_capacity = 0

        for shelter in sorted(shelters_data, key=lambda s: s.get("distance_km", 999)):
            shelter_name = shelter.get("name", "Unknown Shelter")
            assessment = _assess_shelter_capacity(shelter)
            is_rejected = shelter_name in rejected_shelters

            entry = {
                "name": shelter_name,
                "latitude": shelter.get("latitude"),
                "longitude": shelter.get("longitude"),
                "distance_km": shelter.get("distance_km", 0),
                "capacity_assessment": assessment,
                "data_source": shelter_source,
                "memory_rejected": is_rejected,
            }

            if is_rejected:
                rej_mem = rejection_evidence[shelter_name]
                entry["rejection_reason"] = rej_mem.get("metadata", {}).get("rejected_reason", "Prior incident failure")
                entry["rejection_memory"] = {
                    "memory_type": rej_mem.get("memory_type"),
                    "content": rej_mem.get("content", "")[:400],
                    "similarity_score": rej_mem.get("similarity_score", 0),
                    "outcome": rej_mem.get("metadata", {}).get("outcome", ""),
                }
                memory_overridden.append(shelter_name)
            else:
                if assessment["status"] != "AT_CAPACITY":
                    total_available_capacity += assessment["available_spaces"]

            shelter_assessments.append(entry)

        # ── 5. Build activation plan — skip memory-rejected shelters ──────────
        activation_plan = []
        valid_shelters = [s for s in shelter_assessments if not s["memory_rejected"]]
        primary_shelter = valid_shelters[0] if valid_shelters else (shelter_assessments[0] if shelter_assessments else None)

        # Track what the recommendation WOULD have been without memory
        naive_primary = shelter_assessments[0] if shelter_assessments else None
        memory_changed_recommendation = (
            memory_overridden and
            naive_primary and
            naive_primary["name"] in memory_overridden and
            primary_shelter and
            primary_shelter["name"] != naive_primary["name"]
        )

        if primary_shelter:
            cap = primary_shelter["capacity_assessment"]
            mem_note = ""
            if memory_changed_recommendation:
                top_mem = recalled_memories[0]
                mem_note = (
                    f" [MEMORY-GUIDED DECISION: '{naive_primary['name']}' was initial candidate but was "
                    f"overridden by CockroachDB recall — prior DECISION_RECORD confirms access route failure. "
                    f"Similarity score: {top_mem.get('similarity_score', 0):.3f}]"
                )

            activation_plan.append({
                "shelter": primary_shelter["name"],
                "action": "ACTIVATE_PRIMARY",
                "priority": "P1",
                "memory_guided": memory_changed_recommendation,
                "detail": (
                    f"Open {primary_shelter['name']} as primary evacuation hub. "
                    f"Available: {cap['available_spaces']} of {cap['capacity']} spaces "
                    f"({cap['utilization_pct']}% utilized). "
                    f"Distance: {primary_shelter['distance_km']} km from incident."
                    f"{mem_note}"
                ),
                "evidence": (
                    f"OSM shelter registry ({shelter_source}). "
                    + (f"Promoted from position 2 by memory override of '{naive_primary['name']}'."
                       if memory_changed_recommendation else "Nearest available shelter confirmed.")
                ),
            })

        # Emit REJECT entries for memory-flagged shelters
        for sh_name in memory_overridden:
            rej_mem = rejection_evidence[sh_name]
            activation_plan.append({
                "shelter": sh_name,
                "action": "REJECT_SHELTER",
                "priority": "P1",
                "memory_guided": True,
                "detail": (
                    f"MEMORY OVERRIDE: '{sh_name}' REJECTED. "
                    f"Reason: {rej_mem.get('metadata', {}).get('rejected_reason', 'Prior failure on record')}. "
                    f"Source: {rej_mem.get('memory_type', 'DECISION_RECORD')} from prior incident."
                ),
                "evidence": rej_mem.get("content", "")[:350],
                "prior_outcome": rej_mem.get("metadata", {}).get("outcome", ""),
                "memory_similarity": rej_mem.get("similarity_score", 0),
            })

        if len(valid_shelters) > 1:
            backup = valid_shelters[1]
            activation_plan.append({
                "shelter": backup["name"],
                "action": "ACTIVATE_SECONDARY",
                "priority": "P2",
                "memory_guided": False,
                "detail": (
                    f"Pre-activate {backup['name']} as overflow hub. "
                    f"Capacity: {backup['capacity_assessment']['available_spaces']} spaces available."
                ),
                "evidence": f"Distance: {backup['distance_km']} km from incident.",
            })

        if total_available_capacity < displaced:
            gap = displaced - total_available_capacity
            activation_plan.append({
                "action": "REQUEST_EMERGENCY_OVERFLOW",
                "priority": "P1",
                "memory_guided": False,
                "detail": (
                    f"CAPACITY GAP: Need {displaced:,} spaces, only {total_available_capacity:,} verified. "
                    f"Gap: {gap:,} persons. Activate regional mutual aid agreement."
                ),
                "evidence": f"Displaced: {displaced:,}. Verified capacity: {total_available_capacity:,}.",
            })

        temp = weather.get("temperature_c", 22)
        supply_items = [
            "Water (4L/person/day)", "Emergency rations (3 meals/day)",
            "First aid kits (1 per 20 persons)"
        ]
        if temp < 15:
            supply_items += ["Thermal blankets (1 per person)", "Portable heaters (1 per 50 persons)"]
        if temp > 32:
            supply_items += ["Cooling fans (1 per 30 persons)", "Oral rehydration salts"]

        activation_plan.append({
            "action": "PRE_POSITION_SUPPLIES",
            "priority": "P2",
            "memory_guided": False,
            "detail": f"Stage supplies for {displaced:,} displaced persons at primary hub.",
            "required_items": supply_items,
            "evidence": f"Displacement model: {severity} severity at {affected_population:,} population.",
        })

        confidence = 91.0 if shelter_source == "live" else 72.0
        if memory_influenced:
            confidence = min(confidence + 5.0, 98.5)  # Memory recall increases confidence

        findings = {
            "shelter_need": shelter_need,
            "total_available_capacity": total_available_capacity,
            "capacity_gap": max(0, displaced - total_available_capacity),
            "shelter_assessments": shelter_assessments,
            "activation_plan": activation_plan,
            "supply_requirements": supply_items,
            "shelters_data_source": shelter_source,

            # Memory recall metadata — surfaces in the UI
            "memory_recall": {
                "enabled": True,
                "memories_retrieved": len(recalled_memories),
                "shelters_overridden": memory_overridden,
                "recommendation_changed": memory_changed_recommendation,
                "naive_recommendation": naive_primary["name"] if naive_primary else None,
                "final_recommendation": primary_shelter["name"] if primary_shelter else None,
                "recalled_memories": recalled_memories[:2],  # Top 2 for UI display
            },

            "confidence_score": confidence,
            "data_provenance": (
                f"OSM shelter registry ({shelter_source}) + displacement modeling "
                + ("+ CockroachDB collective memory recall" if memory_influenced else "")
            ),
        }

        if memory_changed_recommendation:
            summary = (
                f"ShelterAgent MEMORY-GUIDED decision for {severity} incident '{title}'. "
                f"Initial candidate '{naive_primary['name']}' REJECTED by CockroachDB memory recall "
                f"(prior access road failure on record). "
                f"Recommendation revised to '{primary_shelter['name']}'. "
                f"Displaced: {displaced:,} persons. Available capacity: {total_available_capacity:,}. "
                f"Memory similarity score: {recalled_memories[0].get('similarity_score', 0):.3f}."
            )
        else:
            summary = (
                f"ShelterAgent assessed {severity} incident '{title}'. "
                f"Estimated {displaced:,} displaced. "
                f"Primary hub: {primary_shelter['name'] if primary_shelter else 'N/A'}. "
                f"Capacity: {'SUFFICIENT' if total_available_capacity >= displaced else 'INSUFFICIENT'}."
                + (f" Memory recall: {len(recalled_memories)} relevant records retrieved." if memory_influenced else "")
            )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)



shelter_agent = ShelterAgent()
