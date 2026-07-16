import time
import math
from typing import Dict, Any, List
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState


# Alert templates for different incident severities
ALERT_TEMPLATES = {
    "CRITICAL": {
        "public_sms": (
            "EMERGENCY ALERT: {title}. IMMEDIATE EVACUATION required for residents within 5km of "
            "{location}. Move to {shelter} NOW. Follow official convoy routes. Do NOT use private vehicles on "
            "main roads. Call {hotline} for assistance."
        ),
        "media_bulletin": (
            "CIVIL EMERGENCY BULLETIN — {title}\n"
            "Severity: CRITICAL\n"
            "Affected Area: {location}\n"
            "Status: MANDATORY EVACUATION in effect\n"
            "Nearest Shelter: {shelter}\n"
            "Emergency Hotline: {hotline}\n"
            "Issued by: ReliefGrid Emergency Command Centre"
        ),
        "responder_radio": (
            "ALL UNITS — CRITICAL INCIDENT: {title} at {location}. "
            "Activate full ICS structure. All sector commanders report to command post immediately. "
            "Radio channel: PRIMARY OPS. Backup: TACT-2."
        ),
    },
    "HIGH": {
        "public_sms": (
            "EMERGENCY ALERT: {title} near {location}. Authorities recommend VOLUNTARY EVACUATION "
            "for low-lying areas. Shelter available at {shelter}. Call {hotline} for info."
        ),
        "media_bulletin": (
            "EMERGENCY ADVISORY — {title}\n"
            "Severity: HIGH\n"
            "Area: {location}\n"
            "Status: Voluntary evacuation recommended\n"
            "Shelter: {shelter}\n"
            "Hotline: {hotline}"
        ),
        "responder_radio": (
            "ALL UNITS — HIGH PRIORITY: {title} at {location}. "
            "ICS Level 2 activated. Staging at command post. Coordinate with sector leads."
        ),
    },
    "MEDIUM": {
        "public_sms": (
            "ADVISORY: {title} near {location}. Remain alert and follow local authority guidance. "
            "Shelter available at {shelter} if needed. Info: {hotline}."
        ),
        "media_bulletin": (
            "PUBLIC ADVISORY — {title}\n"
            "Area: {location}\n"
            "Status: Monitor and standby\n"
            "Info: {hotline}"
        ),
        "responder_radio": (
            "UNITS ON STANDBY — {title} at {location}. Monitor situation. Await activation orders."
        ),
    },
    "LOW": {
        "public_sms": (
            "INFO: {title} reported near {location}. No immediate danger. Stay tuned for updates. "
            "Info: {hotline}."
        ),
        "media_bulletin": (
            "SITUATION REPORT — {title}\nArea: {location}\nStatus: Monitoring in progress."
        ),
        "responder_radio": (
            "ROUTINE ADVISORY — {title} near {location}. No immediate action required."
        ),
    },
}

EMERGENCY_HOTLINE = "112 / 999"


def _generate_broadcast_messages(
    title: str,
    severity: str,
    lat: float,
    lon: float,
    location_name: str,
    shelter_name: str,
) -> Dict[str, str]:
    template = ALERT_TEMPLATES.get(severity, ALERT_TEMPLATES["MEDIUM"])
    context = {
        "title": title,
        "location": location_name or f"{lat:.4f}, {lon:.4f}",
        "shelter": shelter_name or "nearest designated shelter",
        "hotline": EMERGENCY_HOTLINE,
    }
    return {
        "public_sms": template["public_sms"].format(**context),
        "media_bulletin": template["media_bulletin"].format(**context),
        "responder_radio": template["responder_radio"].format(**context),
    }


def _estimate_reach(affected_population: int, severity: str) -> Dict[str, Any]:
    """Estimate communication reach based on population and severity urgency."""
    mobile_penetration = 0.82  # 82% mobile penetration assumed
    sms_reach = int(affected_population * mobile_penetration)
    radio_reach = int(affected_population * 0.65)
    alert_systems = ["Emergency SMS Broadcast", "Local Radio Frequency", "Social Media Push"]
    if severity == "CRITICAL":
        alert_systems.append("Outdoor PA / Siren Network")
        alert_systems.append("Civil Defence Warning System")
    return {
        "estimated_sms_reach": sms_reach,
        "estimated_radio_reach": radio_reach,
        "alert_channels": alert_systems,
    }


class CommunicationAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="CommunicationAgent", domain="communication")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"CommunicationAgent preparing broadcast plan for incident {task.incident_id}")

        ctx = task.context
        lat = ctx.get("latitude", 0)
        lon = ctx.get("longitude", 0)
        severity = ctx.get("severity", "MEDIUM")
        affected_population = ctx.get("affected_population", 1000)
        title = ctx.get("title", "Emergency Incident")
        description = ctx.get("description", "")
        weather = ctx.get("weather", {})

        # Get shelter name for broadcast
        shelters = ctx.get("nearby_shelters", [])
        shelter_name = shelters[0].get("name", "Nearest Evacuation Hub") if shelters else "Nearest Evacuation Hub"

        # Try to get human-readable location
        location_name = ctx.get("location_display_name", f"{lat:.4f}, {lon:.4f}")

        # 1. Generate broadcast messages
        broadcast_messages = _generate_broadcast_messages(
            title=title,
            severity=severity,
            lat=lat,
            lon=lon,
            location_name=location_name,
            shelter_name=shelter_name,
        )

        # 2. Estimate communication reach
        reach = _estimate_reach(affected_population, severity)

        # 3. Weather-adjusted communication notes
        wind = weather.get("wind_speed_kmh", 0)
        weather_code = weather.get("weather_code", 0)
        comms_notes = []
        if wind > 60:
            comms_notes.append(f"High wind ({wind} km/h) may affect outdoor PA system range — increase broadcast power by 20%.")
        if weather_code in {95, 96, 99}:
            comms_notes.append("Thunderstorm active — radio propagation may be degraded. Switch to SMS-primary broadcast mode.")

        # 4. Build communication directives
        directives = []

        directives.append({
            "action": "BROADCAST_PUBLIC_ALERT",
            "priority": "P1",
            "channel": "SMS + Social Media",
            "message_preview": broadcast_messages["public_sms"][:200] + "...",
            "estimated_reach": reach["estimated_sms_reach"],
            "detail": f"Immediately broadcast public alert to all mobile users within 10km radius of ({lat:.4f}, {lon:.4f}).",
            "evidence": f"Affected population: {affected_population:,}. Mobile penetration: 82%.",
        })

        directives.append({
            "action": "ISSUE_MEDIA_BULLETIN",
            "priority": "P1",
            "channel": "Press Release + Broadcast Media",
            "message_preview": broadcast_messages["media_bulletin"][:300] + "...",
            "detail": "Distribute formal emergency bulletin to all registered media outlets and public broadcasting services.",
            "evidence": f"Severity: {severity}. Incident: {title}.",
        })

        directives.append({
            "action": "RESPONDER_RADIO_BROADCAST",
            "priority": "P1",
            "channel": "Emergency Radio Network",
            "message_preview": broadcast_messages["responder_radio"],
            "estimated_reach": reach["estimated_radio_reach"],
            "detail": "Broadcast operational status update to all first responder units on emergency radio network.",
            "evidence": f"ICS activation for {severity} incident.",
        })

        if severity in ("CRITICAL", "HIGH"):
            directives.append({
                "action": "ACTIVATE_HOTLINE",
                "priority": "P1",
                "detail": (
                    f"Activate 24-hour emergency information hotline ({EMERGENCY_HOTLINE}). "
                    f"Staff with minimum 4 operators. Expected call volume: "
                    f"{int(affected_population * 0.05):,} calls/hour at peak."
                ),
                "evidence": f"High-severity event requiring public assistance capacity.",
            })

        for note in comms_notes:
            directives.append({
                "action": "WEATHER_COMMS_ADJUSTMENT",
                "priority": "P2",
                "detail": note,
                "evidence": f"WMO code {weather_code}, Wind {wind} km/h.",
            })

        # Misinformation mitigation
        if severity in ("CRITICAL", "HIGH"):
            directives.append({
                "action": "MISINFORMATION_MONITORING",
                "priority": "P2",
                "detail": "Monitor social media for misinformation. Issue corrections via official channels within 15 minutes of detection.",
                "evidence": "Standard protocol for severity-classified events.",
            })

        findings = {
            "broadcast_messages": broadcast_messages,
            "communication_reach": reach,
            "communication_directives": directives,
            "comms_weather_notes": comms_notes,
            "shelter_broadcast_target": shelter_name,
            "emergency_hotline": EMERGENCY_HOTLINE,
            "confidence_score": 97.0,  # Communication planning is internally derived, high confidence
            "data_provenance": "Alert template engine + population reach modeling + weather-adjusted broadcast plan",
        }

        summary = (
            f"CommunicationAgent generated {severity} broadcast plan for '{title}'. "
            f"Estimated reach: {reach['estimated_sms_reach']:,} SMS, {reach['estimated_radio_reach']:,} radio. "
            f"{len(reach['alert_channels'])} broadcast channels activated. "
            f"{len(directives)} communication directive(s) issued. "
            f"Primary shelter broadcast target: {shelter_name}."
        )

        self.logger.info(summary)
        return self._create_response(task.task_id, AgentState.COMPLETED, findings, summary, start_time)


communication_agent = CommunicationAgent()
