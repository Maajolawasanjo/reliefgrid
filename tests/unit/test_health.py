def test_health_schema_import():
    from apps.api.app.schemas.health import HealthResponse
    response = HealthResponse(
        status="healthy",
        version="1.0.0",
        environment="test",
        services={"api": "online"},
        correlation_id="test-cid-123"
    )
    assert response.status == "healthy"
    assert response.correlation_id == "test-cid-123"
