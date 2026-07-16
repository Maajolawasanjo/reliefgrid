"""
ReliefGrid Enterprise Exception Architecture
============================================
Layer 1 — Exception Taxonomy (full hierarchy)
Layer 2 — Checked / Recoverable exceptions
Layer 3 — Unchecked / Critical exceptions
Layer 4 — Domain-specific exceptions
Layer 5 — Recovery policy metadata on every exception class
Layer 6 — Error Code Registry (structured codes)
Layer 7 — Severity classification

All exceptions extend ReliefGridException which carries:
  - error_code     : str  (e.g. "WX-101")
  - category       : str  (e.g. "ExternalService")
  - severity       : ErrorSeverity
  - recoverable    : bool
  - retry          : bool
  - max_retries    : int
  - http_status    : int  (for FastAPI handler mapping)
  - incident_id    : optional
  - agent_id       : optional
  - user_id        : optional
  - trace_id       : optional
"""

from __future__ import annotations
from enum import Enum
from typing import Optional, Dict, Any
import uuid


# ── Severity classification ───────────────────────────────────────────────────

class ErrorSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"
    FATAL = "FATAL"


# ── Error code registry ───────────────────────────────────────────────────────

class ErrorCode:
    """Structured error code registry. Format: <DOMAIN>-<NUMBER>"""

    # Authentication
    AUTH_001 = "AUTH-001"   # Invalid credentials
    AUTH_002 = "AUTH-002"   # Expired token
    AUTH_003 = "AUTH-003"   # Invalid/malformed token
    AUTH_004 = "AUTH-004"   # Refresh token expired
    AUTH_005 = "AUTH-005"   # Token revoked

    # Authorization
    AUTHZ_001 = "AUTHZ-001"  # Permission denied
    AUTHZ_002 = "AUTHZ-002"  # Organization access denied
    AUTHZ_003 = "AUTHZ-003"  # RBAC violation

    # Validation
    VAL_001 = "VAL-001"   # Invalid request payload
    VAL_002 = "VAL-002"   # Invalid incident data
    VAL_003 = "VAL-003"   # Invalid coordinates
    VAL_004 = "VAL-004"   # Invalid severity level
    VAL_005 = "VAL-005"   # Missing required field

    # Agent
    AGENT_101 = "AGENT-101"  # Agent timeout
    AGENT_102 = "AGENT-102"  # Agent execution failure
    AGENT_103 = "AGENT-103"  # Agent communication failure
    AGENT_104 = "AGENT-104"  # Agent unavailable
    AGENT_105 = "AGENT-105"  # Confidence below threshold
    AGENT_106 = "AGENT-106"  # Task planning failure
    AGENT_107 = "AGENT-107"  # Dispatch failure

    # Memory
    MEM_201 = "MEM-201"  # Embedding generation failed
    MEM_202 = "MEM-202"  # Vector search failed
    MEM_203 = "MEM-203"  # Memory persistence failed
    MEM_204 = "MEM-204"  # Memory record not found
    MEM_205 = "MEM-205"  # Memory corrupted

    # GIS
    GIS_301 = "GIS-301"  # Invalid location / coordinates
    GIS_302 = "GIS-302"  # Route calculation failed
    GIS_303 = "GIS-303"  # Reverse geocoding failed
    GIS_304 = "GIS-304"  # OSM provider unavailable
    GIS_305 = "GIS-305"  # OSRM provider unavailable

    # Weather
    WX_401 = "WX-401"   # Weather API unavailable
    WX_402 = "WX-402"   # Weather data stale/invalid
    WX_403 = "WX-403"   # Forecast unavailable

    # Database
    DB_501 = "DB-501"   # Transaction conflict (CockroachDB retry)
    DB_502 = "DB-502"   # Record not found
    DB_503 = "DB-503"   # Duplicate record (conflict)
    DB_504 = "DB-504"   # Connection failure
    DB_505 = "DB-505"   # Optimistic lock conflict

    # Bedrock / AI
    AI_601 = "AI-601"   # Bedrock timeout
    AI_602 = "AI-602"   # Bedrock invocation failed
    AI_603 = "AI-603"   # Model response parse error
    AI_604 = "AI-604"   # Token limit exceeded

    # External APIs
    EXT_701 = "EXT-701"  # External API unavailable
    EXT_702 = "EXT-702"  # External API rate limited
    EXT_703 = "EXT-703"  # External API bad response

    # Shelter domain
    SHELTER_801 = "SHELTER-801"  # No shelter found
    SHELTER_802 = "SHELTER-802"  # Shelter at capacity
    SHELTER_803 = "SHELTER-803"  # Shelter access route blocked

    # Medical domain
    MED_802 = "MED-802"  # No hospital found
    MED_803 = "MED-803"  # Hospital capacity exceeded

    # Infrastructure domain
    INFRA_801 = "INFRA-801"  # Road blocked
    INFRA_802 = "INFRA-802"  # Bridge unavailable
    INFRA_803 = "INFRA-803"  # Route unavailable

    # Logistics domain
    LOG_801 = "LOG-801"  # Route unavailable
    LOG_802 = "LOG-802"  # Resource unavailable

    # Communication domain
    COMM_801 = "COMM-801"  # Notification delivery failed
    COMM_802 = "COMM-802"  # Broadcast failure

    # System
    SYS_901 = "SYS-901"  # Configuration error
    SYS_902 = "SYS-902"  # Dependency injection failure
    SYS_903 = "SYS-903"  # Serialization error
    SYS_999 = "SYS-999"  # Unexpected internal error


# ── Base exception ────────────────────────────────────────────────────────────

class ReliefGridException(Exception):
    """
    Root of the ReliefGrid exception hierarchy.
    All platform exceptions derive from this class.

    Recovery policy is embedded in the class to enable consistent
    handling by the global exception middleware.
    """

    # Default recovery policy — override in subclasses
    error_code: str = ErrorCode.SYS_999
    category: str = "Platform"
    severity: ErrorSeverity = ErrorSeverity.ERROR
    http_status: int = 500
    recoverable: bool = False
    retry: bool = False
    max_retries: int = 0
    fallback_available: bool = False
    notify_operator: bool = False
    escalate: bool = False

    def __init__(
        self,
        message: str,
        *,
        error_code: Optional[str] = None,
        detail: Optional[Any] = None,
        incident_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        user_id: Optional[str] = None,
        org_id: Optional[str] = None,
        trace_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.detail = detail
        self.incident_id = incident_id
        self.agent_id = agent_id
        self.user_id = user_id
        self.org_id = org_id
        self.trace_id = trace_id or str(uuid.uuid4())
        self.context = context or {}
        # Allow per-instance error code override
        if error_code:
            self.error_code = error_code

    def to_dict(self) -> Dict[str, Any]:
        """Serialize to the standard API error response shape."""
        from datetime import datetime
        return {
            "success": False,
            "error": {
                "code": self.error_code,
                "message": self.message,
                "category": self.category,
                "severity": self.severity.value,
                "recoverable": self.recoverable,
                "retry": self.retry,
                "fallback_available": self.fallback_available,
                "trace_id": self.trace_id,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "context": {
                    k: v for k, v in self.context.items()
                    if k not in ("password", "token", "secret")
                },
                "incident_id": self.incident_id,
                "agent_id": self.agent_id,
            },
        }

    def __repr__(self) -> str:
        return (
            f"<{self.__class__.__name__} code={self.error_code} "
            f"severity={self.severity.value} message='{self.message}'>"
        )


# ═══════════════════════════════════════════════════════════════════════════════
# Layer 2 — Recoverable (Checked) Exceptions
# ═══════════════════════════════════════════════════════════════════════════════

class RecoverableException(ReliefGridException):
    """Base class for all recoverable failures — caller is expected to handle."""
    recoverable = True
    http_status = 503


# ── Authentication ────────────────────────────────────────────────────────────

class AuthenticationException(ReliefGridException):
    error_code = ErrorCode.AUTH_001
    category = "Authentication"
    severity = ErrorSeverity.WARNING
    http_status = 401
    recoverable = True

# Backward compatibility alias
AuthenticationError = AuthenticationException



class InvalidCredentialsException(AuthenticationException):
    error_code = ErrorCode.AUTH_001

class TokenExpiredException(AuthenticationException):
    error_code = ErrorCode.AUTH_002
    retry = False  # Must re-authenticate

class TokenInvalidException(AuthenticationException):
    error_code = ErrorCode.AUTH_003

class RefreshTokenExpiredException(AuthenticationException):
    error_code = ErrorCode.AUTH_004


# ── Authorization ─────────────────────────────────────────────────────────────

class AuthorizationException(ReliefGridException):
    error_code = ErrorCode.AUTHZ_001
    category = "Authorization"
    severity = ErrorSeverity.WARNING
    http_status = 403
    recoverable = False

class PermissionDeniedException(AuthorizationException):
    error_code = ErrorCode.AUTHZ_001

class OrganizationAccessDeniedException(AuthorizationException):
    error_code = ErrorCode.AUTHZ_002

class RBACViolationException(AuthorizationException):
    error_code = ErrorCode.AUTHZ_003




# ── Validation ────────────────────────────────────────────────────────────────

class ValidationException(ReliefGridException):
    error_code = ErrorCode.VAL_001
    category = "Validation"
    severity = ErrorSeverity.WARNING
    http_status = 422
    recoverable = True

class InvalidIncidentException(ValidationException):
    error_code = ErrorCode.VAL_002

class InvalidCoordinatesException(ValidationException):
    error_code = ErrorCode.VAL_003

class InvalidSeverityException(ValidationException):
    error_code = ErrorCode.VAL_004

class InvalidPayloadException(ValidationException):
    error_code = ErrorCode.VAL_001


# ── Resource Not Found ────────────────────────────────────────────────────────

class NotFoundException(ReliefGridException):
    error_code = ErrorCode.DB_502
    category = "Resource"
    severity = ErrorSeverity.WARNING
    http_status = 404
    recoverable = False

class IncidentNotFoundException(NotFoundException):
    pass

class UserNotFoundException(NotFoundException):
    pass

class MemoryNotFoundException(NotFoundException):
    error_code = ErrorCode.MEM_204


# ── Conflict ──────────────────────────────────────────────────────────────────

class ConflictException(ReliefGridException):
    error_code = ErrorCode.DB_503
    category = "Resource"
    severity = ErrorSeverity.WARNING
    http_status = 409
    recoverable = True
    retry = True
    max_retries = 3


# ══════════════════════════════════════════════════════════════════════════════
# Layer 3 — Agent Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class AgentException(RecoverableException):
    error_code = ErrorCode.AGENT_102
    category = "Agent"
    severity = ErrorSeverity.ERROR
    http_status = 500
    fallback_available = True
    notify_operator = True

class AgentTimeoutException(AgentException):
    error_code = ErrorCode.AGENT_101
    severity = ErrorSeverity.WARNING
    retry = True
    max_retries = 2

class AgentExecutionException(AgentException):
    error_code = ErrorCode.AGENT_102
    fallback_available = True

class AgentCommunicationException(AgentException):
    error_code = ErrorCode.AGENT_103
    retry = True
    max_retries = 3

class AgentUnavailableException(AgentException):
    error_code = ErrorCode.AGENT_104
    fallback_available = True

class AgentConfidenceException(AgentException):
    """Raised when agent confidence score falls below operational threshold."""
    error_code = ErrorCode.AGENT_105
    severity = ErrorSeverity.WARNING
    recoverable = True

class TaskPlanningException(AgentException):
    error_code = ErrorCode.AGENT_106
    notify_operator = True

class DispatchFailureException(AgentException):
    error_code = ErrorCode.AGENT_107
    escalate = True


# ══════════════════════════════════════════════════════════════════════════════
# Layer 4 — Memory Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class MemoryException(RecoverableException):
    error_code = ErrorCode.MEM_201
    category = "Memory"
    severity = ErrorSeverity.ERROR
    fallback_available = True

class EmbeddingException(MemoryException):
    """Bedrock or local embedding generation failed — fallback to pseudo-vector."""
    error_code = ErrorCode.MEM_201
    fallback_available = True
    retry = True
    max_retries = 2

class VectorSearchException(MemoryException):
    error_code = ErrorCode.MEM_202
    fallback_available = True  # Falls back to keyword search

class MemoryPersistenceException(MemoryException):
    error_code = ErrorCode.MEM_203
    severity = ErrorSeverity.CRITICAL
    notify_operator = True
    fallback_available = False

class MemoryCorruptedException(MemoryException):
    error_code = ErrorCode.MEM_205
    severity = ErrorSeverity.CRITICAL
    escalate = True


# ══════════════════════════════════════════════════════════════════════════════
# Layer 5 — GIS Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class GISException(RecoverableException):
    error_code = ErrorCode.GIS_301
    category = "GIS"
    fallback_available = True  # Always falls back to simulated GIS data

class InvalidLocationException(GISException):
    error_code = ErrorCode.GIS_301
    http_status = 422
    severity = ErrorSeverity.WARNING
    recoverable = True

class RoutingException(GISException):
    error_code = ErrorCode.GIS_302
    fallback_available = True  # Falls back to haversine estimate

class ReverseGeocodeException(GISException):
    error_code = ErrorCode.GIS_303
    severity = ErrorSeverity.WARNING
    fallback_available = True  # Falls back to lat/lon display

class MapProviderUnavailableException(GISException):
    error_code = ErrorCode.GIS_304
    retry = True
    max_retries = 2
    fallback_available = True


# ══════════════════════════════════════════════════════════════════════════════
# Layer 6 — Weather Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class WeatherException(RecoverableException):
    error_code = ErrorCode.WX_401
    category = "Weather"
    severity = ErrorSeverity.WARNING
    fallback_available = True  # Falls back to cached/simulated weather
    retry = True
    max_retries = 2

class WeatherAPIUnavailableException(WeatherException):
    error_code = ErrorCode.WX_401

class WeatherDataStaleException(WeatherException):
    error_code = ErrorCode.WX_402
    severity = ErrorSeverity.INFO


# ══════════════════════════════════════════════════════════════════════════════
# Layer 7 — Bedrock / AI Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class BedrockException(RecoverableException):
    error_code = ErrorCode.AI_601
    category = "AI"
    severity = ErrorSeverity.ERROR
    fallback_available = True  # Falls back to deterministic response
    retry = True
    max_retries = 3

class BedrockTimeoutException(BedrockException):
    error_code = ErrorCode.AI_601
    severity = ErrorSeverity.WARNING

class BedrockInvocationException(BedrockException):
    error_code = ErrorCode.AI_602

class BedrockParseException(BedrockException):
    error_code = ErrorCode.AI_603
    retry = False  # Model returned garbage, retry won't help

class BedrockTokenLimitException(BedrockException):
    error_code = ErrorCode.AI_604
    retry = False


# ══════════════════════════════════════════════════════════════════════════════
# Layer 8 — Database Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class DatabaseException(ReliefGridException):
    error_code = ErrorCode.DB_501
    category = "Database"
    severity = ErrorSeverity.ERROR
    http_status = 503
    notify_operator = True

class TransactionConflictException(DatabaseException):
    """CockroachDB optimistic locking / serialization conflict — retry is safe."""
    error_code = ErrorCode.DB_501
    recoverable = True
    retry = True
    max_retries = 5
    severity = ErrorSeverity.WARNING

class RecordNotFoundException(NotFoundException):
    error_code = ErrorCode.DB_502

class DuplicateRecordException(ConflictException):
    error_code = ErrorCode.DB_503

class DatabaseConnectionException(DatabaseException):
    error_code = ErrorCode.DB_504
    severity = ErrorSeverity.CRITICAL
    escalate = True


# ══════════════════════════════════════════════════════════════════════════════
# Layer 9 — External API Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class ExternalAPIException(RecoverableException):
    error_code = ErrorCode.EXT_701
    category = "ExternalService"
    fallback_available = True
    retry = True
    max_retries = 2

class ExternalAPIUnavailableException(ExternalAPIException):
    error_code = ErrorCode.EXT_701

class ExternalAPIRateLimitedException(ExternalAPIException):
    error_code = ErrorCode.EXT_702
    retry = True
    max_retries = 1  # One retry after backoff

class ExternalAPIBadResponseException(ExternalAPIException):
    error_code = ErrorCode.EXT_703
    retry = False


# ══════════════════════════════════════════════════════════════════════════════
# Layer 10 — Domain Exceptions (Shelter, Medical, Infra, Logistics, Comm)
# ══════════════════════════════════════════════════════════════════════════════

class ShelterException(RecoverableException):
    category = "Shelter"
    fallback_available = True

class ShelterNotFoundException(ShelterException):
    error_code = ErrorCode.SHELTER_801
    http_status = 404

class ShelterCapacityException(ShelterException):
    error_code = ErrorCode.SHELTER_802
    severity = ErrorSeverity.WARNING

class ShelterAccessBlockedException(ShelterException):
    error_code = ErrorCode.SHELTER_803
    severity = ErrorSeverity.ERROR
    notify_operator = True


class MedicalException(RecoverableException):
    category = "Medical"
    fallback_available = True

class HospitalNotFoundException(MedicalException):
    error_code = ErrorCode.MED_802
    http_status = 404

class HospitalCapacityException(MedicalException):
    error_code = ErrorCode.MED_803
    severity = ErrorSeverity.WARNING
    notify_operator = True


class InfrastructureException(RecoverableException):
    category = "Infrastructure"
    fallback_available = True

class RoadBlockedException(InfrastructureException):
    error_code = ErrorCode.INFRA_801
    severity = ErrorSeverity.ERROR
    notify_operator = True

class BridgeUnavailableException(InfrastructureException):
    error_code = ErrorCode.INFRA_802
    severity = ErrorSeverity.CRITICAL
    escalate = True

class RouteUnavailableException(InfrastructureException):
    error_code = ErrorCode.INFRA_803
    fallback_available = True


class LogisticsException(RecoverableException):
    category = "Logistics"
    fallback_available = True

class LogisticsRouteUnavailableException(LogisticsException):
    error_code = ErrorCode.LOG_801

class ResourceUnavailableException(LogisticsException):
    error_code = ErrorCode.LOG_802
    severity = ErrorSeverity.WARNING


class CommunicationException(RecoverableException):
    category = "Communication"
    fallback_available = True

class NotificationDeliveryException(CommunicationException):
    error_code = ErrorCode.COMM_801
    severity = ErrorSeverity.WARNING

class BroadcastFailureException(CommunicationException):
    error_code = ErrorCode.COMM_802
    severity = ErrorSeverity.ERROR
    notify_operator = True


# ══════════════════════════════════════════════════════════════════════════════
# Layer 11 — Unchecked / Critical / System Exceptions
# ══════════════════════════════════════════════════════════════════════════════

class UnrecoverableException(ReliefGridException):
    """
    Unrecoverable failures — indicates a programming or infrastructure defect.
    These should be logged, traced, and investigated. Never silently swallowed.
    """
    recoverable = False
    retry = False
    escalate = True
    notify_operator = True
    severity = ErrorSeverity.FATAL

class ConfigurationException(UnrecoverableException):
    error_code = ErrorCode.SYS_901
    category = "Configuration"
    http_status = 500

class InternalPlatformException(UnrecoverableException):
    error_code = ErrorCode.SYS_999
    category = "Platform"
    http_status = 500

class SerializationException(UnrecoverableException):
    error_code = ErrorCode.SYS_903
    category = "Platform"

class BusinessRuleException(ReliefGridException):
    """Raised when a valid request violates a domain business rule."""
    category = "BusinessRule"
    severity = ErrorSeverity.WARNING
    http_status = 422
    recoverable = True


# ══════════════════════════════════════════════════════════════════════════════
# Legacy Backward-Compatibility Aliases
# ══════════════════════════════════════════════════════════════════════════════

AuthenticationError = AuthenticationException
PermissionDeniedError = PermissionDeniedException
AuthorizationError = AuthorizationException
NotFoundError = NotFoundException
ValidationError = ValidationException
AgentExecutionError = AgentExecutionException
BedrockInvocationError = BedrockInvocationException

