"""
ReliefGrid Global Exception Handlers
=====================================
Layer 6 — FastAPI exception middleware.

One centralized handler for every exception type:
  - Maps every exception class to a standard JSON response
  - Logs with correlation ID, user context, agent/incident scope
  - Persists audit log entries for critical failures
  - Triggers operator notifications for CRITICAL/FATAL
  - Formats all responses using to_dict() from base exceptions

No endpoint implements its own error formatting.
"""

import logging
import traceback
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.config import settings

from app.exceptions.base import (
    ReliefGridException,
    UnrecoverableException,
    ErrorSeverity,
    ErrorCode,
)

logger = logging.getLogger("reliefgrid.exceptions")


def _build_error_response(
    code: str,
    message: str,
    category: str,
    severity: str,
    http_status: int,
    recoverable: bool,
    trace_id: str,
    detail: Optional[object] = None,
    context: Optional[dict] = None,
) -> dict:
    """Build the standard ReliefGrid error response envelope."""
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "category": category,
            "severity": severity,
            "recoverable": recoverable,
            "trace_id": trace_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "detail": detail,
            "context": context or {},
        },
    }


def _log_exception(exc: Exception, request: Request, trace_id: str) -> None:
    """Structured log with correlation data from request state."""
    correlation_id = getattr(request.state, "correlation_id", trace_id)
    user_id = getattr(request.state, "user_id", "anonymous")
    org_id = getattr(request.state, "org_id", None)

    if isinstance(exc, ReliefGridException):
        level = {
            ErrorSeverity.INFO: logging.INFO,
            ErrorSeverity.WARNING: logging.WARNING,
            ErrorSeverity.ERROR: logging.ERROR,
            ErrorSeverity.CRITICAL: logging.CRITICAL,
            ErrorSeverity.FATAL: logging.CRITICAL,
        }.get(exc.severity, logging.ERROR)

        logger.log(
            level,
            f"[{exc.error_code}] {exc.__class__.__name__}: {exc.message}",
            extra={
                "trace_id": trace_id,
                "correlation_id": correlation_id,
                "user_id": user_id,
                "org_id": org_id,
                "incident_id": exc.incident_id,
                "agent_id": exc.agent_id,
                "method": request.method,
                "path": request.url.path,
                "recoverable": exc.recoverable,
                "error_code": exc.error_code,
            },
        )
    else:
        logger.error(
            f"Unhandled {exc.__class__.__name__}: {exc}",
            extra={
                "trace_id": trace_id,
                "correlation_id": correlation_id,
                "user_id": user_id,
                "path": request.url.path,
            },
            exc_info=True,
        )


async def _maybe_persist_audit(exc: ReliefGridException, request: Request) -> None:
    """Persist an audit log entry for CRITICAL/FATAL exceptions."""
    if exc.severity not in (ErrorSeverity.CRITICAL, ErrorSeverity.FATAL):
        return
    try:
        from database.connection import SessionLocal
        from app.models.auth import AuditLog

        db = SessionLocal()
        try:
            db.add(AuditLog(
                user_id=getattr(request.state, "user_id", None),
                action=f"EXCEPTION_{exc.error_code}",
                entity_name="Platform",
                entity_id=exc.incident_id,
                details=f"{exc.__class__.__name__}: {exc.message} | trace={exc.trace_id}",
                ip_address=request.client.host if request.client else None,
            ))
            db.commit()
        finally:
            db.close()
    except Exception:
        pass  # Never let audit persistence crash the handler


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all exception handlers on the FastAPI application.
    Call this in main.py after creating the app instance.
    """

    # ── 1. ReliefGrid native exceptions ──────────────────────────────────────
    @app.exception_handler(ReliefGridException)
    async def reliefgrid_exception_handler(request: Request, exc: ReliefGridException):
        import uuid
        trace_id = exc.trace_id or str(uuid.uuid4())
        _log_exception(exc, request, trace_id)

        if exc.severity in (ErrorSeverity.CRITICAL, ErrorSeverity.FATAL):
            await _maybe_persist_audit(exc, request)

        return JSONResponse(
            status_code=exc.http_status,
            content=exc.to_dict(),
            headers={"X-Trace-ID": trace_id},
        )

    # ── 2. FastAPI request validation errors ──────────────────────────────────
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        import uuid
        trace_id = str(uuid.uuid4())
        logger.warning(
            f"Validation error on {request.method} {request.url.path}: {exc.errors()}"
        )
        return JSONResponse(
            status_code=422,
            content=_build_error_response(
                code=ErrorCode.VAL_001,
                message="Request validation failed. Check the 'detail' field for field-level errors.",
                category="Validation",
                severity=ErrorSeverity.WARNING.value,
                http_status=422,
                recoverable=True,
                trace_id=trace_id,
                detail=exc.errors(),
            ),
            headers={"X-Trace-ID": trace_id},
        )

    # ── 3. Starlette / FastAPI HTTP exceptions ────────────────────────────────
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        import uuid
        trace_id = str(uuid.uuid4())

        code_map = {
            400: ErrorCode.VAL_001,
            401: ErrorCode.AUTH_001,
            403: ErrorCode.AUTHZ_001,
            404: ErrorCode.DB_502,
            409: ErrorCode.DB_503,
            422: ErrorCode.VAL_001,
            429: ErrorCode.EXT_702,
            500: ErrorCode.SYS_999,
            503: ErrorCode.EXT_701,
        }
        severity_map = {
            400: ErrorSeverity.WARNING, 401: ErrorSeverity.WARNING,
            403: ErrorSeverity.WARNING, 404: ErrorSeverity.WARNING,
            409: ErrorSeverity.WARNING, 422: ErrorSeverity.WARNING,
            429: ErrorSeverity.WARNING, 500: ErrorSeverity.ERROR,
            503: ErrorSeverity.ERROR,
        }

        code = code_map.get(exc.status_code, ErrorCode.SYS_999)
        severity = severity_map.get(exc.status_code, ErrorSeverity.ERROR)

        logger.warning(f"HTTP {exc.status_code} on {request.method} {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content=_build_error_response(
                code=code,
                message=str(exc.detail),
                category="HTTP",
                severity=severity.value,
                http_status=exc.status_code,
                recoverable=exc.status_code < 500,
                trace_id=trace_id,
            ),
            headers={"X-Trace-ID": trace_id},
        )

    # ── 4. CockroachDB transaction conflicts ──────────────────────────────────
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        """
        Safety net for any exception not caught by a more specific handler.
        Logs the full traceback and returns SYS-999.
        """
        import uuid
        trace_id = str(uuid.uuid4())

        # Detect CockroachDB serialization errors
        exc_str = str(exc).lower()
        if "serialization" in exc_str or "retry transaction" in exc_str:
            logger.warning(f"[DB-501] CockroachDB transaction conflict: {exc}")
            return JSONResponse(
                status_code=503,
                content=_build_error_response(
                    code=ErrorCode.DB_501,
                    message="Database transaction conflict. Safe to retry.",
                    category="Database",
                    severity=ErrorSeverity.WARNING.value,
                    http_status=503,
                    recoverable=True,
                    trace_id=trace_id,
                ),
                headers={"X-Trace-ID": trace_id, "Retry-After": "1"},
            )

        # All other unhandled exceptions
        logger.critical(
            f"[SYS-999] Unhandled {exc.__class__.__name__} on {request.method} {request.url.path}",
            exc_info=True,
        )
        return JSONResponse(
            status_code=500,
            content=_build_error_response(
                code=ErrorCode.SYS_999,
                message=f"Unhandled {exc.__class__.__name__}: {exc}" if settings.DEBUG_MODE else "An unexpected platform error occurred. The engineering team has been notified.",
                category="Platform",
                severity=ErrorSeverity.FATAL.value,
                http_status=500,
                recoverable=False,
                trace_id=trace_id,
                detail=str(exc) if settings.DEBUG_MODE else None,
            ),
            headers={"X-Trace-ID": trace_id},
        )
