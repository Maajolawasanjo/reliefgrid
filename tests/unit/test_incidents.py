import pytest
from pydantic import ValidationError
from apps.api.app.schemas.incident import IncidentCreate, SeverityLevel

def test_incident_create_valid_schema():
    payload = IncidentCreate(
        title="Severe Hurricane Warning",
        description="Hurricane warning issued for eastern coastline.",
        severity=SeverityLevel.CRITICAL,
        latitude=25.7617,
        longitude=-80.1918,
        affected_population=15000
    )
    assert payload.title == "Severe Hurricane Warning"
    assert payload.severity == SeverityLevel.CRITICAL
    assert payload.affected_population == 15000

def test_incident_create_invalid_coordinates():
    with pytest.raises(ValidationError):
        IncidentCreate(
            title="Out of Bounds Coordinates",
            description="Testing latitude validation constraint.",
            severity=SeverityLevel.HIGH,
            latitude=120.0, # Latitude out of bounds (>90)
            longitude=-80.1918
        )
