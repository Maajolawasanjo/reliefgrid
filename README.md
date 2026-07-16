# 🛡️ ReliefGrid — Autonomous Emergency Response Platform Engine

[![CockroachDB × AWS Hackathon 2026](https://img.shields.io/badge/Hackathon-CockroachDB%20%C3%97%20AWS-00D2FF?style=for-the-badge&logo=cockroachlabs)](https://devpost.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-9AF376?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI Python](https://img.shields.io/badge/Backend-FastAPI-0055FF?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![CockroachDB Pgvector](https://img.shields.io/badge/Memory-CockroachDB%20pgvector-6933FF?style=for-the-badge&logo=cockroachlabs)](https://www.cockroachlabs.com)
[![AWS Bedrock](https://img.shields.io/badge/AI Engine-AWS%20Bedrock-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**ReliefGrid** is an enterprise-grade, mission-critical autonomous multi-agent disaster coordination platform. Built for crisis centers, emergency management agencies, NGOs, and field responders, ReliefGrid combines **Distributed Transactional Vector Memory in CockroachDB**, **Autonomous AWS Bedrock AI Agents**, and **Real-Time OpenStreetMap/OSRM GIS Matrix** to dynamically coordinate multi-agency emergency responses during catastrophic natural disasters.

---

## 👨‍💻 Project Maintainer & Lead Architect
* **Lead Engineer & Architect**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626
* **Repository**: [https://github.com/Maajolawasanjo/reliefgrid](https://github.com/Maajolawasanjo/reliefgrid)

---

## 🏛️ System Architecture

```
                  ┌─────────────────────────────────────────────────────────┐
                  │          Next.js 14 Enterprise Web Client               │
                  │   (Aspekta Typography, Live GIS, Command Center UI)     │
                  └────────────────────────────┬────────────────────────────┘
                                               │ HTTP / REST / JSON
                                               ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │             FastAPI Production API Service              │
                  │        (Rate Limiting, Exception Envelopes, RBAC)        │
                  └──────┬─────────────────────┬────────────────────┬───────┘
                         │                     │                    │
                         ▼                     ▼                    ▼
        ┌──────────────────────────┐ ┌──────────────────┐ ┌─────────────────┐
        │  CockroachDB Distributed │ │ AWS Bedrock AI   │ │ Real-Time GIS   │
        │      Vector Store        │ │   Agent Engine   │ │  Matrix Engine  │
        │ (1024-dim pgvector, RAG) │ │ (Claude Claude3) │ │ (OSM / OSRM)    │
        └──────────────────────────┘ └──────────────────┘ └─────────────────┘
```

---

## 🌟 Core Platform Features

* 🤖 **7 Autonomous Multi-Agent Specialists**:
  * **Master Coordinator Agent**: Dynamic task assignment, workflow decomposition, and global conflict resolution.
  * **Weather Intelligence Agent**: Meteorological observation ingestion, flood risk prediction, and radar analysis.
  * **Infrastructure Safety Agent**: Bridge failure assessment, power grid degradation tracking, and structural safety audits.
  * **Medical Ops Agent**: Triage demand forecasting, trauma center capacity tracking, and blood supply dispatch.
  * **Shelter Capacity Agent**: Mass evacuation hub occupancy tracking, food ration calculations, and sanitation planning.
  * **Logistics & Supply Agent**: OSRM-powered route optimization, convoy scheduling, and supply line resilience.
  * **Communications Agent**: Tactical emergency broadcasts, public alert dispatching, and responder radio telemetry.
* 🧠 **CockroachDB Collective Memory Engine**: 1024-dimensional semantic vector search using `pgvector` on CockroachDB Serverless. Learns from past disasters to modify future recommendations.
* 📍 **Real-Time Tactical GIS Engine**: OpenStreetMap integration with OSRM (Open Source Routing Machine) calculation for shortest emergency response paths and hazard zone buffers.
* 🛡️ **Self-Healing Watchdog Engine**: Background telemetry watcher detecting stale tasks, agent failure modes, and automated retries with exponential backoff.
* 🔒 **Enterprise RBAC & Security Gateway**: Standardized JWT Authentication with granular role control (`ADMIN`, `COORDINATOR`, `RESPONDER`).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | Server-side rendering, React Server Components, Tailwind CSS |
| **Typography System** | **Aspekta & Sans-Serif** | Enterprise mission control aesthetic & high contrast tokens |
| **Backend API** | **FastAPI (Python 3.11)** | Asynchronous, auto-generating Swagger/OpenAPI docs, Pydantic v2 |
| **Distributed Database** | **CockroachDB Serverless** | Multi-region resilient SQL cluster with PostgreSQL compatibility |
| **Vector Engine** | **CockroachDB `pgvector`** | 1024-dimensional HNSW cosine similarity semantic search |
| **AI Orchestration** | **AWS Bedrock (Claude 3)** | Enterprise-grade foundation model agent reasoning |
| **GIS & Mapping** | **OpenStreetMap & OSRM** | Live leaflet mapping, reverse-geocoding, and route networks |
| **Testing** | **Pytest & TypeScript Compiler** | End-to-end integration tests & strict type enforcement |

---

## 📦 CockroachDB Integration & Usage

ReliefGrid leverages CockroachDB not as a simple data store, but as a **Production-Grade Transactional Agent Memory Layer**:

1. **Distributed Vector Indexing**: Stores 1024-dimensional vector embeddings generated from incident resolution logs, SITREPs, and post-action reports.
2. **Transactional RAG (Retrieval-Augmented Generation)**: Before any specialist agent issues a recommendation, it queries CockroachDB for past lessons learned.
3. **Multi-Region Resiliency**: Disaster management platforms require zero-downtime database survival across multi-region cloud outages.

---

## ⚡ AWS Integration & Usage

1. **AWS Bedrock Engine**: Powers autonomous reasoning for all 7 specialist agents using Anthropic Claude models on AWS Bedrock.
2. **Deterministic Fallbacks**: Integrated structured schema outputs and fallback chains when external LLM endpoints experience latency spikes.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
* **Node.js**: v18.0 or higher
* **Python**: v3.11 or higher
* **CockroachDB**: Cluster connection string (or local instance)

### 2. Environment Setup
Clone the repository and create `.env` files:
```bash
git clone https://github.com/Maajolawasanjo/reliefgrid.git
cd ReliefGrid
```

Copy `.env.example` to `.env` in both the backend and web folders:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Configure key variables in `apps/api/.env`:
```env
DATABASE_URL=postgresql://user:pass@free-tier.cockroachlabs.cloud:26257/reliefgrid?sslmode=verify-full
AWS_BEDROCK_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

### 3. Running Backend API
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
uvicorn app.main:app --app-dir apps/api --port 8000 --reload
```

### 4. Running Web Dashboard
```bash
cd apps/web
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Credentials

To experience the platform instantly without setup friction:

* **URL**: [http://localhost:3000/login](http://localhost:3000/login)
* **Email**: `admin@reliefgrid.gov`
* **Password**: `AdminPassword123!`
* *(Click **"Fill Credentials"** on the login screen for 1-click authentication)*

---

## 📄 License & Contact

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed by **Ma'ajo Lawasanjo** for the **CockroachDB × AWS Global Hackathon 2026**.

* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone**: +2348105510626
