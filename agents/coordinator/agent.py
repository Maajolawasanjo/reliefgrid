import time
from typing import Dict, Any, List
from agents.base import BaseAgent
from agents.contracts import AgentTask, AgentResponse, AgentState
try:
    from apps.api.app.services.bedrock import bedrock_service
except ModuleNotFoundError:
    from app.services.bedrock import bedrock_service


class CoordinatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_name="CoordinatorAgent", domain="orchestration")

    async def execute_task(self, task: AgentTask) -> AgentResponse:
        start_time = time.time()
        self.logger.info(f"CoordinatorAgent decomposing incident {task.incident_id} into specialist mandates")

        ctx = task.context

        # Invoke Bedrock Claude for master plan decomposition
        reasoning_result = await bedrock_service.invoke_coordinator(ctx)

        plan_summary = reasoning_result.get("plan_summary", "Master plan orchestrated.")
        specialist_tasks = reasoning_result.get("specialist_tasks", {})

        findings = {
            "status": "plan_decomposed",
            "plan_summary": plan_summary,
            "specialist_tasks": specialist_tasks,
            "agents_dispatched": list(specialist_tasks.keys()),
        }

        summary = (
            f"CoordinatorAgent decomposed incident '{ctx.get('title', 'Unknown')}' "
            f"into {len(specialist_tasks)} specialist mandate(s): {', '.join(specialist_tasks.keys())}."
        )

        self.logger.info(summary)
        return self._create_response(
            task_id=task.task_id,
            status=AgentState.COMPLETED,
            findings=findings,
            summary=summary,
            start_time=start_time
        )

    async def orchestrate_all_specialists(
        self,
        task: AgentTask,
        coordinator_response: AgentResponse,
    ) -> Dict[str, AgentResponse]:
        """
        Execute all specialist agents in parallel using the coordinator's
        decomposed task plan. Each agent operates independently on the shared
        context and returns structured findings with evidence.
        """
        import asyncio

        # Import specialist agents lazily to avoid circular imports
        from agents.weather.agent import weather_agent
        from agents.medical.agent import medical_agent
        from agents.shelter.agent import shelter_agent
        from agents.logistics.agent import logistics_agent
        from agents.infrastructure.agent import infrastructure_agent
        from agents.communication.agent import communication_agent

        specialist_registry = {
            "WeatherAgent": weather_agent,
            "MedicalAgent": medical_agent,
            "ShelterAgent": shelter_agent,
            "LogisticsAgent": logistics_agent,
            "InfrastructureAgent": infrastructure_agent,
            "CommunicationAgent": communication_agent,
        }

        specialist_instructions = coordinator_response.findings.get("specialist_tasks", {})

        async def run_specialist(agent_name: str, instruction: str) -> tuple:
            agent = specialist_registry.get(agent_name)
            if not agent:
                self.logger.warning(f"No registered specialist for {agent_name}, skipping.")
                return agent_name, None
            try:
                specialist_task = AgentTask(
                    incident_id=task.incident_id,
                    assigned_agent=agent_name,
                    instruction=instruction,
                    context=task.context,
                )
                response = await agent.execute_task(specialist_task)
                self.logger.info(f"Specialist {agent_name} completed in {response.execution_time_ms:.0f}ms")
                return agent_name, response
            except Exception as e:
                self.logger.error(f"Specialist {agent_name} failed: {e}")
                return agent_name, None

        # Execute all specialists concurrently
        tasks = [
            run_specialist(agent_name, instruction)
            for agent_name, instruction in specialist_instructions.items()
            if agent_name in specialist_registry
        ]

        results = await asyncio.gather(*tasks)
        return {name: resp for name, resp in results if resp is not None}


coordinator_agent = CoordinatorAgent()
