# 🏛️ System Architecture Specification

## 📌 High-Level Architecture Overview

ReliefGrid is architected as a decoupled, multi-layer reactive system comprising a Next.js 14 web dashboard, an asynchronous FastAPI backend service, a CockroachDB Serverless vector memory cluster, AWS Bedrock AI foundation models, and external OpenStreetMap/OSRM GIS feeds.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                 Next.js 14 Frontend Command Dashboard                     │
│               (Aspekta Design System, Leaflet GIS Matrix)                 │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ REST API / JWT
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Async Application Engine                       │
│     (JWT Auth, RBAC Gateway, Rate Limiting, Watchdog Telemetry)           │
└────────┬────────────────────────────┬────────────────────────────┬────────┘
         │                            │                            │
         ▼                            ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ CockroachDB Vector│        │ AWS Bedrock AI   │        │ OSRM & OSM       │
│  Memory Layer    │        │ Specialist Agents│        │ GIS Pathfinding  │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

---

## 🧱 Subsystem Architecture

### 1. Web Command Console (`apps/web`)
* **Framework**: Next.js 14 (App Router) with React Server Components.
* **Styling**: Vanilla CSS variable tokens (`--font-body: 'Aspekta', sans-serif`) with dark mode mission-control color palettes (`#0B131A` base).
* **Map Engine**: Leaflet map renderer with dynamic OSM tiles, custom SVGs, and real-time hazard markers.

### 2. Backend Application Engine (`apps/api`)
* **Framework**: FastAPI (Python 3.11) leveraging async request handling and Pydantic v2 data validation.
* **Authentication**: OAuth2 JWT Bearer authentication with role-based dependencies (`ADMIN`, `COORDINATOR`, `RESPONDER`).
* **Resilience**: Integrated `slowapi` rate limiters and `tenacity` exponential backoff retries.

### 3. Distributed Database & Memory Layer (`CockroachDB`)
* **Engine**: CockroachDB Serverless (Distributed SQL).
* **Vector Mechanics**: Native `pgvector` extension operating 1024-dimensional HNSW cosine similarity indexes.
* **Transactional Integrity**: Wraps relational state changes and memory vector embeddings in unified ACID transactions.

### 4. AI Specialist Swarm (`AWS Bedrock`)
* **Foundation Models**: Anthropic Claude 3 deployed on AWS Bedrock.
* **Agents**: Coordinator, Weather, Infrastructure, Medical, Shelter, Logistics, Communications.
