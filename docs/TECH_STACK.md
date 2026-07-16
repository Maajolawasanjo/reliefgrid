# 🛠️ Technology Stack Reference

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **Next.js** | `14.2.35` | Server-side rendering, App Router, React Server Components |
| **Design System** | **Aspekta CSS** | `CDN v1` | Enterprise command center visual hierarchy and typography |
| **Icons & SVG** | **Lucide Icons** | Integrated SVG | High-contrast vector icons replacing raw text emojis |
| **Backend API** | **FastAPI** | `0.109.0+` | High-performance asynchronous Python web framework |
| **Python Language** | **Python** | `3.11.8+` | Runtime engine for FastAPI, SQLModel, and Pytest |
| **Database** | **CockroachDB** | `Serverless v24+` | Multi-region distributed SQL with PostgreSQL compatibility |
| **Vector Search** | **`pgvector`** | `0.2.4` | 1024-dimensional HNSW cosine distance vector indexing |
| **AI Foundation** | **AWS Bedrock** | `boto3 v1.34+` | Cloud LLM runtime for Anthropic Claude 3 agents |
| **GIS & Routing** | **OSM / OSRM** | API Integration | Leaflet mapping tiles, geocoding, and shortest path calculations |
| **Security** | **PyJWT & Passlib** | `2.9.0+` | JWT Bearer sign-in authentication & bcrypt password hashing |
| **Rate Limiter** | **SlowAPI** | `0.1.9` | DDoS protection and endpoint invocation rate limiting |
| **Retry Engine** | **Tenacity** | `8.2.3` | Exponential backoff retry logic for AWS Bedrock calls |
