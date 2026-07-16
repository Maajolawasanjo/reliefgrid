import pytest
from agents.coordinator.agent import CoordinatorAgent
from agents.contracts import AgentTask

@pytest.mark.asyncio
async def test_coordinator_agent_initialization():
    agent = CoordinatorAgent()
    task = AgentTask(
        incident_id="inc-101",
        assigned_agent="CoordinatorAgent",
        instruction="Verify initial triage plan"
    )
    response = await agent.execute_task(task)
    assert str(response.status.value) == "COMPLETED"
    assert response.agent_name == "CoordinatorAgent"
