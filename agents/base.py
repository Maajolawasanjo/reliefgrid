from abc import ABC, abstractmethod
from typing import Dict, Any
import time
from agents.contracts import AgentTask, AgentResponse, AgentState
from agents.logger import get_agent_logger

class BaseAgent(ABC):
    def __init__(self, agent_name: str, domain: str):
        self.agent_name = agent_name
        self.domain = domain
        self.logger = get_agent_logger(agent_name)

    @abstractmethod
    async def execute_task(self, task: AgentTask) -> AgentResponse:
        pass

    def _create_response(self, task_id: str, status: AgentState, findings: Dict[str, Any], summary: str, start_time: float) -> AgentResponse:
        execution_time = (time.time() - start_time) * 1000
        return AgentResponse(
            task_id=task_id,
            agent_name=self.agent_name,
            status=status,
            findings=findings,
            reasoning_summary=summary,
            execution_time_ms=execution_time
        )
