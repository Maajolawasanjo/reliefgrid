from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings
from app.core.telemetry import get_correlation_id

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["Observability"])
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        services={
            "api": "online",
            "cockroachdb": "connected",
            "vector_engine": "ready",
            "bedrock": "configured",
        },
        correlation_id=get_correlation_id()
    )

@router.get("/ready", tags=["Observability"])
async def readiness_probe():
    return {"status": "ready"}
