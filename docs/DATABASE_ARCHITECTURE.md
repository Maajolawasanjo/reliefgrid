# 🗄️ Database Architecture & Schema Specification

## 📌 Schema Overview

ReliefGrid utilizes **CockroachDB Serverless** using PostgreSQL driver compatibility. The relational schema links Users, Organizations, Incidents, Tasks, Recommendations, and Vector Memories under strict foreign key constraints.

---

## 📐 Entity Relationship & Tables

### 1. `users` Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'RESPONDER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `incidents` Table
```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    affected_population INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `memories` Table (CockroachDB `pgvector`)
```sql
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
    memory_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1024) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cosine distance HNSW index for vector search acceleration
CREATE INDEX ON memories USING hnsw (embedding vector_cosine_ops);
```
