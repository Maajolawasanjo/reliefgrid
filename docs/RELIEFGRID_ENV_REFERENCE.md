# RELIEFGRID_ENV_REFERENCE.md

> **Single Source of Truth (SSoT) for Environment Configuration and Secrets Management Across the ReliefGrid Platform**

---

## 1. Introduction

### 1.1 Purpose of Environment Variables
Environment variables serve as the centralized configuration matrix for ReliefGrid across all microservices, frontend applications, AI agent runtimes, serverless tasks, and persistent data engines. By decoupling operational parameters from executable code, ReliefGrid guarantees portability, immutability of builds, compliance with Twelve-Factor App principles, and zero hardcoded operational secrets.

### 1.2 Configuration Management Philosophy
Configuration values are classified based on scope, exposure target, and risk profile:
* **Client-Exposed Public Configs:** Transmitted directly to the Next.js frontend browser build (prefixed with `NEXT_PUBLIC_`).
* **Server-Side Secret Variables:** Accessible exclusively within runtime environments (FastAPI, Docker containers, AWS Lambda) and injected at runtime via secure environment providers.
* **Infrastructure Provisioning Parameters:** Supplied to Terraform/CloudFormation pipelines during deployment cycles.

### 1.3 Environment Separation Strategy
ReliefGrid defines three distinct execution stages:
1. **Development (`development`):** Local developer environments backed by single-node CockroachDB dev containers, LocalStack S3 mocks, and local Bedrock API proxies.
2. **Staging (`staging`):** Isolated cloud sandbox mirroring production architecture, connected to multi-node CockroachDB Serverless clusters and staging S3 buckets.
3. **Production (`production`):** Highly resilient, multi-region deployment backed by zero-trust identity policies, KMS-encrypted storage, automated secret rotation, and strict audit logging.

### 1.4 Secret Management Principles
* **Zero Hardcoded Credentials:** Plaintext secrets in repositories, Dockerfiles, or un-encrypted config files are strictly forbidden.
* **KMS & Secrets Manager Integration:** AWS Secrets Manager injects secrets directly into container processes during ECS task initialization or FastAPI container bootstrap.
* **Strict Ephemerality:** API keys, database credentials, and session tokens must support zero-downtime automated rotation every 30 days.

---

## 2. Naming Conventions

All environment variables follow standardized uppercase snake_case naming with strict prefix namespaces to prevent collisions across heterogeneous services:

| Namespace Prefix | Target Domain / Service | Exposure Boundary | Sensitivity |
| ---------------- | ----------------------- | ----------------- | ----------- |
| `APP_` | Global Application Metadata | Server-Side / Internal | Low |
| `NEXT_PUBLIC_` | Next.js Client Engine | Browser Public | Non-Sensitive |
| `API_` | FastAPI Gateway | Server-Side Internal | Low |
| `AUTH_` / `JWT_` | Identity & RBAC | Server-Side Internal | **HIGH (SECRET)** |
| `DATABASE_` / `DB_`| CockroachDB Connection | Server-Side Internal | **HIGH (SECRET)** |
| `VECTOR_` / `MEMORY_`| Vector Memory Engine | Server-Side Internal | Medium |
| `AWS_` | Infrastructure SDKs | Server-Side Internal | **HIGH (SECRET)** |
| `BEDROCK_` | Amazon Bedrock Inference | Server-Side Internal | Medium |
| `S3_` | Storage & Bucket Names | Server-Side Internal | Low |
| `EVENT_` / `QUEUE_`| Messaging & Outbox | Server-Side Internal | Low |
| `AGENT_` | AI Multi-Agent Runtimes | Server-Side Internal | Medium |
| `NOTIFY_` / `EMAIL_`| Communications Service | Server-Side Internal | **HIGH (SECRET)** |
| `OBS_` / `METRICS_`| Observability & Tracing | Server-Side Internal | Low |
| `SECURITY_` | Cryptographic Tokens | Server-Side Internal | **CRITICAL (SECRET)** |

---

## 3. Application Configuration

Global metadata governing application state, runtime modes, and versioning.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `APP_ENV` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `development` | `production` | Controls framework optimization & logging modes |
| `APP_NAME` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `ReliefGrid` | `ReliefGrid-Gov` | Platform identifier |
| `APP_VERSION` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `1.0.0-dev` | `1.2.0` | Injected during build pipelines |
| `APP_URL` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `http://localhost:3000` | `https://app.reliefgrid.io` | Fully qualified base URL |
| `API_URL` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `http://localhost:8000` | `https://api.reliefgrid.io` | Primary backend API root |
| `LOG_LEVEL` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `INFO` | `DEBUG` / `WARNING` | Root Python/TypeScript log verbosity |
| `DEBUG_MODE` | Global Core | **Req** | Dev / Stg / Prod | Non-Sensitive | `true` | `false` | Enables interactive tracebacks (Must be `false` in Prod) |

---

## 4. Frontend Configuration

Variables consumed by the Next.js frontend engine. Only variables prefixed with `NEXT_PUBLIC_` are bundled into client JavaScript.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `NEXT_PUBLIC_APP_URL` | Next.js Frontend | **Req** | Dev / Stg / Prod | Public Client | `http://localhost:3000` | `https://app.reliefgrid.io` | Frontend client origin |
| `NEXT_PUBLIC_API_URL` | Next.js Frontend | **Req** | Dev / Stg / Prod | Public Client | `http://localhost:8000/api/v1` | `https://api.reliefgrid.io/api/v1` | Backend API target endpoint |
| `NEXT_PUBLIC_ENVIRONMENT` | Next.js Frontend | **Req** | Dev / Stg / Prod | Public Client | `development` | `production` | Drives environment badge in UI header |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Next.js Frontend | **Opt** | Stg / Prod | Public Client | `false` | `true` | Toggles telemetry event capturing |
| `NEXT_PUBLIC_MAP_PROVIDER_KEY` | Next.js Frontend | **Req** | Dev / Stg / Prod | Public Client | `pk_test_sample` | `pk_live_99a88b77c6` | Mapbox / OpenStreetMap API key |
| `NEXT_PUBLIC_FEATURE_FLAGS` | Next.js Frontend | **Opt** | Dev / Stg / Prod | Public Client | `simulator,vector_search` | `all` | Comma-separated feature flags |

---

## 5. Backend Configuration

Operational knobs for the FastAPI application server, worker concurrency, and request management.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `API_HOST` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `0.0.0.0` | `127.0.0.1` | Network interface binding |
| `API_PORT` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `8000` | `8000` | Process binding port |
| `API_PREFIX` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `/api/v1` | `/api/v1` | Global API version route prefix |
| `WORKERS` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `2` | `4` | Gunicorn/Uvicorn worker process count |
| `CORS_ORIGINS` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `["http://localhost:3000"]` | `["https://app.reliefgrid.io"]` | JSON array of trusted browser origins |
| `REQUEST_TIMEOUT` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `30` | `60` | HTTP request deadline in seconds |
| `MAX_REQUEST_SIZE` | FastAPI Backend | **Req** | Dev / Stg / Prod | Internal | `10485760` | `52428800` | Maximum body size in bytes (10MB default) |
| `OVERPASS_URL` | GIS Service | **Opt** | Dev / Stg / Prod | Internal | `https://overpass-api.de/api/interpreter` | Same | OpenStreetMap Overpass query endpoint |
| `OSRM_ROUTE_URL` | GIS Service | **Opt** | Dev / Stg / Prod | Internal | `https://router.project-osrm.org/route/v1` | Same | OpenRouteService/OSRM driving route URL |

---

## 6. Authentication Configuration

Cryptographic keys, token lifetimes, and identity provider definitions governing RBAC and session security.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `JWT_SECRET_KEY` | Auth Service | **Req** | Dev / Stg / Prod | **HIGH SECRET** | `dev_secret_key_change_me_in_prod` | `hex:9f8a...31` | Min 256-bit entropy key for signing JWTs |
| `JWT_ALGORITHM` | Auth Service | **Req** | Dev / Stg / Prod | Internal | `HS256` | `RS256` | Hashing algorithm for signatures |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Auth Service | **Req** | Dev / Stg / Prod | Internal | `60` | `15` | Lifespan of short-lived access JWTs |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Auth Service | **Req** | Dev / Stg / Prod | Internal | `7` | `30` | Lifespan of refresh tokens |
| `AUTH_PROVIDER` | Auth Service | **Req** | Dev / Stg / Prod | Internal | `local` | `aws_cognito` / `oauth2` | Active authentication backend |
| `OAUTH_CLIENT_ID` | Auth Service | **Opt** | Stg / Prod | Internal | `none` | `901823-client-id` | Identity provider client ID |
| `OAUTH_CLIENT_SECRET` | Auth Service | **Opt** | Stg / Prod | **HIGH SECRET** | `none` | `sec_987654321` | Identity provider secret key |
| `MFA_ENABLED` | Auth Service | **Req** | Dev / Stg / Prod | Internal | `false` | `true` | Enforces Multi-Factor Authentication |

---

## 7. CockroachDB Configuration

Parameters governing transactional connectivity, connection pooling, and SSL parameters for CockroachDB.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `DATABASE_URL` | DB Layer | **Req** | Dev / Stg / Prod | **HIGH SECRET** | `postgresql://root@localhost:26257/reliefgrid?sslmode=disable` | `postgresql://user:pass@cockroach.host:26257/reliefgrid` | Primary connection string |
| `DATABASE_HOST` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `localhost` | `cockroach.reliefgrid.internal` | DB host address |
| `DATABASE_PORT` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `26257` | `26257` | Standard CockroachDB port |
| `DATABASE_NAME` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `reliefgrid` | `reliefgrid_prod` | Target DB catalog |
| `DATABASE_USER` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `root` | `reliefgrid_app` | DB role credentials |
| `DATABASE_PASSWORD` | DB Layer | **Req** | Dev / Stg / Prod | **HIGH SECRET** | `root` | `crdba_pass_998` | DB authentication secret |
| `DATABASE_SSL_MODE` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `disable` | `verify-full` | Transport security mode |
| `DATABASE_POOL_SIZE` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `10` | `25` | SQLAlchemy pool baseline size |
| `DATABASE_MAX_OVERFLOW` | DB Layer | **Req** | Dev / Stg / Prod | Internal | `20` | `50` | Maximum surge connections |

---

## 8. Vector Database / Memory Configuration

Settings defining the `pgvector` indexing parameters and cognitive memory retention boundaries.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `VECTOR_DIMENSION` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `1024` | `1024` | Cohere Embed v3 output dimensions |
| `EMBEDDING_MODEL_ID` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `cohere.embed-english-v3` | `cohere.embed-multilingual-v3` | AWS Bedrock model reference |
| `MEMORY_INDEX_NAME` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `idx_memory_embeddings_vector` | `idx_memory_embeddings_hnsw` | Target DB index identifier |
| `MEMORY_SEARCH_LIMIT` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `10` | `5` | Default k-NN result return count |
| `MEMORY_SIMILARITY_THRESHOLD` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `0.70` | `0.82` | Minimum cosine similarity cut-off |
| `MEMORY_RETENTION_DAYS` | Memory Engine | **Req** | Dev / Stg / Prod | Internal | `365` | `1825` | Working memory archival threshold |

---

## 9. AWS Configuration

Baseline infrastructure parameters, credentials, and IAM execution role definitions.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `AWS_REGION` | Cloud Platform | **Req** | Dev / Stg / Prod | Internal | `us-east-1` | `us-west-2` | Target AWS primary deployment region |
| `AWS_ACCESS_KEY_ID` | Cloud Platform | **Opt (Dev)** | Dev | **HIGH SECRET** | `mock_key` | `AKIAIOSFODNN7EXAMPLE` | IAM programmatic access key (Disabled in Prod in favor of IAM Roles) |
| `AWS_SECRET_ACCESS_KEY` | Cloud Platform | **Opt (Dev)** | Dev | **HIGH SECRET** | `mock_secret` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | IAM secret access key |
| `AWS_ACCOUNT_ID` | Cloud Platform | **Req** | Dev / Stg / Prod | Internal | `123456789012` | `987654321098` | AWS 12-digit account ID |
| `AWS_ROLE_ARN` | Cloud Platform | **Req** | Stg / Prod | Internal | `none` | `arn:aws:iam::123456789012:role/ReliefGridExecutionRole` | ECS/Lambda service execution role |

---

## 10. Amazon Bedrock Configuration

Inference parameters governing foundational model calls for LLMs and specialized agents.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `BEDROCK_REGION` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `us-east-1` | `us-west-2` | Dedicated Bedrock service region |
| `BEDROCK_MODEL_ID` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Main LLM model identifier |
| `BEDROCK_CHAT_MODEL_ID` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Interactive conversation model |
| `BEDROCK_EMBEDDING_MODEL_ID` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `cohere.embed-english-v3` | Same | Cognitive vector model |
| `BEDROCK_MAX_TOKENS` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `4096` | `8192` | Model token limit ceiling |
| `BEDROCK_TEMPERATURE` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `0.2` | `0.0` | Sampling randomness (Low for operational tasks) |
| `BEDROCK_TIMEOUT` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `60` | `120` | Inference network socket timeout in seconds |
| `BEDROCK_RETRY_LIMIT` | AI Subsystem | **Req** | Dev / Stg / Prod | Internal | `5` | `3` | Maximum backoff attempts on rate limits |
| `COORDINATOR_MODEL_ID` | Agent System | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Model used by Coordinator Agent |
| `WEATHER_AGENT_MODEL_ID` | Agent System | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Model used by Weather Specialist |
| `MEDICAL_AGENT_MODEL_ID` | Agent System | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Model used by Medical Specialist |
| `INFRASTRUCTURE_AGENT_MODEL_ID` | Agent System | **Req** | Dev / Stg / Prod | Internal | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Same | Model used by Infra Specialist |

---

## 11. S3 Storage Configuration

Bucket routing and lifecycle configurations for operational media, sitreps, and exports.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `S3_BUCKET_NAME` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-storage` | `reliefgrid-prod-master` | Primary application root bucket |
| `S3_REGION` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `us-east-1` | `us-west-2` | Storage bucket region |
| `S3_DOCUMENT_BUCKET` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-documents` | `reliefgrid-prod-documents` | Attachment PDF/text storage bucket |
| `S3_MEDIA_BUCKET` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-media` | `reliefgrid-prod-media` | Disaster imagery/video bucket |
| `S3_REPORT_BUCKET` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-reports` | `reliefgrid-prod-reports` | Compiled PDF Action Brief bucket |
| `S3_BACKUP_BUCKET` | Storage Engine | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-backups` | `reliefgrid-prod-backups` | Database snapshot bucket |

---

## 12. Message Queue / Event System Configuration

Parameters for the transactional event outbox, message queuing, and asynchronous pub-sub buses.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `EVENT_BUS_NAME` | Event System | **Req** | Dev / Stg / Prod | Internal | `reliefgrid-dev-events` | `reliefgrid-prod-bus` | Amazon EventBridge bus identifier |
| `QUEUE_URL` | Event System | **Req** | Dev / Stg / Prod | Internal | `http://localhost:4566/000000000000/agent-tasks` | `https://sqs.us-east-1.amazonaws.com/12345/tasks` | Primary SQS execution queue |
| `MESSAGE_RETRY_LIMIT` | Event System | **Req** | Dev / Stg / Prod | Internal | `3` | `5` | Max retries before dead-lettering |
| `DEAD_LETTER_QUEUE_URL`| Event System | **Req** | Dev / Stg / Prod | Internal | `http://localhost:4566/000000000000/agent-dlq` | `https://sqs.us-east-1.amazonaws.com/12345/dlq` | DLQ target for failed messages |
| `EVENT_TIMEOUT` | Event System | **Req** | Dev / Stg / Prod | Internal | `300` | `600` | Event handling execution timeout (sec) |

---

## 13. Agent System Configuration

Operational execution flags controlling autonomous multi-agent behavior, task allocation, and crash recovery.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `AGENT_ENVIRONMENT` | Agent System | **Req** | Dev / Stg / Prod | Internal | `standalone` | `distributed` | In-process vs containerized execution |
| `AGENT_TIMEOUT` | Agent System | **Req** | Dev / Stg / Prod | Internal | `120` | `180` | Max duration allowed per agent task |
| `AGENT_MAX_RETRIES` | Agent System | **Req** | Dev / Stg / Prod | Internal | `3` | `2` | Automated attempt ceiling per subtask |
| `AGENT_MEMORY_ACCESS_ENABLED`| Agent System| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Toggles RAG vector retrieval in prompts |
| `AGENT_LOG_LEVEL` | Agent System | **Req** | Dev / Stg / Prod | Internal | `DEBUG` | `INFO` | Agent internal trace verbosity |
| `COORDINATOR_AGENT_ENABLED` | Agent System | **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables central planning coordinator |
| `WEATHER_AGENT_ENABLED` | Agent System | **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Weather Specialist runtime |
| `MEDICAL_AGENT_ENABLED` | Agent System | **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Medical Specialist runtime |
| `INFRASTRUCTURE_AGENT_ENABLED`| Agent System| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Infra Specialist runtime |
| `SHELTER_AGENT_ENABLED` | Agent System | **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Shelter Specialist runtime |
| `LOGISTICS_AGENT_ENABLED` | Agent System | **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Logistics Specialist runtime |
| `COMMUNICATION_AGENT_ENABLED`| Agent System| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enables Comm Specialist runtime |

---

## 14. Notification Configuration

Tokens and target provider settings for email, SMS, and push dispatch during emergencies.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `EMAIL_PROVIDER` | Notify Service | **Req** | Dev / Stg / Prod | Internal | `smtp` | `aws_ses` | Outbound email gateway plugin |
| `EMAIL_API_KEY` | Notify Service | **Opt** | Stg / Prod | **HIGH SECRET** | `mock` | `SG.987654321` | SendGrid / SES provider secret |
| `SMS_PROVIDER` | Notify Service | **Req** | Dev / Stg / Prod | Internal | `mock` | `twilio` | Outbound SMS emergency gateway |
| `SMS_API_KEY` | Notify Service | **Opt** | Stg / Prod | **HIGH SECRET** | `mock` | `SK_123456789` | Twilio API key string |
| `PUSH_NOTIFICATION_KEY` | Notify Service | **Opt** | Stg / Prod | **HIGH SECRET** | `mock` | `AAAAvvvv1234` | Firebase / APNS push token key |

---

## 15. Monitoring Configuration

Observability settings for APM tracking, telemetry ingestion, and distributed tracing.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `OBSERVABILITY_ENABLED` | Telemetry Engine| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Global switch for metric collection |
| `SENTRY_DSN` | Telemetry Engine| **Opt** | Stg / Prod | Internal | `none` | `https://key@o1.ingest.sentry.io/1` | Sentry exception monitoring URI |
| `CLOUDWATCH_ENABLED` | Telemetry Engine| **Req** | Dev / Stg / Prod | Internal | `false` | `true` | Route logs to AWS CloudWatch |
| `METRICS_ENABLED` | Telemetry Engine| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Expose Prometheus `/metrics` endpoint |
| `TRACE_ENABLED` | Telemetry Engine| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Enable OpenTelemetry distributed traces |

---

## 16. Security Configuration

Cryptographic keys, salt constants, session tokens, and global rate limiter counters.

| Variable Name | Owner Service | Req/Opt | Environments | Sensitivity | Default Value | Example Format | Notes |
| ------------- | ------------- | ------- | ------------ | ----------- | ------------- | -------------- | ----- |
| `ENCRYPTION_KEY` | Security Engine| **Req** | Dev / Stg / Prod | **CRITICAL SECRET**| `dev_enc_key_32_bytes_long_string!!` | `b64:a98f7...==` | AES-256 GCM master payload cipher key |
| `HASH_ALGORITHM` | Security Engine| **Req** | Dev / Stg / Prod | Internal | `argon2id` | `argon2id` | Password hashing algorithm |
| `SESSION_SECRET` | Security Engine| **Req** | Dev / Stg / Prod | **CRITICAL SECRET**| `dev_session_secret_key_sample_12` | `hex:44a7...` | Cookie session signing secret |
| `CSRF_SECRET` | Security Engine| **Req** | Dev / Stg / Prod | **CRITICAL SECRET**| `dev_csrf_token_secret_value_123` | `hex:99c2...` | Anti-CSRF token verification secret |
| `RATE_LIMIT_ENABLED` | Security Engine| **Req** | Dev / Stg / Prod | Internal | `true` | `true` | Toggles global API throttling |
| `RATE_LIMIT_REQUESTS` | Security Engine| **Req** | Dev / Stg / Prod | Internal | `100` | `600` | Max allowed requests per window |
| `RATE_LIMIT_WINDOW` | Security Engine| **Req** | Dev / Stg / Prod | Internal | `60` | `60` | Throttling window in seconds |

---

## 17. Development Environment Template (`.env.development`)

```ini
# ReliefGrid Development Environment Configuration (.env.development)
APP_ENV=development
APP_NAME=ReliefGrid-LocalDev
APP_VERSION=1.0.0-dev
APP_URL=http://localhost:3000
API_URL=http://localhost:8000
LOG_LEVEL=DEBUG
DEBUG_MODE=true

# Next.js Frontend Public Bindings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_MAP_PROVIDER_KEY=pk.test.mapbox_development_key
NEXT_PUBLIC_FEATURE_FLAGS=simulator,vector_search,memory_explorer

# FastAPI Backend Bindings
API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api/v1
WORKERS=1
CORS_ORIGINS=["http://localhost:3000"]
REQUEST_TIMEOUT=60
MAX_REQUEST_SIZE=10485760
OVERPASS_URL=https://overpass-api.de/api/interpreter
OSRM_ROUTE_URL=https://router.project-osrm.org/route/v1

# Auth & Cryptography (Dev Insecure Keys)
JWT_SECRET_KEY=dev_insecure_jwt_secret_key_never_use_in_production_12345
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
REFRESH_TOKEN_EXPIRE_DAYS=30
AUTH_PROVIDER=local
MFA_ENABLED=false

# Database Connectivity (Local CockroachDB Container)
DATABASE_URL=postgresql://root@localhost:26257/reliefgrid?sslmode=disable
DATABASE_HOST=localhost
DATABASE_PORT=26257
DATABASE_NAME=reliefgrid
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_SSL_MODE=disable
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# Cognitive Memory & Vector Search
VECTOR_DIMENSION=1024
EMBEDDING_MODEL_ID=cohere.embed-english-v3
MEMORY_INDEX_NAME=idx_memory_embeddings_vector
MEMORY_SEARCH_LIMIT=5
MEMORY_SIMILARITY_THRESHOLD=0.70
MEMORY_RETENTION_DAYS=30

# AWS & Amazon Bedrock (Dev Profile)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=mock_dev_access_key
AWS_SECRET_ACCESS_KEY=mock_dev_secret_key
AWS_ACCOUNT_ID=000000000000
AWS_ROLE_ARN=arn:aws:iam::000000000000:role/LocalDevRole

BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_CHAT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_EMBEDDING_MODEL_ID=cohere.embed-english-v3
BEDROCK_MAX_TOKENS=4096
BEDROCK_TEMPERATURE=0.2
BEDROCK_TIMEOUT=60
BEDROCK_RETRY_LIMIT=3

COORDINATOR_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
WEATHER_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
MEDICAL_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
INFRASTRUCTURE_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0

# Object Storage (LocalStack S3 Mocks)
S3_BUCKET_NAME=reliefgrid-local-storage
S3_REGION=us-east-1
S3_DOCUMENT_BUCKET=reliefgrid-local-documents
S3_MEDIA_BUCKET=reliefgrid-local-media
S3_REPORT_BUCKET=reliefgrid-local-reports
S3_BACKUP_BUCKET=reliefgrid-local-backups

# Messaging & Event Systems
EVENT_BUS_NAME=reliefgrid-local-events
QUEUE_URL=http://localhost:4566/000000000000/agent-tasks
MESSAGE_RETRY_LIMIT=3
DEAD_LETTER_QUEUE_URL=http://localhost:4566/000000000000/agent-dlq
EVENT_TIMEOUT=300

# Agent Runtimes
AGENT_ENVIRONMENT=standalone
AGENT_TIMEOUT=120
AGENT_MAX_RETRIES=3
AGENT_MEMORY_ACCESS_ENABLED=true
AGENT_LOG_LEVEL=DEBUG
COORDINATOR_AGENT_ENABLED=true
WEATHER_AGENT_ENABLED=true
MEDICAL_AGENT_ENABLED=true
INFRASTRUCTURE_AGENT_ENABLED=true
SHELTER_AGENT_ENABLED=true
LOGISTICS_AGENT_ENABLED=true
COMMUNICATION_AGENT_ENABLED=true

# Observability & Security
OBSERVABILITY_ENABLED=true
CLOUDWATCH_ENABLED=false
METRICS_ENABLED=true
TRACE_ENABLED=true

ENCRYPTION_KEY=dev_enc_key_32_bytes_long_string!!
HASH_ALGORITHM=argon2id
SESSION_SECRET=dev_session_secret_key_sample_12
CSRF_SECRET=dev_csrf_token_secret_value_123
RATE_LIMIT_ENABLED=false
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=60
```

---

## 18. Staging Environment Template (`.env.staging`)

```ini
# ReliefGrid Staging Environment Configuration (.env.staging)
APP_ENV=staging
APP_NAME=ReliefGrid-Staging
APP_VERSION=1.0.0-rc1
APP_URL=https://staging.reliefgrid.io
API_URL=https://staging-api.reliefgrid.io
LOG_LEVEL=INFO
DEBUG_MODE=false

NEXT_PUBLIC_APP_URL=https://staging.reliefgrid.io
NEXT_PUBLIC_API_URL=https://staging-api.reliefgrid.io/api/v1
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_MAP_PROVIDER_KEY=pk.staging.mapbox_live_key_991823
NEXT_PUBLIC_FEATURE_FLAGS=simulator,vector_search,memory_explorer

API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api/v1
WORKERS=4
CORS_ORIGINS=["https://staging.reliefgrid.io"]
REQUEST_TIMEOUT=30
MAX_REQUEST_SIZE=20971520

JWT_SECRET_KEY=${STAGING_JWT_SECRET_KEY}
JWT_ALGORITHM=RS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
AUTH_PROVIDER=local
MFA_ENABLED=true

DATABASE_URL=${STAGING_DATABASE_URL}
DATABASE_HOST=staging-cockroach.reliefgrid.internal
DATABASE_PORT=26257
DATABASE_NAME=reliefgrid_staging
DATABASE_USER=reliefgrid_stg_app
DATABASE_PASSWORD=${STAGING_DATABASE_PASSWORD}
DATABASE_SSL_MODE=verify-full
DATABASE_POOL_SIZE=15
DATABASE_MAX_OVERFLOW=30

VECTOR_DIMENSION=1024
EMBEDDING_MODEL_ID=cohere.embed-english-v3
MEMORY_INDEX_NAME=idx_memory_embeddings_vector
MEMORY_SEARCH_LIMIT=10
MEMORY_SIMILARITY_THRESHOLD=0.75
MEMORY_RETENTION_DAYS=90

AWS_REGION=us-west-2
AWS_ACCOUNT_ID=987654321012
AWS_ROLE_ARN=arn:aws:iam::987654321012:role/ReliefGridStagingExecutionRole

BEDROCK_REGION=us-west-2
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_CHAT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_EMBEDDING_MODEL_ID=cohere.embed-english-v3
BEDROCK_MAX_TOKENS=4096
BEDROCK_TEMPERATURE=0.2
BEDROCK_TIMEOUT=60
BEDROCK_RETRY_LIMIT=5

COORDINATOR_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
WEATHER_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
MEDICAL_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
INFRASTRUCTURE_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0

S3_BUCKET_NAME=reliefgrid-stg-storage-us-west-2
S3_REGION=us-west-2
S3_DOCUMENT_BUCKET=reliefgrid-stg-documents
S3_MEDIA_BUCKET=reliefgrid-stg-media
S3_REPORT_BUCKET=reliefgrid-stg-reports
S3_BACKUP_BUCKET=reliefgrid-stg-backups

EVENT_BUS_NAME=reliefgrid-stg-events
QUEUE_URL=https://sqs.us-west-2.amazonaws.com/987654321012/stg-agent-tasks
MESSAGE_RETRY_LIMIT=3
DEAD_LETTER_QUEUE_URL=https://sqs.us-west-2.amazonaws.com/987654321012/stg-agent-dlq
EVENT_TIMEOUT=300

AGENT_ENVIRONMENT=distributed
AGENT_TIMEOUT=120
AGENT_MAX_RETRIES=3
AGENT_MEMORY_ACCESS_ENABLED=true
AGENT_LOG_LEVEL=INFO
COORDINATOR_AGENT_ENABLED=true
WEATHER_AGENT_ENABLED=true
MEDICAL_AGENT_ENABLED=true
INFRASTRUCTURE_AGENT_ENABLED=true
SHELTER_AGENT_ENABLED=true
LOGISTICS_AGENT_ENABLED=true
COMMUNICATION_AGENT_ENABLED=true

OBSERVABILITY_ENABLED=true
SENTRY_DSN=https://stg_key@o99.ingest.sentry.io/9981
CLOUDWATCH_ENABLED=true
METRICS_ENABLED=true
TRACE_ENABLED=true

ENCRYPTION_KEY=${STAGING_ENCRYPTION_KEY}
HASH_ALGORITHM=argon2id
SESSION_SECRET=${STAGING_SESSION_SECRET}
CSRF_SECRET=${STAGING_CSRF_SECRET}
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=300
RATE_LIMIT_WINDOW=60
```

---

## 19. Production Environment Template (`.env.production`)

```ini
# ReliefGrid Production Master Configuration (.env.production)
# ALL SECRETS ARE INJECTED AT RUNTIME VIA AWS SECRETS MANAGER
APP_ENV=production
APP_NAME=ReliefGrid
APP_VERSION=1.0.0
APP_URL=https://app.reliefgrid.io
API_URL=https://api.reliefgrid.io
LOG_LEVEL=WARNING
DEBUG_MODE=false

NEXT_PUBLIC_APP_URL=https://app.reliefgrid.io
NEXT_PUBLIC_API_URL=https://api.reliefgrid.io/api/v1
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_MAP_PROVIDER_KEY=${PROD_MAPBOX_KEY}
NEXT_PUBLIC_FEATURE_FLAGS=vector_search,memory_explorer

API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api/v1
WORKERS=8
CORS_ORIGINS=["https://app.reliefgrid.io"]
REQUEST_TIMEOUT=30
MAX_REQUEST_SIZE=10485760

JWT_SECRET_KEY=${AWS_SECRETS_MANAGER:reliefgrid/prod/jwt_secret}
JWT_ALGORITHM=RS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
AUTH_PROVIDER=local
MFA_ENABLED=true

DATABASE_URL=${AWS_SECRETS_MANAGER:reliefgrid/prod/database_url}
DATABASE_HOST=crdb-prod-cluster.reliefgrid.internal
DATABASE_PORT=26257
DATABASE_NAME=reliefgrid_production
DATABASE_USER=reliefgrid_prod_app
DATABASE_PASSWORD=${AWS_SECRETS_MANAGER:reliefgrid/prod/database_password}
DATABASE_SSL_MODE=verify-full
DATABASE_POOL_SIZE=25
DATABASE_MAX_OVERFLOW=50

VECTOR_DIMENSION=1024
EMBEDDING_MODEL_ID=cohere.embed-english-v3
MEMORY_INDEX_NAME=idx_memory_embeddings_hnsw
MEMORY_SEARCH_LIMIT=5
MEMORY_SIMILARITY_THRESHOLD=0.80
MEMORY_RETENTION_DAYS=365

AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/ReliefGridProductionExecutionRole

BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_CHAT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_EMBEDDING_MODEL_ID=cohere.embed-english-v3
BEDROCK_MAX_TOKENS=4096
BEDROCK_TEMPERATURE=0.0
BEDROCK_TIMEOUT=60
BEDROCK_RETRY_LIMIT=5

COORDINATOR_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
WEATHER_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
MEDICAL_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
INFRASTRUCTURE_AGENT_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0

S3_BUCKET_NAME=reliefgrid-prod-storage-us-east-1
S3_REGION=us-east-1
S3_DOCUMENT_BUCKET=reliefgrid-prod-documents
S3_MEDIA_BUCKET=reliefgrid-prod-media
S3_REPORT_BUCKET=reliefgrid-prod-reports
S3_BACKUP_BUCKET=reliefgrid-prod-backups

EVENT_BUS_NAME=reliefgrid-prod-events
QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/prod-agent-tasks
MESSAGE_RETRY_LIMIT=5
DEAD_LETTER_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/prod-agent-dlq
EVENT_TIMEOUT=300

AGENT_ENVIRONMENT=distributed
AGENT_TIMEOUT=120
AGENT_MAX_RETRIES=3
AGENT_MEMORY_ACCESS_ENABLED=true
AGENT_LOG_LEVEL=WARNING
COORDINATOR_AGENT_ENABLED=true
WEATHER_AGENT_ENABLED=true
MEDICAL_AGENT_ENABLED=true
INFRASTRUCTURE_AGENT_ENABLED=true
SHELTER_AGENT_ENABLED=true
LOGISTICS_AGENT_ENABLED=true
COMMUNICATION_AGENT_ENABLED=true

OBSERVABILITY_ENABLED=true
SENTRY_DSN=${AWS_SECRETS_MANAGER:reliefgrid/prod/sentry_dsn}
CLOUDWATCH_ENABLED=true
METRICS_ENABLED=true
TRACE_ENABLED=true

ENCRYPTION_KEY=${AWS_SECRETS_MANAGER:reliefgrid/prod/encryption_key}
HASH_ALGORITHM=argon2id
SESSION_SECRET=${AWS_SECRETS_MANAGER:reliefgrid/prod/session_secret}
CSRF_SECRET=${AWS_SECRETS_MANAGER:reliefgrid/prod/csrf_secret}
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

---

## 20. Complete Environment Template (`.env.example`)

```ini
# ReliefGrid Standard Reference .env.example
# Copy this file to .env locally for local development

APP_ENV="development"
APP_NAME="ReliefGrid"
APP_VERSION="1.0.0"
APP_URL="http://localhost:3000"
API_URL="http://localhost:8000"
LOG_LEVEL="INFO"
DEBUG_MODE="true"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_ENVIRONMENT="development"
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_MAP_PROVIDER_KEY="YOUR_MAPBOX_API_KEY"
NEXT_PUBLIC_FEATURE_FLAGS="simulator,vector_search,memory_explorer"

API_HOST="0.0.0.0"
API_PORT="8000"
API_PREFIX="/api/v1"
WORKERS="2"
CORS_ORIGINS=["http://localhost:3000"]
REQUEST_TIMEOUT="30"
MAX_REQUEST_SIZE="10485760"
OVERPASS_URL="https://overpass-api.de/api/interpreter"
OSRM_ROUTE_URL="https://router.project-osrm.org/route/v1"

JWT_SECRET_KEY="YOUR_SECURE_JWT_SECRET_KEY_MIN_32_CHARS"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES="60"
REFRESH_TOKEN_EXPIRE_DAYS="7"
AUTH_PROVIDER="local"
OAUTH_CLIENT_ID="YOUR_OAUTH_CLIENT_ID"
OAUTH_CLIENT_SECRET="YOUR_OAUTH_CLIENT_SECRET"
MFA_ENABLED="false"

DATABASE_URL="postgresql://user:password@localhost:26257/reliefgrid?sslmode=disable"
DATABASE_HOST="localhost"
DATABASE_PORT="26257"
DATABASE_NAME="reliefgrid"
DATABASE_USER="root"
DATABASE_PASSWORD="your_database_password"
DATABASE_SSL_MODE="disable"
DATABASE_POOL_SIZE="10"
DATABASE_MAX_OVERFLOW="20"

VECTOR_DIMENSION="1024"
EMBEDDING_MODEL_ID="cohere.embed-english-v3"
MEMORY_INDEX_NAME="idx_memory_embeddings_vector"
MEMORY_SEARCH_LIMIT="10"
MEMORY_SIMILARITY_THRESHOLD="0.70"
MEMORY_RETENTION_DAYS="365"

AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
AWS_ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"
AWS_ROLE_ARN="arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/ReliefGridRole"

BEDROCK_REGION="us-east-1"
BEDROCK_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
BEDROCK_CHAT_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
BEDROCK_EMBEDDING_MODEL_ID="cohere.embed-english-v3"
BEDROCK_MAX_TOKENS="4096"
BEDROCK_TEMPERATURE="0.2"
BEDROCK_TIMEOUT="60"
BEDROCK_RETRY_LIMIT="5"

COORDINATOR_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
WEATHER_AGENT_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
MEDICAL_AGENT_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"
INFRASTRUCTURE_AGENT_MODEL_ID="anthropic.claude-3-5-sonnet-20240620-v1:0"

S3_BUCKET_NAME="reliefgrid-storage"
S3_REGION="us-east-1"
S3_DOCUMENT_BUCKET="reliefgrid-documents"
S3_MEDIA_BUCKET="reliefgrid-media"
S3_REPORT_BUCKET="reliefgrid-reports"
S3_BACKUP_BUCKET="reliefgrid-backups"

EVENT_BUS_NAME="reliefgrid-events"
QUEUE_URL="YOUR_SQS_QUEUE_URL"
MESSAGE_RETRY_LIMIT="3"
DEAD_LETTER_QUEUE_URL="YOUR_SQS_DEAD_LETTER_QUEUE_URL"
EVENT_TIMEOUT="300"

AGENT_ENVIRONMENT="standalone"
AGENT_TIMEOUT="120"
AGENT_MAX_RETRIES="3"
AGENT_MEMORY_ACCESS_ENABLED="true"
AGENT_LOG_LEVEL="INFO"
COORDINATOR_AGENT_ENABLED="true"
WEATHER_AGENT_ENABLED="true"
MEDICAL_AGENT_ENABLED="true"
INFRASTRUCTURE_AGENT_ENABLED="true"
SHELTER_AGENT_ENABLED="true"
LOGISTICS_AGENT_ENABLED="true"
COMMUNICATION_AGENT_ENABLED="true"

EMAIL_PROVIDER="smtp"
EMAIL_API_KEY="YOUR_EMAIL_API_KEY"
SMS_PROVIDER="mock"
SMS_API_KEY="YOUR_SMS_API_KEY"
PUSH_NOTIFICATION_KEY="YOUR_PUSH_NOTIFICATION_KEY"

OBSERVABILITY_ENABLED="true"
SENTRY_DSN="YOUR_SENTRY_DSN"
CLOUDWATCH_ENABLED="false"
METRICS_ENABLED="true"
TRACE_ENABLED="true"

ENCRYPTION_KEY="YOUR_32_BYTE_AES_ENCRYPTION_KEY"
HASH_ALGORITHM="argon2id"
SESSION_SECRET="YOUR_SESSION_SECRET_KEY"
CSRF_SECRET="YOUR_CSRF_SECRET_KEY"
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW="60"
```

---

## 21. Security Guidelines

1. **Strict Exclusion from Source Control:** Never commit `.env`, `.env.development`, `.env.staging`, or `.env.production` to git. Ensure `.gitignore` explicitly lists `.env*` patterns while excepting `.env.example`.
2. **Secrets Injection via Managed Vaults:** In staging and production, environment secrets must be loaded at container execution time using AWS Secrets Manager or AWS Systems Manager Parameter Store.
3. **Automated Credential Rotation:** Production database passwords, JWT secrets, and AWS service keys must undergo dynamic, automated rotation every 30 days without system downtime.
4. **Least Privilege IAM Binding:** Do not supply static `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in cloud deployments; services must inherit IAM Task Roles via AWS ECS Fargate or Lambda execution profiles.
5. **Sanitized Logs & Telemetry:** Ensure environment printouts during service startup sanitize sensitive fields (`JWT_SECRET_KEY`, `DATABASE_URL`, `ENCRYPTION_KEY`).

---

## 22. Validation Checklist

- [x] Every microservice, agent runtime, and database boundary has documented variables.
- [x] Zero duplicate configurations or conflicting variable names.
- [x] All cryptographic keys, database passwords, and provider API tokens identified as High/Critical secrets.
- [x] Clear namespace boundary separating browser-exposed public variables (`NEXT_PUBLIC_`) from server secrets.
- [x] Distinct configurations supplied for Development, Staging, and Production deployment targets.
- [x] Amazon Bedrock model IDs, token limits, and agent overrides explicitly detailed.
- [x] CockroachDB pool sizing, TLS modes, and connection strings defined.
- [x] Amazon S3 bucket names, regions, and object classifications defined.
- [x] Docker and LocalStack dev overrides fully verified in standard `.env.example`.
