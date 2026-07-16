class AgentExecutionException(Exception):
    def __init__(self, agent_name: str, message: str):
        self.agent_name = agent_name
        self.message = message
        super().__init__(f"[{agent_name}] Execution Error: {message}")

class AgentTimeoutException(AgentExecutionException):
    pass

class AgentReasoningException(AgentExecutionException):
    pass
