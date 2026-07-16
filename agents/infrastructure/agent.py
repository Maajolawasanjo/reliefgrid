import time
import math
from typing import Dict, Any, List
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


def _assess_road_risk(weather: Dict[str, Any], severity: str) -> Dict[str, Any]:
    """Determine road network risk level from weather and incident severity."""
    code = weather.get("weather_code", 0)
    wind = weather.get("wind_speed_kmh", 0)
    flood_codes = {61, 63, 65, 80, 81, 82, 95, 96, 99}
    storm_codes = {95, 96, 99}

    blockages = []
    risk_level = "LOW"
    risk_score = 0

    if code in storm_codes:
        risk_score += 50
        blockages.append("Active storm system — structural debris and flooding expected on arterial roads.")
    elif code in flood_codes:
        risk_score += 30
        blockages.append("Active precipitation — low-lying roads at flood risk.")
    if wind > 70:
        risk_score += 30
        blockages.append(f"Wind gusts {wind} km/h may cause fallen trees and overhead line hazards.")
    elif wind > 50:
        risk_score += 15
    if severity == "CRITICAL":
        risk_score += 20

    if risk_score >= 70:
        risk_level = "CRITICAL"
    elif risk_score >= 40:
        risk_level = "HIGH"
    elif risk_score >= 15:
        risk_level = "MODERATE"

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "identified_blockages": blockages,
    }


def _recommend_alternative_routes(primary_route: Dict[str, Any], road_risk: Dict[str, Any]) -> List[str]:
    alternatives = []
    if road_risk["risk_level"] in ("CRITICAL", "HIGH"):
        alternatives.append("Route via elevated bypass corridors — avoid river crossings and underpasses.")
        alternatives.append("Deploy lead escort vehicle 500m ahead of convoys to scout live road conditions.")
        alternatives.append("Enable police-coordinated traffic management at all major intersections.")
    else:
        alternatives.append("Standard convoy protocol — no route deviations required.")
    return alternatives


class InfrastructureAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="InfrastructureAgent", domain="infrastructure")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"InfrastructureAgent assessing road & infrastructure for incident {task.incident_id}")

        ctx = task.context
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")
        title = ctx.get("title", "Emergency Incident")
        weather = ctx.get("weather", {})

        # 1. Fetch police & fire stations (infrastructure nodes)
        police_data = []
        fire_data = []

        try:
            from apps.api.app.services.gis import gis_service
            p_result = gis_service.fetch_osm_amenities(lat, lon, "police")
            police_data = p_result.get("data", [])
            p_source = p_result.get("source", "live")

            f_result = gis_service.fetch_osm_amenities(lat, lon, "fire_station")
            fire_data = f_result.get("data", [])
            f_source = f_result.get("source", "live")
            self.logger.info(f"InfrastructureAgent: {len(police_data)} police, {len(fire_data)} fire stations found.")
        except Exception as e:
            self.logger.warning(f"InfrastructureAgent GIS fetch failed: {e}")
            p_source = "unavailable"
            f_source = "unavailable"

        # 2. Get shelter route for clearance assessment
        shelter_route = ctx.get("closest_shelter_route")
        if not shelter_route:
            shelters = ctx.get("nearby_shelters", [])
            if shelters and lat and lon:
                try:
                    from apps.api.app.services.gis import gis_service
                    closest = sorted(shelters, key=lambda s: s.get("distance_km", 999))[0]
                    shelter_route = gis_service.calculate_route(
                        lat, lon, closest["latitude"], closest["longitude"]
                    )
                except Exception:
                    pass

        # 3. Assess road infrastructure risk
        road_risk = _assess_road_risk(weather, severity)

        # 4. Recommend alternative routing
        alt_routes = _recommend_alternative_routes(shelter_route, road_risk)

        # 5. Build infrastructure directives
        directives = []

        # Evacuation corridor clearance
        route_detail = ""
        if shelter_route:
            route_detail = (
                f"Primary evacuation corridor: {shelter_route.get('distance_km')} km, "
                f"ETA {shelter_route.get('duration_mins')} mins ({shelter_route.get('source', 'N/A')} routing)."
            )

        directives.append({
            "action": "CLEAR_EVACUATION_CORRIDOR",
            "priority": "P1",
            "detail": (
                f"Deploy road clearance teams along primary evacuation corridor. "
                f"{route_detail} Road risk: {road_risk['risk_level']}."
            ),
            "evidence": f"OSRM route analysis. Weather risk score: {road_risk['risk_score']}.",
            "alternative_routing": alt_routes,
        })

        # Police deployment
        if police_data:
            nearest_police = sorted(police_data, key=lambda p: p.get("distance_km", 999))[0]
            directives.append({
                "action": "DEPLOY_POLICE_TRAFFIC_CONTROL",
                "priority": "P1",
                "detail": (
                    f"Coordinate with {nearest_police['name']} ({nearest_police['distance_km']} km) "
                    f"to enforce convoy corridors and manage evacuation traffic flows."
                ),
                "evidence": f"Nearest police station at {nearest_police['distance_km']} km ({p_source}).",
            })

        # Fire station mobilization
        if fire_data:
            nearest_fire = sorted(fire_data, key=lambda f: f.get("distance_km", 999))[0]
            directives.append({
                "action": "MOBILIZE_FIRE_RESCUE",
                "priority": "P1" if severity in ("CRITICAL", "HIGH") else "P2",
                "detail": (
                    f"Alert {nearest_fire['name']} ({nearest_fire['distance_km']} km) for structural rescue "
                    f"and road clearance support. Pre-position heavy rescue equipment."
                ),
                "evidence": f"Nearest fire station at {nearest_fire['distance_km']} km ({f_source}).",
            })

        # Blockage alerts
        for blockage in road_risk["identified_blockages"]:
            directives.append({
                "action": "ISSUE_ROUTE_BLOCKAGE_ALERT",
                "priority": "P2",
                "detail": blockage,
                "evidence": f"Weather WMO code {weather.get('weather_code')}, Wind {weather.get('wind_speed_kmh')} km/h.",
            })

        # Critical infrastructure check
        if road_risk["risk_level"] == "CRITICAL":
            directives.append({
                "action": "REQUEST_ENGINEERING_UNIT",
                "priority": "P1",
                "detail": "Critical infrastructure risk detected. Request military/civil engineering unit for bridge and road structural assessment.",
                "evidence": f"Road risk score: {road_risk['risk_score']}/100.",
            })

        gis_confidence = 88.0 if (p_source == "live" and f_source == "live") else 70.0

        findings = {
            "road_risk_assessment": road_risk,
            "police_stations": police_data[:3],
            "fire_stations": fire_data[:3],
            "evacuation_corridor": shelter_route,
            "alternative_routing_recommendations": alt_routes,
            "infrastructure_directives": directives,
            "police_data_source": p_source,
            "fire_data_source": f_source,
            "confidence_score": gis_confidence,
            "data_provenance": f"OpenStreetMap Overpass API ({p_source}/{f_source}) + OSRM route analysis",
        }

        summary = (
            f"InfrastructureAgent assessed {severity} incident '{title}'. "
            f"Road risk: {road_risk['risk_level']} (score {road_risk['risk_score']}/100). "
            f"{len(road_risk['identified_blockages'])} blockage hazard(s) identified. "
            f"Nearest police: {police_data[0]['name'] if police_data else 'N/A'} "
            f"({police_data[0]['distance_km'] if police_data else 'N/A'} km). "
            f"Nearest fire: {fire_data[0]['name'] if fire_data else 'N/A'} "
            f"({fire_data[0]['distance_km'] if fire_data else 'N/A'} km). "
            f"{len(directives)} infrastructure directive(s) issued."
        )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)


infrastructure_agent = InfrastructureAgent()
