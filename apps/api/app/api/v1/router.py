from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, users, incidents, agents, memory, telemetry, analytics

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["User Management"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["Incident Management"])
api_router.include_router(agents.router, prefix="/incidents", tags=["AI Multi-Agent Systems"])
api_router.include_router(memory.router, prefix="/memories", tags=["Collective Memory Engine"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry & Observability"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Recommendations"])
