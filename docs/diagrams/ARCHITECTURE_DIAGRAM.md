# 🏛️ ReliefGrid System Architecture Diagram

## 📌 Technical Component Flow

```mermaid
graph TD
    User([Emergency Operator / Agency Commander]) -->|HTTPS / JWT Auth| Web[Next.js 14 Web Command Center]
    
    subgraph Frontend Layer
        Web -->|Aspekta Design System| UI[Incidents / GIS Map / Memory Explorer / Telemetry]
    end
    
    Web -->|REST / JSON API| API[FastAPI Async Backend Core]
    
    subgraph Security & Middleware
        API --> Auth[JWT & RBAC Security Layer]
        API --> Rate[SlowAPI Rate Limiter]
        API --> Watch[Self-Healing Watchdog Engine]
    end
    
    subgraph Data & Memory Layer
        API -->|Distributed SQL & pgvector| CDB[(CockroachDB Serverless Cluster)]
        CDB --> MemIndex[1024-dim Cosine Similarity HNSW Index]
    end
    
    subgraph AI Intelligence Layer
        API -->|Tenacity Retry Client| AWS[AWS Bedrock Engine]
        AWS --> Claude[Anthropic Claude 3 Foundation Models]
        Claude --> Coord[Master Coordinator Agent]
        Coord --> Weather[Weather Agent]
        Coord --> Infra[Infrastructure Agent]
        Coord --> Med[Medical Agent]
        Coord --> Shelter[Shelter Agent]
        Coord --> Logi[Logistics Agent]
        Coord --> Comm[Communications Agent]
    end
    
    subgraph Real-Time GIS Matrix
        API --> OSM[OpenStreetMap Geocoding API]
        API --> OSRM[OSRM Route Calculation Engine]
        API --> Meteo[Open-Meteo Weather Service]
    end
```

---

## 📌 Data Interaction Lifecycle

1. **Operator Action**: Operator inputs an incident report via the Next.js frontend.
2. **FastAPI Gateway**: Sanitizes payload using Pydantic v2 and validates JWT permissions.
3. **CockroachDB Vector Retrieval**: Queries nearest 1024-dimensional memory embeddings matching crisis parameters.
4. **AWS Bedrock Inference**: Master Coordinator Agent delegates prompt context + CockroachDB memories to Specialist Agents.
5. **GIS Path Generation**: OSRM API computes route geometry avoiding hazard polygons.
6. **Execution Output**: Action plan rendered live on the Command Center timeline.
