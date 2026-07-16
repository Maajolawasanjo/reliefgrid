# 📜 Architectural Decision Records (ADRs)

## ADR-001: Selection of CockroachDB as Transactional Memory Layer

* **Status**: Accepted
* **Context**: Disaster response management platforms require vector recall (RAG) to learn from historical events. However, traditional vector databases (Pinecone, Qdrant, Chroma) operate outside relational database transactions. In a crisis, if a task assignment updates but the vector DB fails, memory desynchronization occurs.
* **Decision**: Adopt **CockroachDB Serverless** with native `pgvector` support.
* **Consequences**: Enables atomic transactions across relational database tables (`Incidents`, `Tasks`) and 1024-dimensional memory vectors in a single multi-region SQL database cluster.

---

## ADR-002: Selection of AWS Bedrock for Agent Foundation Models

* **Status**: Accepted
* **Context**: Autonomous AI agents handling disaster logistics require high-precision reasoning, strict schema compliance, and enterprise cloud SLA security.
* **Decision**: Adopt **AWS Bedrock** powering Anthropic Claude 3 models.
* **Consequences**: Provides sub-second response times, structured JSON outputs, and IAM cloud credential security.

---

## ADR-003: Standardizing Typography on Aspekta

* **Status**: Accepted
* **Context**: Emergency operations room displays require clear contrast, clean geometric letterforms, and zero visual fatigue over long shifts.
* **Decision**: Standardize all platform UI components strictly on **Aspekta & sans-serif**.
* **Consequences**: High visual legibility across all dashboard views (`/incidents`, `/memory`, `/executive`, `/telemetry`).
