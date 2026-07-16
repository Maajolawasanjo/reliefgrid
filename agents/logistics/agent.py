import time
import math
from typing import Dict, Any, List, Optional
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


# Standard emergency supply packages
SUPPLY_PACKAGES = {
    "CRITICAL": {
        "water_litres": 4.0,
        "ration_units": 3,
        "medical_kits": 0.05,
        "generators": 0.002,
        "blankets": 1.2,
        "tents": 0.25,
    },
    "HIGH": {
        "water_litres": 3.0,
        "ration_units": 2,
        "medical_kits": 0.03,
        "generators": 0.001,
        "blankets": 1.0,
        "tents": 0.15,
    },
    "MEDIUM": {
        "water_litres": 2.0,
        "ration_units": 1,
        "medical_kits": 0.02,
        "generators": 0.0005,
        "blankets": 0.5,
        "tents": 0.05,
    },
    "LOW": {
        "water_litres": 1.5,
        "ration_units": 1,
        "medical_kits": 0.01,
        "generators": 0,
        "blankets": 0.25,
        "tents": 0,
    },
}

# Convoy capacity per vehicle type
CONVOY_CAPACITY = {
    "heavy_truck": {"payload_kg": 10000, "volume_m3": 40},
    "medium_truck": {"payload_kg": 5000, "volume_m3": 20},
    "pickup": {"payload_kg": 1000, "volume_m3": 3},
}

# Average weight of supply items in kg
SUPPLY_WEIGHTS = {
    "water_litres": 1.0,  # 1 kg/litre
    "ration_units": 0.8,
    "medical_kits": 5.0,
    "generators": 150.0,
    "blankets": 1.5,
    "tents": 12.0,
}


def _calculate_supply_manifest(severity: str, displaced: int) -> Dict[str, Any]:
    pkg = SUPPLY_PACKAGES.get(severity, SUPPLY_PACKAGES["MEDIUM"])
    manifest = {}
    total_weight_kg = 0
    for item, rate in pkg.items():
        qty = math.ceil(displaced * rate)
        manifest[item] = qty
        total_weight_kg += qty * SUPPLY_WEIGHTS.get(item, 1.0)

    # Estimate convoys needed (heavy trucks preferred)
    convoys_needed = math.ceil(total_weight_kg / CONVOY_CAPACITY["heavy_truck"]["payload_kg"])
    return {
        "manifest": manifest,
        "total_weight_kg": round(total_weight_kg, 1),
        "heavy_trucks_needed": convoys_needed,
        "medium_trucks_as_alternative": math.ceil(total_weight_kg / CONVOY_CAPACITY["medium_truck"]["payload_kg"]),
    }


class LogisticsAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="LogisticsAgent", domain="logistics")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"LogisticsAgent computing supply chain plan for incident {task.incident_id}")

        ctx = task.context
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")
        affected_population = ctx.get("affected_population", 1000)
        title = ctx.get("title", "Emergency Incident")
        weather = ctx.get("weather", {})

        # Estimate displaced (logistics serves the shelter population)
        displacement_rates = {"CRITICAL": 0.45, "HIGH": 0.25, "MEDIUM": 0.10, "LOW": 0.03}
        displaced = int(affected_population * displacement_rates.get(severity, 0.15))

        # 1. Get nearest shelter as primary delivery target
        shelters_data = ctx.get("nearby_shelters", [])
        shelter_source = "context"

        if not shelters_data and lat and lon:
            try:
                from apps.api.app.services.gis import gis_service
                result = gis_service.fetch_osm_amenities(lat, lon, "shelter")
                shelters_data = result.get("data", [])
                shelter_source = result.get("source", "live")
            except Exception as e:
                self.logger.warning(f"LogisticsAgent shelter fetch failed: {e}")

        primary_delivery_point = None
        primary_route = None
        route_source = "none"

        if shelters_data:
            primary_delivery_point = sorted(shelters_data, key=lambda s: s.get("distance_km", 999))[0]
            try:
                from apps.api.app.services.gis import gis_service
                route = gis_service.calculate_route(
                    lat, lon,
                    primary_delivery_point["latitude"],
                    primary_delivery_point["longitude"]
                )
                primary_route = route
                route_source = route.get("source", "simulated")
            except Exception as e:
                self.logger.warning(f"LogisticsAgent route calculation failed: {e}")
                dist = primary_delivery_point.get("distance_km", 5)
                primary_route = {
                    "source": "estimated",
                    "distance_km": dist * 1.25,
                    "duration_mins": dist * 1.5,
                }
                route_source = "estimated"

        # 2. Weather constraints on logistics
        wind = weather.get("wind_speed_kmh", 0)
        weather_code = weather.get("weather_code", 0)
        flood_codes = {61, 63, 65, 80, 81, 82, 95, 96, 99}
        road_restriction = None
        if wind > 80:
            road_restriction = "SEVERE_WIND: Restrict loads exceeding 2m height on exposed highways."
        elif weather_code in flood_codes:
            road_restriction = "FLOOD_RISK: Avoid low-lying roads; use elevated highway corridors only."
        else:
            road_restriction = "CLEAR: All routes operational."

        # 3. Supply manifest
        supply_manifest = _calculate_supply_manifest(severity, displaced)

        # 4. Logistics directives
        directives = []

        if primary_delivery_point and primary_route:
            directives.append({
                "action": "DISPATCH_SUPPLY_CONVOYS",
                "priority": "P1",
                "detail": (
                    f"Deploy {supply_manifest['heavy_trucks_needed']} heavy truck(s) from central depot to "
                    f"{primary_delivery_point['name']}. Route length: {primary_route['distance_km']} km, "
                    f"ETA: {primary_route['duration_mins']} mins. Carrying {supply_manifest['total_weight_kg']:,} kg total payload."
                ),
                "evidence": f"OSRM routing ({route_source}). Shelter registry ({shelter_source}).",
            })

        directives.append({
            "action": "STAGE_SUPPLY_MANIFEST",
            "priority": "P1",
            "detail": (
                f"Pre-position supplies for {displaced:,} displaced persons: "
                f"{supply_manifest['manifest']['water_litres']:,}L water, "
                f"{supply_manifest['manifest']['ration_units']:,} ration units, "
                f"{supply_manifest['manifest']['medical_kits']} medical kits, "
                f"{supply_manifest['manifest']['blankets']} blankets, "
                f"{supply_manifest['manifest']['tents']} tents."
            ),
            "evidence": f"Supply calculation: {severity} severity, {displaced:,} displaced.",
        })

        directives.append({
            "action": "ROAD_CLEARANCE_ADVISORY",
            "priority": "P2" if "CLEAR" not in road_restriction else "P3",
            "detail": road_restriction,
            "evidence": f"WMO weather code {weather_code}, Wind: {wind} km/h.",
        })

        if supply_manifest["heavy_trucks_needed"] > 6:
            directives.append({
                "action": "REQUEST_MUTUAL_AID_LOGISTICS",
                "priority": "P1",
                "detail": f"Convoy requirement ({supply_manifest['heavy_trucks_needed']} trucks) exceeds local asset pool. Activate regional logistics mutual aid.",
                "evidence": f"Payload requirement: {supply_manifest['total_weight_kg']:,} kg.",
            })

        confidence = 90.0 if (shelter_source == "live" and route_source == "live") else 75.0

        findings = {
            "displaced_population": displaced,
            "primary_delivery_target": primary_delivery_point,
            "primary_route": primary_route,
            "supply_manifest": supply_manifest,
            "road_restriction": road_restriction,
            "logistics_directives": directives,
            "shelter_data_source": shelter_source,
            "route_data_source": route_source,
            "confidence_score": confidence,
            "data_provenance": f"OSRM routing ({route_source}) + OSM shelter registry + supply modeling",
        }

        summary = (
            f"LogisticsAgent planned supply operation for {severity} incident. "
            f"Serving {displaced:,} displaced persons requiring {supply_manifest['total_weight_kg']:,} kg payload. "
            f"Primary delivery to {primary_delivery_point['name'] if primary_delivery_point else 'N/A'} "
            f"via {primary_route['distance_km'] if primary_route else 'N/A'} km route "
            f"(ETA {primary_route['duration_mins'] if primary_route else 'N/A'} mins). "
            f"Road status: {road_restriction}."
        )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)


logistics_agent = LogisticsAgent()
