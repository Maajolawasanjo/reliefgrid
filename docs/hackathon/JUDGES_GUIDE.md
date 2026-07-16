# 🧑‍⚖️ Hackathon Judges Evaluation & Audit Guide

Welcome, Hackathon Judges! This document provides a streamlined 5-minute audit path to evaluate **ReliefGrid**, test its core features, inspect CockroachDB vector memory performance, and verify AWS Bedrock agent execution.

---

## ⏱️ 5-Minute Evaluation Pathway

```
  [1] Login (1-Click Demo) ──► [2] View Emergency Command Center ──► [3] Test GIS Matrix
                                                                          │
  [5] Review CockroachDB Memory ◄── [4] Inspect Agent Timeline ───────────┘
```

---

## 🛠️ Step-by-Step Evaluation Protocol

### Step 1: Access Platform & 1-Click Authenticate
* **URL**: Open [http://localhost:3000/login](http://localhost:3000/login) (or your deployed Vercel URL).
* **Shortcut**: Click the **`Fill Credentials`** button on the sign-in form.
* **Credentials**:
  * **Email**: `admin@reliefgrid.gov`
  * **Password**: `AdminPassword123!`
* **Expected Outcome**: Instant redirect to `/incidents` (Emergency Command Center Dashboard).

### Step 2: Inspect Active Incidents & GIS Matrix (`/incidents`)
* Select an incident from the left feed (e.g. *"Lagos Tidal Surge & Flash Flooding"*).
* Observe the interactive Leaflet map featuring real-time incident markers, hazard risk radius overlays, and emergency infrastructure locations (hospitals, shelters, logistics hubs).

### Step 3: Test Sector Geolocation Switching
* In the top **Active Command Sector** bar, select **`Lagos, Nigeria`** or **`Nairobi, Kenya`** from the sector dropdown.
* Verify that sector coordinates, active street names, and map focus dynamically update.

### Step 4: Verify CockroachDB Collective Memory Engine (`/memory`)
* Click **`Memory Engine`** in the header navigation or sidebar.
* Input a vector search query: *"shelter access road flooded"* or click a suggested pill.
* Verify that sub-second semantic vector results are returned, complete with similarity percentage bars (`89% similarity`), memory classification badges, and metadata tags.

### Step 5: Verify Executive Analytics (`/executive`) & Telemetry (`/telemetry`)
* Click **`Executive View`** to review high-level disaster metrics, agency resource allocation graphs, and active critical alerts.
* Click **`Telemetry`** to inspect real-time platform system metrics, API latency gauges, and watchdog process status.

---

## 📄 Key Files for Codebase Inspection

* **CockroachDB Vector Memory Service**: `apps/api/app/services/memory_service.py`
* **AWS Bedrock Client Integration**: `apps/api/app/core/bedrock.py`
* **7 Autonomous Specialist Agents**: `apps/api/app/agents/`
* **Next.js Command Shell**: `apps/web/src/components/layout/app-shell.tsx`

---

## 📬 Questions or Assistance?
* **Lead Engineer**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626
