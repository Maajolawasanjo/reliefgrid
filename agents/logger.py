import logging

def get_agent_logger(agent_name: str) -> logging.Logger:
    logger = logging.getLogger(f"reliefgrid.agents.{agent_name}")
    logger.setLevel(logging.INFO)
    return logger
