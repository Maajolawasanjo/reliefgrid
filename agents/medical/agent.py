import time
import math
from typing import Dict, Any, List, Optional
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


def _triage_category(hospital: Dict[str, Any], travel_mins: float) -> str:
    """Assign triage dispatch category based on distance and occupancy."""
    occupancy = hospital.get("capacity_occupancy_percent", 70)
    if travel_mins <= 10 and occupancy < 85:
        return "PRIMARY_DISPATCH"
    elif travel_mins <= 20 and occupancy < 90:
        return "SECONDARY_DISPATCH"
    else:
        return "TERTIARY_OVERFLOW"


def _estimate_casualties(severity: str, affected_population: int) -> Dict[str, int]:
    """Estimate casualty load from severity and population."""
    rates = {
        "CRITICAL": 0.12,
        "HIGH": 0.06,
        "MEDIUM": 0.02,
        "LOW": 0.005,
    }
    rate = rates.get(severity, 0.03)
    total = int(affected_population * rate)
    critical = max(1, int(total * 0.20))
    moderate = int(total * 0.35)
    minor = total - critical - moderate
    return {
        "total_estimated": total,
        "critical": critical,
        "moderate": moderate,
        "minor": minor,
    }


class MedicalAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="MedicalAgent", domain="medical")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"MedicalAgent performing medical assessment for incident {task.incident_id}")

        ctx = task.context
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")
        affected_population = ctx.get("affected_population", 1000)
        title = ctx.get("title", "Emergency Incident")

        # 1. Fetch hospitals — prefer context data, fall back to live GIS
        hospitals_data = ctx.get("nearby_hospitals", [])
        hosp_source = ctx.get("hospitals_source", "context")

        if not hospitals_data and lat and lon:
            try:
                from apps.api.app.services.gis import gis_service
                result = gis_service.fetch_osm_amenities(lat, lon, "hospital")
                hospitals_data = result.get("data", [])
                hosp_source = result.get("source", "live")
                self.logger.info(f"MedicalAgent fetched {len(hospitals_data)} hospitals from {hosp_source}")
            except Exception as e:
                self.logger.warning(f"MedicalAgent GIS hospital fetch failed: {e}")

        # 2. Fetch routing to closest hospital
        hospital_assignments = []
        primary_hospital = None
        primary_route = None

        if hospitals_data:
            # Sort by distance
            sorted_hosps = sorted(hospitals_data, key=lambda h: h.get("distance_km", 999))
            primary_hospital = sorted_hosps[0]

            # Attempt live routing
            try:
                from apps.api.app.services.gis import gis_service
                route = gis_service.calculate_route(
                    lat, lon,
                    primary_hospital["latitude"], primary_hospital["longitude"]
                )
                primary_route = route
            except Exception:
                dist = primary_hospital.get("distance_km", 5)
                primary_route = {
                    "source": "estimated",
                    "distance_km": dist * 1.25,
                    "duration_mins": dist * 1.5,
                }

            # Build assignment list for up to 3 hospitals
            for hosp in sorted_hosps[:3]:
                travel_mins = hosp.get("distance_km", 5) * 1.5  # rough estimate
                category = _triage_category(hosp, travel_mins)
                hospital_assignments.append({
                    "name": hosp.get("name", "Unknown Hospital"),
                    "latitude": hosp.get("latitude"),
                    "longitude": hosp.get("longitude"),
                    "distance_km": hosp.get("distance_km", 0),
                    "estimated_travel_mins": round(travel_mins, 1),
                    "occupancy_pct": hosp.get("capacity_occupancy_percent", "N/A"),
                    "triage_category": category,
                    "data_source": hosp_source,
                })

        # 3. Casualty estimation
        casualties = _estimate_casualties(severity, affected_population)

        # 4. Weather impact on medical ops
        weather = ctx.get("weather", {})
        temp = weather.get("temperature_c", 22)
        medical_weather_note = ""
        if temp > 35:
            medical_weather_note = f"Extreme heat ({temp}°C): elevated risk of heat stroke — deploy IV hydration kits."
        elif temp < 8:
            medical_weather_note = f"Cold exposure ({temp}°C): hypothermia risk for casualties — prioritize thermal wrapping."
        else:
            medical_weather_note = f"Ambient temperature ({temp}°C) within safe operational range."

        # 5. Build medical directives
        directives = []
        if hospital_assignments:
            ph = hospital_assignments[0]
            directives.append({
                "action": "DISPATCH_TRAUMA_UNITS",
                "priority": "P1",
                "target": ph["name"],
                "detail": (
                    f"Pre-alert {ph['name']} for {casualties['critical']} critical and "
                    f"{casualties['moderate']} moderate casualties. ETA: {ph['estimated_travel_mins']} mins."
                ),
                "evidence": f"Nearest verified hospital at {ph['distance_km']} km ({hosp_source} data).",
            })

        directives.append({
            "action": "FIELD_TRIAGE_STAGING",
            "priority": "P1",
            "detail": (
                f"Establish field triage post at incident epicenter. Estimated load: "
                f"{casualties['total_estimated']} total casualties ({casualties['critical']} critical)."
            ),
            "evidence": f"Population: {affected_population:,}, Severity: {severity}",
        })

        if medical_weather_note:
            directives.append({
                "action": "WEATHER_MEDICAL_ADVISORY",
                "priority": "P2",
                "detail": medical_weather_note,
                "evidence": f"Open-Meteo temperature reading: {temp}°C",
            })

        if casualties["total_estimated"] > 200:
            directives.append({
                "action": "REQUEST_MASS_CASUALTY_INCIDENT_PROTOCOL",
                "priority": "P1",
                "detail": f"Estimated {casualties['total_estimated']} casualties exceeds MCI threshold. Activate mutual aid agreement.",
                "evidence": f"MCI threshold: >200 casualties.",
            })

        confidence = 93.5 if hosp_source == "live" else 78.0

        findings = {
            "casualty_estimate": casualties,
            "hospital_assignments": hospital_assignments,
            "primary_hospital": primary_hospital,
            "primary_route": primary_route,
            "hospitals_data_source": hosp_source,
            "medical_directives": directives,
            "medical_weather_note": medical_weather_note,
            "confidence_score": confidence,
            "data_provenance": f"OpenStreetMap Overpass API ({hosp_source}) for {lat:.4f}, {lon:.4f}",
        }

        summary = (
            f"MedicalAgent assessed {severity} incident '{title}'. "
            f"Estimated {casualties['total_estimated']} total casualties "
            f"({casualties['critical']} critical, {casualties['moderate']} moderate). "
            f"Primary dispatch: {primary_hospital['name'] if primary_hospital else 'N/A'} "
            f"({hospital_assignments[0]['estimated_travel_mins'] if hospital_assignments else 'N/A'} mins ETA). "
            f"{len(directives)} medical directive(s) issued."
        )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)


medical_agent = MedicalAgent()
