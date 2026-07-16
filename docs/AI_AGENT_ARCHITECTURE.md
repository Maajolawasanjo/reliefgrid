# 🤖 AI Agent Architecture Specification

## 📌 Agent Swarm Topology

ReliefGrid operates a **Hierarchical Multi-Agent Swarm** composed of a **Master Coordinator Agent** and **6 Domain Specialist Agents**:

```
                       ┌────────────────────────────┐
                       │   Master Coordinator Agent │
                       └─────────────┬──────────────┘
                                     │ Delegated Tasks & Analysis
       ┌───────────┬─────────────┼─────────────┬───────────┬───────────┐
       ▼           ▼             ▼             ▼           ▼           ▼
  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐
  │ Weather │ │ Infra    │ │ Medical   │ │ Shelter  │ │Logistics│ │ Comms     │
  │ Agent   │ │ Agent    │ │ Agent     │ │ Agent    │ │ Agent   │ │ Agent     │
  └─────────┘ └──────────┘ └───────────┘ └──────────┘ └─────────┘ └───────────┘
```

---

## ⚙️ Agent Execution Contract

1. **Input Context**: Ingests incident severity, GPS location, current weather telemetry, and retrieved CockroachDB memories.
2. **Pydantic Validation**: Converts Bedrock responses into structured Python models enforcing valid schemas.
3. **Execution & Auditing**: Writes output action steps to the `agent_assignments` table with timeline audit logs.
