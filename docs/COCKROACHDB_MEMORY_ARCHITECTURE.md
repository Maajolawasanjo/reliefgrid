# 🧠 CockroachDB Memory Architecture Deep-Dive

## 📌 Memory Layer Mechanics

ReliefGrid treats historical operational knowledge as a **Transactional Memory Layer**. Storing 1024-dimensional vector embeddings within CockroachDB allows AI agents to perform semantic RAG searches without sacrificing ACID transactional consistency.

---

## 🛠️ HNSW Vector Cosine Similarity Search

Memory lookup uses the Cosine Distance Operator (`<=>`) to rank memories by semantic similarity:

```sql
SELECT id, memory_type, content, metadata, 1 - (embedding <=> :query_vec) AS similarity_score
FROM memories
WHERE 1 - (embedding <=> :query_vec) >= :min_similarity
ORDER BY embedding <=> :query_vec ASC
LIMIT :limit;
```

---

## 🔄 Memory Insertion Lifecycle

1. **Agent Action / Incident Resolved**: The Coordinator Agent or field team logs a final incident outcome.
2. **Embedding Calculation**: Text content is vectorized into a 1024-float array.
3. **CockroachDB Atomic Transaction**: Relational status (`incident.status = 'CLOSED'`) and the vector embedding row (`memories`) are committed together in a single CockroachDB SQL transaction.
