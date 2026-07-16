# 👑 Master Coordinator Agent Specification

## 📌 Role & Responsibility

The **Master Coordinator Agent** acts as the central intelligence commander of ReliefGrid. It evaluates new disaster declarations, queries CockroachDB memories, decomposes complex crisis events into actionable sub-tasks, and assigns specific responsibilities to domain specialist agents.

---

## 🛠️ Capabilities & Input/Output Contracts

* **Input**: Master incident report payload, operational sector location, active responder counts.
* **Output**: Prioritized multi-agency master action plan with risk metrics and task delegations.
