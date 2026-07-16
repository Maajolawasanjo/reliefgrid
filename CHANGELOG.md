# 📜 Changelog

All notable changes to the **ReliefGrid** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-rc1] - 2026-07-16

### 🌟 Added
* **7 Autonomous Multi-Agent AI System**: Implemented Master Coordinator Agent and 6 Specialist Agents (Weather, Infrastructure, Medical, Shelter, Logistics, Communications) backed by AWS Bedrock Claude models.
* **CockroachDB `pgvector` Memory Engine**: Integrated 1024-dimensional semantic vector search allowing agents to query historical disaster lessons learned and situational reports.
* **Real-Time Tactical GIS Engine**: OpenStreetMap mapping integration featuring dynamic marker overlays, hazard zone buffer calculation, and OSRM route optimization.
* **Self-Healing Watchdog Engine**: Background process monitoring stale tasks, agent timeouts, and automated task re-assignment with exponential backoff.
* **Enterprise Command Center UI**: Next.js 14 App Router dashboard with strictly enforced Aspekta typography and mission-control dark mode styling (`#0B131A` base).
* **Automated Geolocation Context**: Location provider supporting HTML5 GPS geolocation resolution, manual city presets (Lagos, Nairobi, Houston, Tokyo), and custom coordinates.
* **Automated Testing Suite**: Full integration test suite in `tests/integration/test_api_flow.py` validating login, incident lifecycle, agent timeline, and memory vector search.

### 🛡️ Security & Hardening
* **JWT & RBAC Infrastructure**: Enforced role-based authorization (`ADMIN`, `COORDINATOR`, `RESPONDER`) across FastAPI endpoints.
* **Rate Limiting**: Integrated `slowapi` rate limiters on sensitive endpoints (`/auth/login`).
* **CockroachDB SSL Verification**: Enabled `sslmode=verify-full` connection string configuration for cloud deployment security.
* **Exception Envelopes**: Implemented standardized error envelopes (`ApiError`) preventing standard python traceback leakage.

### 🔧 Fixed
* **Authentication Redirects**: Fixed login routing loop where successful sign-ins were redirecting to `/` root landing page instead of `/incidents`.
* **Token Key Mismatch**: Resolved `localStorage` key inconsistency between `auth-context.tsx` and `api.ts`.
* **Pydantic Response Serialization**: Fixed 500 error on `GET /auth/me` by mapping SQLAlchemy `Role` ORM models to string arrays.

---

## [0.9.0] - 2026-06-25

### Added
* Initial project architecture blueprint and database schema migration scripts for CockroachDB.
* Core FastAPI boilerplate setup with SQLModel/SQLAlchemy definitions for Users, Incidents, Tasks, and Memories.
