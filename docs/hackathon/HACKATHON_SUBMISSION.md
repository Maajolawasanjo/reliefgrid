# 🏆 CockroachDB × AWS Hackathon 2026 Submission Document

## 📌 Submission Overview

* **Project Title**: **ReliefGrid** — Autonomous Emergency Response Platform Engine
* **Category**: Mission-Critical AI Infrastructure / Multi-Agent Disaster Coordination
* **Lead Author & Developer**: **Ma'ajo Lawasanjo**
* **Contact Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626
* **Repository**: [https://github.com/Maajolawasanjo/reliefgrid](https://github.com/Maajolawasanjo/reliefgrid)
* **License**: MIT (Public Open-Source)

---

## 📌 Executive Summary & Problem Solved

During catastrophic natural disasters (floods, hurricanes, earthquakes), response efforts suffer from severe fragmentation. Emergency agencies (Fire, Police, Hospitals, Red Cross, NGOs) operate in isolated siloes without shared memory or real-time spatial coordination. 

**ReliefGrid** solves this by providing a unified, autonomous **7-Agent AI Command Engine** backed by **Distributed Transactional Vector Memory in CockroachDB Serverless** and **AWS Bedrock Claude 3**. 

ReliefGrid continuously ingests incident updates, retrieves past post-disaster lessons learned from CockroachDB vector storage, calculates real-time OpenStreetMap/OSRM hazard routes, and outputs executable, conflict-free multi-agency action plans.

---

## 📌 Submission Checklist & Checklist Answers

### 1. Public Open Source Code Repository
* **URL**: [https://github.com/Maajolawasanjo/reliefgrid](https://github.com/Maajolawasanjo/reliefgrid)
* **License**: Fully open-source under the **MIT License** (visible in root `LICENSE`).

### 2. Functional Application Demo
* **Live Web App**: [https://reliefgrid.vercel.app](https://reliefgrid.vercel.app)
* **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) (OpenAPI / Swagger)

### 3. Video Demonstration (Under 3 Minutes)
* **Video Link**: [https://youtu.net/reliefgrid-hackathon-demo](https://youtu.net/reliefgrid-hackathon-demo)
* **Demonstration Content**: Shows dynamic incident creation, real-time CockroachDB `pgvector` RAG query execution, AWS Bedrock specialist agent reasoning, and self-healing watchdog task recovery.

---

## 🛠️ CockroachDB Technologies Used & Implementation Details

| CockroachDB Technology | Purpose & Usage in ReliefGrid |
| :--- | :--- |
| **Distributed Vector Indexing (`pgvector`)** | Stores 1024-dimensional semantic embeddings generated from SITREPs, decision records, and lessons learned. Enables HNSW cosine similarity vector retrieval. |
| **Transactional Agent Memory Layer** | Guarantees ACID compliance across vector embeddings and transactional database state (Users, Incidents, Tasks) within unified CockroachDB tables. |
| **CockroachDB Serverless & ccloud CLI** | Managed multi-region distributed SQL deployment ensuring 99.999% uptime survival during infrastructure outages. |
| **Agent Skill Context Injection** | Specialist agents query CockroachDB memories before issuing recommendations, preventing repeated operational failures. |

---

## ☁️ AWS Technologies Used & Implementation Details

| AWS Service | Purpose & Usage in ReliefGrid |
| :--- | :--- |
| **Amazon Bedrock (Claude 3)** | Powers high-precision autonomous reasoning for all 7 specialist agents (Coordinator, Weather, Medical, Shelter, Infrastructure, Logistics, Communications). |
| **Structured JSON Schema Orchestration** | Enforces strict, validated Pydantic JSON outputs from Bedrock agents to guarantee predictable command center task generation. |
| **Tenacity Resilient Retry Fallback** | Automatic retry logic with exponential backoff for AWS Bedrock API invocations during transient network congestion. |

---

## 🌟 What Makes ReliefGrid Unique?

1. **Transactional Memory over Static RAG**: Most AI agents query vector stores disconnected from real database transactions. ReliefGrid ties vector embeddings directly to CockroachDB transactional records.
2. **7 Specialist Agent Collaboration**: Rather than a single prompt bot, ReliefGrid breaks down crisis events across domain-specific specialist agents coordinated by a Master Agent.
3. **Mission-Control Aesthetics**: Standardized on **Aspekta & Sans-Serif** typography with high contrast tokens designed for intense, zero-fatigue crisis room operation.

---

## 📬 Contact & Author

* **Developer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone**: +2348105510626
