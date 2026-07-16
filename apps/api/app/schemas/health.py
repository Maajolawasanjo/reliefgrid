from pydantic import BaseModel
from typing import Dict

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    services: Dict[str, str]
    correlation_id: str
