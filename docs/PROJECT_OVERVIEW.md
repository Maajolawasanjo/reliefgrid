# 🌐 Project Overview: ReliefGrid

## 📌 Vision & Purpose

**ReliefGrid** is an enterprise-grade, mission-critical autonomous multi-agent disaster response platform. Built for emergency crisis centers, humanitarian agencies, governments, and field responders, ReliefGrid closes the operational coordination gap during natural catastrophes (floods, hurricanes, earthquakes, and industrial disasters).

During large-scale emergency events, response agencies traditionally operate in isolated silos. Emergency services, medical centers, logistics networks, weather services, and shelter managers struggle to maintain a unified operational picture. **ReliefGrid** bridges this divide by deploying a coordinated team of **7 Autonomous AI Specialist Agents** anchored by a **Distributed Transactional Vector Memory System in CockroachDB** and **AWS Bedrock Claude 3**.

---

## 🎯 Primary Problem Solved

1. **Fragmentation of Command**: Eliminates manual cross-agency synchronization delays during critical early response hours.
2. **Loss of Historical Operational Memory**: Prevents repeat mistakes by querying CockroachDB `pgvector` memory embeddings for past lessons learned and post-action incident reports.
3. **Dynamic Route Hazard Invalidation**: Uses real-time OpenStreetMap/OSRM pathfinding to continuously calculate safe evacuation routes around active hazard polygons.

---

## 🌟 Key Functional Pillars

* 🤖 **Autonomous Multi-Agent Swarm**: Master Coordinator Agent orchestrating Specialist Agents (Weather, Infrastructure, Medical, Shelter, Logistics, Communications).
* 🧠 **CockroachDB Transactional RAG**: ACID-guaranteed 1024-dimensional memory vector search.
* 📍 **Tactical OpenStreetMap & OSRM Matrix**: Dynamic map geometry, geocoding, and route hazard buffers.
* 🛡️ **Self-Healing Telemetry Watchdog**: Background process automatically detecting stale tasks and retrying failed agent workflows.
* 🎨 **Aspekta Design System**: High-contrast, zero-fatigue dark mode user interface built with Next.js 14.

---

## 📬 Maintenance & Contact

* **Platform Lead & Architect**: Ma'ajo Lawasanjo
* **Email**: [maajolawasanjo@gmail.com](mailto:maajolawasanjo@gmail.com)
* **Phone / WhatsApp**: +2348105510626
