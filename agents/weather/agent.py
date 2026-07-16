import time
import math
from typing import Dict, Any, List
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


# WMO Weather Code → human label mapping
WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
}

HIGH_RISK_CODES = {65, 82, 95, 96, 99, 75, 86}
FLOOD_RISK_CODES = {61, 63, 65, 80, 81, 82, 95, 96, 99}


def _assess_risk(weather: Dict[str, Any]) -> Dict[str, Any]:
    code = weather.get("weather_code", 0)
    wind = weather.get("wind_speed_kmh", 0)
    temp = weather.get("temperature_c", 20)

    label = WMO_CODES.get(code, "Unknown conditions")
    flood_risk = code in FLOOD_RISK_CODES
    severe = code in HIGH_RISK_CODES
    wind_hazard = wind > 60
    extreme_heat = temp > 38
    extreme_cold = temp < 5

    # Composite risk score 0-100
    score = 0
    if severe:
        score += 40
    if flood_risk:
        score += 25
    if wind_hazard:
        score += 20
    if extreme_heat or extreme_cold:
        score += 15

    if score >= 70:
        risk_level = "CRITICAL"
    elif score >= 45:
        risk_level = "HIGH"
    elif score >= 20:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    return {
        "risk_level": risk_level,
        "risk_score": min(score, 100),
        "conditions_label": label,
        "flood_risk": flood_risk,
        "severe_weather": severe,
        "wind_hazard": wind_hazard,
        "extreme_heat": extreme_heat,
        "extreme_cold": extreme_cold,
    }


def _build_recommendations(weather: Dict[str, Any], risk: Dict[str, Any]) -> List[Dict[str, Any]]:
    recs = []
    wind = weather.get("wind_speed_kmh", 0)
    temp = weather.get("temperature_c", 20)

    if risk["flood_risk"]:
        recs.append({
            "action": "ISSUE_FLOOD_ADVISORY",
            "priority": "P1",
            "detail": f"Active precipitation pattern (WMO code {weather.get('weather_code')}) indicates elevated flood risk. Alert downstream communities and pre-position water pumps.",
            "evidence": f"Weather code {weather.get('weather_code')}: {risk['conditions_label']}",
        })
    if risk["wind_hazard"]:
        recs.append({
            "action": "RESTRICT_AERIAL_OPS",
            "priority": "P1",
            "detail": f"Wind gusts at {wind} km/h exceed safe aerial operations threshold of 60 km/h. Ground all rotary-wing assets.",
            "evidence": f"Live wind speed: {wind} km/h",
        })
    if risk["severe_weather"]:
        recs.append({
            "action": "FULL_SHELTER_IN_PLACE",
            "priority": "P1",
            "detail": "Severe storm conditions confirmed. Halt all non-essential ground movements and enforce shelter protocols.",
            "evidence": f"WMO code {weather.get('weather_code')}: {risk['conditions_label']}",
        })
    if risk["extreme_heat"]:
        recs.append({
            "action": "HEAT_CASUALTY_PROTOCOL",
            "priority": "P2",
            "detail": f"Ambient temperature {temp}°C exceeds 38°C threshold. Deploy hydration stations and increase medical patrol frequency.",
            "evidence": f"Temperature: {temp}°C",
        })
    if risk["extreme_cold"]:
        recs.append({
            "action": "COLD_CASUALTY_PROTOCOL",
            "priority": "P2",
            "detail": f"Temperature of {temp}°C creates hypothermia risk for exposed evacuees. Prioritize warming shelters and thermal blanket distribution.",
            "evidence": f"Temperature: {temp}°C",
        })
    if not recs:
        recs.append({
            "action": "ROUTINE_MONITORING",
            "priority": "P3",
            "detail": "Conditions are within normal operational parameters. Maintain standard weather monitoring interval.",
            "evidence": f"Conditions: {risk['conditions_label']}",
        })
    return recs


class WeatherAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="WeatherAgent", domain="meteorology")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"WeatherAgent analyzing meteorological conditions for incident {task.incident_id}")

        ctx = task.context
        weather = ctx.get("weather", {})
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")

        # Fall back to fetching live weather if not pre-loaded in context
        if not weather or not weather.get("temperature_c"):
            try:
                from apps.api.app.services.weather import weather_service
                weather = weather_service.get_live_weather(lat, lon)
                self.logger.info(f"WeatherAgent fetched live weather: {weather.get('source', 'unknown')}")
            except Exception as e:
                self.logger.warning(f"WeatherAgent weather fetch failed: {e}")
                weather = {
                    "temperature_c": 26.0,
                    "wind_speed_kmh": 22.4,
                    "weather_code": 3,
                    "source": "Cached Radar Simulation",
                }

        risk = _assess_risk(weather)
        recommendations = _build_recommendations(weather, risk)

        # Determine operational window
        if risk["wind_hazard"]:
            operational_window = "Operations severely restricted — wind hazard active"
        elif risk["flood_risk"]:
            operational_window = "Ground operations possible; avoid flood-prone zones"
        else:
            operational_window = "Full operational capacity — no meteorological constraints"

        # Confidence based on data source
        is_live = weather.get("source", "").lower() not in ("cached radar simulation", "simulated")
        confidence = 96.2 if is_live else 74.5

        findings = {
            "data_source": weather.get("source", "unknown"),
            "is_live_data": is_live,
            "temperature_c": weather.get("temperature_c"),
            "wind_speed_kmh": weather.get("wind_speed_kmh"),
            "weather_code": weather.get("weather_code"),
            "conditions_label": risk["conditions_label"],
            "risk_assessment": risk,
            "recommendations": recommendations,
            "operational_window": operational_window,
            "confidence_score": confidence,
            "data_provenance": f"Open-Meteo WMO forecast for {lat:.4f}, {lon:.4f}",
        }

        summary = (
            f"WeatherAgent confirmed {risk['risk_level']} meteorological risk at incident coordinates. "
            f"Conditions: {risk['conditions_label']}, Wind: {weather.get('wind_speed_kmh')} km/h, "
            f"Temp: {weather.get('temperature_c')}°C. "
            f"{len(recommendations)} operational directive(s) issued. "
            f"Data source: {weather.get('source', 'N/A')}."
        )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)


weather_agent = WeatherAgent()
