import pytest
from agents.coordinator.agent import coordinator_agent
from agents.contracts import AgentTask, AgentState

@pytest.mark.asyncio
async def test_coordinator_agent_reasoning():
    task = AgentTask(
        incident_id="inc-999",
        assigned_agent="CoordinatorAgent",
        instruction="Formulate master emergency task plan",
        context={"title": "Coastal Storm", "description": "High surge levels", "severity": "HIGH"}
    )
    
    response = await coordinator_agent.execute_task(task)
    
    assert response.status == AgentState.COMPLETED
    assert "plan_summary" in response.findings
    assert "specialist_tasks" in response.findings
    assert len(response.findings["specialist_tasks"]) == 6
