# ReliefGrid Document Index — Master Reference

> **Single-entry index for all engineering and planning documents.**
> Keep this file open at all times during development as a navigation guide.

---

## Planning & Architecture Documents

| # | Document | Purpose | Location |
|---|----------|---------|---------|
| 1 | **RELIEFGRID_MASTER_SPECIFICATION.md** | Single Source of Truth — Full EDD (22 Phases, all architecture, DB design, API contracts, agents, security, DevOps, behavioral UML, appendices) | `docs/RELIEFGRID_MASTER_SPECIFICATION.md` |
| 2 | **RELIEFGRID_IMPLEMENTATION_ROADMAP.md** | High-level architecture audit, feature inventory, module breakdown, dependency graph, critical path, risk matrix, build order recommendation | `docs/RELIEFGRID_IMPLEMENTATION_ROADMAP.md` |
| 3 | **RELIEFGRID_MASTER_BACKLOG.md** | Full agile engineering backlog — Epics, Features, User Stories, Engineering Tasks, Subtasks, Milestones, Risk matrix, DoD | `docs/RELIEFGRID_MASTER_BACKLOG.md` |
| 4 | **RELIEFGRID_IMPLEMENTATION_MASTER_PLAN.md** | Execution roadmap — Development phases, Sprint plans, MVP definition, Hackathon build path, Production path, Team parallelization, Review gates | `docs/RELIEFGRID_IMPLEMENTATION_MASTER_PLAN.md` |

| 5 | **RELIEFGRID_ENV_REFERENCE.md** | Single Source of Truth for Environment Configuration across frontend, backend, CockroachDB, AWS Bedrock, S3, agent runtimes, security, and observability | `docs/RELIEFGRID_ENV_REFERENCE.md` |

---

## Document Hierarchy

```text
RELIEFGRID_MASTER_SPECIFICATION.md   ← Architecture SSoT (READ ONLY — LOCKED)
        │
        ├──► RELIEFGRID_ENV_REFERENCE.md ← Environment Configuration & Secrets Blueprint
        │
        ▼
RELIEFGRID_IMPLEMENTATION_ROADMAP.md ← Engineering audit & recommended build order
        │
        ▼
RELIEFGRID_MASTER_BACKLOG.md         ← Agile sprint backlog (Epics → Tasks → Subtasks)
        │
        ▼
RELIEFGRID_IMPLEMENTATION_MASTER_PLAN.md ← Execution schedule (Phases → Sprints → Gates)
```

---

## Technology Stack Reference (Locked)

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js + TypeScript (Vite for local dev) |
| **Backend** | FastAPI (Python 3.12+) |
| **Database** | CockroachDB Serverless + pgvector extension |
| **AI Inference** | Amazon Bedrock — Claude 3.5 Sonnet (agents), Cohere Embed v3 (embeddings) |
| **Cloud** | AWS (S3, IAM, Secrets Manager, CloudWatch, EventBridge) |
| **Container** | Docker Compose (local dev), ECS Fargate (production) |
| **CI/CD** | GitHub Actions |
| **Migrations** | Alembic (Python SQLAlchemy) |
| **Testing** | pytest (backend), Vitest + Cypress (frontend) |

---

## Task ID Quick Reference

| TSK-101 | CockroachDB Core Schema & Auth Migrations | Sprint 1 | ✅ Complete |
| TSK-102 | JWT Authentication & Refresh Tokens System | Sprint 1 | ✅ Complete |
| TSK-103 | RBAC Authorization & User Management API | Sprint 1 | ✅ Complete |
| TSK-104 | Frontend Auth Store & Login Gateway | Sprint 1 | ✅ Complete |
| TSK-201 | Incident CRUD API & Repository Engine | Sprint 2 | ✅ Complete |
| TSK-202 | Incident Audit Timeline & Attachments Engine | Sprint 2 | ✅ Complete |
| TSK-203 | Incident Command Workspace & Creation UI | Sprint 2 | ✅ Complete |
| TSK-301 | Bedrock Reasoning Service & LLM Integration | Sprint 3 | ✅ Complete |
| TSK-302 | AI Agent & Memory CockroachDB Schema Migration | Sprint 3 | ✅ Complete |
| TSK-303 | Coordinator Task Decomposition Loop & Dispatch API | Sprint 3 | ✅ Complete |
| TSK-401 | Autonomous Agent Execution Matrix & Task Assignments | Sprint 3 | ✅ Complete |
| TSK-402 | Specialist Domain Agent Runtime Executions | Sprint 4 | ✅ Complete |
| TSK-403 | Frontend Agent Timeline Widget & Reasoning UI | Sprint 3 | ✅ Complete |
| TSK-404 | Vector Embedding Generator Service (Cohere Embed v3) | Sprint 4 | ✅ Complete |
| TSK-405 | Memory Vector Search API & CockroachDB Store | Sprint 4 | ✅ Complete |
| TSK-406 | Frontend Memory Explorer Visualizer Page | Sprint 4 | ✅ Complete |
| TSK-501 | Agent Crash & Checkpoint Restore Watchdog Service | Sprint 5 | ✅ Complete |
| TSK-502 | Centralized Telemetry & Platform Audit Log Portal | Sprint 5 | ✅ Complete |

---

## Status Key
* ⬜ **Not Started** — Task has not been picked up yet.
* 🔄 **In Progress** — Task is actively being worked on.
* ✅ **Complete** — All Definition of Done criteria satisfied.
* 🔴 **Blocked** — Task cannot proceed due to a dependency.
* ⚠️ **At Risk** — Task has an identified risk or issue.

---

## Critical Dependency Chain (Do Not Reorder)

```text
TSK-101 → TSK-102 → TSK-201 → TSK-301 → TSK-401 → TSK-501
                 └──────────────────────────────── TSK-202 → TSK-203
                                                   TSK-302 → TSK-303
                                                   TSK-402 → TSK-403 → TSK-502
```

---

*Last Updated: 2026-07-15 | Maintained by: Engineering Director*
