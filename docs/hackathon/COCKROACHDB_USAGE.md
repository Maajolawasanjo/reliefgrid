# 🪳 CockroachDB Architecture & Usage Specification

## 📌 Executive Summary

**ReliefGrid** utilizes **CockroachDB Serverless** as an enterprise-grade **Transactional Vector Memory System**. In emergency response environments, simple vector stores (like Pinecone or Chroma) are inadequate because they lack ACID transaction guarantees. Disaster operational state—such as incident status, responder locations, task dependencies, and vector embeddings—must be atomically consistent.

CockroachDB provides distributed SQL scalability, multi-region fault tolerance, PostgreSQL compatibility, and native `pgvector` indexing to ensure zero operational data loss during crisis events.

---

## 🧠 Why CockroachDB for AI Agent Memory?

### 1. Distributed Vector Indexing (`pgvector`)
ReliefGrid uses `pgvector` in CockroachDB to index 1024-dimensional semantic vector embeddings generated from operational SITREPs (Situation Reports), decision records, post-action reviews, and field updates.

```sql
-- Schema sample from ReliefGrid database migrations
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id),
    memory_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1024) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cosine Similarity Index for sub-millisecond vector recall
CREATE INDEX ON memories USING hnsw (embedding vector_cosine_ops);
```

### 2. Transactional Memory vs. External Vector DBs
In traditional RAG systems, updating a database record and updating a vector index are non-transactional operations. If an external vector DB update fails, the LLM memory becomes desynchronized from ground truth. 

CockroachDB solves this by storing relational state (`Incidents`, `Tasks`, `Users`) and vector embeddings in the **same distributed SQL cluster**, wrapped in ACID transactions:

```python
# Atomic Transaction in ReliefGrid Memory API
with session.begin():
    incident = session.query(Incident).get(incident_id)
    incident.status = "ESCALATED"
    
    new_memory = Memory(
        incident_id=incident.id,
        memory_type="DECISION_RECORD",
        content="Evacuation route altered due to Agege bridge flooding.",
        embedding=embedder.generate_vector(content),
    )
    session.add(new_memory)
# Both incident state and vector index commit atomically!
```

---

## 🤖 How ReliefGrid AI Agents Use CockroachDB Memory

Before any specialist agent (Medical, Logistics, Weather, etc.) formulates an operational recommendation, it executes a 3-step CockroachDB Memory Recall Pipeline:

1. **Contextual Embedding Generation**: The agent converts the current incident description into a 1024-dimensional vector embedding.
2. **Nearest-Neighbor Cosine Recall**: Queries CockroachDB for top $K$ historical memories matching the current crisis parameters:
   ```sql
   SELECT content, memory_type, 1 - (embedding <=> :query_vec) AS similarity_score
   FROM memories
   ORDER BY embedding <=> :query_vec ASC
   LIMIT 5;
   ```
3. **Prompt RAG Injection**: Injects past lessons learned (e.g. *"Agege Stadium shelter failed due to power loss in 2024 flood"*) into the AWS Bedrock system prompt, forcing the AI agent to avoid repeat errors.

---

## 🛠️ CockroachDB Developer Feedback & Recommendations

During the development of ReliefGrid, the following insights were noted for Cockroach Labs engineering:
* **Strengths**: `pgvector` support within CockroachDB Serverless allows seamless PostgreSQL ORM integration (SQLModel / SQLAlchemy) without needing separate vector drivers.
* **Feature Recommendation**: Native automated embedding generation triggers directly inside CockroachDB table definitions would reduce Python client-side vector pipeline overhead.

---

## 📬 Contact & Maintainer

* **Author**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
