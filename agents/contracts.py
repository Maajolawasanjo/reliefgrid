from enum import Enum
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid

class AgentState(str, Enum):
    INITIALIZED = "INITIALIZED"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class AgentMessage(BaseModel):
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_agent: str
    recipient_agent: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentTask(BaseModel):
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    incident_id: str
    assigned_agent: str
    instruction: str
    context: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentResponse(BaseModel):
    task_id: str
    agent_name: str
    status: AgentState
    findings: Dict[str, Any]
    reasoning_summary: str
    memories_referenced: List[str] = Field(default_factory=list)
    execution_time_ms: float
