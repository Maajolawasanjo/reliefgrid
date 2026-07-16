# 🧠 CockroachDB Memory Engine Demonstration Guide

## 📌 Demonstration Overview

This document provides a step-by-step walkthrough demonstrating how **ReliefGrid's Transactional Vector Memory System** (built on CockroachDB Serverless `pgvector`) actively learns from historical disaster events and dynamically alters future AI agent recommendations.

---

## 🧪 Step-by-Step Memory Influence Test Script

### Step 1: Querying the Memory Engine (`GET /api/v1/memories/search`)
Navigate to the **Collective Memory Engine** UI tab (`http://localhost:3000/memory`) or execute a vector similarity search via `curl`:

```bash
curl -X POST "http://localhost:3000/api/v1/memories/search" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
     -d '{
           "query": "shelter access road flooded Lagos",
           "limit": 5
         }'
```

### Step 2: CockroachDB Vector Cosine Recall Output
CockroachDB performs cosine distance calculation (`1 - (embedding <=> query_vector)`) over stored 1024-dimensional vectors and returns relevant historical records:

```json
{
  "matches": [
    {
      "id": "mem_8f91a20b-411a-4c28",
      "memory_type": "DECISION_RECORD",
      "content": "Abeokuta Expressway access to Agege Primary School shelter was completely flooded during 2024 surge. Route rejected for heavy convoy transport.",
      "similarity_score": 0.892,
      "metadata": {
        "incident_type": "FLOOD",
        "affected_region": "Lagos Sector"
      }
    }
  ]
}
```

### Step 3: Agent Recommendation Transformation
When a new flood incident is reported in the same region:

1. **Without Memory**: A naive AI agent would suggest routing logistics convoys via Abeokuta Expressway (shortest distance).
2. **With CockroachDB Memory**: The **Logistics Agent** reads the retrieved memory score ($0.892$), rejects Abeokuta Expressway, and automatically recalculates an alternative safe route via Ikeja Inner Ring Road.

---

## 🖥️ Visual UI Verification

1. Open **`http://localhost:3000/memory`**.
2. Notice the vector search input bar and filter badges displaying **SVG Vector Icons** for each memory type (`Decision Record`, `Lesson Learned`, `Action Plan`, `Specialist Findings`).
3. Click any suggested query (e.g. *"shelter access road flooded Lagos"*) to observe live sub-second semantic search results powered by CockroachDB!
