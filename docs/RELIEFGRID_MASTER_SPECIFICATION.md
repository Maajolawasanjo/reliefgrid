# ReliefGrid Master Specification

This document serves as the **Single Source of Truth (SSoT)** for the **ReliefGrid** project. All architectural decisions, product specifications, technical designs, database schemas, UI/UX guidelines, and implementation plans will be maintained and updated here.

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Vision](#vision)
3. [Product Goals](#product-goals)
4. [Product Requirements Document (PRD)](#prd)
5. [System Architecture](#system-architecture)
6. [Multi-Agent Architecture](#multi-agent-architecture)
7. [Agent Reasoning Framework](#agent-reasoning-framework)
8. [Memory Model](#memory-model)
9. [CockroachDB Architecture](#cockroachdb-architecture)
10. [AWS Cloud Architecture & Infrastructure (Phase 14)](#phase-14---aws-cloud-architecture--infrastructure)
11. [Technical Implementation Specification](#technical-implementation-specification)
12. [Complete Database Design & CockroachDB Cognitive Memory Architecture (Phase 12)](#phase-12---complete-database-design--cockroachdb-cognitive-memory-architecture)
13. [UI/UX Architecture](#uiux-architecture)
    - [6.1 Design Philosophy](#61-design-philosophy)
    - [6.2 Information Architecture](#62-information-architecture)
    - [6.3 Dashboard Architecture & Emergency Operations Command Center](#63-dashboard-architecture--emergency-operations-command-center)
    - [6.4 Collective Memory Explorer Architecture](#64-collective-memory-explorer-architecture)
    - [6.5 AI Agent Operations Center](#65-ai-agent-operations-center)
    - [6.6 Incident Operations Workspace](#66-incident-operations-workspace)
14. [Design System & Component Library](#design-system--component-library)
    - [9.1 Design Philosophy](#91-design-philosophy)
    - [9.2 Design Principles](#92-design-principles)
    - [9.3 Typography System](#93-typography-system)
    - [9.4 Color System](#94-color-system)
    - [9.5 Spacing System](#95-spacing-system)
    - [9.6 Grid System](#96-grid-system)
    - [9.7 Border Radius](#97-border-radius)
    - [9.8 Elevation](#98-elevation)
    - [9.9 Motion System](#99-motion-system)
    - [9.10 Iconography](#910-iconography)
    - [9.11 Visual Language for Collective Memory](#911-visual-language-for-collective-memory)
    - [9.12 Accessibility Standards](#912-accessibility-standards)
15. [Component Library Specification](#component-library-specification)
    - [9.13 Component Design Philosophy](#913-component-design-philosophy)
    - [9.14 Buttons](#914-buttons)
    - [9.15 Input Components](#915-input-components)
    - [9.16 Search Components](#916-search-components)
    - [9.17 Cards](#917-cards)
    - [9.18 Tables](#918-tables)
    - [9.19 Status Badges](#919-status-badges)
    - [9.20 Alerts](#920-alerts)
    - [9.21 Timelines](#921-timelines)
    - [9.22 Charts](#922-charts)
    - [9.23 Maps](#923-maps)
    - [9.24 Memory Components](#924-memory-components)
    - [9.25 AI Components](#925-ai-components)
    - [9.26 Navigation Components](#926-navigation-components)
    - [9.27 Modal Components](#927-modal-components)
    - [9.28 Loading States](#928-loading-states)
    - [9.29 Empty States](#929-empty-states)
    - [9.30 Error States](#930-error-states)
    - [9.31 Responsive Behavior](#931-responsive-behavior)
    - [9.32 Component Quality Standards](#932-component-quality-standards)
16. [Frontend Implementation Specification (Phase 10)](#phase-10---frontend-implementation-specification)
17. [Backend Implementation Specification (Phase 11)](#phase-11---backend-implementation-specification)
18. [User Journey & User Flows](#user-journey--user-flows)
19. [API Design & Service Contracts (Phase 13)](#phase-13---api-design--service-contracts)
20. [Security, Identity & Compliance (Phase 15)](#phase-15---security-identity--compliance)
21. [DevOps, CI/CD & Observability (Phase 16)](#phase-16---devops-cicd--observability)
22. [Testing & Quality Assurance (Phase 17)](#phase-17---testing--quality-assurance)
23. [Production Deployment & Operations (Phase 18)](#phase-18---production-deployment--operations)
24. [Error Handling, Exception Management & Fault Tolerance (Phase 19)](#phase-19---error-handling-exception-management--fault-tolerance-architecture)
25. [Behavioral Architecture, Sequence Diagrams & State Machines (Phase 20)](#phase-20---behavioral-architecture-sequence-diagrams--state-machines)
26. [Demo Strategy (Phase 21)](#phase-21---demo-strategy)
27. [Future Roadmap (Phase 22)](#phase-22---future-roadmap)
28. [Appendix A — UML Reference Diagrams](#appendix-a---uml-reference-diagrams)
29. [Appendix B — JSON Schemas & Event Catalog](#appendix-b---json-schemas--event-catalog)
30. [Appendix C — Architecture Decision Records (ADRs)](#appendix-c---architecture-decision-records-adrs)
31. [Appendix D — Engineering & Implementation Standards](#appendix-d---engineering--implementation-standards)

---

## Executive Summary

### Overview
ReliefGrid is a production-inspired, multi-agent emergency intelligence platform that enables autonomous AI agents to collaboratively assess, coordinate, and respond to disaster events through a **persistent collective memory** powered by CockroachDB.

Unlike traditional AI applications where each agent operates independently and loses context between interactions, ReliefGrid introduces a **Collective Memory Engine** that serves as the shared cognitive layer for all participating agents.

Every observation, inference, recommendation, decision, prediction, and operational outcome becomes part of a continuously evolving memory fabric that persists across failures, regions, sessions, and time.

Memory is not treated as application storage.

Memory is the product.

The platform demonstrates how production AI systems should coordinate when operating in dynamic, high-risk environments where context continuity, distributed collaboration, and transactional consistency are essential.

### Executive Vision
ReliefGrid transforms autonomous AI from isolated decision-makers into a collaborative intelligence network.

Instead of asking:
> "What can one AI agent do?"

ReliefGrid asks:
> "What can many specialized AI agents accomplish when they never forget what they have learned together?"

The answer is a resilient, adaptive, continuously improving emergency response platform capable of coordinating complex disaster operations using shared operational intelligence.

### Core Innovation: Persistent Collective Memory Architecture (PCMA)
Rather than assigning memory to individual agents, the platform maintains a globally distributed memory layer where:
* Every agent contributes knowledge.
* Every agent consumes knowledge.
* Every agent continuously enriches shared understanding.
* Every decision becomes organizational intelligence.

This architecture enables agents to recover instantly after failure without losing operational awareness.

It also enables future decisions to benefit from historical experiences.

Memory therefore evolves from passive storage into an active coordination mechanism.

### Why This Project Exists
Disaster response systems often suffer from fragmented information.

Weather services monitor forecasts.
Infrastructure teams assess damage.
Medical responders monitor casualties.
Shelter coordinators manage capacity.
Logistics teams track supplies.
Communication teams issue public advisories.

These systems frequently operate using disconnected data sources and delayed information exchange.

Human operators become responsible for mentally integrating multiple streams of information under extreme pressure.

ReliefGrid replaces fragmented coordination with autonomous collaborative intelligence.

Each specialized AI agent continuously contributes its understanding to a persistent memory layer, allowing every other agent to immediately operate using the latest shared operational context.

The result is faster, more informed, and more resilient coordination.

### Why CockroachDB
CockroachDB is not simply selected because it satisfies a hackathon requirement.

It is selected because its distributed systems architecture directly enables the project's central innovation.

ReliefGrid requires a memory system capable of:
* surviving infrastructure failures,
* maintaining transactional consistency,
* scaling across geographic regions,
* storing structured operational knowledge,
* supporting semantic vector retrieval,
* serving multiple concurrent AI agents,
* preserving long-term organizational intelligence.

CockroachDB uniquely satisfies these requirements through:
* Distributed SQL architecture
* Global consistency
* Horizontal scalability
* Distributed Vector Indexing
* PostgreSQL compatibility
* Managed MCP Server integration

Removing CockroachDB fundamentally changes the architecture.

Without persistent collective memory, ReliefGrid becomes a collection of disconnected AI assistants.

Therefore CockroachDB is not infrastructure.

It is the platform's cognitive backbone.

### Why AWS
AWS provides the execution environment for autonomous intelligence.

While CockroachDB provides persistent memory, AWS provides computation.

Amazon Bedrock enables advanced reasoning.
AWS Lambda enables event-driven agent execution.
Amazon S3 stores disaster datasets, uploaded reports, imagery, and historical artifacts.

Together they establish a production-inspired architecture where:
* Reasoning lives on AWS.
* Memory lives in CockroachDB.
* Coordination emerges through their interaction.

### Architectural Philosophy
Every architectural decision follows one guiding principle:
> Persistent memory should become more valuable with every disaster the platform experiences.

Rather than repeatedly solving isolated incidents, ReliefGrid continuously accumulates operational intelligence.

Over time the platform becomes increasingly capable because it remembers.

### Guiding Design Principles

#### Memory First
Memory is the primary product capability.
Every feature exists to create, improve, retrieve, validate, or utilize memory.

#### Multi-Agent Collaboration
Specialization produces better reasoning than monolithic intelligence.
Each agent owns a specific operational domain while contributing to collective intelligence.

#### Shared Understanding
Agents never communicate through temporary chat messages alone.
They communicate through persistent knowledge.
Every significant event becomes part of organizational memory.

#### Explainable Decisions
Every recommendation must be traceable to:
* observations,
* previous incidents,
* learned lessons,
* confidence scores,
* reasoning chains.

Operational trust is as important as prediction accuracy.

#### Continuous Learning
Every completed incident enriches future response capability.
Lessons become reusable operational knowledge rather than archived reports.

#### Failure Tolerance
Individual agent failures should never compromise organizational memory.
Recovery should restore operational awareness immediately from persistent state.

### Alignment with Hackathon Judging Criteria

#### Agentic Memory Design
ReliefGrid is fundamentally a memory architecture.
Persistent collective memory is the product rather than a supporting component.

#### Technical Implementation
The platform demonstrates:
* distributed memory,
* semantic retrieval,
* vector indexing,
* transactional coordination,
* agent orchestration,
* production-inspired architecture.

#### Real-World Impact
Disaster response directly affects human safety, resource allocation, and emergency coordination.
The architecture also generalizes to healthcare, logistics, cybersecurity, and enterprise operations.

#### Production Readiness
The architecture emphasizes:
* resilience,
* recoverability,
* consistency,
* observability,
* explainability,
* scalable coordination.

#### Creativity & Originality
Rather than building another conversational assistant, ReliefGrid demonstrates a new architectural pattern:
**Persistent Collective Memory for Autonomous Multi-Agent Systems.**

---

## Vision

### Vision Statement
To establish persistent collective memory as the foundational layer for production-grade autonomous systems, enabling specialized AI agents to coordinate, learn, recover, and improve together in complex, high-stakes environments.

### Long-Term Vision
ReliefGrid is not intended to become another disaster management dashboard.

It is intended to demonstrate a new software architecture for AI.

Today's AI systems are largely stateless.

Tomorrow's AI systems will possess organizational memory.

ReliefGrid explores that future.

The platform demonstrates how distributed memory transforms isolated reasoning into coordinated intelligence.

Disaster response provides the proving ground because it naturally requires multiple specialists operating simultaneously under uncertainty.

However, the architecture extends beyond emergency management.

The same principles can power:
* healthcare coordination,
* autonomous supply chains,
* industrial operations,
* smart cities,
* cybersecurity response,
* enterprise knowledge systems.

ReliefGrid therefore represents both an application and an architectural reference model.

### Product Philosophy
ReliefGrid is founded on five principles.

#### Intelligence should specialize.
Specialized agents outperform a single general-purpose assistant in complex operational environments.

#### Memory should persist.
Knowledge should survive failures, deployments, restarts, and organizational change.

#### Coordination should emerge naturally.
Agents coordinate by contributing to and consuming shared operational knowledge rather than through brittle point-to-point communication.

#### Learning should compound.
Every incident should improve future response capability.
Operational experience becomes reusable intelligence.

#### Systems should explain themselves.
Every recommendation should reference the memories, evidence, and reasoning that produced it.

### North Star
> Build a world where autonomous systems remember together.

---

## Product Goals

### Primary Goal
Demonstrate a production-inspired multi-agent architecture where persistent collective memory enables coordinated disaster response.

### Strategic Goals
* **Goal 1:** Show that memory is the primary capability enabling autonomous coordination.
* **Goal 2:** Demonstrate production-quality usage of CockroachDB as a distributed memory platform.
* **Goal 3:** Showcase semantic retrieval using Distributed Vector Indexing.
* **Goal 4:** Demonstrate autonomous collaboration among specialized AI agents.
* **Goal 5:** Prove that persistent memory improves decision quality over time.
* **Goal 6:** Demonstrate graceful recovery after individual agent failure.
* **Goal 7:** Provide transparent reasoning through explainable memory retrieval.

### MVP Success Criteria
By the end of the hackathon, ReliefGrid should successfully demonstrate:
* A realistic disaster scenario.
* Six specialized AI agents.
* A Coordinator Agent orchestrating workflows.
* Persistent collective memory in CockroachDB.
* Semantic retrieval using vector search.
* Cross-agent knowledge sharing.
* Agent recovery from persisted state.
* A polished operations center dashboard.
* A clear visualization of how memory evolves during the incident.

---

## PRD

### Problem Statement
Modern emergency response suffers from fragmented operational intelligence.

Critical information exists across weather forecasts, infrastructure assessments, hospital capacities, evacuation centers, logistics networks, and public communications.

Each organization often maintains its own systems, creating information silos that delay coordinated action.

While AI agents can automate individual tasks, they typically operate with isolated context and transient memory.

When an agent restarts, scales horizontally, or another specialist joins the workflow, valuable operational context is frequently lost or reconstructed from scratch.

This limits AI systems to reactive assistance rather than collaborative decision-making.

The fundamental challenge is not reasoning.

The fundamental challenge is **shared, persistent organizational memory**.

ReliefGrid addresses this challenge by introducing a Collective Memory Engine where every observation, decision, prediction, and operational outcome becomes durable organizational knowledge.

Instead of isolated AI assistants, ReliefGrid creates a coordinated intelligence network in which specialized agents continuously learn from each other's experiences.

The result is an emergency response platform capable of maintaining operational awareness across time, failures, and distributed execution while demonstrating how production-grade agentic memory can fundamentally transform autonomous systems.

### Product Scope

#### Product Overview
ReliefGrid is a production-inspired, AI-native emergency intelligence platform that enables multiple specialized autonomous agents to coordinate disaster response through a **shared persistent collective memory** powered by CockroachDB.

Unlike conventional emergency management systems that aggregate dashboards or independent AI assistants, ReliefGrid treats memory as the central intelligence layer of the platform.

Every agent contributes knowledge to a continuously evolving Collective Memory Engine and consumes relevant historical and real-time context before making recommendations.

This transforms autonomous agents from isolated problem solvers into collaborative decision makers.

The result is an intelligent emergency coordination platform that becomes increasingly capable with every incident it experiences.

##### Product Mission
ReliefGrid exists to solve one fundamental problem:
> **Critical operational knowledge disappears when organizations need it most.**

Disasters evolve rapidly.
Weather forecasts change.
Roads become inaccessible.
Hospitals reach capacity.
Shelters fill.
Supply routes fail.
Response teams continuously generate valuable operational knowledge.

Unfortunately, that knowledge is often fragmented across multiple organizations, spreadsheets, communication channels, and individual responders.

When new responders arrive—or when systems restart—much of that context must be reconstructed.

ReliefGrid prevents this loss of organizational intelligence by creating a persistent, shared memory layer where every significant observation, decision, action, and outcome becomes durable operational knowledge.

##### Product Differentiation
ReliefGrid is **not**:
* another chatbot,
* another dashboard,
* another disaster reporting application,
* another document search tool.

Instead, ReliefGrid introduces a **Persistent Collective Memory Architecture (PCMA)**.

The platform distinguishes itself through five foundational capabilities:
1. **Persistent Collective Memory:** Knowledge survives system restarts, infrastructure failures, agent replacement, organizational changes, and future disaster events. Memory continuously compounds over time.
2. **Multi-Agent Intelligence:** Instead of relying on a single general-purpose AI model, ReliefGrid employs specialized agents with clearly defined operational responsibilities. Each agent contributes expertise while benefiting from the collective intelligence generated by every other agent.
3. **Operational Learning:** Every completed incident strengthens future responses. Historical experience is transformed into reusable organizational knowledge rather than static reports.
4. **Explainable Coordination:** Every recommendation is supported by historical evidence, previous decisions, confidence assessments, retrieved memories, and supporting observations. Decision support is transparent rather than opaque.
5. **Production-Inspired Architecture:** The platform demonstrates production-quality patterns including distributed memory, transactional consistency, semantic retrieval, autonomous coordination, graceful recovery, and scalable intelligence.

##### Product Value Proposition
ReliefGrid enables emergency organizations to move from reactive coordination to continuously learning operational intelligence.

Instead of repeatedly solving similar problems from scratch, organizations accumulate institutional knowledge that improves future decision making.

The longer the platform operates, the more valuable it becomes.

#### In Scope (MVP Capabilities)
The MVP intentionally focuses on capabilities that directly demonstrate the value of persistent collective memory. Each capability exists because it contributes to at least one of the official hackathon judging criteria.

* **Incident Intelligence:** Provide a centralized operational representation of an evolving disaster event.
  * *Capabilities:* Create disaster incidents, track incident status, monitor affected regions, maintain incident timelines, store incident observations, record operational updates, and track response progress.
  * *Why Included:* Every memory requires context. The incident becomes the anchor around which all memories evolve.
* **Multi-Agent Coordination:** Coordinate specialized AI agents under a single orchestration model.
  * *Included Agents:* Weather Agent, Infrastructure Agent, Medical Agent, Shelter Agent, Logistics Agent, Communication Agent, and Coordinator Agent.
  * *Capabilities:* Task delegation, shared reasoning, cross-agent communication, memory synchronization, and coordinated recommendations.
  * *Why Included:* Multi-agent collaboration demonstrates why shared memory is essential rather than optional.
* **Collective Memory Engine:** Create the platform's persistent organizational intelligence.
  * *Capabilities:* Store operational memories, retrieve relevant memories, update memories, rank memories, link related memories, preserve historical knowledge, track confidence, and record decision outcomes.
  * *Why Included:* This is the core innovation of ReliefGrid. Without this subsystem, the product no longer fulfills its architectural vision.
* **Semantic Memory Retrieval:** Allow agents to retrieve relevant operational knowledge using meaning rather than exact matches.
  * *Capabilities:* Vector embeddings, semantic similarity search, historical incident retrieval, recommendation support, and context enrichment.
  * *Why Included:* Demonstrates CockroachDB Distributed Vector Indexing.
* **Operational Dashboard:** Provide responders with a single operational view.
  * *Dashboard Components:* Disaster map, active incident overview, agent activity panel, memory timeline, recommendation feed, resource status, alerts, and operational metrics.
  * *Why Included:* Judges should immediately understand how collective memory influences decision making.
* **Explainable AI Recommendations:** Every recommendation should include supporting observations, historical precedent, retrieved memories, confidence score, responsible agent, and timestamp.
  * *Why Included:* Operational trust is essential during emergencies.
* **Memory Explorer:** Users should be able to inspect historical memories, decision history, relationships, lessons learned, and semantic retrieval results.
  * *Why Included:* This feature makes the invisible architecture visible during the demo.

#### Out of Scope
The following capabilities are intentionally excluded from the hackathon MVP. Their exclusion is strategic rather than technical.

* **Live Drone Control:** Requires specialized hardware and introduces unnecessary operational complexity. Future versions may integrate drone telemetry as an additional data source.
* **Satellite Imagery Processing:** High implementation complexity. Requires external APIs and advanced image processing beyond the scope of the MVP.
* **Live IoT Sensor Networks:** Physical sensor integration is not required to demonstrate persistent collective memory. The MVP will simulate sensor-derived events where appropriate.
* **Government Emergency Dispatch Integration:** Requires secure partnerships, compliance, and real operational infrastructure. The MVP focuses on decision support rather than dispatch execution.
* **SMS / Cellular Broadcast Systems:** Communication channels are implementation details rather than core architectural innovations.
* **GIS Platform Integration:** The MVP includes map visualization but not full GIS interoperability.
* **Mobile Field Responder Applications:** Desktop operations center provides a more effective demonstration of collective memory during judging.
* **Offline Synchronization:** Production feature requiring conflict resolution strategies. Outside hackathon scope.
* **International Multi-Tenant Deployments:** Single region deployment is sufficient to demonstrate distributed memory architecture.
* **Regulatory Compliance:** (e.g. FEMA, GDPR, ISO 22320, National emergency standards) Relevant for production but unnecessary for the hackathon demonstration.

#### MVP Scope
The MVP is intentionally constrained to showcase architectural excellence rather than feature breadth. Success is defined by demonstrating the value of persistent collective memory.

The MVP must include:
* Incident creation and management
* Coordinator Agent orchestration
* Six specialized AI agents
* CockroachDB-backed Collective Memory Engine
* Distributed Vector Indexing for semantic retrieval
* Amazon Bedrock-powered reasoning
* Amazon S3 for supporting documents and artifacts
* Interactive Emergency Operations Dashboard
* Memory Explorer
* Explainable recommendations
* Simulated disaster scenario
* Agent failure and recovery demonstration

The MVP explicitly prioritizes reliability over feature count, architectural clarity over breadth, and memorable demonstrations over exhaustive functionality.

#### Demo Scope
The demo is designed around a single realistic disaster scenario that unfolds over several stages.

The presenter creates a flood incident affecting a region.
As the scenario progresses:
1. The Weather Agent forecasts extreme rainfall and records the prediction in collective memory.
2. The Infrastructure Agent retrieves the weather context, identifies vulnerable bridges, and updates the shared memory with road closures.
3. The Medical Agent uses the evolving memory to identify hospitals approaching capacity and recommends patient redistribution.
4. The Shelter Agent reallocates evacuees based on infrastructure constraints and shelter occupancy.
5. The Logistics Agent reroutes essential supplies using the latest shared operational picture.
6. The Communication Agent prepares coordinated public advisories using the verified operational state.

The presenter then intentionally stops one agent to simulate failure.
The remaining agents continue operating because all critical context resides within CockroachDB's persistent collective memory.
When the failed agent is restored, it immediately reconstructs its operational context by retrieving the latest collective memory and resumes participation without manual intervention.

The demonstration concludes with the Memory Explorer, showing how observations, decisions, embeddings, confidence scores, and lessons learned accumulated throughout the incident.

This sequence makes the platform's central message unmistakable:
> **The system remains intelligent because the memory persists.**

#### Future Production Scope
ReliefGrid is architected as a platform rather than a single-purpose application. Future evolution may include:
* Live weather service integrations
* Satellite imagery ingestion
* Drone and UAV telemetry
* IoT flood and seismic sensors
* GIS interoperability
* NGO collaboration workspaces
* Cross-border emergency coordination
* Mobile responder applications
* Offline-first synchronization
* Predictive evacuation modeling
* Resource optimization using reinforcement learning
* Historical disaster analytics
* Compliance reporting for emergency management agencies
* Multi-region, multi-tenant deployments
* Citizen reporting portals
* Integration with national emergency operation centers
* Advanced simulation and training environments
* AI-assisted post-incident reviews and policy recommendations

Each of these capabilities builds upon the same architectural principle:
> **Persistent collective memory remains the cognitive backbone of the platform.**

#### Architectural Decisions
* **Memory-first scope:** Every included capability either creates, enriches, retrieves, or visualizes collective memory.
* **Constrained MVP:** Features were selected to maximize hackathon impact while remaining achievable within the available development time.
* **Production trajectory:** Out-of-scope features are deferred because they add integration complexity without strengthening the core demonstration.

#### Hackathon Alignment
This product scope directly supports:
* **Agentic Memory Design:** Collective Memory Engine, Memory Explorer, semantic retrieval.
* **Technical Implementation:** Multi-agent orchestration, CockroachDB, AWS integration.
* **Real-World Impact:** Disaster response workflow.
* **Production Readiness:** Explainability, recovery, operational dashboard.
* **Creativity & Originality:** Persistent Collective Memory Architecture.

---

### User Personas

#### Introduction
ReliefGrid is designed for professionals operating in high-pressure emergency response environments where decisions must be made rapidly, collaboratively, and with incomplete information.

Unlike conventional emergency management software, ReliefGrid does not replace human decision-makers. Instead, it augments them by providing a persistent, explainable, and continuously evolving collective memory that supports coordination across multiple operational domains.

Each persona represents a distinct operational role with unique goals, workflows, and information needs. Understanding these roles is essential for designing AI agents, dashboards, memory structures, and user experiences that align with real-world emergency operations.

#### Persona 1 — Emergency Operations Commander
* **Profile:** Commander Amina Yusuf (EOC Commander, 18 years experience, National EOC workspace).
* **Responsibilities:** Oversees entire disaster response operation. Maintains situational awareness, coordinates teams, prioritizes actions, approves strategic decisions, and ensures resource allocation.
* **Goals:**
  * Maintain a comprehensive operational picture.
  * Coordinate specialized teams efficiently.
  * Minimize casualties and infrastructure damage.
  * Make timely, evidence-based decisions.
  * Ensure continuity of operations during evolving crises.
* **Pain Points:**
  * Information arrives from many disconnected sources.
  * Critical updates may be delayed or overlooked.
  * Reconstructing context during shift changes is time-consuming.
  * Conflicting reports reduce confidence in decision-making.
  * Historical lessons are difficult to access during active incidents.
* **Daily Workflow:**
  1. Monitor active incidents.
  2. Review AI-generated operational recommendations.
  3. Approve strategic response plans.
  4. Allocate resources.
  5. Monitor overall system performance.
  6. Review post-incident reports.
* **Decisions They Make:**
  * Whether to declare an emergency.
  * Which regions require immediate attention.
  * Resource prioritization.
  * Evacuation approvals.
  * Escalation of response levels.
* **Information Required:**
  * Overall incident status, cross-agent recommendations, confidence scores, historical precedents, resource availability, risk forecasts, and operational bottlenecks.
* **How ReliefGrid Helps:**
  * Provides a unified operational picture by combining insights from all specialized agents into a single, explainable view. The commander can trace every recommendation back to the memories and evidence that informed it.
* **Primary AI Agent Interactions:** Coordinator Agent, Weather Agent, Logistics Agent, Medical Agent.
* **Most Valuable Memory Types:** Decision Memory, Incident Timeline, Prediction Memory, Organizational Memory, Confidence Scores.

#### Persona 2 — Disaster Response Coordinator
* **Profile:** David Mensah (Disaster Response Coordinator, 11 years in humanitarian operations).
* **Responsibilities:** Coordinates field operations across multiple responding organizations, ensuring tasks are synchronized and response efforts remain aligned with changing conditions.
* **Goals:**
  * Maintain coordination across agencies.
  * Prevent duplication of effort.
  * Resolve operational conflicts quickly.
  * Keep response activities synchronized.
* **Pain Points:**
  * Multiple teams often operate independently.
  * Task ownership becomes unclear.
  * Situational updates become outdated rapidly.
  * Communication gaps slow response efforts.
* **Daily Workflow:**
  1. Review active operational tasks.
  2. Coordinate field teams.
  3. Monitor logistics.
  4. Update incident records.
  5. Resolve operational conflicts.
* **Decisions They Make:** Task assignments, operational priorities, resource redistribution, and coordination schedules.
* **Information Required:** Current operational tasks, agent recommendations, infrastructure status, shelter capacity, and logistics constraints.
* **How ReliefGrid Helps:** The Coordinator Agent consolidates updates from all operational agents into a continuously synchronized task view, reducing coordination overhead.
* **Primary AI Agent Interactions:** Coordinator Agent, Infrastructure Agent, Logistics Agent, Shelter Agent.
* **Most Valuable Memory Types:** Task Memory, Working Memory, Incident Timeline, Resource Memory.

#### Persona 3 — Medical Operations Officer
* **Profile:** Dr. Grace Okeke (Medical Operations Officer, Emergency physician with disaster response specialization).
* **Responsibilities:** Coordinates medical resources, hospital capacity, casualty management, and emergency healthcare logistics.
* **Goals:**
  * Prevent hospital overload.
  * Prioritize critical patients.
  * Optimize ambulance routing.
  * Maintain healthcare continuity.
* **Pain Points:**
  * Limited visibility into regional medical capacity.
  * Rapidly changing casualty numbers.
  * Delayed reporting from field hospitals.
  * Difficulty anticipating future demand.
* **Daily Workflow:**
  1. Monitor casualty reports.
  2. Review hospital capacity.
  3. Allocate medical resources.
  4. Coordinate patient transfers.
  5. Prepare emergency recommendations.
* **Decisions They Make:** Hospital redistribution, medical supply allocation, emergency staffing, and patient prioritization.
* **Information Required:** Casualty trends, hospital occupancy, infrastructure accessibility, and predicted patient inflow.
* **How ReliefGrid Helps:** The Medical Agent continuously combines operational memory, historical incidents, and live observations to recommend evidence-based medical resource allocation.
* **Primary AI Agent Interactions:** Medical Agent, Infrastructure Agent, Logistics Agent.
* **Most Valuable Memory Types:** Resource Memory, Prediction Memory, Episodic Memory, Decision Memory.

#### Persona 4 — Logistics Coordinator
* **Profile:** Samuel Adeyemi (Logistics Coordinator, Supply chain and emergency logistics specialist, 11 years experience).
* **Responsibilities:** Ensures critical resources reach affected areas efficiently despite changing infrastructure conditions.
* **Goals:**
  * Deliver supplies quickly.
  * Optimize transportation routes.
  * Avoid resource shortages.
  * Reduce operational delays.
* **Pain Points:**
  * Unexpected road closures.
  * Incomplete infrastructure updates.
  * Limited visibility into shelter demand.
  * Dynamic transportation constraints.
* **Daily Workflow:**
  1. Review supply requests.
  2. Monitor transportation routes.
  3. Allocate inventory.
  4. Coordinate deliveries.
  5. Track logistics performance.
* **Decisions They Make:** Route selection, resource allocation, warehouse prioritization, and transportation scheduling.
* **Information Required:** Infrastructure status, shelter occupancy, supply inventory, and weather forecasts.
* **How ReliefGrid Helps:** The Logistics Agent retrieves collective memory from all operational domains, enabling supply decisions based on the latest shared understanding rather than isolated reports.
* **Primary AI Agent Interactions:** Logistics Agent, Infrastructure Agent, Shelter Agent, Weather Agent.
* **Most Valuable Memory Types:** Resource Memory, Working Memory, Prediction Memory, Relationship Memory.

#### Persona 5 — Government Administrator
* **Profile:** Fatima Bello (Government Emergency Administrator, Public sector emergency management executive).
* **Responsibilities:** Oversees policy implementation, resource governance, funding decisions, and interagency coordination.
* **Goals:**
  * Ensure effective disaster governance.
  * Monitor national response performance.
  * Review strategic reports.
  * Support long-term resilience planning.
* **Pain Points:**
  * Limited visibility into operational decisions.
  * Difficulty measuring response effectiveness.
  * Inconsistent reporting standards.
  * Fragmented historical records.
* **Daily Workflow:**
  1. Review executive dashboards.
  2. Monitor national incidents.
  3. Evaluate operational metrics.
  4. Approve strategic initiatives.
  5. Review historical analyses.
* **Decisions They Make:** Funding approvals, strategic policy adjustments, national coordination priorities, and long-term preparedness planning.
* **Information Required:** Executive summaries, historical performance, operational KPIs, and lessons learned.
* **How ReliefGrid Helps:** ReliefGrid transforms operational memories into strategic intelligence, allowing leadership to evaluate performance and improve preparedness using accumulated organizational knowledge.
* **Primary AI Agent Interactions:** Coordinator Agent, Communication Agent.
* **Most Valuable Memory Types:** Organizational Memory, Lessons Learned, Decision Memory, Reflection Memory.

#### Persona 6 — Public Information Officer
* **Profile:** Michael Ndlovu (Public Information Officer, Crisis communications specialist).
* **Responsibilities:** Develops and distributes verified public communications before, during, and after emergencies.
* **Goals:**
  * Deliver timely and accurate information.
  * Prevent misinformation.
  * Maintain public trust.
  * Coordinate messaging across agencies.
* **Pain Points:**
  * Rapidly changing operational information.
  * Conflicting reports from multiple sources.
  * Pressure to communicate before information is fully verified.
  * Difficulty tracking message history.
* **Daily Workflow:**
  1. Monitor verified operational updates.
  2. Draft public advisories.
  3. Coordinate approvals.
  4. Publish communications.
  5. Track public information history.
* **Decisions They Make:** When to issue alerts, what information is safe to publish, how to prioritize public messaging, and communication frequency.
* **Information Required:** Verified incident status, infrastructure impacts, shelter availability, evacuation recommendations, and confidence levels.
* **How ReliefGrid Helps:** The Communication Agent generates explainable recommendations using verified collective memory, ensuring that public communications remain accurate, consistent, and traceable to operational evidence.
* **Primary AI Agent Interactions:** Communication Agent, Coordinator Agent.
* **Most Valuable Memory Types:** Semantic Memory, Decision Memory, Confidence Memory, Incident Timeline.

#### Cross-Persona Insights
Although each persona has different operational responsibilities, they all rely on the same underlying capability: **Persistent Collective Memory.**

Rather than maintaining separate operational views, ReliefGrid enables every stakeholder to access a shared organizational understanding tailored to their responsibilities. This eliminates information silos while preserving role-specific perspectives.

The platform's AI agents act as domain experts, but the collective memory ensures that every recommendation reflects the latest verified operational context across all domains.

#### Architectural Decisions
* Personas were modeled after common roles found in emergency operations centers and humanitarian response organizations, ensuring realistic workflows and decision-making patterns.
* Each persona maps directly to one or more specialized AI agents, reinforcing the principle of collaborative intelligence.
* Memory types were assigned based on operational needs, establishing clear requirements for the Collective Memory Engine that will be designed in later phases.

#### Hackathon Alignment
This section strengthens the following judging criteria:
* **Real-World Impact:** Demonstrates a clear understanding of emergency response stakeholders.
* **Agentic Memory Design:** Shows how different users derive value from persistent collective memory.
* **Production Readiness:** Grounds the product in realistic operational roles rather than abstract AI concepts.

---

### Functional Requirements

#### Introduction
Functional requirements define the capabilities, behaviors, and interactions that ReliefGrid must provide to satisfy its product vision.

These requirements are derived from:
* The product scope.
* User personas.
* Disaster lifecycle journey.
* Hackathon judging criteria.
* Persistent collective memory architecture.

The functional requirements are intentionally designed around one principle:
> **Every major capability must either create, retrieve, improve, or operationalize collective memory.**

A feature that does not strengthen the memory-driven intelligence model is not considered a core ReliefGrid capability.

#### Requirement Priority Definitions
* **Must Have (M):** Capabilities required for the hackathon MVP. Without these features, ReliefGrid cannot demonstrate its core innovation.
* **Should Have (S):** Important capabilities that improve quality, realism, or judging impact but are not strictly required.
* **Nice To Have (N):** Future enhancements that improve the product but are not required for the initial release.

#### Phase 2D.1 — Incident Management & Agent Coordination

##### Category Overview
Incident management represents the operational foundation of ReliefGrid. Every agent action, memory creation, recommendation, and decision exists within the context of a disaster incident.

The incident is the central entity connecting:
* human operators,
* AI agents,
* operational events,
* resources,
* decisions,
* memories.

##### FR-001 — Disaster Incident Creation
* **Priority:** Must Have
* **Requirement:** The system shall allow authorized users or automated triggers to create a disaster incident.
* **Description:** ReliefGrid must support creation of a structured incident record containing essential operational information: Incident name, Incident type, Geographic area, Severity level, Start time, Current status, and Responsible organization.
* **Business Justification:** Every memory requires contextual grounding. Without a structured incident entity, agent-generated knowledge cannot be properly organized, retrieved, or reused.
* **Primary Users:** Emergency Operations Commander, Disaster Response Coordinator.
* **Primary Agents:** Coordinator Agent.
* **Memory Interaction:** Creates Incident Memory, Working Memory.
* **Judging Alignment:** Agentic Memory Design, Production Readiness.

##### FR-002 — Incident Lifecycle Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain the complete lifecycle of an emergency incident.
* **Description:** Incidents must transition through defined states: Monitoring, Detected, Active Response, Stabilizing, Recovery, and Closed. Every state transition must be recorded.
* **Business Justification:** Emergency situations evolve over time. Persistent lifecycle tracking enables agents to understand operational context and historical progression.
* **Primary Users:** All operational users.
* **Primary Agents:** Coordinator Agent.
* **Memory Interaction:** Creates Incident Timeline Memory, Decision Memory.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-003 — Incident Timeline Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain a chronological timeline of significant incident events.
* **Description:** The timeline must capture: Observations, Agent recommendations, Human decisions, Resource changes, Communications, and Outcomes.
* **Business Justification:** Emergency response depends heavily on understanding how situations evolved. A persistent timeline allows both humans and agents to reconstruct context.
* **Primary Users:** Emergency Commander, Government Administrator.
* **Primary Agents:** All agents.
* **Memory Interaction:** Creates Episodic Memory, Decision Memory.
* **Judging Alignment:** Agentic Memory Design, Production Readiness.

##### FR-004 — Incident Context Retrieval
* **Priority:** Must Have
* **Requirement:** The system shall provide agents with relevant incident context before generating recommendations.
* **Description:** Before making decisions, agents must retrieve: Current incident state, Recent observations, Previous decisions, Related historical events, and Relevant resources.
* **Business Justification:** AI agents without context produce isolated recommendations. Context retrieval transforms individual reasoning into collective intelligence.
* **Primary Users:** AI Agents.
* **Primary Agents:** All specialized agents.
* **Memory Interaction:** Reads Working Memory, Episodic Memory, Semantic Memory.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-005 — Coordinator Agent Orchestration
* **Priority:** Must Have
* **Requirement:** The system shall provide a Coordinator Agent responsible for managing specialized AI agents.
* **Description:** The Coordinator Agent shall: Receive incident updates, Assign tasks, Request analysis, Resolve conflicting recommendations, Maintain operational state, and Trigger workflows.
* **Business Justification:** Multiple autonomous agents require coordination. Without orchestration, the platform becomes disconnected AI assistants rather than a collective intelligence system.
* **Primary Users:** Emergency Operations Commander.
* **Primary Agents:** Coordinator Agent.
* **Memory Interaction:** Reads all memory types; Writes Decision Memory, Task Memory.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-006 — Agent Task Assignment
* **Priority:** Must Have
* **Requirement:** The system shall allow the Coordinator Agent to assign operational tasks to specialized agents.
* **Description:** Tasks should include: Task objective, Assigned agent, Priority, Deadline, Context requirements, and Expected output.
* **Business Justification:** Specialized intelligence requires structured collaboration. Agents must understand their responsibilities within the broader operation.
* **Primary Users:** Coordinator Agent.
* **Memory Interaction:** Creates Task Memory.
* **Judging Alignment:** Technical Implementation.

##### FR-007 — Multi-Agent Communication
* **Priority:** Must Have
* **Requirement:** The system shall support structured communication between autonomous agents.
* **Description:** Agents must exchange findings, recommendations, warnings, confidence levels, and memory references. Communication should be based on shared memory rather than temporary conversations.
* **Business Justification:** The core innovation of ReliefGrid is collaborative intelligence through shared knowledge.
* **Primary Agents:** All specialized agents.
* **Memory Interaction:** Reads/Writes Shared Collective Memory.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-008 — Agent Status Monitoring
* **Priority:** Must Have
* **Requirement:** The system shall monitor the operational status of every AI agent.
* **Description:** The system should track states: Active, Processing, Waiting, Failed, and Recovering.
* **Business Justification:** Production-grade autonomous systems require visibility into agent health.
* **Primary Users:** Emergency Commander, System Administrator.
* **Memory Interaction:** Creates Agent State Memory.
* **Judging Alignment:** Production Readiness.

##### FR-009 — Agent Failure Detection
* **Priority:** Must Have
* **Requirement:** The system shall detect when an AI agent becomes unavailable.
* **Description:** Failure detection should identify: Timeout, Processing failure, Invalid response, and Service interruption.
* **Business Justification:** The system must demonstrate resilience. Agent failure should not result in memory loss or operational collapse.
* **Memory Interaction:** Reads Agent State Memory; Writes Failure Event Memory.
* **Judging Alignment:** Production Readiness, Agentic Memory Design.

##### FR-010 — Agent Recovery
* **Priority:** Must Have
* **Requirement:** The system shall allow failed agents to recover operational context from persistent memory.
* **Description:** When an agent restarts, it must retrieve: Current incident state, Previous assignments, Relevant memories, Recent decisions, and Pending tasks.
* **Business Justification:** This is one of the strongest demonstrations of why persistent agentic memory matters. The agent does not restart as a blank system; it resumes with organizational knowledge.
* **Memory Interaction:** Reads Working Memory, Task Memory, Decision Memory, Semantic Memory.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation, Production Readiness.

##### FR-011 — Recommendation Generation
* **Priority:** Must Have
* **Requirement:** The system shall allow AI agents to generate operational recommendations.
* **Description:** Recommendations must include proposed action, reasoning, supporting memories, confidence score, and responsible agent.
* **Business Justification:** Emergency users require actionable intelligence, not raw information.
* **Memory Interaction:** Reads Historical Memory, Current Incident Memory; Writes Decision Memory.
* **Judging Alignment:** Real-World Impact, Explainability.

##### FR-012 — Recommendation Conflict Resolution
* **Priority:** Should Have
* **Requirement:** The Coordinator Agent should identify and resolve conflicting agent recommendations.
* **Description:** Example: Weather Agent recommends evacuation, but Logistics Agent reports primary route is unavailable. Coordinator Agent selects an alternate evacuation route using shared context.
* **Business Justification:** Real-world emergencies contain conflicting information. The platform must demonstrate coordinated intelligence rather than independent predictions.
* **Memory Interaction:** Reads Agent Recommendations, Confidence Scores; Writes Final Decision Memory.
* **Judging Alignment:** Creativity & Originality, Agentic Memory Design.

##### Summary of Phase 2D.1 Requirements

| ID | Capability | Priority |
| --- | --- | --- |
| FR-001 | Incident Creation | Must Have |
| FR-002 | Incident Lifecycle | Must Have |
| FR-003 | Incident Timeline | Must Have |
| FR-004 | Context Retrieval | Must Have |
| FR-005 | Coordinator Agent | Must Have |
| FR-006 | Task Assignment | Must Have |
| FR-007 | Agent Communication | Must Have |
| FR-008 | Agent Monitoring | Must Have |
| FR-009 | Failure Detection | Must Have |
| FR-010 | Agent Recovery | Must Have |
| FR-011 | Recommendation Generation | Must Have |
| FR-012 | Conflict Resolution | Should Have |

#### Phase 2D.2 — Collective Memory & Vector Retrieval Requirements

##### Category Overview
The Collective Memory Engine is the cognitive foundation of ReliefGrid. Traditional applications treat databases as passive storage systems. ReliefGrid treats memory as an active intelligence layer that enables agents to remember previous events, understand current situations, learn from outcomes, coordinate decisions, recover after failures, and improve future responses.

Every agent interaction contributes to a continuously evolving operational knowledge system. The Collective Memory Engine consists of multiple memory categories:
* Working Memory
* Episodic Memory
* Semantic Memory
* Task Memory
* Decision Memory
* Reflection Memory
* Prediction Memory
* Resource Memory
* Relationship Memory
* Long-Term Organizational Memory

##### FR-013 — Collective Memory Creation
* **Priority:** Must Have
* **Requirement:** The system shall allow AI agents and human operators to create persistent memories during incident operations.
* **Description:** Every meaningful operational event should become a structured memory object: Weather observation, Road blockage, Medical shortage, Shelter availability, Resource movement, Human decision, or Agent recommendation. Each memory must contain: Source, Timestamp, Incident reference, Memory type, Confidence score, Importance level, and Related entities.
* **Business Justification:** Without structured memory creation, ReliefGrid becomes a normal AI workflow system. Memory creation is the foundation of autonomous learning.
* **Primary Users:** AI Agents, Emergency Operators.
* **Primary Agents:** All specialized agents.
* **Memory Interaction:** Creates Episodic Memory, Semantic Memory, Operational Memory.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-014 — Working Memory Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain short-term operational context required for active decision-making.
* **Description:** Working Memory stores temporary but important information during an active reasoning cycle (e.g. Current incident conditions, active agent tasks, recent observations, current recommendations, pending decisions). Working Memory allows agents to avoid repeatedly analyzing the same information.
* **Business Justification:** AI agents require immediate context to operate efficiently. Without working memory, every interaction starts from zero.
* **Primary Agents:** All agents.
* **Memory Interaction:** Reads recent incident information; Writes current reasoning state.
* **Retention Strategy:** Short-lived; automatically consolidated into long-term memory when important.
* **Judging Alignment:** Agentic Memory Design.

##### FR-015 — Episodic Memory Storage
* **Priority:** Must Have
* **Requirement:** The system shall preserve historical experiences from previous incidents.
* **Description:** Episodic Memory stores what happened, when it happened, where it happened, which decisions were made, and what outcomes occurred (e.g. "During the 2026 River Flood Incident, evacuation route B failed after bridge damage").
* **Business Justification:** Agents improve when they can recall similar historical situations.
* **Primary Agents:** All agents.
* **Memory Interaction:** Reads historical incidents; Writes completed operational experiences.
* **Retention Strategy:** Long-term; historical incidents remain available for future retrieval.
* **Judging Alignment:** Agentic Memory Design, Real-World Impact.

##### FR-016 — Semantic Memory Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain generalized knowledge extracted from previous experiences.
* **Description:** Semantic Memory represents knowledge independent of a single incident (e.g. Areas vulnerable to flooding, typical evacuation challenges, historical response patterns, successful mitigation strategies). Unlike episodic memory, semantic memory represents learned knowledge.
* **Business Justification:** This allows ReliefGrid to become smarter over time. The platform does not only remember events, it learns patterns.
* **Primary Agents:** All agents.
* **Memory Interaction:** Reads historical knowledge; Writes consolidated lessons.
* **CockroachDB Requirement:** Semantic memories will use vector embeddings and Distributed Vector Indexing.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-017 — Task Memory Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain persistent records of operational tasks assigned to agents.
* **Description:** Task Memory stores task description, assigned agent, status, dependencies, completion history, and related memories.
* **Business Justification:** Autonomous systems require state persistence. Agents must know what work has already happened.
* **Example:** Coordinator Agent requests: "Logistics Agent, identify alternative supply routes." This is stored as Task Memory.
* **Judging Alignment:** Production Readiness.

##### FR-018 — Decision Memory Storage
* **Priority:** Must Have
* **Requirement:** The system shall preserve all significant operational decisions.
* **Description:** Decision Memory records the decision made, decision maker, supporting evidence, agent recommendations, confidence score, and outcome (e.g. Decision: "Evacuate Zone A", supporting memories: Weather prediction, flood risk, historical flooding pattern).
* **Business Justification:** Emergency decisions require accountability. Future agents should understand why previous actions were taken.
* **Judging Alignment:** Explainability, Production Readiness.

##### FR-019 — Reflection Memory
* **Priority:** Should Have
* **Requirement:** The system should analyze completed incidents and generate improvement memories.
* **Description:** Reflection Memory stores what worked, what failed, unexpected events, and improvement opportunities.
* **Business Justification:** This transforms ReliefGrid from a response tool into a learning system.
* **Example:** After incident: "Medical Agent prediction underestimated hospital demand by 20%." Future confidence scores are adjusted.
* **Judging Alignment:** Creativity & Originality, Agentic Memory Design.

##### FR-020 — Prediction Memory
* **Priority:** Must Have
* **Requirement:** The system shall store predictions generated by AI agents.
* **Description:** Prediction Memory contains prediction, source agent, confidence level, expected outcome, and actual result (e.g., Weather Agent: "Flood probability: 82%"; Infrastructure Agent: "Bridge failure risk: High").
* **Business Justification:** Prediction tracking allows agents to improve accuracy.
* **Judging Alignment:** Real-World Impact.

##### FR-021 — Resource Memory
* **Priority:** Must Have
* **Requirement:** The system shall maintain persistent knowledge about operational resources.
* **Description:** Stores medical supplies, vehicles, shelters, personnel, equipment, and locations.
* **Business Justification:** Resource awareness is essential for emergency coordination.
* **Judging Alignment:** Real-World Impact.

##### FR-022 — Memory Relationship Management
* **Priority:** Must Have
* **Requirement:** The system shall maintain relationships between memories (e.g., Weather Prediction -> caused -> Flood Risk -> triggered -> Evacuation Decision -> required -> Shelter Allocation).
* **Business Justification:** Relationships allow agents to understand causal chains rather than isolated facts.
* **Memory Interaction:** Creates knowledge relationships, memory graphs.
* **Judging Alignment:** Creativity & Originality.

##### FR-023 — Memory Confidence Scoring
* **Priority:** Must Have
* **Requirement:** Every generated memory shall contain a confidence score.
* **Description:** Confidence considers source reliability, historical accuracy, data freshness, and agent certainty (e.g. Weather Agent prediction confidence: 91%, citizen report confidence: 55%).
* **Business Justification:** Emergency decisions require understanding uncertainty.
* **Judging Alignment:** Production Readiness, Explainability.

##### FR-024 — Semantic Memory Retrieval
* **Priority:** Must Have
* **Requirement:** The system shall retrieve relevant memories using semantic similarity.
* **Description:** Agents should search by meaning rather than exact keywords. Example: Agent query "What happened during previous severe floods?" retrieves past flood incidents, evacuation decisions, infrastructure failures, and successful responses.
* **CockroachDB Requirement:** Uses Distributed Vector Indexing, stores memory embeddings, and retrieves similar operational experiences.
* **Business Justification:** Semantic retrieval enables intelligent reasoning. Traditional keyword search cannot provide contextual understanding.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-025 — Memory Consolidation
* **Priority:** Should Have
* **Requirement:** The system should transform short-term memories into long-term knowledge.
* **Description:** Example: During incident, temporary observation "Road closed" is analyzed and converted to permanent knowledge "This route frequently fails during heavy rainfall."
* **Business Justification:** Continuous learning requires converting experiences into reusable knowledge.
* **Judging Alignment:** Creativity & Originality.

##### FR-026 — Memory Versioning
* **Priority:** Must Have
* **Requirement:** The system shall maintain historical versions of changing memories.
* **Description:** Example: Shelter capacity initial is 500 people, updated is 350 people. The previous value remains available.
* **Business Justification:** Emergency information changes rapidly. The system must preserve history.
* **Judging Alignment:** Production Readiness.

##### FR-027 — Memory Audit Trail
* **Priority:** Must Have
* **Requirement:** The system shall record every memory creation, update, and retrieval event.
* **Description:** Audit records include actor, timestamp, action, and memory affected.
* **Business Justification:** Operational systems require accountability.
* **CockroachDB Alignment:** Supports transaction history and reliable state tracking.
* **Judging Alignment:** Production Readiness.

##### Summary of Phase 2D.2 Requirements

| ID | Capability | Priority |
| --- | --- | --- |
| FR-013 | Memory Creation | Must Have |
| FR-014 | Working Memory | Must Have |
| FR-015 | Episodic Memory | Must Have |
| FR-016 | Semantic Memory | Must Have |
| FR-017 | Task Memory | Must Have |
| FR-018 | Decision Memory | Must Have |
| FR-019 | Reflection Memory | Should Have |
| FR-020 | Prediction Memory | Must Have |
| FR-021 | Resource Memory | Must Have |
| FR-022 | Memory Relationships | Must Have |
| FR-023 | Confidence Scoring | Must Have |
| FR-024 | Vector Retrieval | Must Have |
| FR-025 | Memory Consolidation | Should Have |
| FR-026 | Memory Versioning | Must Have |
| FR-027 | Audit Trail | Must Have |

#### Phase 2D.3 — Dashboard, Timeline & Visualization Requirements

##### Category Overview
ReliefGrid operates in an environment where information overload can become as dangerous as information shortage. Emergency operators do not need more data; they need the right information, at the right time, with the right context, supported by explainable intelligence.

The visualization layer converts collective memory and multi-agent reasoning into operational awareness. The interface must allow users to understand incidents, monitor agent activity, inspect memories, evaluate recommendations, trace decisions, and identify risks. The dashboard is designed as a modern Emergency Operations Center (EOC) platform.

##### FR-028 — Emergency Operations Dashboard
* **Priority:** Must Have
* **Requirement:** The system shall provide a centralized operational dashboard displaying current disaster intelligence.
* **Description:** The main dashboard shall provide a unified view of active incidents, incident severity, geographic impact, agent activity, current recommendations, resource status, critical alerts, and memory activity.
* **Business Justification:** Emergency commanders require a single operational picture. Without centralized visibility, information remains fragmented across different systems.
* **Primary Users:** Emergency Operations Commander, Disaster Response Coordinator, Government Administrator.
* **Primary Agents:** Coordinator Agent.
* **Memory Interaction:** Displays Incident Memory, Decision Memory, Operational Memory.
* **Judging Alignment:** Real-World Impact, Production Readiness.

##### FR-029 — Incident Command Center View
* **Priority:** Must Have
* **Requirement:** The system shall provide a dedicated view for managing individual disaster incidents.
* **Description:** Each incident page shall display:
  * *Incident Summary:* Incident name, type, severity, location, status.
  * *Operational Overview:* Current risks, active recommendations, agent status.
  * *Response Overview:* Tasks, resources, decisions.
  * *Memory Overview:* Recent memories, important historical context.
* **Business Justification:** Emergency operations require focused views for individual events.
* **Judging Alignment:** Agentic Memory Design.

##### FR-030 — Real-Time Incident Timeline
* **Priority:** Must Have
* **Requirement:** The system shall display a chronological timeline of incident events.
* **Description:** The timeline shall include weather updates, agent analyses, human decisions, resource changes, communications, and outcomes. Each event must show: Timestamp, Source, Confidence, and Related memories.
* **Example:**
  ```
  10:02 AM | Weather Agent | Detected extreme rainfall probability
     ↓
  10:08 AM | Infrastructure Agent | Identified bridge failure risk
     ↓
  10:15 AM | Commander | Approved evacuation recommendation
  ```
* **Business Justification:** Emergency decisions depend on understanding how situations evolved.
* **Memory Interaction:** Displays Episodic Memory, Decision Memory.
* **Judging Alignment:** Agentic Memory Design, Explainability.

##### FR-031 — Interactive Disaster Map
* **Priority:** Must Have
* **Requirement:** The system shall provide geographic visualization of incidents and operational conditions.
* **Description:** The map should display incident location, affected areas, shelters, hospitals, supply routes, and infrastructure risks.
* **User Capabilities:** Users should be able to zoom into affected regions, view location-specific memories, inspect agent recommendations, and compare historical incidents.
* **Business Justification:** Disasters are spatial problems. Geographic awareness is essential for emergency decision-making.
* **Memory Interaction:** Retrieves Location Memory, Resource Memory, Historical Incident Memory.
* **Judging Alignment:** Real-World Impact.

##### FR-032 — Agent Activity Monitor
* **Priority:** Must Have
* **Requirement:** The system shall provide visibility into autonomous agent operations.
* **Description:** Users should see: Active agents, current tasks, processing status, recent actions, and memory interactions.
* **Example:**
  ```
  Weather Agent | Status: Analyzing | Current Task: Evaluate rainfall risk | Memory Access: 23 historical events retrieved
  ```
* **Business Justification:** Autonomous systems require transparency. Users must understand what agents are doing.
* **Primary Users:** Emergency Commander, System Administrator.
* **Memory Interaction:** Displays Agent State Memory, Task Memory.
* **Judging Alignment:** Production Readiness, Technical Implementation.

##### FR-033 — Collective Memory Explorer
* **Priority:** Must Have
* **Requirement:** The system shall provide an interface for exploring stored collective memories.
* **Description:** Users should be able to browse recent memories, historical incidents, decisions, lessons learned, and agent-generated insights.
* **Memory Visualization:** The explorer should display relationships (e.g. Heavy Rain Prediction -> Flood Risk Assessment -> Evacuation Decision -> Shelter Allocation -> Outcome).
* **Business Justification:** Memory must be visible to demonstrate its value.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-034 — Semantic Memory Search Interface
* **Priority:** Must Have
* **Requirement:** The system shall allow users to search operational knowledge using natural language.
* **Description:** Users can ask "Have we experienced similar flooding before?" and the system retrieves similar incidents, previous decisions, successful responses, and lessons learned.
* **Technical Concept:** Search uses vector embeddings and semantic similarity.
* **Business Justification:** Emergency personnel think in concepts, not database queries.
* **CockroachDB Alignment:** Uses Distributed Vector Indexing.
* **Judging Alignment:** Technical Implementation, Agentic Memory Design.

##### FR-035 — Recommendation Explanation Panel
* **Priority:** Must Have
* **Requirement:** The system shall explain why an AI recommendation was generated.
* **Description:** Every recommendation should display: Proposed action, responsible agent, supporting memories, confidence score, and alternative considerations.
* **Example:** Recommendation: "Evacuate Zone B." Explanation: "Recommended because flood probability increased to 85%, previous flooding occurred under similar conditions, and main access route remains available."
* **Business Justification:** Emergency decisions require trust.
* **Memory Interaction:** Displays Decision Memory, Prediction Memory, Evidence Memory.
* **Judging Alignment:** Production Readiness, Real-World Impact.

##### FR-036 — Resource Monitoring Dashboard
* **Priority:** Must Have
* **Requirement:** The system shall provide visibility into emergency resources.
* **Description:** Resources include medical supplies, vehicles, shelters, personnel, and equipment.
* **User Capabilities:** Users can view availability, track allocation, identify shortages, and review historical usage.
* **Business Justification:** Resource optimization directly impacts disaster outcomes.
* **Memory Interaction:** Uses Resource Memory.
* **Judging Alignment:** Real-World Impact.

##### FR-037 — Alert Management Interface
* **Priority:** Must Have
* **Requirement:** The system shall display operational alerts generated by agents.
* **Description:** Alerts include weather warnings, infrastructure failures, medical shortages, and logistics problems. Each alert contains: Severity, source, confidence, and recommended action.
* **Business Justification:** Critical information must be prioritized.
* **Judging Alignment:** Production Readiness.

##### FR-038 — Analytics Dashboard
* **Priority:** Should Have
* **Requirement:** The system should provide operational analytics.
* **Description:** Analytics include response efficiency, agent performance, resource utilization, decision accuracy, and memory growth.
* **Business Justification:** Organizations improve when performance can be measured.
* **Memory Interaction:** Uses Reflection Memory, Outcome Memory.
* **Judging Alignment:** Creativity & Originality.

##### FR-039 — Memory Growth Visualization
* **Priority:** Should Have
* **Requirement:** The system should visualize how collective memory evolves during incidents.
* **Description:** Display number of memories created, memory categories, agent contributions, and knowledge expansion.
* **Business Justification:** This visually demonstrates the core hackathon innovation.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-040 — System Health Dashboard
* **Priority:** Must Have
* **Requirement:** The system shall provide operational monitoring of platform health.
* **Description:** Display agent availability, database status, memory operations, service health, and errors.
* **Business Justification:** Production systems require observability.
* **Judging Alignment:** Production Readiness.

##### Summary of Phase 2D.3 Requirements

| ID | Capability | Priority |
| --- | --- | --- |
| FR-028 | Emergency Dashboard | Must Have |
| FR-029 | Incident Command View | Must Have |
| FR-030 | Timeline | Must Have |
| FR-031 | Disaster Map | Must Have |
| FR-032 | Agent Monitor | Must Have |
| FR-033 | Memory Explorer | Must Have |
| FR-034 | Semantic Search | Must Have |
| FR-035 | Explanation Panel | Must Have |
| FR-036 | Resource Dashboard | Must Have |
| FR-037 | Alert Interface | Must Have |
| FR-038 | Analytics | Should Have |
| FR-039 | Memory Growth Visualization | Should Have |
| FR-040 | System Health Dashboard | Must Have |

#### Phase 2D.4 — Search, Reporting & Notification Requirements

##### Category Overview
During emergency operations, information must move from intelligence systems to humans quickly and accurately. ReliefGrid therefore requires intelligent search, reporting, and notification capabilities that transform agent observations, operational memories, historical knowledge, decisions, and outcomes into understandable operational communication.

These capabilities ensure that collective memory is not only preserved but actively used.

##### FR-041 — Natural Language Operational Search
* **Priority:** Must Have
* **Requirement:** The system shall allow users to search emergency intelligence using natural language queries.
* **Description:** Users should not need technical database knowledge. They should be able to ask questions such as "What areas are most vulnerable to flooding?", "Have we handled a similar incident before?", "Why was evacuation recommended?", "Which shelters have available capacity?", and "What resources are currently limited?" The system retrieves relevant memories, decisions, incidents, recommendations, and reports.
* **Business Justification:** Emergency responders think in operational questions, not database queries. Natural language search makes collective memory accessible to every user.
* **Primary Users:** Emergency Commander, Response Coordinator, Government Administrator.
* **Memory Interaction:** Reads Semantic Memory, Episodic Memory, Decision Memory, Resource Memory.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-042 — Semantic Knowledge Retrieval
* **Priority:** Must Have
* **Requirement:** The system shall retrieve knowledge based on meaning and context rather than exact keyword matching.
* **Description:** Example query: "Previous disasters where transportation failed" should retrieve flood incidents involving road collapse, supply chain failures, alternative routing decisions, and successful recovery strategies.
* **Technical Foundation:** Uses memory embeddings, vector similarity search, and context-aware retrieval.
* **Business Justification:** Disaster knowledge is highly contextual. Semantic retrieval enables agents and humans to discover related experiences they may not explicitly search for.
* **CockroachDB Alignment:** Uses Distributed Vector Indexing.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

##### FR-043 — Automated Incident Summary Generation
* **Priority:** Must Have
* **Requirement:** The system shall generate structured summaries of active incidents.
* **Description:** Summaries should include current situation, major risks, agent findings, resource conditions, recommended actions, and confidence levels.
* **Example Output:**
  ```
  Flood Incident Summary | Severity: High | Primary Risk: River overflow affecting Zone A
  Key Findings: Weather risk increased by 40%, two transport routes unavailable
  Recommended Actions: Open emergency shelter 3, redirect medical supplies
  ```
* **Business Justification:** Leadership requires rapid understanding without reviewing thousands of operational events.
* **Memory Interaction:** Uses Incident Timeline, Agent Memories, Decision Memory.
* **Judging Alignment:** Real-World Impact, Production Readiness.

##### FR-044 — Executive Briefing Generation
* **Priority:** Should Have
* **Requirement:** The system should generate high-level reports for government leadership.
* **Description:** Reports should focus on strategic impact, resource requirements, response effectiveness, and long-term implications.
* **Users:** Government Administrator, Emergency Leadership.
* **Business Justification:** Executive users require strategic intelligence rather than operational details.
* **Memory Interaction:** Uses Organizational Memory, Reflection Memory, Outcome Memory.
* **Judging Alignment:** Real-World Impact.

##### FR-045 — Post-Incident Report Generation
* **Priority:** Must Have
* **Requirement:** The system shall generate automated post-incident analysis reports.
* **Description:** Reports include:
  * *Incident Overview:* Timeline, severity, impact.
  * *Response Analysis:* Decisions made, resources used, agent recommendations.
  * *Performance Review:* What succeeded, what failed, improvement opportunities.
  * *Lessons Learned:* New organizational knowledge.
* **Business Justification:** Every disaster should improve future preparedness.
* **Memory Interaction:** Creates Reflection Memory, Lessons Learned Memory.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-046 — AI-Assisted Report Customization
* **Priority:** Should Have
* **Requirement:** The system should allow users to customize generated reports.
* **Description:** Users can specify audience, detail level, focus area, and time period (e.g. "Generate a medical response report for the last 24 hours").
* **Business Justification:** Different stakeholders require different information perspectives.
* **Judging Alignment:** Real-World Impact.

##### FR-047 — Communication Recommendation Generation
* **Priority:** Must Have
* **Requirement:** The Communication Agent shall generate recommended public communication messages.
* **Description:** Recommendations should consider verified incident information, current risks, public safety requirements, and confidence levels.
* **Example:** Agent recommends: "Residents in Zone B should move to designated shelters due to increasing flood risk."
* **Business Justification:** Incorrect information during disasters can create additional harm. Communication must be based on verified collective memory.
* **Memory Interaction:** Reads Verified Memories, Decision Memory, Risk Predictions.
* **Judging Alignment:** Real-World Impact, Production Readiness.

##### FR-048 — Alert Prioritization
* **Priority:** Must Have
* **Requirement:** The system shall prioritize alerts based on operational importance.
* **Description:** Alerts should prioritize based on severity, confidence, affected population, time sensitivity, and historical impact (e.g. Critical: "Hospital capacity exceeded within 2 hours", Medium: "Secondary road disruption detected", Low: "Minor weather variation").
* **Business Justification:** Emergency teams cannot respond equally to every notification. Prioritization improves decision quality.
* **Memory Interaction:** Uses Prediction Memory, Risk Memory, Historical Impact Memory.
* **Judging Alignment:** Production Readiness.

##### FR-049 — Alert History Tracking
* **Priority:** Must Have
* **Requirement:** The system shall maintain a complete history of generated alerts.
* **Description:** Each alert stores creation time, source agent, confidence, user actions, and final outcome.
* **Business Justification:** Storing alert history allows us to track patterns and improve alert quality over time.
* **Memory Interaction:** Creates Alert Memory, Outcome Memory.
* **Judging Alignment:** Agentic Memory Design.

##### FR-050 — User Notification Management
* **Priority:** Should Have
* **Requirement:** The system should manage user notification preferences.
* **Description:** Users can configure alert categories, severity levels, operational areas, and communication channels.
* **Business Justification:** Different operational roles require different information streams.
* **Judging Alignment:** Production Readiness.

##### FR-051 — Historical Incident Comparison
* **Priority:** Must Have
* **Requirement:** The system shall compare current incidents with previous events.
* **Description:** Comparison includes similar conditions, previous decisions, outcomes, and recommended actions (e.g. "Similar to 2024 River Incident" provides previous evacuation strategy, successful resource allocation, and lessons learned).
* **Business Justification:** This is where historical memory becomes operational intelligence.
* **Memory Interaction:** Uses Episodic Memory, Semantic Memory, Vector Retrieval.
* **Judging Alignment:** Agentic Memory Design, Creativity & Originality.

##### FR-052 — Knowledge Recommendation Engine
* **Priority:** Should Have
* **Requirement:** The system should proactively recommend relevant knowledge.
* **Description:** Instead of waiting for queries, ReliefGrid should surface relevant past incidents, important lessons, similar patterns, and potential risks (e.g. "Three previous incidents showed shelter shortages in this region").
* **Business Justification:** The most valuable intelligence is sometimes information users do not know they need.
* **Judging Alignment:** Creativity & Originality.

##### Summary of Phase 2D.4 Requirements

| ID | Capability | Priority |
| --- | --- | --- |
| FR-041 | Natural Language Search | Must Have |
| FR-042 | Semantic Retrieval | Must Have |
| FR-043 | Incident Summaries | Must Have |
| FR-044 | Executive Briefings | Should Have |
| FR-045 | Post-Incident Reports | Must Have |
| FR-046 | Report Customization | Should Have |
| FR-047 | Communication Recommendations | Must Have |
| FR-048 | Alert Prioritization | Must Have |
| FR-049 | Alert History | Must Have |
| FR-050 | Notification Management | Should Have |
| FR-051 | Historical Comparison | Must Have |
| FR-052 | Knowledge Recommendations | Should Have |

#### Phase 2D.5 — User Management, Explainability & Observability Requirements

##### Category Overview
ReliefGrid operates in a high-consequence environment where inaccurate information, unauthorized access, or unexplained AI decisions can negatively impact emergency operations. Therefore, the platform requires strong capabilities around identity management, authorization, AI transparency, operational monitoring, audit trails, and system reliability.

These capabilities ensure that autonomous intelligence remains controlled, explainable, and trustworthy.

##### FR-053 — User Authentication
* **Priority:** Must Have
* **Requirement:** The system shall provide secure authentication for all users accessing ReliefGrid.
* **Description:** Users must authenticate before accessing operational information. Authentication should support secure login, session management, identity verification, and account recovery.
* **Business Justification:** Emergency intelligence contains sensitive operational information. Unauthorized access could compromise response operations.
* **Primary Users:** All human users.
* **Judging Alignment:** Production Readiness, Security.

##### FR-054 — Role-Based Access Control
* **Priority:** Must Have
* **Requirement:** The system shall enforce access permissions based on user roles.
* **Description:** Roles include:
  * *Emergency Operations Commander:* Access all incidents, strategic decisions, and agent recommendations.
  * *Disaster Response Coordinator:* Access operational tasks, resources, and incident workflows.
  * *Medical Officer:* Access medical intelligence and healthcare resources.
  * *Logistics Coordinator:* Access supply information and transportation data.
  * *Government Administrator:* Access reports, analytics, and strategic insights.
  * *Public Information Officer:* Access communication intelligence.
* **Business Justification:** Different users require different information levels. Access control prevents unnecessary exposure of sensitive information.
* **Judging Alignment:** Production Readiness.

##### FR-055 — Agent Permission Management
* **Priority:** Must Have
* **Requirement:** The system shall control what data and actions each AI agent can access.
* **Description:** Each agent should have defined permissions. Example: Weather Agent can read weather-related memories and create predictions, but cannot modify medical resources. Medical Agent can access healthcare information, but cannot change evacuation decisions.
* **Business Justification:** Autonomous systems require controlled boundaries. Agents should not have unrestricted access.
* **Judging Alignment:** Production Readiness, Technical Implementation.

##### FR-056 — Human Approval Workflow
* **Priority:** Must Have
* **Requirement:** The system shall support human approval before executing high-impact decisions.
* **Description:** AI recommendations should be categorized:
  * *Informational:* No approval required (e.g. "Rainfall probability increased").
  * *Advisory:* Human review recommended (e.g. "Consider opening additional shelters").
  * *Critical Action:* Human approval required (e.g. "Initiate regional evacuation").
* **Business Justification:** ReliefGrid supports human decision-makers. It does not replace emergency authorities.
* **Judging Alignment:** Production Readiness, Real-World Impact.

##### FR-057 — AI Recommendation Explainability
* **Priority:** Must Have
* **Requirement:** The system shall explain the reasoning behind every AI recommendation.
* **Description:** Each recommendation must show: Responsible agent, input information, retrieved memories, confidence score, alternative options, and expected impact.
* **Example:** Recommendation: "Open Shelter C." Explanation: Based on current shelter occupancy, flood risk prediction, and historical evacuation patterns. Confidence: 89%.
* **Business Justification:** Users must trust AI systems before relying on them during emergencies.
* **Memory Interaction:** Displays Decision Memory, Evidence Memory, Prediction Memory.
* **Judging Alignment:** Agentic Memory Design, Production Readiness.

##### FR-058 — Agent Reasoning Trace
* **Priority:** Should Have
* **Requirement:** The system should provide visibility into agent reasoning workflows.
* **Description:** Users should understand what information the agent considered, which memories were retrieved, and which conclusions were reached.
* **Business Justification:** Transparent AI increases user confidence.
* **Judging Alignment:** Creativity & Originality, Production Readiness.

##### FR-059 — Memory Access Audit Logging
* **Priority:** Must Have
* **Requirement:** The system shall record all memory access activities.
* **Description:** Audit logs include user or agent identity, memory accessed, action performed, timestamp, and result.
* **Business Justification:** Emergency platforms require accountability.
* **CockroachDB Alignment:** Supports reliable transactional records.
* **Judging Alignment:** Production Readiness.

##### FR-060 — Agent Activity Logging
* **Priority:** Must Have
* **Requirement:** The system shall record autonomous agent activities.
* **Description:** Logs include agent actions, tasks completed, memories created, recommendations generated, and errors encountered.
* **Business Justification:** Operators need visibility into autonomous operations.
* **Judging Alignment:** Technical Implementation, Production Readiness.

##### FR-061 — System Health Monitoring
* **Priority:** Must Have
* **Requirement:** The system shall monitor application and infrastructure health.
* **Description:** Monitor API availability, database status, agent services, memory operations, and processing latency.
* **Business Justification:** A production emergency system must detect failures before users are affected.
* **Judging Alignment:** Production Readiness.

##### FR-062 — Agent Failure Monitoring
* **Priority:** Must Have
* **Requirement:** The system shall monitor AI agent reliability.
* **Description:** Track response time, success rate, failure frequency, and recovery status.
* **Business Justification:** Autonomous systems require operational visibility.
* **Memory Interaction:** Creates Agent Performance Memory.
* **Judging Alignment:** Production Readiness.

##### FR-063 — Incident Data Auditability
* **Priority:** Must Have
* **Requirement:** The system shall preserve a complete history of incident changes.
* **Description:** Track who changed information, what changed, previous value, new value, and time of change.
* **Business Justification:** Emergency decisions require traceability.
* **Judging Alignment:** Production Readiness.

##### FR-064 — AI Confidence Management
* **Priority:** Must Have
* **Requirement:** The system shall display confidence levels for AI-generated outputs.
* **Description:** Confidence should consider data quality, source reliability, historical performance, and agent certainty.
* **Business Justification:** Emergency users need to understand uncertainty.
* **Memory Interaction:** Uses Confidence Memory.
* **Judging Alignment:** Agentic Memory Design, Explainability.

##### FR-065 — Data Privacy Controls
* **Priority:** Should Have
* **Requirement:** The system should protect sensitive operational information.
* **Description:** Controls include access restrictions, data classification, secure storage, and activity monitoring.
* **Business Justification:** Emergency data may include sensitive information about populations and infrastructure.
* **Judging Alignment:** Production Readiness.

##### FR-066 — System Configuration Management
* **Priority:** Should Have
* **Requirement:** Administrators should manage system configuration settings.
* **Description:** Configuration includes agent settings, alert thresholds, user permissions, and operational parameters.
* **Business Justification:** Different emergency organizations require different operating models.
* **Judging Alignment:** Production Readiness.

##### FR-067 — Disaster Recovery Monitoring
* **Priority:** Must Have
* **Requirement:** The system shall monitor recovery capabilities.
* **Description:** Track backup status, recovery events, and service restoration.
* **Business Justification:** Emergency platforms must remain available during failures.
* **CockroachDB Alignment:** Supports distributed resilience and data durability.
* **Judging Alignment:** Production Readiness, Technical Implementation.

##### FR-068 — Memory Integrity Verification
* **Priority:** Must Have
* **Requirement:** The system shall ensure stored memories remain consistent and trustworthy.
* **Description:** Verification includes source validation, conflict detection, version tracking, and integrity checks.
* **Business Justification:** Incorrect memories can negatively influence future AI decisions.
* **Judging Alignment:** Agentic Memory Design, Production Readiness.

##### Summary of Phase 2D.5 Requirements

| ID | Capability | Priority |
| --- | --- | --- |
| FR-053 | Authentication | Must Have |
| FR-054 | Role Access Control | Must Have |
| FR-055 | Agent Permissions | Must Have |
| FR-056 | Human Approval Workflow | Must Have |
| FR-057 | AI Explainability | Must Have |
| FR-058 | Reasoning Trace | Should Have |
| FR-059 | Memory Audit Logs | Must Have |
| FR-060 | Agent Logging | Must Have |
| FR-061 | System Monitoring | Must Have |
| FR-062 | Agent Monitoring | Must Have |
| FR-063 | Incident Auditability | Must Have |
| FR-064 | Confidence Management | Must Have |
| FR-065 | Privacy Controls | Should Have |
| FR-066 | Configuration Management | Should Have |
| FR-067 | Disaster Recovery Monitoring | Must Have |
| FR-068 | Memory Integrity Verification | Must Have |

### Non-Functional Requirements

#### Category Overview
Non-functional requirements define how ReliefGrid must operate as a reliable emergency intelligence platform. The platform must not only produce intelligent recommendations; it must provide continuous availability, predictable performance, secure operations, trustworthy AI behavior, and resilient memory infrastructure.

The core engineering philosophy:
> An emergency intelligence system is only valuable if it remains available when conditions become unpredictable.

#### NFR-001 — Scalability
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall support growth in users, incidents, agents, and memory volume without significant architectural redesign.
* **Description:** The system should scale across:
  * *Users:* From small emergency teams to national-level disaster organizations.
  * *Incidents:* From single disaster events to multiple simultaneous disasters across regions.
  * *Agents:* From the initial six agents (Weather, Infrastructure, Medical, Shelter, Logistics, Communication) to future specialized agents (e.g., Fire, Agriculture, Transportation, Cyber Infrastructure).
  * *Memory:* Continuous memory growth due to learning agents, historical incidents, and accumulating embeddings.
* **Architectural Importance:** CockroachDB provides distributed SQL, horizontal scalability, and resilient storage, which prevents bottlenecks when operational data grows globally.
* **Expected Behavior:** Add capacity without downtime, maintain query performance, and support increasing agent activity.
* **Judging Alignment:** Production Readiness, Technical Implementation.

#### NFR-002 — High Availability
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall remain operational during infrastructure failures.
* **Description:** The platform should tolerate service failures, regional outages, individual agent failures, and network interruptions.
* **Core Principle:** Memory availability is more important than individual agent availability. If an agent fails, the system should recover because memory persists, tasks are stored, and another agent can continue.
* **CockroachDB Alignment:** CockroachDB provides distributed replication, automatic failover, and strong consistency.
* **Expected Behavior:** If the Medical Agent crashes, the system detects the failure, preserves current task state, stores the failure event, and restarts or assigns a replacement agent to continue.
* **Judging Alignment:** Agentic Memory Design, Production Readiness.

#### NFR-003 — Reliability
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall provide consistent and dependable operation.
* **Description:** Reliability applies to data integrity (no loss), agent activities (recoverable actions), memory availability (persistently accessible), and decisions (traceable history).
* **Reliability Principles:** Every important operation must have transaction tracking, validation, error handling, and a recovery path.
* **Expected Behavior:** If a memory write fails, the system detects it, retries safely, prevents duplicate records, and preserves consistency.
* **Judging Alignment:** Production Readiness.

#### NFR-004 — Performance
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall provide responsive intelligence during emergency operations.
* **Description:** Performance targets:
  * *User Interface Dashboard:* < 2 seconds.
  * *Memory Retrieval (Semantic Search):* < 3 seconds.
  * *Agent Communication:* Near real-time internal agent coordination.
  * *Critical Alerts:* Priority generation and processing.
* **Performance Considerations:** Optimize database queries, vector retrieval, agent workflows, and API responses.
* **CockroachDB Alignment:** Distributed indexing supports efficient retrieval of large memory collections.
* **Judging Alignment:** Technical Implementation, Production Readiness.

#### NFR-005 — Data Consistency
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall maintain accurate and consistent operational information.
* **Description:** Emergency decisions depend on multiple agents. The system must prevent conflicting states (e.g. if Logistics Agent reports 20 available vehicles, and Medical Agent requests 15, conflicts or double allocations must be prevented).
* **CockroachDB Importance:** Transactional consistency ensures reliable updates, conflict resolution, and correct state management.
* **Example:** If two agents attempt to allocate the same ambulance, CockroachDB transaction serialization prevents double allocation.
* **Judging Alignment:** Agentic Memory Design, Technical Implementation.

#### NFR-006 — Fault Tolerance
* **Priority:** Must Have
* **Requirement:** The system shall continue operating despite component failures.
* **Failure Scenarios:**
  * *Agent Failure:* Weather Agent unavailable; another agent retrieves existing weather memories.
  * *Database Node Failure:* CockroachDB replication maintains availability.
  * *AWS Service Failure:* Fallback processing continues.
* **Business Justification:** Disasters are environments where failure is expected; the platform must be designed around resilience.
* **Judging Alignment:** Production Readiness.

#### NFR-007 — Disaster Recovery
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall support recovery after major system failures.
* **Description:** Recovery mechanisms include database backups, state restoration, memory recovery, and incident reconstruction.
* **Recovery Objectives:**
  * *Recovery Point Objective (RPO):* Minimal data loss.
  * *Recovery Time Objective (RTO):* Rapid restoration.
* **CockroachDB Alignment:** Supports backups, replication, and distributed recovery.
* **Judging Alignment:** Production Readiness.

#### NFR-008 — Security
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall protect operational data and system access.
* **Security Areas:** Authentication (verify users), Authorization (control permissions), Data Protection (protect stored information), and Agent Security (limit autonomous actions).
* **Security Principles:** Follow least privilege, defense in depth, and auditability.
* **Judging Alignment:** Production Readiness.

#### NFR-009 — Privacy
* **Priority:** Must Have
* **Requirement:** The system shall protect sensitive information.
* **Description:** Sensitive information may include affected populations, infrastructure details, medical information, and operational decisions.
* **Requirements:** The platform should support access controls, data classification, and controlled sharing.
* **Judging Alignment:** Production Readiness.

#### NFR-010 — Observability
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall provide visibility into system behavior.
* **Monitoring Areas:**
  * *Application:* Errors, response times.
  * *Agents:* Tasks, decisions, failures.
  * *Memory:* Creation, retrieval, usage patterns.
  * *Infrastructure:* Services, database health.
* **Business Justification:** Operators cannot manage what they cannot see.
* **Judging Alignment:** Production Readiness.

#### NFR-011 — Explainability
* **Priority:** Must Have
* **Requirement:** AI-generated decisions must be understandable.
* **Description:** Every recommendation should provide supporting memories, reasoning factors, confidence level, and alternative options.
* **Business Justification:** Emergency organizations require trust before acting.
* **Judging Alignment:** Agentic Memory Design, Real-World Impact.

#### NFR-012 — Maintainability
* **Priority:** Must Have
* **Requirement:** The system architecture shall support continuous improvement.
* **Description:** The platform should allow adding new agents, modifying workflows, expanding memory types, and introducing new integrations.
* **Business Justification:** Disaster intelligence requirements evolve continuously.
* **Judging Alignment:** Production Readiness.

#### NFR-013 — Extensibility
* **Priority:** Must Have
* **Requirement:** ReliefGrid shall support future expansion.
* **Future Extensions:** Satellite intelligence, IoT sensors, mobile responders, international deployments, and NGO collaboration.
* **Judging Alignment:** Creativity & Originality.

#### NFR-014 — Accessibility
* **Priority:** Should Have
* **Requirement:** The platform should be usable by diverse emergency personnel.
* **Considerations:** Clear interface design, high readability, keyboard support, and low complexity workflows.
* **Business Justification:** Emergency environments involve users with different technical abilities.
* **Judging Alignment:** Real-World Impact.

#### NFR-015 — Auditability
* **Priority:** Must Have
* **Requirement:** All critical system actions shall be traceable.
* **Track:** User actions, agent actions, memory updates, decisions, and system changes.
* **Business Justification:** Emergency systems require accountability.
* **Judging Alignment:** Production Readiness.

##### Summary of Phase 2E Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-001 | Scalability | Must Have |
| NFR-002 | Availability | Must Have |
| NFR-003 | Reliability | Must Have |
| NFR-004 | Performance | Must Have |
| NFR-005 | Data Consistency | Must Have |
| NFR-006 | Fault Tolerance | Must Have |
| NFR-007 | Disaster Recovery | Must Have |
| NFR-008 | Security | Must Have |
| NFR-009 | Privacy | Must Have |
| NFR-010 | Observability | Must Have |
| NFR-011 | Explainability | Must Have |
| NFR-012 | Maintainability | Must Have |
| NFR-013 | Extensibility | Must Have |
| NFR-014 | Accessibility | Should Have |
| NFR-015 | Auditability | Must Have |

### Success Metrics & KPIs

#### Category Overview
ReliefGrid's success will be measured across three dimensions:
1. Product effectiveness
2. Technical excellence
3. Hackathon demonstration impact

The measurement framework evaluates whether the system successfully achieves its core mission:
> Enable faster, smarter, and more coordinated emergency response through persistent collective intelligence.

#### Product KPIs
Product KPIs measure the value ReliefGrid provides to emergency operators.

##### KPI-001 — Incident Response Intelligence Time
* **Category:** Product Performance
* **Priority:** Critical
* **Definition:** Measures the time required for users to understand an incident and receive actionable intelligence.
* **Measurement:** Time from incident detection to the generation of actionable recommendations.
* **Target:** Reduce operational analysis time compared with manual investigation.
* **Why It Matters:** Emergency teams often lose valuable time collecting and organizing information. ReliefGrid reduces information processing delays.
* **System Capabilities Supporting This:** Coordinator Agent, Shared Memory, Automated Reports, Agent Collaboration.

##### KPI-002 — Decision Support Quality
* **Category:** Product Effectiveness
* **Priority:** Critical
* **Definition:** Measures how useful AI recommendations are for operational decisions.
* **Measurement Factors:** Evaluate evidence quality, historical relevance, confidence accuracy, and recommendation usefulness.
* **Example:** Recommendation to "Open additional shelter capacity" evaluated on whether it was supported by current risk, previous incidents, and available resources.
* **System Capabilities Supporting This:** Decision Memory, Prediction Memory, Explainability Layer.

##### KPI-003 — Collective Memory Utilization
* **Category:** Core Product Innovation
* **Priority:** Critical
* **Definition:** Measures whether agents actively use shared memory.
* **Measurement:** Track memory retrieval frequency, memory reuse, historical references, and knowledge contribution.
* **Success Indicator:** Agents should not operate independently. They should continuously retrieve -> reason -> contribute -> improve.
* **Why It Matters:** This directly validates the hackathon theme: "Build with Agentic Memory."

##### KPI-004 — Historical Knowledge Reuse
* **Category:** Learning Capability
* **Priority:** High
* **Definition:** Measures how often previous incidents improve current decisions.
* **Example:** Current flood event triggers retrieval of a previous flood's evacuation strategy, shelter allocation, and transportation issues.
* **Success Indicator:** Older memories influence new operational recommendations.
* **System Capabilities Supporting This:** Episodic Memory, Semantic Memory, Vector Search.

##### KPI-005 — User Trust & Explainability Score
* **Category:** Human Adoption
* **Priority:** High
* **Definition:** Measures whether users understand and trust AI recommendations.
* **Evaluation Factors:** Users should understand why recommendation was made, what evidence supports it, confidence level, and possible alternatives.
* **System Capabilities Supporting This:** Explanation Panel, Decision Memory, Confidence Scores.

##### KPI-006 — Resource Coordination Efficiency
* **Category:** Operational Impact
* **Priority:** High
* **Definition:** Measures how effectively ReliefGrid helps coordinate emergency resources.
* **Measurement Areas:** Resource visibility, allocation accuracy, shortage detection, and response prioritization.
* **Example:** System identifies: "Medical supplies will become insufficient within 8 hours."
* **System Capabilities Supporting This:** Logistics Agent, Resource Memory, Prediction Memory.

#### Technical KPIs
Technical KPIs measure whether ReliefGrid achieves production-grade architecture.

##### KPI-007 — Memory Persistence Reliability
* **Category:** Agentic Memory
* **Priority:** Critical
* **Definition:** Measures whether agent knowledge survives failures.
* **Test Scenario:** Agent creates memories -> agent service fails -> system restarts agent -> agent retrieves previous state.
* **Success Criteria:** No critical memory loss.
* **Hackathon Demonstration:** Show agent failure simulation, then memory recovery.
* **Judging Alignment:** Agentic Memory Design.

##### KPI-008 — Vector Retrieval Performance
* **Category:** Technical Implementation
* **Priority:** Critical
* **Definition:** Measures semantic memory retrieval speed and accuracy.
* **Measurement:** Track query latency, similarity relevance, and retrieved context quality.
* **Example:** Query "Previous transportation failures during floods" returns relevant historical incidents.
* **Technology:** CockroachDB Distributed Vector Indexing.
* **Judging Alignment:** Technical Implementation.

##### KPI-009 — Agent Coordination Efficiency
* **Category:** Multi-Agent Performance
* **Priority:** High
* **Definition:** Measures communication effectiveness between agents.
* **Measurement:** Track agent task completion, information sharing, and conflict resolution.
* **Example:** Weather Agent discovers risk -> Infrastructure Agent evaluates impact -> Logistics Agent adjusts resources.
* **Judging Alignment:** Agentic Memory Design.

##### KPI-010 — Database Transaction Reliability
* **Category:** Infrastructure Quality
* **Priority:** Critical
* **Definition:** Measures consistency of operational data.
* **Test Cases:** Multiple agents update resources, tasks, and decisions; system prevents conflicts.
* **Technology:** CockroachDB transactional consistency.
* **Judging Alignment:** Technical Implementation.

##### KPI-011 — System Availability
* **Category:** Reliability
* **Priority:** High
* **Definition:** Measures platform operational uptime.
* **Measurement:** Track service availability, database availability, and agent availability.
* **Importance:** Emergency systems cannot depend on fragile infrastructure.

##### KPI-012 — Recovery Performance
* **Category:** Resilience
* **Priority:** High
* **Definition:** Measures how quickly the system recovers from failures.
* **Test Scenario:** Failure of Weather Agent -> detect failure -> restore state -> continue operation.
* **Judging Alignment:** Production Readiness.

#### Hackathon Demo Success Criteria
This section defines what judges should experience during the final demonstration.

##### Demo Scenario
* **Scenario:** A severe flooding event affects a regional community. The system receives initial disaster indicators.

##### Demo Flow
* **Step 1 — Incident Creation:** User creates "River Flood Emergency — Region A". System creates Incident Memory and Initial Task Memory.
* **Step 2 — Agents Activate:** Coordinator Agent assigns: Weather Agent (analyze rainfall risk), Infrastructure Agent (evaluate damaged routes), Medical Agent (estimate healthcare requirements), Shelter Agent (check capacity), Logistics Agent (optimize resources), and Communication Agent (prepare public updates).
* **Step 3 — Collective Memory Formation:** Agents write memories (e.g. weather prediction, infrastructure assessment, resource availability, risk evaluation).
* **Step 4 — Memory Retrieval:** User asks "Have we experienced similar flooding before?" System retrieves previous incidents, decisions, and lessons learned using CockroachDB Vector Search.
* **Step 5 — Agent Failure Simulation:** One agent (e.g. Weather Agent) becomes unavailable. System demonstrates memory remains available, task state is preserved, and recovery occurs.
* **Step 6 — Decision Recommendation:** Coordinator Agent recommends "Open additional shelter capacity". Explanation shows supporting memories, confidence score, and historical evidence.
* **Step 7 — Executive Report:** System generates Flood Response Summary containing current situation, risks, recommendations, and resource status.

##### Judge Evaluation Checklist
A successful demo should clearly show:
* *Agentic Memory Design:* Multiple agents sharing memory, persistent operational knowledge, memory retrieval influencing decisions, and learning from previous incidents.
* *Technical Implementation:* CockroachDB MCP Server usage, CockroachDB Vector Indexing, AWS service integration, and transactional consistency.
* *Real-World Impact:* Disaster response improvement, better resource coordination, and faster decision making.
* *Production Readiness:* Failure recovery, explainability, monitoring, and security controls.
* *Creativity & Originality:* Multi-agent collective intelligence, memory as a core product capability, and autonomous coordination system.

#### Phase 2 Completion Summary
ReliefGrid Product Definition is now complete. The product specification has established:
* **Product Foundation:** Vision, scope, personas, and user journeys.
* **Functional Foundation:** Incident management, agent coordination, collective memory, search, reporting, dashboards, and security.
* **Quality Foundation:** Scalability, reliability, fault tolerance, observability, and explainability.
* **Success Foundation:** Product KPIs, technical KPIs, and hackathon demo criteria.

---

## System Architecture

### Architecture Overview

#### System Vision
ReliefGrid is designed as a distributed multi-agent intelligence platform where autonomous AI agents collaborate through a shared Collective Memory Engine. The system consists of five major layers:

```
┌───────────────────────────────────────┐
│          User Experience Layer        │
│ Dashboard | Maps | Reports | Alerts   │
└───────────────────────────────────────┘
                  │
┌───────────────────────────────────────┐
│       Agent Coordination Layer        │
│       Coordinator Agent               │
│       Task Management                 │
└───────────────────────────────────────┘
                  │
┌───────────────────────────────────────┐
│        Specialized Agent Layer        │
│ Weather | Medical | Logistics        │
│ Shelter | Infrastructure | Comms      │
└───────────────────────────────────────┘
                  │
┌───────────────────────────────────────┐
│      Collective Memory Engine         │
│ Working | Episodic | Semantic         │
│ Decision | Prediction | Resource     │
└───────────────────────────────────────┘
                  │
┌───────────────────────────────────────┐
│ Infrastructure Layer                  │
│ CockroachDB + AWS Services            │
└───────────────────────────────────────┘
```

#### Core Architectural Philosophy
Traditional AI applications operate linearly where the model is query-response based and context is transient:
`User -> AI Model -> Database -> Response (The AI forgets)`

ReliefGrid treats memory as a continuous loop of experience:
`Incident -> Coordinator Agent -> Specialized Agents -> Collective Memory Engine -> Continuous Learning -> Improved Future Decisions`

The system becomes smarter through experience over time.

#### Major Architectural Components

##### Component 1 — User Interface Platform
* **Purpose:** Provides human operators with visibility and control.
* **Responsibilities:** Handles incident management, dashboard visualization, agent monitoring, memory exploration, reports, and alerts.
* **Primary Users:** Emergency commanders, response coordinators, government administrators.
* **Core Principle:** The interface does not replace human decisions; it improves decision quality.

##### Component 2 — Coordinator Agent
* **Purpose:** Acts as the central intelligence orchestrator.
* **Responsibilities:** Receives incidents, understands objectives, creates tasks, assigns specialized agents, monitors progress, resolves conflicts, combines findings, and generates recommendations.
* **Architectural Rationale:** Prevents isolated agent intelligence. Rather than independent agents operating in silos, the Coordinator Agent establishes a shared loop around a common memory space.

##### Component 3 — Specialized Agent Network
ReliefGrid initially contains six specialized agents:
* **Weather Agent:** Analyzes rainfall information, flood probability, and environmental patterns. Produces weather predictions and risk assessments. Reads historical predictions/incidents, writes Prediction and Episodic Memory.
* **Infrastructure Agent:** Evaluates roads, bridges, buildings, and transport routes. Produces damage assessments and route accessibility analysis. Reads historical failures, writes Infrastructure Memory.
* **Medical Agent:** Manages healthcare intelligence, medical demand, hospital capacities, and emergency requirements. Produces medical recommendations and resource needs. Reads previous medical responses, writes Medical Operational Memory.
* **Shelter Agent:** Tracks emergency shelter availability, capacity, and population movement. Produces shelter recommendations. Reads shelter history, writes Shelter Resource Memory.
* **Logistics Agent:** Manages supply distribution, transportation, and resource allocation. Produces logistics plans and route recommendations. Reads and writes Resource and Logistics Memory.
* **Communication Agent:** Creates public updates, emergency alerts, and briefings. Reads verified incident memories, writes Communication Memory.

##### Component 4 — Collective Memory Engine
* **Purpose:** The permanent intelligence layer.
* **Core Principle:** Agents do not remember individually; they remember collectively. If one agent discovers a pattern, it is stored in the Collective Memory Engine. Any other agent can immediately query and retrieve that context.
* **Responsibilities:** Handles memory creation, retrieval, semantic search, memory relationship mapping, confidence scoring, and memory evolution.

##### Component 5 — CockroachDB Memory Layer
* **Purpose:** Provides reliable persistent memory infrastructure.
* **Capabilities Utilized:**
  * *Distributed Storage:* Memory exists across multiple regions.
  * *Strong Consistency:* Serializability guarantees that agents do not operate on conflicting or double-allocated states.
  * *Vector Search:* Supports semantic retrieval through distributed vector indexing of incident descriptions, decisions, lessons, and outcomes.
  * *CockroachDB Cloud MCP Server:* Enables AI agents to safely query, retrieve, and store operational memory directly.

##### Component 6 — AWS Intelligence Layer
* **Purpose:** Execution environment.
* **AWS Services Utilized:**
  * *Amazon Bedrock:* Provides foundation models for agent reasoning, summarization, and recommendation generation.
  * *AWS Lambda:* Serves serverless task execution and background workflows.
  * *Amazon S3:* Stores large operational artifacts (reports, document archives, raw datasets, images).

#### Architecture Summary

```
                    Users
                      │
            ReliefGrid Dashboard
                      │
              Coordinator Agent
                      │
 ────────────────────────────────────────────────
 Weather   Infrastructure   Medical   Logistics
  Agent         Agent        Agent      Agent
 ────────────────────────────────────────────────
            Collective Memory Engine
                      │
             CockroachDB Cloud
      SQL Memory + Vector Memory + MCP
                      │
 ────────────────────────────────────────────────
            AWS Cloud Platform
    Bedrock       Lambda       S3
 ────────────────────────────────────────────────
```

##### Architectural Decisions Summary

| Decision | Reason |
| --- | --- |
| Multi-agent architecture | Demonstrates autonomous collaboration |
| Coordinator Agent | Prevents isolated intelligence |
| Shared memory | Core hackathon requirement |
| CockroachDB as memory layer | Demonstrates persistent distributed memory |
| Vector search | Enables semantic recall |
| AWS Bedrock | Provides AI reasoning |
| Lambda | Provides scalable execution |
| S3 | Stores large artifacts |

### Detailed Data Flow Architecture

#### Data Flow Philosophy
ReliefGrid operates as a continuous intelligence loop. Unlike traditional systems where data flows linearly (Input -> Process -> Output -> End), ReliefGrid feeds experience back into the engine:
`Input -> Understand -> Retrieve Memory -> Reason -> Act -> Store Experience -> Improve Future Intelligence`

#### Major Data Flow Categories
1. **Incident Creation Flow:** Triggered by user inputs, external systems, or uploaded reports.
2. **Agent Coordination Flow:** Managing task distribution and consolidation.
3. **Memory Retrieval Flow:** Semantic search and relational lookup.
4. **Memory Creation Flow:** Validating, embedding, and storing agent knowledge.
5. **Decision Generation Flow:** Aggregating data, resources, and history to output recommendations.
6. **Failure Recovery Flow:** Handling agent state reconstruction.

#### Incident Creation Data Flow
Defines the sequence when a new emergency enters the system:

```
Emergency User ──> ReliefGrid Dashboard ──> Incident Service ──> CockroachDB ──> Coordinator Agent Activation
```
* **Step 1 — Submission:** A coordinator inputs details (e.g. "Flood Emergency, Region A, Severity: High").
* **Step 2 — Record Persistence:** The Incident Service saves the incident identifier, timestamp, severity, and status in CockroachDB.
* **Step 3 — Working Memory Initialization:** An initial incident memory block is initialized to hold real-time data.
* **Step 4 — Orchestrator Activation:** The system triggers the Coordinator Agent's activation.

#### Coordinator Agent Data Flow
Orchestrates task assignment and memory lookup:

```
Incident ──> Coordinator Agent ──> Task Planning ──> Agent Assignment ──> Specialized Agents
```
* **Step 1 — Incident Analysis:** Coordinator parses incident variables to map needed expertise.
* **Step 2 — Historical Retrieval:** Coordinator queries CockroachDB Vector Memory for past incidents ("Similar flood incidents").
* **Step 3 — Task Division:** Coordinator writes tasks into Task Memory (e.g. Weather Agent for rainfall risk, Infrastructure Agent for routes, Medical Agent for medical capacity).
* **Step 4 — Task Dispatch:** Coordinator triggers agent Lambdas.

#### Specialized Agent Execution Flow
Each specialized agent follows a unified execution loop:

```
Assigned Task ──> Agent Activation ──> Memory Retrieval ──> Reasoning ──> Decision Gen ──> Memory Update ──> Report Result
```
* **Example (Weather Agent):**
  1. *Input:* Receives task "Analyze rainfall risk".
  2. *Retrieval:* Queries CockroachDB for previous rainfall patterns and predictions.
  3. *Reasoning:* Compares current metrics against historical trends.
  4. *Output:* Generates finding: "Flood risk High (86%), recommend evacuation preparation".
  5. *Memory Update:* Writes finding to Prediction Memory.

#### Collective Memory Write Flow
Ensures agent knowledge is validated, embedded, and stored:

```
Agent Finding ──> Memory Validation ──> Embedding Gen ──> CockroachDB Storage ──> Global Availability
```
1. *Creation:* Agent produces a finding ("Bridge failure risk detected").
2. *Validation:* System checks for duplicates, validates confidence values, and checks security boundaries.
3. *Embedding Generation:* Converts text to vector representation.
4. *Transaction Storage:* CockroachDB writes structured data and vector embeddings within a single transaction.
5. *Availability:* The new memory becomes searchable by all other agents.

#### Vector Retrieval Flow
Enables semantic search based on context and meaning:

```
User Query ──> Embedding Generation ──> Vector Similarity Search ──> CockroachDB Index ──> Relevant Memories ──> Agent Reasoning
```
1. *Query Input:* Human asks "Have we experienced similar transportation problems?".
2. *Embedding:* System creates a vector embedding of the query.
3. *Similarity Search:* CockroachDB executes vector cosine distance search against memory embeddings.
4. *Ranking:* Returns top-K results sorted by similarity, recency, and confidence.
5. *Context Delivery:* Passed as prompt context to the reasoning engine.

#### Decision Generation Flow
Compiles recommendations with traceable evidence:

```
Agent Findings + Historical Memory + Current Situation + Resource Capacity
                               │
                               ▼
                        Coordinator Agent
                               │
                               ▼
                        Decision Memory
                               │
                               ▼
                      User Recommendation
```
* **Decision Structure:**
  * *Action:* What should happen (e.g. "Open Shelter B").
  * *Reason:* Cause (e.g. "Flood risk increasing").
  * *Evidence:* Justification (e.g. "Historical displacement patterns in Region A").
  * *Confidence:* Level of certainty (e.g. "91%").
  * *Expected Outcome:* Predicted result (e.g. "Prevents shelter overcrowding").

#### Memory Evolution & Failure Recovery Flows
* **Memory Evolution (Learning):** Post-disaster, outcomes are compared with predictions (e.g. Predicted: hospital capacity sufficient; Actual: hospital overloaded). Reflection memories are written, updating the semantic weights to ensure future recommendations adapt.
* **Failure Recovery Flow:**
  ```
  Agent Failure ──> Failure Detection ──> State Retrieval ──> Task Reassignment ──> Continued Execution
  ```
  If the Weather Agent crashes during execution, the monitoring system writes a failure log, fetches the active task state from CockroachDB Task Memory, spins up a new instance, and passes the saved context so it resumes immediately.

#### Real-Time Operational Flow
```
                         Emergency Operator
                                │
                                ▼
                        Incident Creation
                                │
                                ▼
                       Coordinator Agent
                                │
        ┌───────────────────┬───┴───────────────┬──────────────────┐
        ▼                   ▼                   ▼                  ▼
  Weather Agent       Medical Agent      Logistics Agent     Shelter Agent
        │                   │                   │                  │
        └───────────────────┴───┬───────────────┴──────────────────┘
                                │
                                ▼
                    Collective Memory Engine
                                │
                                ▼
                        CockroachDB Cloud
                                │
                                ▼
                  Memory Improves Future Events
```

#### Data Consistency Strategy
1. **Transactional updates:** Updates to shared assets occur atomically to prevent conflicts (e.g. double booking resources).
2. **Versioned Memories:** Prevents data loss by keeping history instead of destructive updates.
3. **Confidence Scoring:** Signals the dependability of facts to other agents.

---

## Multi-Agent Architecture

### Agent Design Philosophy
ReliefGrid follows a **specialized intelligence architecture**. Instead of one general-purpose AI agent attempting every task, the system uses multiple specialized agents. Each agent has a defined responsibility, domain expertise, memory access, decision capability, and operational objectives.

Agents are not isolated. They operate through a shared memory fabric. The intelligence cycle is:
`Observe -> Retrieve Relevant Memory -> Analyze Situation -> Generate Decision -> Write New Memory -> Improve Future Operations`

### Agent Internal Architecture
Every ReliefGrid agent follows the same internal architecture pattern:
1. **Perception Layer:** Collects and interprets incoming information from user input, other agents, stored memories, external APIs, and uploaded documents. For example, Weather Agent receives raw rainfall data and interprets it as a flood risk signal.
2. **Reasoning Layer:** The intelligence engine of each agent that evaluates information, compares historical situations, identifies patterns, and generates recommendations. Agents do not reason only from current information; they reason by combining current data * with historical memory * with collective knowledge.
3. **Memory Interface:** Connects agents to the Collective Memory Engine. Allows agents to retrieve memories ("Find similar previous incidents"), create memories ("Store this new observation"), update knowledge ("Improve existing knowledge"), and link memories ("Connect this event with previous events").
4. **Action Layer:** Executes decisions by creating tasks, sending recommendations, updating incident status, and notifying the Coordinator Agent.
5. **Reflection Layer:** Allows agents to learn. After completing tasks, the agent evaluates its performance (e.g. was the prediction correct? was the recommendation effective? what should change?) and creates Reflection Memory.

```
                Agent
                  │
        ┌─────────────────┐
        │ Perception Layer │
        └─────────────────┘
                  │
        ┌─────────────────┐
        │ Reasoning Layer  │
        └─────────────────┘
                  │
        ┌─────────────────┐
        │ Memory Interface │
        └─────────────────┘
                  │
        ┌─────────────────┐
        │ Action Layer     │
        └─────────────────┘
                  │
        ┌─────────────────┐
        │ Reflection Layer │
        └─────────────────┘
```

### Agent Lifecycle
Every agent follows a continuous lifecycle:
1. **Activation:** Agent receives assignment from the Coordinator Agent (e.g. "Analyze flood risk").
2. **Context Retrieval:** Agent retrieves relevant memory (e.g. Weather Agent searches previous rainfall events, flood patterns, and predictions).
3. **Analysis:** Agent processes current data * historical memory * related agent information.
4. **Decision Generation:** Agent produces findings, confidence score, and recommended action.
5. **Memory Contribution:** Agent stores observation, reasoning, and outcome prediction.
6. **Monitoring:** Agent waits for updates, feedback, and new tasks.

### Coordinator Agent Architecture
The Coordinator Agent is the central orchestration intelligence managing collaboration between specialized agents.
* **Responsibilities:** Receives incidents, breaks problems into tasks, assigns agents, manages priorities, combines intelligence, resolves conflicts, and generates final recommendations.
* **Coordinator Workflow:**
  1. *Incident Creation:* Incident created. Coordinator analyzes what intelligence is required.
  2. *Task Creation:* Coordinator assigns specialized tasks to Weather Agent, Infrastructure Agent, Medical Agent, Shelter Agent, Logistics Agent, and Communication Agent.
  3. *Execution:* Specialized agents execute their respective tasks.
  4. *Results Aggregation:* Coordinator receives results from all agents.
  5. *Context Enrichment:* Coordinator retrieves related memories from database.
  6. *Recommendation:* Coordinator generates unified operational recommendation.
* **Decision Model:** The Coordinator evaluates evidence (supporting data), confidence (agent certainty), historical similarity (past occurrences), resource impact (feasibility), and risk (consequences of inaction).

### Agent Communication Architecture
Agents communicate through the Coordinator Agent and shared memory. They do not directly create uncontrolled peer-to-peer connections.
* **Why This Approach?** Direct agent-to-agent communication creates exponential complexity (6 agents require 15 paths; 50 agents require 1,225 paths). The coordinator-mediated pattern keeps communication manageable and clean.

```
          Weather Agent
               │
       Coordinator Agent ─── Shared Memory
         /     │      \
     Medical Logistics Shelter
      Agent    Agent    Agent
```

* **Agent Message Structure:** Every agent communication contains:
  * *Identity:* Who generated the message.
  * *Intent:* Purpose (Report, Request, Recommendation, Warning).
  * *Context:* Related incident.
  * *Evidence:* Supporting memories.
  * *Confidence:* Agent certainty.
  * *Expected Action:* What should happen next.
* **Example:**
  * *Agent:* Weather Agent
  * *Intent:* Risk Alert
  * *Finding:* High flood probability (87%)
  * *Evidence:* Previous flood events from region
  * *Recommendation:* Evaluate evacuation routes

### Agent Failure Recovery
A production agent system must assume failure. Agents can fail because of API issues, processing errors, model unavailability, or network problems.
* **Recovery Process:**
  1. *Failure Detection:* System detects that an agent is unresponsive.
  2. *Logging:* Failure event stored ("Weather Agent unavailable at 14:03").
  3. *State Retrieval:* Current task state retrieved from persistent task memory.
  4. *Reassignment:* Task is assigned to a restarted or replacement agent instance.
  5. *Resumption:* Replacement agent reads previous reasoning/memories and continues task execution without restarting from scratch.

### Agent Memory Ownership Model
Agents contribute knowledge but do not own memory. Rather than having separate databases for Weather Agent, Medical Agent, and Logistics Agent which causes isolated intelligence and context fragmentation, ReliefGrid uses a shared memory model.
* **Benefits:** Knowledge sharing, faster learning, fault recovery, and consistent global state.

```
             Shared Memory
        /          │         \
  Weather       Medical     Logistics
   Agent         Agent        Agent
```

### Agent Security Boundaries & Performance
* **Security Boundaries:** Agents operate under least-privilege permissions. For example, Weather Agent is restricted from modifying resource allocations or medical records, while the Coordinator Agent holds higher permission levels. Any critical action (evacuations, resource deployment, public updates) requires human approval.
* **Performance Tracking:** Each agent maintains operational metrics stored as Agent Performance Memory, including task completion rate, response time, prediction accuracy, memory contribution, and failure frequency.

## Agent Reasoning Framework

### Philosophy
ReliefGrid is not a collection of Large Language Models responding independently. It is a **collective intelligence system** in which every agent contributes to, benefits from, and continuously improves a shared organizational memory.

The quality of the platform depends less on individual model capability and more on the consistency of its reasoning process. To ensure predictable, explainable, and production-ready behavior, every agent follows the same cognitive framework.

This framework guarantees that:
* Every decision is evidence-based.
* Every recommendation is traceable.
* Every action enriches organizational knowledge.
* Every future incident benefits from previous experience.

### Universal Cognitive Cycle
Every agent executes the same reasoning lifecycle regardless of its specialization:

```text
Receive Objective
        │
        ▼
  Validate Task
        │
        ▼
Understand Context
        │
        ▼
Retrieve Working Memory
        │
        ▼
Retrieve Long-Term Memory
        │
        ▼
Retrieve Similar Incidents
        │
        ▼
Construct Context Package
        │
        ▼
     Reason
        │
        ▼
Generate Candidate Actions
        │
        ▼
 Evaluate Confidence
        │
        ▼
Validate Recommendation
        │
        ▼
 Persist New Memory
        │
        ▼
 Notify Coordinator
        │
        ▼
     Reflect
        │
        ▼
      Learn
```

This lifecycle is mandatory for every agent. No agent bypasses memory retrieval or memory persistence.

### Stage 1 — Objective Understanding
The first responsibility of an agent is to determine precisely what problem it has been asked to solve. Each task contains:
* **Incident Identifier:** Link to the active crisis.
* **Objective:** Direct text goal.
* **Priority:** Critical, High, Medium, Low.
* **Geographic Scope:** Impact coordinates and boundaries.
* **Time Constraints:** Deadlines and simulation parameters.
* **Available Context:** Associated resources and assets.
* **Assigned Dependencies:** Prerequisite task IDs.

Example task:
```yaml
Objective: "Assess flood severity in District A."
Priority: "Critical"
Deadline: "Immediate"
Supporting Context: "Flood alert issued; population estimate available; historical incidents linked."
```
The agent does not begin reasoning until this objective has been validated against active API models.

### Stage 2 — Context Construction
The agent assembles a comprehensive context package before invoking the reasoning model. The package combines multiple information sources rather than relying solely on the current request:

```text
Current Incident + Working Memory + Relevant Episodic Memories + Semantic Knowledge + Task State + Recent Decisions + Resource Availability + Predictions ──> Unified Context Package
```

This ensures that reasoning is grounded in both active telemetry and cumulative historical knowledge.

### Stage 3 — Memory Retrieval Strategy
Memory retrieval follows a defined priority order:
1. **Working Memory:** Active incident variables.
2. **Task Memory:** Current agent objectives and progress logs.
3. **Decision Memory:** Past operational decisions and outcomes.
4. **Episodic Memory:** Similar historical incidents.
5. **Semantic Memory:** Permanent generalized operational rules.
6. **Reflection Memory:** Post-disaster lessons learned.
7. **Prediction Memory:** Historical forecasts vs outcomes.
8. **Resource Memory:** Operational capabilities and constraints.

Retrieval uses both structured filters (SQL) and semantic vector search (pgvector). This layered approach balances precision with contextual relevance.

### Stage 4 — Context Ranking
Retrieved memories are ranked before being supplied to the reasoning model. Ranking factors include:
* **Semantic Similarity:** Vector distance score.
* **Geographic Relevance:** Proximity to active coordinates.
* **Temporal Proximity:** Timestamps relative to the active simulation.
* **Confidence Score:** Success ratings of past outcomes.
* **Recency:** Time-decay values.
* **Source Reliability:** Source agent performance ratings.
* **Operational Impact:** Magnitude of response improvement.

The highest-ranked memories form the final reasoning context. This prevents information overload while maximizing relevance.

### Stage 5 — Reasoning
Once context has been assembled, the agent performs structured reasoning using Amazon Bedrock. The reasoning process must produce:
* Situation assessment
* Identified risks
* Possible candidate actions
* Supporting evidence logs
* Confidence estimate
* Assumptions
* Identified uncertainties

The objective is to produce an explainable operational recommendation.

### Stage 6 — Candidate Action Generation
Agents generate one or more candidate actions. Each candidate includes:
* Recommended action
* Expected outcome
* Operational impact
* Required resources
* Dependencies
* Urgency
* Confidence rating

Example candidate:
```yaml
Action: "Activate Shelter Alpha."
Expected Outcome: "Reduce population exposure."
Required Resources: "Medical staff, transportation, emergency supplies."
Confidence: "93%"
```

### Stage 7 — Confidence Evaluation
Every recommendation is evaluated before submission. Confidence is derived from:
* Quality of retrieved memories.
* Consistency across evidence.
* Completeness of available data.
* Historical success of similar actions.
* Model certainty parameters.

Confidence levels are categorized as **High**, **Medium**, or **Low**. Low-confidence recommendations may require additional agent collaboration before escalation.

### Stage 8 — Validation
Recommendations pass through a validation layer before entering collective memory. Validation checks include:
* **Logical Consistency:** Check for contradictions in reasoning.
* **Contradictory Evidence:** Verify against local active sensors.
* **Missing Dependencies:** Ensure required assets are active.
* **Unsupported Assumptions:** Flag ungrounded declarations.
* **Policy Violations:** Enforce RBAC constraints.
* **Duplicate Recommendations:** Prevent redundant action queues.

Only validated recommendations are written to the database.

### Stage 9 — Memory Creation
Every completed reasoning cycle generates new organizational knowledge. Potential outputs include:
* Updated Working Memory
* Decision Memory
* Prediction Memory
* Reflection Memory
* Timeline events

The system records not only the final recommendation but also the supporting evidence and reasoning metadata.

### Stage 10 — Reflection
After execution, each agent evaluates its own performance, addressing:
* *Was the recommendation implemented?*
* *Was the prediction accurate?*
* *Which assumptions proved incorrect?*
* *Which knowledge should be retained?*
* *Which knowledge should be revised?*

Reflection transforms operational experience into institutional learning.

### Conflict Resolution
Different agents may produce conflicting recommendations (e.g. Weather Agent recommends evacuation, Logistics Agent reports transport shortages, Medical Agent advises sheltering-in-place). Conflict resolution follows:
1. **Detect Conflict:** Identify overlapping operational targets.
2. **Compare Evidence:** Evaluate supporting vector similarities.
3. **Evaluate Confidence:** Compare calculated confidence metrics.
4. **Clarification Check:** Query for additional variables if necessary.
5. **Coordinator Arbitration:** Delegate to the Coordinator Agent.
6. **Consolidated Output:** Render a unified response or escalate to the human Commander.

### Memory Promotion Rules
Not all information should become permanent knowledge. ReliefGrid classifies memories according to long-term value:
* **Remain Temporary:** Active rainfall measurements, current traffic conditions, and incomplete investigations.
* **Promote to Long-Term Memory:** Successful evacuation strategies, recurring infrastructure failures, validated medical response patterns, and effective resource allocation methods.

Promotion decisions are based on operational significance and repeated validation.

### Memory Evolution
Knowledge is not static. Existing memories may be:
* Updated
* Superseded
* Linked
* Merged
* Archived

Older memories remain available for audit purposes while newer validated knowledge becomes the preferred reference. This preserves historical integrity without preventing organizational learning.

### Explainability Framework
Every recommendation must be explainable. The platform records:
* Responsible agent
* Supporting memories
* Retrieved incidents
* Evidence sources
* Confidence score
* Reasoning summary
* Timestamp

Operators can inspect this information through the Memory Explorer and Decision Details interfaces.

### Organizational Learning Loop
ReliefGrid continuously improves through repeated operational cycles:
`Incident ──> Agent Analysis ──> Decision ──> Execution ──> Outcome ──> Reflection ──> Knowledge Update ──> Future Incident Improvement`

### Alignment with CockroachDB × AWS Hackathon
This reasoning framework directly supports the hackathon objectives:
* **Agentic Memory Design:** Every reasoning cycle depends on persistent memory before and after inference.
* **Technical Implementation:** Memory retrieval, vector search, transactional persistence, and coordinated agent workflows are first-class architectural concepts.
* **Real-World Impact:** Recommendations are grounded in accumulated organizational experience.
* **Production Readiness:** The framework emphasizes validation, explainability, conflict resolution, and continuous learning.
* **Creativity & Originality:** ReliefGrid models an organization that learns collectively through persistent memory.


## Memory Model

### Memory Architecture Philosophy
Unlike traditional AI applications where a database sits passively as storage behind the application logic (transient query-response context), ReliefGrid treats the Collective Memory Engine as the cognitive foundation of the platform. Here, agents do not run as isolated silos; they continuously retrieve, update, and contribute experiences to a shared cognitive layers, transforming raw data into evolving, permanent organizational intelligence.

### Collective Memory Engine Architecture
The memory engine structure comprises multiple specialized cognitive layers:

```
                 Collective Memory Engine
        ┌─────────────────────────────────────────┐
        │  Working Memory (Task state / context)  │
        ├─────────────────────────────────────────┤
        │  Episodic Memory (Past incident events) │
        ├─────────────────────────────────────────┤
        │  Semantic Memory (Generalized concepts) │
        ├─────────────────────────────────────────┤
        │  Decision Memory (Actions & evidence)   │
        ├─────────────────────────────────────────┤
        │  Prediction Memory (Forecast outcomes)  │
        ├─────────────────────────────────────────┤
        │  Resource Memory (Supplies & status)    │
        ├─────────────────────────────────────────┤
        │  Reflection Memory (Lessons learned)    │
        └─────────────────────────────────────────┘
                            │
                       CockroachDB
              SQL + Transactions + Vectors
```

### Memory Types
1. **Working Memory:** Stores temporary information needed during active reasoning (e.g. current weather indicators, active tasks, intermediate agent notes). It persists during an active incident and is consolidated/removed after the incident concludes, enabling agents to recover state without restarting.
2. **Episodic Memory:** Stores specific past experiences and event sequences (e.g. Lagos Region Flood of 2026). This allows agents to retrieve historical situations and adapt successful strategies.
3. **Semantic Memory:** Stores generalized knowledge and conceptual facts (e.g., "Region A has high vulnerability during extreme rainfall" derived from past events) rather than exact logs. It creates long-term organizational wisdom.
4. **Decision Memory:** Records crucial operational decisions including reasoning, supporting evidence, responsible agents, and outcomes (e.g., "Open Shelter B because rainfall prediction exceeded thresholds and population density is high"). This is the foundation of explainable AI.
5. **Prediction Memory:** Tracks forecasts, confidence scores, expected outcomes, and actual outcomes to evaluate and improve AI prediction accuracy over time.
6. **Resource Memory:** Monitors real-time availability, allocation, and shortages of hospitals, shelters, vehicles, personnel, and equipment.
7. **Reflection Memory:** Records lessons learned post-incident (e.g., "Supply allocation was delayed due to route blocks; future responses require earlier staging").

### Memory Lifecycle & Learning Architecture

#### Memory Lifecycle Philosophy
In ReliefGrid, memory is not passive data storage. It is treated as an active intelligence asset. Every memory passes through seven lifecycle stages—Creation, Validation, Enrichment, Storage, Retrieval, Evaluation, and Evolution—ensuring that every incident builds a stronger foundation of operational wisdom.

```text
Memory Creation ──> Memory Validation ──> Memory Enrichment ──> Memory Storage ──> Memory Retrieval ──> Memory Evaluation ──> Memory Evolution
```

#### Detailed Memory Lifecycle Stages

##### Stage 1 — Memory Creation
Defines how new knowledge enters ReliefGrid. Sources include:
* *Agent Observations:* Real-time data captures (e.g. Weather Agent notes: "Rainfall intensity increasing").
* *Human Input:* Manual reports filed by operators (e.g. "Bridge collapsed near District B").
* *External Data:* Telemetry or feeds.
* *System Events:* Automated logs (e.g. "Medical Agent completed demand assessment").
* *Memory Object Structure:* Every memory contains:
  * **Identity:** Memory ID, creation time, creator agent, related incident ID.
  * **Content:** The core observation or finding (e.g., "Flooding caused road blockage").
  * **Context:** Location, severity, affected population.
  * **Confidence:** Certainty percentage (e.g., "87%").
  * **Source:** Originating system (Weather Agent, human operator, historical log).
  * **Relationships:** Connections to related events (e.g. Incident linked to road damage, shelter shortage, or evacuation plans).
  * **Embedding:** High-dimensional vector representation.

##### Stage 2 — Memory Validation
Prevents hallucinations and incorrect data from polluting the collective memory. Validation is executed against:
* *Source Reliability:* Evaluates the origin. Human inputs receive higher trust weightings; AI outputs require confidence verification.
* *Confidence Thresholds:* Low-certainty inputs (e.g. weather probability under 50%) are flagged for operator approval before writing.
* *Evidence Availability:* Checks for corroborating files or secondary agent observations (e.g., validating "Hospital capacity exceeded" against hospital reports).
* *Consistency Checking:* Identifies state conflicts (e.g., resource allocation conflict where vehicle count differs from existing memory).

##### Stage 3 — Memory Enrichment
Transforms raw observations into structured intelligence:
* *Entity Extraction:* Identifies locations, organizations, resource types, and risk levels.
* *Relationship Mapping:* Links new observations to previous ones (e.g., linking rainfall to road closure and shelter demand).
* *Vector Embedding Generation:* Converts the raw memory text into a semantic embedding vector for downstream similarity searching.

##### Stage 4 — Memory Storage
Saves structural data and relationships in CockroachDB tables while referencing external assets (like raw damage photos, maps, and PDF briefs) in Amazon S3 buckets.

##### Stage 5 — Memory Retrieval & Ranking
When querying the Collective Memory Engine, search results are ranked according to a multi-factor importance algorithm:
$$\text{Importance Score} = \text{Semantic Similarity} + \text{Confidence Score} + \text{Recency Factor} + \text{Historical Success Weight}$$
This ensures that agents retrieve not only relevant keyword matches, but the most recent, highest confidence, and historically successful actions.

##### Stage 6 — Memory Evaluation
Compares predictions and decisions with actual outcomes:
* *Prediction Accuracy:* If the Weather Agent predicted bridge failure within 12 hours and it remained functional, the system lowers the confidence coefficient for that specific predictive model.
* *Decision Effectiveness:* Evaluates whether opening a specific shelter resolved the overcrowding issue or if resources fell short, updating the success metrics of that action.

##### Stage 7 — Memory Evolution & Learning
Memories are dynamic and evolve over time:
* *Confidence Adjustments:* Proven memories gain confidence weights; incorrect or obsolete ones decay.
* *Memory Linking:* Establishes new relationships between historical records.
* *Consolidation:* Translates hundreds of granular incident records into generalized semantic rules (e.g., "Region A always experiences road collapse when rainfall exceeds 200mm").

#### Memory Retention & Versioning Strategy
* **Memory Forgetting Strategy:** Avoids database bloat and cognitive pollution by archiving low-value memories (duplicate agent states, obsolete predictions) while permanently preserving high-value lessons (successful evacuations, post-incident reflection reports).
* **Versioning:** Resource and state records are versioned. Previous capacities (e.g., "Hospital capacity: 100 beds" vs "60 beds") remain queryable to provide full explainability and auditability during post-incident reviews.
* **The Learning Loop:**
  `Incident -> Observation -> Memory Creation -> Decision -> Real Outcome -> Performance Evaluation -> Reflection Memory -> Improved Future Response`

## CockroachDB Architecture

### Why CockroachDB is the Memory Backbone
ReliefGrid's memory engine requires global availability, multi-agent concurrency support, strong serializable consistency, and vector processing. Traditional databases suffer from memory fragmentation, race conditions (inconsistent state), and data loss upon agent crashes. CockroachDB solves these concerns via:
* **Distributed SQL:** Spans multiple regions to keep memory close to processing nodes.
* **Transactional Consistency (Serializable Isolation):** Prevents conflicts when multiple agents write to the same record concurrently.
* **Vector Indexing:** Enables semantic similarity searches across high-dimensional embeddings.
* **Resilient Replication:** Replicates data across independent nodes to guarantee zero memory loss on node or agent failure.

### CockroachDB MCP Server Integration
The Model Context Protocol (MCP) server provides a secure, standardized interface for LLM agents to safely query, edit, and insert memory items.
* **Agent Interaction Model:**
  `Agent ──[MCP protocol]──> CockroachDB MCP Server ──[SQL]──> Database`
* **MCP Workflow:**
  1. The Coordinator Agent requests: "Find previous flood incidents with similar conditions."
  2. The agent sends the request via MCP protocol.
  3. The CockroachDB MCP Server validates permissions and inputs.
  4. The query is executed against CockroachDB.
  5. Structured memory results are returned to the agent's reasoning loop.
* **Benefits:** Establishes a standardized agent-to-DB interface, eliminates custom DB connectors, and ensures strong security boundaries and query auditing.

### Distributed Vector Memory Architecture
Enables semantic search based on meaning rather than exact keyword matches. The system generates and stores vector embeddings in CockroachDB for:
* **Incident Memories:** Textual summaries of disasters.
* **Agent Findings:** Bridge damage reports, rainfall risk assessments.
* **Decisions:** Evacuation approvals, resource routing.
* **Lessons Learned:** Reflection notes and post-incident reports.

### Semantic Retrieval Workflow
```
User Query ──> Embedding Gen ──> Vector Search ──> CockroachDB Index ──> Relevant Memories ──> Agent Reasoning ──> Decision
```
* **Example:** A commander asks "How did we handle similar flooding before?". The system embeds the query, executes a vector similarity search in CockroachDB, retrieves past flood decisions and outcomes, and passes them to the Coordinator Agent to draft a recommendation.

### Transaction Consistency & Recovery Strategy
* **Data Consistency:** Serializable isolation ensures that if a Medical Agent allocates 15 ambulances and a Logistics Agent attempts to reserve 10 from the same fleet, CockroachDB serializes the transactions to prevent double allocation.
* **Failure Strategy:** If a memory write fails due to network issues, the transactional engine rolls back the operation, logs the event, retries safely, and prevents corrupted or partial states.

## Phase 14 — AWS Cloud Architecture & Infrastructure

> **Building a Scalable, Fault-Tolerant, AI-Native Cloud Platform**

---

### 14.1 Objective

This phase defines the complete AWS architecture that powers ReliefGrid.

AWS provides the infrastructure required for:

* AI inference
* Event-driven processing
* Object storage
* Secure identity
* Monitoring
* Scalability
* Disaster recovery
* High availability

The architecture is designed around managed services to minimize operational overhead while maximizing reliability and elasticity.

---

### 14.2 Cloud Architecture Principles

The infrastructure follows eight core principles.

#### AI-Native

Artificial intelligence is a first-class capability.

Inference, orchestration, and memory enrichment are treated as native cloud workloads rather than external integrations.

---

#### Serverless Where Appropriate

Compute should scale automatically.

Long-running infrastructure should only exist where persistent services are required.

---

#### Event-Driven

Independent services communicate through asynchronous events whenever possible.

This reduces coupling and improves resilience.

---

#### Secure by Default

Every resource follows least-privilege access policies.

Encryption is enabled by default.

Secrets are never hardcoded.

---

#### Fault Isolation

Failure of one service must not interrupt the entire platform.

Every major subsystem should degrade gracefully.

---

#### Multi-Region Ready

Although the MVP targets a single region, infrastructure should be designed to expand into multi-region deployments with minimal architectural changes.

---

#### Observable

Every component emits logs, metrics, traces, and health signals.

Operational visibility is built into the platform.

---

#### Cost Conscious

Managed services should be selected to balance performance, simplicity, and cost efficiency—an important consideration for both hackathon development and future production deployment.

---

### 14.3 High-Level AWS Architecture

```text
                         Users
                           │
                           ▼
                 CloudFront CDN
                           │
                           ▼
              Next.js Frontend (Vercel)
                           │
                           ▼
                FastAPI Backend (AWS)
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Amazon Bedrock      CockroachDB       Amazon S3
        │                  │                  │
        ▼                  ▼                  ▼
 AI Inference      Collective Memory   Reports & Files
        │
        ▼
 AWS Lambda
        │
        ▼
 Background Jobs
        │
        ▼
 CloudWatch
```

This architecture separates presentation, application logic, persistent memory, AI inference, and asynchronous processing into distinct layers.

---

### 14.4 Amazon Bedrock

#### Purpose

Amazon Bedrock provides access to foundation models used throughout ReliefGrid.

---

#### Responsibilities

* Recommendation generation.
* Reflection synthesis.
* Incident summarization.
* Semantic analysis.
* Knowledge extraction.
* Embedding generation (where supported).
* Report drafting.

---

#### Integration Pattern

The backend communicates with Bedrock through a dedicated AI abstraction layer rather than invoking models directly from business services.

This approach simplifies model replacement and future expansion.

---

#### Design Goals

* Model independence.
* Centralized prompt management.
* Request auditing.
* Retry policies.
* Cost monitoring.

---

### 14.5 AWS Lambda

#### Purpose

AWS Lambda executes asynchronous and event-driven workloads.

---

#### Example Workloads

* Memory embedding generation.
* Reflection creation.
* Report rendering.
* Notification processing.
* Memory promotion.
* Data synchronization.
* Scheduled analytics.

---

#### Benefits

* Automatic scaling.
* Pay-per-use pricing.
* Operational simplicity.
* Isolation of long-running tasks.

---

### 14.6 Amazon S3

#### Purpose

Amazon S3 stores unstructured assets.

---

#### Stored Objects

* Incident attachments.
* Satellite imagery.
* Generated reports.
* Exported datasets.
* AI artifacts.
* Audit exports.
* Training datasets.

---

#### Bucket Organization

```text
reliefgrid/
├── incidents/
├── reports/
├── images/
├── exports/
├── analytics/
├── backups/
└── archives/
```

Object keys should be organized to simplify lifecycle management and retrieval.

---

### 14.7 Identity & Access Management (IAM)

Every AWS resource operates under the principle of least privilege.

Roles include:

* Backend Service Role
* Lambda Execution Role
* Bedrock Access Role
* Reporting Role
* Deployment Role
* Monitoring Role

Permissions are granted only for required actions.

---

### 14.8 Secrets Management

Sensitive configuration is stored securely.

Examples include:

* Database credentials.
* API keys.
* OAuth secrets.
* Encryption keys.
* Third-party integration credentials.

Secrets should be retrieved dynamically at runtime rather than embedded in application code.

---

### 14.9 Monitoring with CloudWatch

Operational metrics are centralized through Amazon CloudWatch.

Monitored metrics include:

* API latency.
* Lambda execution duration.
* Bedrock invocation success rate.
* Memory indexing throughput.
* Error rates.
* Queue depth.
* Infrastructure health.

CloudWatch alarms notify administrators of abnormal conditions.

---

### 14.10 Logging Strategy

All services emit structured logs.

Each log entry includes:

* Timestamp.
* Request ID.
* Correlation ID.
* Service Name.
* Severity.
* Organization ID.
* Incident ID (when applicable).

Structured logging enables end-to-end traceability across distributed workflows.

---

### 14.11 Infrastructure Scalability

The architecture supports horizontal scaling.

Scalable components include:

* API instances.
* Lambda concurrency.
* Bedrock inference requests.
* S3 storage.
* CockroachDB nodes.

Scalability should occur transparently without disrupting ongoing emergency operations.

---

### 14.12 Resilience Strategy

Infrastructure resilience includes:

* Automatic retries.
* Exponential backoff.
* Circuit breakers for external services.
* Graceful degradation.
* Health checks.
* Recovery workflows.
* Stateless application services.

Failures should be isolated and recoverable.

---

### 14.13 Backup & Disaster Recovery

Operational data is protected through layered recovery strategies.

Measures include:

* Automated CockroachDB backups.
* Versioned S3 buckets.
* Infrastructure-as-Code recreation.
* Configuration backups.
* Regular recovery validation.

Recovery objectives should align with the needs of emergency response systems.

---

### 14.14 Cost Optimization

To maintain cost efficiency:

* Prefer serverless compute for intermittent workloads.
* Archive infrequently accessed artifacts.
* Monitor Bedrock token usage.
* Apply lifecycle policies to S3 objects.
* Right-size persistent infrastructure.

These practices help balance operational capability with sustainable cloud expenditure.

---

### 14.15 Why This Phase Matters

AWS provides the execution environment that transforms ReliefGrid's architecture into a resilient, AI-powered operational platform. Managed services such as Amazon Bedrock, AWS Lambda, Amazon S3, IAM, and CloudWatch collectively support autonomous reasoning, background processing, secure storage, and operational observability.

By designing around managed, scalable services, ReliefGrid minimizes infrastructure complexity while maximizing reliability and extensibility. This architecture aligns closely with AWS best practices and demonstrates how cloud-native services can underpin a production-grade, multi-agent emergency intelligence platform.


## Technical Implementation Specification

### Objective
This phase translates ReliefGrid from a conceptual multi-agent emergency intelligence platform into an implementable software system. It defines the technology choices, engineering boundaries, application architecture, agent architecture, database strategy, cloud integration, and development workflow.

### Structure
1. **Technology Stack Selection** (FastAPI, Next.js, CockroachDB, Amazon Bedrock, AWS Lambda/S3)
2. **System Architecture** (Major services, communication patterns, boundaries)
3. **Repository Architecture** (Project organization, separation of concerns)
4. **Backend Engineering Specification** (API, business logic, agent orchestration, memory engine)
5. **Multi-Agent System Architecture** (Agent framework, coordinator logic, lifecycle)
6. **CockroachDB Implementation Architecture** (Database design, vector indexing, transactions)
7. **AWS Integration Architecture** (Bedrock usage, Lambda workflows, S3)
8. **Frontend Engineering Specification** (Dashboard, components, user experience)
9. **API Design Specification** (Endpoints, request flow, security)
10. **Development Roadmap** (Implementation sequence, milestones)

### Technology Stack Selection

#### Technology Selection Philosophy
ReliefGrid requires a stack that balances development speed (for rapid hackathon delivery), production-grade scalability (simulating real EOC workloads), deep AI compatibility (supporting agent loops, embeddings, and context retrieval), and developer efficiency.

#### Selected Architecture
* **Frontend:** Next.js + TypeScript + Tailwind CSS
* **Backend:** Python FastAPI
* **AI Layer:** Amazon Bedrock (Claude 3.5 Sonnet / Cohere Embed) + Custom Agent Orchestration Layer
* **Database:** CockroachDB Cloud (pgvector enabled)
* **Storage:** Amazon S3
* **Cloud Execution:** AWS Lambda
* **Authentication:** Token-based JWT authentication

#### Frontend Stack & UI Framework
* **Next.js & TypeScript:** Enables server-side rendering for quick load times and type safety to prevent communication mismatches between frontend and backend.
* **Tailwind CSS:** Accelerates consistent layout creation, responsive styling, and custom glassmorphism components.
* **Visualization Layer:** Utilizes modern charting libraries (e.g. Recharts or Chart.js) and maps (e.g. Maplibre GL or Leaflet) to display real-time incident timelines, evacuation corridors, and resource capacities.

#### Backend & AI Orchestration Layer
* **Python FastAPI:** Offers native integration with core machine learning/LLM libraries, high performance via asynchronous concurrency, and automatic OpenAPI schema documentation.
* **Amazon Bedrock Foundation Models:** Powers agent planning and reasoning. We utilize off-the-shelf models rather than custom fine-tuned models to demonstrate that value is created by how agents utilize persistent memory, not specialized model training.
* **Custom Agent Orchestration:** Employs a deterministic coordinator framework with tool calling. Instead of completely uncontrolled agent loops (which are unpredictable and hard to debug), agents run specialized steps orchestrated by the Coordinator Agent.

#### Database, Storage & Compute
* **CockroachDB Cloud:** Serves as the cognitive backbone, hosting relational state tables, task queues, and pgvector embeddings for semantic recall.
* **Amazon S3:** Holds large unstructured data assets (e.g. uploaded incident reports, aerial photographs, or generated PDF summary briefs), keeping database storage lightweight.
* **AWS Lambda:** Provides serverless compute, handling background tasks and agent execution dynamically during demand surges.

#### Architecture Decision Summary
| Layer | Technology | Reason |
| --- | --- | --- |
| **Frontend** | Next.js + TypeScript | Enterprise-grade dashboard scalability, safety |
| **Styling** | Tailwind CSS | Rapid prototyping of premium EOC UI |
| **Backend** | Python FastAPI | High-concurrency async, native AI support |
| **AI Layer** | Amazon Bedrock | Managed LLM models, security, reliability |
| **Database** | CockroachDB Cloud | Persistent, distributed SSoT memory layer |
| **Vector Memory**| CockroachDB pgvector | Semantic memory search and ranking |
| **Storage** | Amazon S3 | Document, image, and PDF report hosting |
| **Execution** | AWS Lambda | Automatic serverless scaling during disasters |

### Complete System Architecture Design

#### Architecture Overview
ReliefGrid is designed as a multi-agent cognitive coordination platform built around a distributed, persistent memory layer. The architectural stack consists of six primary layers:

1. **Experience Layer (User Frontend):** Vite-powered Next.js application presenting the web-based Emergency Operations Center (EOC) dashboard.
2. **Application Layer (Backend Services):** FastAPI gateway running the business logic APIs, incident pipelines, and route handlers.
3. **Intelligence Layer (Multi-Agent System):** A central Coordinator Agent supervising six domain-specific specialist agents.
4. **Memory Intelligence Layer (Collective Memory Engine):** Managing validation, pgvector indexing, semantic relevance ranking, and reflection updates.
5. **Data Infrastructure Layer:** Globally distributed CockroachDB cluster for ACID relational storage and vector metrics, alongside Amazon S3 for bulk file storage.
6. **Cloud Infrastructure Layer:** Scalable AWS runtime hosting serverless Lambdas and Bedrock foundation model integrations.

```text
                         USERS
                           │
                           ▼
                  Experience Layer
               (Web Dashboard Interface)
                           │
                           ▼
                  Application Layer
              (API Gateway + Services)
                           │
                           ▼
                  Intelligence Layer
          (Coordinator + Specialized Agents)
                           │
                           ▼
                  Memory Intelligence Layer
        (Collective Memory Engine + Retrieval)
                           │
                           ▼
                  Data Infrastructure Layer
       (CockroachDB + Vector Memory + AWS Storage)
                           │
                           ▼
                  Cloud Infrastructure Layer
              (AWS Runtime Environment)
```

#### Core Architectural Principle
Unlike traditional AI systems that lose intelligence state after a single prompt-response cycle, ReliefGrid feeds every execution cycle back into its database:
`User Query ──> Agent Processing ──> Memory Retrieval ──> Reasoning ──> Action ──> Memory Update ──> Learning ──> Future Decision Improvement`

#### Major System Components
1. **Web Application:** The control interface for humans, housing the Incident Monitor, Agent Timeline, and Memory Explorer UI. It acts strictly as an API client.
2. **API Gateway Layer:** FastAPI gateway parsing payload parameters, validating JSON schemas, verifying session tokens, and routing inputs.
3. **Incident Management Service:** Tracks active and historical incidents, statuses, and coordinates severity level calculations.
4. **Coordinator Agent:** The central orchestrator. It does not perform resource allocations directly; instead, it parses operator goals, generates structured tasks, calls specialist agents, and aggregates findings into a unified commander brief.
5. **Specialized Agent Layer:**
   * *Weather Agent:* Evaluates telemetry to generate rainfall and flood predictions.
   * *Infrastructure Agent:* Examines transport routes, utilities, and bridge structural erosion.
   * *Medical Agent:* Predicts emergency room capacity and clinical demand.
   * *Shelter Agent:* Monitors displaced population volumes and shelter availability.
   * *Logistics Agent:* Plans supply routing, vehicle availability, and distribution nodes.
   * *Communication Agent:* Drafts public statements and briefs based on confirmed facts.
6. **Collective Memory Engine:** Integrates validation, ranking, and consolidation models to structure agent inputs into durable memory formats.
7. **CockroachDB Memory Layer:** Host database for transactional records (fleet counts, shelter availability), task assignments, and pgvector embeddings.
8. **AWS Cloud Compute:** Combines Bedrock models for thinking, Lambda for task scaling, and S3 buckets for report archiving.

#### Service Communication & Agent Message Pattern
ReliefGrid implements a controlled Coordinator-mediated communication model. To prevent high LLM token costs, race conditions, and infinite loop bugs, agents are prohibited from sending arbitrary peer-to-peer messages. All collaboration is serialized through the Coordinator Agent:
```text
Dashboard ──> API Gateway ──> Coordinator Agent ──> Specialized Agent (Lambda) ──> Memory Engine ──> CockroachDB
```
Every agent execution contains exactly two database events:
1. **Pre-execution Retrieval (Read):** Queries the database: *"What do we already know?"*
2. **Post-execution Storage (Write):** Saves findings back to the SSoT: *"What did we learn?"*

#### Event Architecture
Workflows are driven by asynchronous, transactional events:
* `INCIDENT_CREATED` -> Activates the Coordinator Agent.
* `TASK_CREATED` -> Invokes the corresponding Specialist Agent Lambda.
* `MEMORY_CREATED` -> Triggers embedding calculations and validation sweeps.
* `RECOMMENDATION_GENERATED` -> Updates the frontend operator state and logs an audit record.

#### Internal System Modules & Data Ownership
* **Incident Module:** Manages the lifecycle and location footprints of emergency incidents.
* **Agent Module:** Spawns and monitors execution runs of agent scripts.
* **Memory Module:** Orchestrates semantic vector matching and schema writes.
* **Decision Module:** Registers recommendations, tracks commander review statuses, and logs user decisions.
* **Resource Module:** Tracks available public assets (shelters, vehicles, supplies).
* **Monitoring Module:** Collects operational throughput logs and latency metrics.

To prevent write conflicts, each service owns a strict domain partition. The Incident Service owns incident status; the Resource Service owns asset counts. The database enforces serializable transactions to guarantee data integrity across all modules.

#### Scalability & Failure Isolation
* **Horizontal Scaling:** Because agents execute stateless reasoning runs on AWS Lambda and persist all context in CockroachDB, execution pools can scale infinitely without memory fragmentation.
* **Failure Isolation:** A crash in one agent (e.g. Medical Agent LLM timeout) does not stall other processes. The Coordinator logs the failure, continues gathering reports from Weather and Logistics, and restarts the Medical Agent with its previous state retrieved from CockroachDB Task Memory.

#### Production vs MVP Architecture
* **Production Build:** Fully decoupled microservices communicating via AWS EventBridge/Kafka, running multi-region CockroachDB active-active cluster networks.
* **Hackathon MVP:** A single FastAPI service holding the orchestration engine, executing specialized agent subroutines synchronously or via standard async loops, utilizing CockroachDB Cloud Serverless and Bedrock SDK hooks to showcase the core memory features with clean codebase simplicity.

### Repository Architecture & Engineering Organization

#### Monorepo Strategy
ReliefGrid uses a modular monorepo structure. In a multi-agent platform, changing an agent prompt or memory schema frequently requires updates to API endpoints and frontend rendering components. Storing these components in a single codebase keeps types, environment settings, and interface contracts fully synchronized while giving hackathon judges a unified view of the complete architecture.

#### Monorepo Directory Layout
```text
reliefgrid/
├── apps/
│   ├── web/               # Next.js Frontend App
│   └── api/               # FastAPI Backend App
├── agents/                # Agent Intelligence Package
├── memory-engine/         # Shared Cognitive Memory Engine
├── database/              # CockroachDB Schema & Seeds
├── infrastructure/        # AWS Deployment Scripts & IAM Policies
├── shared/                # Shared Schema Types & Utility Functions
├── docs/                  # Markdown Project Specifications
├── tests/                 # Unit, Integration, & System Tests
├── scripts/               # Setup & Simulation Utilities
├── .env.example           # Shared Configuration Template
├── README.md              # SSoT Documentation Hub
└── LICENSE                # Project License
```

#### Application Subsystems Directory Maps

##### Frontend Application (`apps/web/`)
Built with Next.js App Router and TypeScript:
```text
web/
├── app/                   # App routes (dashboard/, incidents/, agents/, memory/)
├── components/            # Global UI elements (Button, Sidebar, GlassCard)
├── features/              # Feature modules containing scoped logic & components
│   ├── incidents/         # Incident creation panels & lists
│   ├── agents/            # Live timeline trace monitor components
│   └── memory/            # Interactive vector database explorer UI
├── hooks/                 # Reusable React hooks (useAuth, useSocket)
├── services/              # API communication wrappers (axios clients)
├── types/                 # Frontend typescript interfaces mapping backend schemas
├── utils/                 # Formatting helpers
└── styles/                # CSS configurations & Tailwind config files
```

##### Backend API Gateway (`apps/api/`)
Built with Python FastAPI:
```text
api/
├── app/                   # Server initialization, routing hooks, main FastAPI app
├── modules/               # Domain business modules
│   ├── incidents/         # REST routes & service logic for incident events
│   ├── users/             # Authentication & session controls
│   ├── agents/            # Run managers for coordinating agent Lambdas
│   ├── decisions/         # Recommendation logs & approval states
│   └── resources/         # Fleet, shelter, and supply databases
├── services/              # Common business logic (S3 clients, Bedrock hooks)
├── middleware/            # JWT verification, CORS config, loggers
├── config/                # Environment schema validation (pydantic Settings)
└── tests/                 # Scoped API router tests
```

##### Agent Subsystem (`agents/`)
Core cognitive runtime engine:
```text
agents/
├── core/                  # Base structures (AgentBase class, lifecycle protocols)
├── coordinator/           # Orchestrator orchestrating task delegation & consolidation
├── weather/               # Specialist: environmental assessment (prompts/, tools/)
├── medical/               # Specialist: bed capacity & clinical staging
├── infrastructure/        # Specialist: road erosion & utility outage mapping
├── shelter/               # Specialist: population placement & occupancy checks
├── logistics/             # Specialist: truck dispatching & supply delivery
├── communication/         # Specialist: drafting public alerts & press releases
└── tools/                 # Common agent utilities (database queries, weather APIs)
```

##### Collective Memory Engine (`memory-engine/`)
Cognitive memory layer interfaces:
```text
memory-engine/
├── retrieval/             # Vector similarity query handlers (pgvector calls)
├── storage/               # Serialization handlers for SQL memory tables
├── embeddings/            # Embedding calculators mapping raw texts to float arrays
├── ranking/               # Rank engines implementing relevance importance calculations
├── lifecycle/             # Consolidation and retention workers
├── validation/            # Verification steps to prevent agent hallucinations
└── models/                # Pydantic schemas mapping memory records
```

##### Database Schema & Migration Hub (`database/`)
All database assets:
```text
database/
├── schema/                # SQL definitions for CockroachDB tables
├── migrations/            # Migration tracking files
├── seeds/                 # Preloaded historical incidents & outcomes for simulation
├── queries/               # Common SQL scripts for performance testing
└── documentation/         # Schema diagrams & relationship maps
```

##### Infrastructure Deployment (`infrastructure/`)
Infrastructure configurations:
```text
infrastructure/
├── aws/                   # IAM policies, S3 bucket definitions, Lambda triggers
├── deployment/            # Dockerfiles & deployment pipelines
├── monitoring/            # CloudWatch alarm rules & dashboard metrics
└── security/              # TLS and network control scripts
```

#### Environment Configuration (`.env.example`)
Configuration settings are managed through environment variables parsed via Pydantic on the backend and client-exposed variables on the frontend. Production secrets are excluded from Git:
```bash
# Database Config
COCKROACH_DB_URL="postgresql://user:pass@cluster.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"

# AWS Credentials
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

# Amazon Bedrock Settings
BEDROCK_MODEL_ID="anthropic.claude-3-5-sonnet-v1:0"
EMBEDDING_MODEL_ID="cohere.embed-english-v3"

# S3 Configuration
S3_BUCKET_NAME="reliefgrid-incident-artifacts"

# Security
JWT_SECRET="super-secret-key-change-in-production"
SESSION_TIMEOUT_SECONDS=3600
```

#### Git Workflow & Testing Organization
* **Git Model:** Standard feature-branch workflow. Feature branches (`feature/memory-engine`, `feature/coordinator`) merge into `develop` for integration testing, with `main` representing production-ready deployments.
* **Testing Levels:**
  * *Unit Tests:* Verified functions (e.g. memory scoring mathematics, JSON parsing schemas).
  * *Integration Tests:* Validates subsystem boundaries (e.g. specialized agent calls storing embeddings to CockroachDB).
  * *System Tests:* Assesses full end-to-end incident loops (e.g. submitting an incident, executing coordinator tasks, verifying final brief output).

### Backend Engineering Specification

#### Backend Architecture & Orchestration Flow
The ReliefGrid backend acts as the control center coordinating inputs and services. Requests undergo JSON validation, authentication, and routing checks before invoking the agent orchestrators. The orchestration workflow is represented as:
`User / System Event ──> API Gateway ──> Incident Services ──> Coordinator Agent ──> Specialized Agent Execution ──> Memory Engine ──> CockroachDB ──> Response Output`

#### Core Responsibilities
1. **Application Control:** Managing incident pipelines, role-based authorization, static metadata, and workflow orchestrations.
2. **Agent Orchestration:** Triggering Coordinator runs, mapping tasks, allocating specialists, tracking active agent statuses, and collecting response payloads.
3. **Memory Management:** Directing pgvector embeddings generation, checking input validation matrices, ranking relevance metrics, and writing updates to CockroachDB.
4. **System Resilience & Logging:** Trapping LLM timeouts, restarting failed agent runtimes, persisting task checkpoints to the database, and raising alerts on system anomalies.

#### Backend Service Layout
The backend directory `apps/api/` is structured as a collection of specialized services:
* **Authentication Service:** Validates user credentials, decodes JSON Web Tokens (JWT), and checks the roles defined in the RBAC matrix before routing requests.
* **Incident Service:** Provides CRUD operations for incident reports, coordinates status transitions (Assessment, Active Response, Recovery, Closed), and links relevant historical lessons to the operational record.
* **Agent Service:** Initializes LLM configurations, monitors agent execution status transitions (`Idle`, `Assigned`, `Processing`, `Completed`, `Failed`), and handles recovery workflows.
* **Memory Service:** Acts as the database intermediary. Agents are restricted from accessing CockroachDB directly; instead, they query the Memory Service, which calculates embeddings and performs pgvector similarity searches.
* **Decision Service:** Collects agent recommendations, formats supporting evidence links, calculates confidence bounds, and updates approval states (Pending, Approved, Rejected).
* **Resource Service:** Manages transactional state tables containing regional resources (vehicles, medical supplies, shelter occupancy levels) and handles lock configurations to prevent double-allocations.
* **Notification Service:** Dispatches websocket alerts for critical events (agent execution complete, resource depletion thresholds, or agent crash events).
* **Analytics Service:** Provides regional disaster metrics, calculating performance KPIs like resource response times and memory evolution rate.
* **Monitoring & Observability Service:** Exposes Prometheus and CloudWatch log scrapers tracking DB latency, token usage, execution durations, and error frequencies.

#### Incident Lifecycle & Agent Orchestration Loop
```text id="6d7c8e"
        Incident Creation
               │
               ▼
      [Coordinator Agent] ──> Fetches Historical Memories (pgvector)
               │
               ├──────────────────┬──────────────────┐
               ▼                  ▼                  ▼
       [Weather Agent]    [Medical Agent]    [Logistics Agent]
               │                  │                  │
               └──────────────────┼──────────────────┘
                                  ▼
                     Synthesized Recommendation
                                  │
                                  ▼
                      Human Approval Workflow
                                  │
                                  ▼
                         Execution & Learning
```

#### Request-Response Lifecycle
1. **Request Intake:** The API Gateway receives a request to analyze a flood threat.
2. **Authorization check:** The token validation middleware verifies role parameters.
3. **State Fetch:** The Incident Service pulls current rainfall rates and road closures.
4. **Context Enrichment:** The Memory Service executes a pgvector query using the current incident context to load previous incident summaries and responses.
5. **Agent Dispatch:** The Agent Service invokes the Coordinator, which spawns specialist threads with context payloads.
6. **Writing Outputs:** Agents write analysis summaries back to the Memory Service. The Coordinator aggregates findings into an actionable recommendation brief.
7. **Response Return:** The brief, supporting evidence, and confidence rating return to the client.

#### Fault Tolerance & Error Recovery
* **Agent Crash Recovery:** If a specialist agent fails mid-execution, the Agent Service captures the crash event, records the error footprint in the task log, and initiates a recovery thread. The resurrected agent queries CockroachDB for its assigned task parameters and context, resuming execution without repeating the entire incident cycle.
* **Database & AWS Resiliency:** CockroachDB Cloud provides distributed replica failovers. For AWS SDK calls (Bedrock, S3), the backend implements exponential backoff with jitter to resolve transient API throttling.
* **Agent Verification Layer:** Before writing any recommendation to the database, a validation controller checks outputs against physical system boundaries (e.g. confirming recommended truck capacities are not mathematically impossible).

### Multi-Agent System Architecture Specification

#### Hierarchical Coordination Architecture
ReliefGrid uses a coordinated hierarchical multi-agent pattern. An open-chat model where all agents communicate peer-to-peer leads to rapid token depletion, conflicting instructions, and race conditions. Conversely, a single monolithic agent lacks localized domain expertise and prevents concurrent processing. ReliefGrid's coordinator-specialist model balances specialized intelligence with controlled orchestration:

```text id="7a8b9c"
                       Human Operator
                             │
                             ▼
                    [Coordinator Agent]
                             │
       ┌──────────────┬──────┴──────┬──────────────┐
       ▼              ▼             ▼              ▼
   [Weather]   [Infrastructure]  [Medical]    [Logistics]
    Agent           Agent         Agent         Agent
       │              │             │              │
       └──────────────┼─────────────┼──────────────┘
                      ▼
          [Collective Memory Engine]
                      │
                      ▼
               [CockroachDB]
```

#### Core Design Principles
* **Specialized Intelligence:** Each agent operates within a defined scope (e.g., Weather Agent only evaluates environmental indicators).
* **Memory-Driven Reasoning:** Agents are prohibited from generating suggestions in isolation; they must query the Collective Memory Engine to retrieve historical case matches before reasoning.
* **Evidence-Based Decisions:** Every response payload must bundle its supporting incident IDs, vector distance scores, and logical reasoning chain.
* **Continuous Learning:** Upon incident resolution, agents must execute a post-action reflection cycle and write the outcome vectors to the shared database.
* **Controlled Autonomy:** Low and medium-risk tasks are executed automatically, while high-risk recommendations (e.g., evacuation routes, asset deployments) queue for human commander verification.

#### Agent Lifecycle & State Management
```text
State: Created ──> Available ──> Assigned ──> Retrieving ──> Reasoning ──> Validating ──> Storing ──> Complete
```
The Agent runtime coordinates the following phases:
1. **Intake:** The agent processes its objective parameters from the Coordinator.
2. **Retrieve:** Queries pgvector for similar past situations.
3. **Execute:** The Bedrock LLM processes the query context, current telemetry, and retrieved memories.
4. **Validate:** Checks output metrics against physical system boundaries.
5. **Commit:** Stores results in CockroachDB and reports success to the Coordinator.

#### Agent Internal Components
* **Identity Manager:** Holds agent type, active model, and cryptographic tokens.
* **Objective Manager:** Tracks the active task objective (e.g. *"Evaluate route safety for truck convoy"*).
* **Reasoning Engine:** Interfaces with Amazon Bedrock API using system prompt profiles.
* **Memory Interface:** Performs read/write serialization against the pgvector schemas.
* **Tool Interface:** Executes external modules (e.g. mock road closure telemetry, weather forecast APIs).
* **Validation Layer:** Evaluates LLM outputs against physical limitations to catch hallucinations.
* **Communication Interface:** Packages output into structured JSON schemas.

#### Agent Specifications

##### 1. Coordinator Agent
* **Mission:** Orchestrate specialized agent workflows and synthesize operational briefs.
* **Key Tasks:** Parse natural language EOC alerts, create task objectives, track specialist execution states, resolve resource prioritization conflicts, and compile final recommendations.
* **Memory Usage:** Retrieves historical incidents to determine which specialized agents are required. Writes decision summaries and master incident plans.

##### 2. Weather Agent
* **Mission:** Predict local flood boundaries and storm escalation risks.
* **Key Tasks:** Retrieve historical rainfall reports, analyze active weather patterns, and model water level changes.
* **Memory Usage:** Reads previous climate patterns; writes prediction and risk estimation vectors.

##### 3. Infrastructure Agent
* **Mission:** Assess route accessibility, power grid status, and structural failure risks.
* **Key Tasks:** Match active route paths against damage telemetry and isolate structural danger zones (e.g., eroding bridges).
* **Memory Usage:** Reads previous route failures; writes infrastructure damage reports.

##### 4. Medical Agent
* **Mission:** Predict casualty volumes and coordinate hospital bed capacities.
* **Key Tasks:** Model injury distributions based on severity data and cross-reference active hospital capacity indexes.
* **Memory Usage:** Reads prior disaster casualty rates; writes medical resource requests.

##### 5. Shelter Agent
* **Mission:** Manage displacement capacity and population placement logistics.
* **Key Tasks:** Calculate shelter occupancy rates, forecast intake volumes, and flag space shortages.
* **Memory Usage:** Reads historical shelter utilization; writes shelter assignment logs.

##### 6. Logistics Agent
* **Mission:** Coordinate cargo vehicle schedules and delivery paths.
* **Key Tasks:** Track fleet locations, calculate delivery times, and map dispatch plans for medical and food supplies.
* **Memory Usage:** Reads past distribution delays; writes supply transit logs.

##### 7. Communication Agent
* **Mission:** Draft verified public alerts, media briefs, and stakeholder reports.
* **Key Tasks:** Synthesize verified facts from the database into clear, non-alarmist natural language announcements.
* **Memory Usage:** Reads previous communication success rates; writes public media logs.

#### Collaboration & Failure Recovery
* **Collaboration Protocol:** Agents communicate via structured JSON envelopes containing strict schemas:
  ```json
  {
    "task_id": "uuid-v4",
    "agent_id": "logistics_agent_v1",
    "findings": "Road X is impassable; routing supplies via Road Y.",
    "evidence_memory_ids": ["uuid-v4-1", "uuid-v4-2"],
    "confidence_score": 0.94,
    "actions": [{"action_type": "reroute", "parameters": {"route": "Y"}}]
  }
  ```
* **Failure Recovery Flow:** If an agent process crashes (e.g., memory exhaustion or LLM endpoint failure):
  1. The API Service catches the timeout and logs the checkpoint status `Failed`.
  2. The service spins up a fresh agent instance.
  3. The agent queries CockroachDB using its `task_id` to retrieve the saved active parameters, context, and current execution state.
  4. The agent resumes execution, avoiding redundant LLM queries.

### CockroachDB Memory Architecture & Database Implementation Plan

#### Architecture Philosophy & Cognitive Substrate
ReliefGrid is built around a single architectural belief: *intelligence without memory is temporary; intelligence with persistent, shared memory becomes organizational knowledge.* CockroachDB is not merely the database for ReliefGrid; it is the Collective Cognitive Memory Layer. Every AI agent interacts with CockroachDB before, during, and after reasoning. Without CockroachDB, ReliefGrid cannot coordinate, recover, or learn.

```text id="8b9c0d"
                    Collective Memory Engine
                              │
     ┌─────────────┬──────────┴───┬──────────────┐
 Working      Episodic      Semantic       Decision
     │              │               │              │
 Prediction   Reflection     Resource       Timeline
```

#### Memory Classification Model
ReliefGrid models memory as multiple cognitive systems. This prevents memory from becoming an unstructured dump of information:

| Memory Type | Purpose | Lifetime | Vector Indexed |
| --- | --- | --- | --- |
| **Working Memory** | Current active incident context, goals, and assignments | Short | Optional |
| **Episodic Memory** | Complete disaster history episodes | Long | Yes |
| **Semantic Memory** | Learned facts, rules, and best-practice patterns | Permanent | Yes |
| **Task Memory** | Agent execution state, progress tracking | Temp | No |
| **Decision Memory** | Recommended actions, evidence, and approvals | Permanent | Yes |
| **Prediction Memory**| Weather forecasts and asset impact estimations | Medium | Yes |
| **Reflection Memory**| Post-incident analysis of lessons learned | Permanent | Yes |
| **Resource Memory** | Fleet status, warehouse capacities, availability | Dynamic | Optional |
| **Timeline Memory** | Chronological transaction events | Permanent | No |

#### Core Cognitive Memory Systems

##### 1. Working Memory
Tracks the active context of an ongoing incident: active objectives, unresolved questions, temporary calculations, and current agent tasks. Once an incident completes, key events are compiled and promoted to long-term memory, while temporary data is archived.

##### 2. Episodic Memory
Chronicles complete historical disaster episodes (e.g. *2025 flood event at River A*), recording the timeline of events, actions taken, and final outcomes. Agents perform semantic vector similarity queries on episodes to find historical parallels.

##### 3. Semantic Memory
Stores generalized facts that remain true across multiple disasters (e.g. *low-elevation rivers require evacuation alerts 6 hours before prediction peaks*). This enables agents to build a library of rules and best practices.

##### 4. Decision Memory
Logs every recommendation, supporting evidence IDs, confidence scores, and commander approvals. Future agents reference these records to reuse successful strategies and avoid past mistakes.

##### 5. Reflection Memory
Stores the Coordinator Agent's post-incident assessments: *what worked, what failed, which resource bottlenecks occurred, and how prediction confidence matched reality.* This represents the organizational learning layer.

##### 6. Prediction Memory
Persists AI-generated predictions and underlying assumptions, allowing retrospective evaluation against real-world outcomes.

##### 7. Resource Memory
Tracks assets (shelters, ambulances, supplies) alongside their historical effectiveness ratings under different disaster conditions.

##### 8. Memory Relationships
Memories are linked as an interconnected graph, allowing agents to trace how a specific weather prediction led to a logistics decision, resource allocation, and subsequent reflection report.

#### Distributed Vector Indexing Strategy
Long-term memories generate high-dimensional embeddings using Cohere Embed and are indexed directly in CockroachDB using pgvector. When a disaster begins, the system executes semantic search queries to rank previous episodes by similarity, feeding this contextual knowledge back to the LLM.

```text
Incident Created ──> Context Builder ──> pgvector Search ──> Context Payload ──> LLM Reasoning ──> Transactional Commit
```

#### CockroachDB Managed MCP Server
The CockroachDB Managed Model Context Protocol (MCP) Server acts as the secure interface between the AI tooling and the database:
* **Engineering Productivity:** During local development, engineers inspect tables, check vector distance calculations, and verify schema migrations directly through LLM tool commands.
* **AI-Assisted Operations:** Exposes database diagnostics and schema definitions to administrative tools, facilitating automated query optimizations.

#### Transaction Strategy & Serializable Isolation
Disaster response requires zero tolerance for race conditions (e.g. two separate agents dispatching the same helicopter convoy). ReliefGrid utilizes CockroachDB’s distributed serializable isolation level to guarantee transactional integrity. If conflicting writes occur during resource allocation, the transaction aborts and retries automatically, ensuring state consistency across the entire collective memory layer.

## Phase 12 — Complete Database Design & CockroachDB Cognitive Memory Architecture

> **Designing the Distributed Cognitive Backbone of ReliefGrid**

---

### 12.1 Objective

This phase defines the complete data architecture that powers ReliefGrid.

Unlike traditional disaster management systems, CockroachDB is not used merely for persistence.

It functions as the platform's **Collective Cognitive Memory**, providing durable knowledge, semantic reasoning, transactional consistency, and shared intelligence for autonomous AI agents.

The schema is designed to support:

* Multi-agent collaboration
* Persistent organizational memory
* Semantic retrieval
* Distributed transactions
* Explainable AI
* Long-term learning
* Fault-tolerant coordination

Every database object contributes directly to the platform's cognitive architecture.

---

### 12.2 Database Design Philosophy

The database is treated as an active participant in the system rather than passive storage.

The architecture follows six principles.

#### Memory Before Storage

Every record represents knowledge with operational value.

The database stores experiences, reasoning, relationships, and decisions—not just application data.

---

#### Shared Intelligence

All AI agents interact through the same persistent memory layer.

Knowledge survives individual agent failures and becomes immediately available to all future agents.

---

#### Strong Consistency

Operational decisions require globally consistent state.

CockroachDB's serializable transactions ensure that concurrent agent operations never produce conflicting memory or incident states.

---

#### Semantic Retrieval

Information is retrieved based on meaning rather than exact matching.

Vector embeddings enable agents to recall historically relevant experiences even when terminology differs.

---

#### Traceability

Every memory, decision, recommendation, and action maintains lineage to its originating evidence.

This supports explainability, auditing, and trust.

---

#### Evolvability

Knowledge evolves over time.

Memories can be validated, refined, superseded, linked, or archived without losing historical context.

---

### 12.3 High-Level Database Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                 CockroachDB Distributed Cluster              │
├──────────────────────────────────────────────────────────────┤
│ Incident Domain                                              │
├──────────────────────────────────────────────────────────────┤
│ Collective Memory Domain                                     │
├──────────────────────────────────────────────────────────────┤
│ Agent Coordination Domain                                    │
├──────────────────────────────────────────────────────────────┤
│ Resource Domain                                               │
├──────────────────────────────────────────────────────────────┤
│ Analytics Domain                                               │
├──────────────────────────────────────────────────────────────┤
│ Identity & Security Domain                                    │
├──────────────────────────────────────────────────────────────┤
│ Audit & Compliance Domain                                     │
└──────────────────────────────────────────────────────────────┘
```

Each domain encapsulates a cohesive business capability while remaining connected through well-defined relationships.

---

### 12.4 Domain-Driven Schema Organization

The schema is partitioned into logical domains rather than a single flat collection of tables.

#### Incident Domain

Stores operational disaster information.

Representative entities:

* Incidents
* Incident Timeline
* Locations
* Risk Assessments
* Operational Decisions

---

#### Collective Memory Domain

Stores persistent organizational knowledge.

Representative entities:

* Working Memories
* Episodic Memories
* Semantic Memories
* Decision Memories
* Reflection Memories
* Prediction Memories
* Lessons Learned
* Memory Relationships
* Embeddings

This is the largest and most strategically important domain.

---

#### Agent Domain

Stores autonomous agent state.

Representative entities:

* Agents
* Tasks
* Coordination Sessions
* Consensus Results
* Recovery History
* Agent Metrics

---

#### Resource Domain

Stores operational assets.

Representative entities:

* Shelters
* Medical Facilities
* Vehicles
* Personnel
* Supply Inventory
* Allocation History

---

#### Analytics Domain

Stores derived operational intelligence.

Representative entities:

* KPIs
* Trend Snapshots
* Executive Insights
* Forecast Results

---

#### Identity Domain

Stores authentication and authorization data.

Representative entities:

* Users
* Roles
* Organizations
* Permissions
* Sessions

---

#### Audit Domain

Stores immutable governance records.

Representative entities:

* Audit Logs
* Configuration History
* Administrative Actions
* AI Decision Audit

---

### 12.5 Entity Relationship Philosophy

Relationships model knowledge rather than only transactional data.

Examples include:

* Incident → Generated Memory
* Memory → Supports Recommendation
* Agent → Produced Decision
* Decision → References Memory
* Memory → Similar Memory
* Reflection → Derived From Incident
* Lesson Learned → Applied To Incident
* Recommendation → Approved By User

These relationships allow the system to reconstruct reasoning paths across time.

---

### 12.6 Universal Entity Standards

Every persistent entity should implement a consistent metadata model.

Standard fields include:

* Unique Identifier
* Organization Identifier
* Created Timestamp
* Updated Timestamp
* Created By
* Updated By
* Version Number
* Status
* Confidence Score (where applicable)
* Source System
* Correlation Identifier

This consistency simplifies auditing, synchronization, and future schema evolution.

---

### 12.7 Identifier Strategy

All primary entities use globally unique identifiers to support distributed operation.

Characteristics:

* Globally unique.
* Non-sequential to avoid hotspotting.
* Stable for the lifetime of the entity.
* Safe for cross-region replication.

Relationship tables reference these identifiers through foreign key constraints to preserve referential integrity.

---

### 12.8 Temporal Modeling

ReliefGrid treats time as a first-class dimension.

Each major entity records:

* Creation Time
* Last Modification Time
* Effective Time
* Expiration Time (if applicable)
* Validation Time
* Archival Time

Temporal data enables:

* Incident replay
* Memory evolution
* Historical analytics
* Time-based reasoning
* Operational auditing

---

### 12.9 Schema Governance

Schema changes are controlled through versioned migrations.

Every migration must:

* Be backward compatible where possible.
* Preserve historical knowledge.
* Include rollback procedures.
* Maintain referential integrity.
* Avoid breaking active agent workflows.

This approach supports continuous evolution without compromising operational stability.

---

### 12.10 Why This Phase Matters

CockroachDB is the defining technology of ReliefGrid.

This phase establishes it as the platform's cognitive substrate rather than a conventional relational database.

By organizing data around persistent knowledge, semantic relationships, and distributed consistency, the schema enables autonomous agents to coordinate through shared experience instead of isolated execution.

For hackathon judges, this section demonstrates that ReliefGrid has been architected around **persistent collective memory**, directly aligning with the competition's emphasis on agentic memory, transactional integrity, and production-ready distributed systems.


---

## Part 2 — Core Operational Entity Specifications

> **Defining the Foundational Data Model for ReliefGrid**

---

### 12.11 Database Entity Design Standards

Every database entity within ReliefGrid must follow a common design methodology.

Each entity specification includes:

* Purpose
* Business Owner
* Primary Responsibilities
* Lifecycle
* Core Attributes
* Relationships
* Indexing Strategy
* Transaction Rules
* Agent Access Patterns
* Memory Integration
* Security Considerations
* Retention Policy

This standardized format ensures consistency across the entire schema.

---

### 12.12 Entity — Organization

#### Purpose

Represents the highest logical tenant within ReliefGrid.

Organizations isolate users, incidents, memories, AI activities, and operational policies while enabling secure multi-tenant deployments.

---

#### Business Owner

Platform Administration

---

#### Responsibilities

* Organizational identity
* Regional configuration
* Default operational settings
* AI policies
* Memory governance
* User ownership

---

#### Core Attributes

* Organization ID
* Name
* Description
* Country
* Operational Regions
* Contact Information
* Subscription Tier
* Status
* Created Timestamp
* Updated Timestamp

---

#### Relationships

One Organization owns:

* Users
* Incidents
* Memories
* Resources
* AI Agents
* Reports
* Analytics

---

#### Index Strategy

Primary lookup:

* Organization ID

Secondary indexes:

* Organization Name
* Status

---

#### Agent Access

Read-only for all operational agents.

Administrative updates require privileged access.

---

#### Retention

Permanent.

Organizations are never physically deleted.

---

### 12.13 Entity — User

#### Purpose

Represents authenticated platform users.

---

#### Business Owner

Identity Service

---

#### Responsibilities

* Authentication
* Authorization
* Audit ownership
* Incident participation
* Approval workflows

---

#### Core Attributes

* User ID
* Organization ID
* Name
* Email
* Role
* Assigned Region
* MFA Status
* Last Login
* Account Status

---

#### Relationships

User may own:

* Incidents
* Recommendations
* Reports
* Approvals
* Audit Entries

---

#### Security

Personally identifiable information is encrypted at rest and protected by role-based access controls.

---

#### Retention

Soft delete with retained audit history.

---

### 12.14 Entity — Incident

#### Purpose

Represents an emergency event managed by ReliefGrid.

This is the central operational entity around which agent collaboration and memory creation occur.

---

#### Business Owner

Incident Service

---

#### Responsibilities

* Incident lifecycle
* Severity management
* Geographic context
* Operational coordination
* Resource linkage

---

#### Core Attributes

* Incident ID
* Organization ID
* Title
* Description
* Disaster Type
* Severity
* Status
* Latitude
* Longitude
* Region
* Created By
* Created At
* Updated At
* Closed At

---

#### Relationships

One Incident owns:

* Timeline Events
* Agent Tasks
* Memories
* Recommendations
* Resources
* Reports

---

#### Index Strategy

Indexes:

* Status
* Severity
* Disaster Type
* Created Timestamp
* Geographic Region

Composite indexes:

* Status + Severity
* Region + Disaster Type

---

#### Transactions

Incident creation includes:

* Incident record
* Initial timeline entry
* Working memory initialization
* Coordinator activation

These operations execute atomically.

---

#### Agent Access

Readable by all specialist agents.

Modification restricted to Coordinator workflows and authorized users.

---

#### Retention

Permanent historical record.

---

### 12.15 Entity — Incident Timeline

#### Purpose

Provides an immutable chronological history of every significant incident event.

---

#### Responsibilities

* Record operational milestones.
* Track decisions.
* Support replay.
* Enable auditing.

---

#### Core Attributes

* Timeline ID
* Incident ID
* Event Type
* Event Source
* Description
* Timestamp
* Related Memory
* Related Agent

---

#### Relationships

Belongs to exactly one Incident.

May reference:

* Memory
* Recommendation
* Agent
* Resource

---

#### Indexes

* Incident ID
* Timestamp
* Event Type

---

#### Retention

Never deleted.

---

### 12.16 Entity — AI Agent

#### Purpose

Represents an autonomous specialist participating in disaster response.

---

#### Business Owner

Agent Service

---

#### Core Attributes

* Agent ID
* Agent Type
* Status
* Health
* Version
* Current Task
* Last Heartbeat
* Total Tasks Completed
* Average Confidence

---

#### Relationships

One Agent produces:

* Recommendations
* Memories
* Reflections
* Tasks
* Metrics

---

#### Index Strategy

Indexes:

* Status
* Agent Type
* Health

---

#### Transactions

Health updates execute independently to minimize contention.

---

### 12.17 Entity — Agent Task

#### Purpose

Represents an individual unit of work assigned to an AI agent.

---

#### Core Attributes

* Task ID
* Incident ID
* Assigned Agent
* Priority
* Status
* Created Time
* Started Time
* Completed Time
* Retry Count

---

#### Relationships

Belongs to:

* Incident
* Agent

Produces:

* Recommendations
* Memory updates

---

#### Indexes

* Assigned Agent
* Status
* Priority

---

#### Lifecycle

Created

↓

Queued

↓

Assigned

↓

Executing

↓

Completed

↓

Archived

---

### 12.18 Entity — Recommendation

#### Purpose

Represents an actionable recommendation synthesized by the Coordinator Agent from specialist analyses.

---

#### Core Attributes

* Recommendation ID
* Incident ID
* Summary
* Detailed Explanation
* Confidence Score
* Approval Status
* Generated Timestamp

---

#### Relationships

References:

* Supporting Memories
* Contributing Agents
* Resources
* Incident

---

#### Agent Access

Generated by Coordinator.

Consumed by users and analytics.

---

#### Indexes

* Incident
* Confidence
* Approval Status

---

### 12.19 Entity — Resource

#### Purpose

Represents deployable operational assets.

---

#### Categories

* Shelter
* Medical
* Logistics
* Personnel
* Vehicle
* Equipment

---

#### Attributes

* Resource ID
* Category
* Name
* Capacity
* Availability
* Region
* Current Assignment

---

#### Relationships

Resources may be linked to:

* Incidents
* Recommendations
* Timeline Events

---

#### Indexes

* Category
* Region
* Availability

---

### 12.20 Entity — Audit Log

#### Purpose

Maintains immutable governance records.

---

#### Attributes

* Audit ID
* User
* Action
* Entity
* Previous State
* New State
* Timestamp
* Result

---

#### Characteristics

Append-only.

Never updated.

Never deleted.

Supports compliance and forensic analysis.

---

### 12.21 Entity Relationship Overview

```text
Organization
      │
      ▼
Users
      │
      ▼
Incidents
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
Tasks Memories Recommendations
 │      │             │
 ▼      ▼             ▼
Agents Relationships Resources
 │
 ▼
Analytics
 │
 ▼
Reports
 │
 ▼
Audit Logs
```

This hierarchy illustrates ownership and interaction pathways across the core operational domain.

---

### 12.22 Why This Section Matters

These foundational entities define the operational backbone of ReliefGrid. By explicitly documenting ownership, relationships, transaction boundaries, indexing, and lifecycle rules, the specification minimizes ambiguity for implementation while preserving architectural integrity.

For Antigravity, these entity definitions provide a clear mapping from business concepts to database structures. For hackathon judges, they demonstrate that ReliefGrid's data model has been engineered with the rigor expected of a production-grade, distributed emergency intelligence platform.


---

## Part 3 — Collective Memory Schema

> **Designing Persistent Organizational Intelligence for Autonomous AI Agents**

---

### 12.23 Collective Memory Philosophy

ReliefGrid's Collective Memory is inspired by human cognitive architecture.

Unlike conventional applications that persist only transactional data, ReliefGrid stores experiences, reasoning processes, operational knowledge, predictions, and lessons learned as first-class entities.

Every autonomous agent contributes to and learns from a continuously evolving organizational memory.

The Collective Memory enables:

* Knowledge persistence across sessions.
* Shared understanding between AI agents.
* Semantic retrieval of prior experiences.
* Explainable recommendations.
* Organizational learning.
* Continuous improvement of disaster response.

This transforms CockroachDB into a distributed cognitive substrate rather than a passive database.

---

### 12.24 Memory Classification Model

The Collective Memory is organized into specialized memory domains, each reflecting a distinct aspect of cognition.

| Memory Type          | Purpose                          | Retention    |
| -------------------- | -------------------------------- | ------------ |
| Working Memory       | Active reasoning context         | Short-term   |
| Episodic Memory      | Historical incidents             | Permanent    |
| Semantic Memory      | Generalized knowledge            | Permanent    |
| Decision Memory      | Decision rationale               | Permanent    |
| Reflection Memory    | AI self-evaluation               | Permanent    |
| Prediction Memory    | Forecasts and projections        | Time-bounded |
| Resource Memory      | Operational resource knowledge   | Dynamic      |
| Lesson Memory        | Validated best practices         | Permanent    |
| Communication Memory | Message history and coordination | Configurable |

Each memory type has unique semantics, lifecycle rules, and retrieval strategies.

---

### 12.25 Working Memory

#### Purpose

Working Memory represents the active cognitive workspace used during ongoing incident response.

It stores transient context that enables agents to coordinate effectively while an incident is in progress.

---

#### Responsibilities

* Maintain current operational context.
* Share intermediate reasoning.
* Track active hypotheses.
* Store temporary observations.
* Coordinate agent collaboration.

---

#### Core Attributes

* Working Memory ID
* Incident ID
* Agent ID
* Context Summary
* Active Objectives
* Current Hypotheses
* Pending Questions
* Confidence
* Expiration Timestamp

---

#### Lifecycle

Created when an incident begins.

Continuously updated during response.

Promoted to longer-term memory if validated.

Expired once no longer operationally relevant.

---

#### Agent Interaction

Read and write access is available to all participating agents under orchestration rules.

---

### 12.26 Episodic Memory

#### Purpose

Stores complete historical experiences from past incidents.

Episodic Memory answers the question:

> "What happened before?"

---

#### Responsibilities

* Preserve operational history.
* Record complete disaster narratives.
* Enable incident replay.
* Support historical comparison.

---

#### Core Attributes

* Episode ID
* Incident Reference
* Event Timeline
* Final Outcome
* Participants
* Geographic Context
* Severity
* Duration
* Lessons Extracted

---

#### Retrieval Strategy

Episodes are retrieved using:

* Semantic similarity.
* Geographic proximity.
* Disaster type.
* Resource usage.
* Temporal relevance.

---

#### Retention

Permanent.

Historical experiences are never discarded.

---

### 12.27 Semantic Memory

#### Purpose

Semantic Memory stores generalized knowledge extracted from many incidents.

Unlike Episodic Memory, it does not preserve individual events.

Instead, it captures enduring concepts and relationships.

---

Examples include:

* Floods above a certain water level often isolate low-lying communities.
* Hospitals require priority power restoration.
* Early evacuation reduces casualty rates.

---

#### Core Attributes

* Concept ID
* Concept Description
* Supporting Evidence
* Confidence
* Related Concepts
* Source Episodes
* Validation Status

---

#### Knowledge Evolution

Semantic memories strengthen as additional supporting evidence accumulates.

Contradictory evidence reduces confidence and may trigger re-evaluation.

---

### 12.28 Decision Memory

#### Purpose

Decision Memory preserves the reasoning behind operational choices.

It answers:

> "Why did we choose this action?"

---

#### Core Attributes

* Decision ID
* Incident ID
* Recommendation
* Approved Action
* Decision Maker
* Supporting Memories
* Risk Assessment
* Confidence
* Outcome

---

#### Importance

Decision Memory enables explainable AI by preserving reasoning paths long after an incident concludes.

---

### 12.29 Reflection Memory

#### Purpose

Reflection Memory captures self-evaluation performed by AI agents after completing tasks.

It answers:

> "What should we improve next time?"

---

#### Generated By

Reflection Engine.

---

#### Contents

* Successful strategies.
* Failed assumptions.
* Missed opportunities.
* Suggested improvements.
* Confidence recalibration.

---

#### Usage

Future agent reasoning incorporates validated reflections to improve decision quality over time.

---

### 12.30 Prediction Memory

#### Purpose

Stores forecasts generated during incident analysis.

Examples include:

* Flood expansion estimates.
* Infrastructure failure predictions.
* Shelter capacity forecasts.
* Resource depletion timelines.

---

#### Core Attributes

* Prediction ID
* Incident
* Forecast Type
* Predicted Outcome
* Probability
* Prediction Horizon
* Validation Status

---

#### Lifecycle

Predictions remain active until verified, invalidated, or expired.

Verified predictions may influence Semantic Memory.

---

### 12.31 Resource Memory

#### Purpose

Captures knowledge regarding resource availability, deployment history, and operational effectiveness.

Examples include:

* Shelter occupancy trends.
* Vehicle deployment efficiency.
* Medical supply consumption rates.
* Personnel utilization patterns.

---

#### Value

Resource Memory improves allocation strategies during future incidents.

---

### 12.32 Lesson Memory

#### Purpose

Stores validated organizational best practices derived from multiple incidents.

Unlike reflections, lessons represent approved institutional knowledge.

---

#### Contents

* Best practices.
* Standard operating procedures.
* Proven response strategies.
* Recurring operational risks.
* Effective coordination patterns.

---

#### Governance

Lessons are promoted only after validation by authorized personnel or repeated confirmation across incidents.

---

### 12.33 Communication Memory

#### Purpose

Preserves significant operational communications exchanged between users and AI agents.

---

#### Examples

* Command decisions.
* Situation reports.
* Emergency broadcasts.
* Agent coordination summaries.
* Executive approvals.

---

#### Importance

Provides historical context for audits and future incident analysis.

---

### 12.34 Memory Relationships

Memories are interconnected rather than isolated.

Supported relationship types include:

* Supports
* Contradicts
* Derived From
* Similar To
* Supersedes
* References
* Depends On
* Validates
* Refines

These relationships enable knowledge graph traversal and explainable reasoning.

---

### 12.35 Memory Lifecycle

Every memory follows a controlled progression:

```text
Observation
      │
      ▼
Working Memory
      │
      ▼
Validation
      │
      ▼
Promotion
      │
      ▼
Persistent Memory
      │
      ▼
Semantic Linking
      │
      ▼
Reflection
      │
      ▼
Future Retrieval
```

This lifecycle ensures that only validated knowledge becomes part of the organization's long-term intelligence.

---

### 12.36 Memory Governance

Memory integrity is maintained through governance policies.

Key rules include:

* Confidence thresholds for promotion.
* Version tracking for updates.
* Immutable historical revisions.
* Role-based approval for institutional lessons.
* Automated archival of obsolete working memories.
* Continuous consistency checks.

Governance balances adaptability with reliability.

---

### 12.37 Why This Section Matters

The Collective Memory Schema is the defining innovation of ReliefGrid. Rather than treating AI outputs as disposable, the platform captures experiences, reasoning, and validated knowledge as durable organizational assets.

By modeling cognition explicitly—through working, episodic, semantic, decision, reflection, prediction, resource, lesson, and communication memories—ReliefGrid enables autonomous agents to collaborate through shared experience, continuously improve over time, and provide transparent, evidence-backed recommendations.

For Antigravity, this section establishes the conceptual and structural foundation for implementing a sophisticated memory engine. For hackathon judges, it demonstrates a deep understanding of **agentic memory**, positioning CockroachDB as the persistent cognitive backbone that differentiates ReliefGrid from traditional AI-powered disaster response systems.


---

## Part 4 — Vector Embeddings, Semantic Retrieval, Knowledge Graph & Indexing Strategy

> **Designing the Retrieval Layer That Powers Collective Intelligence**

---

### 12.38 Objective

The Collective Memory Engine depends on efficient retrieval rather than storage alone.

This phase defines how ReliefGrid transforms stored knowledge into actionable intelligence through:

* Vector embeddings.
* Semantic similarity search.
* Hybrid retrieval.
* Knowledge graph traversal.
* Context assembly.
* Memory ranking.
* Explainable evidence selection.

The objective is to enable every AI agent to retrieve the most relevant historical knowledge before generating recommendations.

---

### 12.39 Retrieval Philosophy

ReliefGrid adopts a retrieval-first reasoning model.

Instead of relying solely on foundation model parameters, every agent begins its reasoning process by consulting the Collective Memory.

The retrieval pipeline answers questions such as:

* Has a similar incident occurred before?
* Which response strategies were effective?
* What lessons apply to the current situation?
* Which resources proved most effective?
* What decisions led to successful outcomes?
* Which predictions were accurate?

The retrieved context forms the evidence base for all downstream reasoning.

---

### 12.40 Embedding Generation Pipeline

Every memory eligible for semantic retrieval is converted into a dense vector representation.

Sources include:

* Incident summaries.
* Timeline events.
* Decision rationales.
* Reflection reports.
* Lessons learned.
* Resource observations.
* Communication summaries.
* AI recommendations.

Embedding generation occurs asynchronously to avoid delaying operational workflows.

Pipeline:

```text
Memory Created
      │
      ▼
Content Normalization
      │
      ▼
Embedding Generation (Amazon Bedrock)
      │
      ▼
Vector Validation
      │
      ▼
Store Vector in CockroachDB
      │
      ▼
Update Search Index
      │
      ▼
Publish MemoryIndexed Event
```

This ensures that new knowledge becomes searchable shortly after creation.

---

### 12.41 Vector Storage Model

Each searchable memory stores:

* Memory ID
* Memory Type
* Embedding Vector
* Embedding Model Version
* Embedding Timestamp
* Source Language
* Confidence Score
* Organization ID

Vectors are versioned to support future embedding model upgrades without losing historical compatibility.

---

### 12.42 Similarity Search

Semantic retrieval is based on vector similarity.

Rather than matching keywords, the system identifies memories with similar meaning.

Typical workflow:

1. User submits a query or an agent formulates a retrieval request.
2. The query is embedded using the same embedding model.
3. CockroachDB performs nearest-neighbor search.
4. Candidate memories are ranked by similarity.
5. Business rules refine the results.
6. Relevant memories are returned to the requesting agent.

This enables retrieval even when different terminology is used.

---

### 12.43 Hybrid Retrieval

Vector similarity alone is insufficient for operational systems.

ReliefGrid combines multiple retrieval techniques into a hybrid pipeline.

Signals include:

* Semantic similarity.
* Keyword relevance.
* Geographic proximity.
* Disaster type.
* Incident severity.
* Temporal relevance.
* Organizational context.
* Confidence score.
* Validation status.

Hybrid retrieval balances semantic flexibility with operational precision.

---

### 12.44 Knowledge Graph Architecture

Beyond vectors, memories are connected through explicit relationships.

Nodes include:

* Incidents
* Memories
* Agents
* Decisions
* Resources
* Recommendations
* Lessons
* Predictions

Edges represent relationships such as:

* Supports
* Derived From
* Similar To
* Assigned To
* Depends On
* Validated By
* Influenced
* Produced

This graph allows agents to navigate chains of reasoning rather than isolated records.

---

### 12.45 Graph Traversal Strategy

Graph traversal supplements semantic retrieval by expanding context.

Example workflow:

```text
Incident
      │
      ▼
Decision Memory
      │
      ▼
Supporting Lesson
      │
      ▼
Related Reflection
      │
      ▼
Resource Allocation
      │
      ▼
Historical Outcome
```

Agents can explore connected evidence to build richer situational understanding.

---

### 12.46 Memory Ranking Algorithm

Retrieved memories are ranked using a composite relevance score.

Factors include:

| Signal                 | Purpose                  |
| ---------------------- | ------------------------ |
| Semantic Similarity    | Conceptual relevance     |
| Confidence Score       | Reliability              |
| Recency                | Freshness                |
| Validation Status      | Trustworthiness          |
| Organizational Context | Tenant relevance         |
| Geographic Similarity  | Regional applicability   |
| Disaster Type Match    | Domain relevance         |
| Outcome Quality        | Historical effectiveness |

The ranking algorithm prioritizes high-quality, contextually relevant knowledge.

---

### 12.47 Context Assembly

Retrieved memories are assembled into a coherent reasoning context before being supplied to AI agents.

Context assembly includes:

* Incident summary.
* Relevant episodic memories.
* Applicable semantic concepts.
* Decision history.
* Lessons learned.
* Resource observations.
* Predictions.
* Recent reflections.

This curated context reduces noise and improves AI reasoning quality.

---

### 12.48 Explainable Retrieval

Every recommendation generated by ReliefGrid should include traceable evidence.

Each recommendation records:

* Supporting memories.
* Similarity scores.
* Source incidents.
* Confidence values.
* Contributing agents.
* Knowledge graph paths.

Users should always be able to inspect why a recommendation was produced.

---

### 12.49 Embedding Model Versioning

Embedding models evolve over time.

To prevent inconsistency:

* Every vector records its originating model version.
* Multiple versions may coexist during migration.
* Re-indexing occurs asynchronously.
* Queries are matched against compatible embeddings.

This strategy enables continuous improvement without disrupting retrieval.

---

### 12.50 Indexing Strategy

Efficient retrieval depends on carefully designed indexes.

The platform maintains:

* Primary indexes for entity lookups.
* Secondary indexes for filtering.
* Composite indexes for operational queries.
* Vector indexes for semantic search.
* Full-text indexes for keyword search.
* Temporal indexes for timeline operations.

Index maintenance is performed incrementally to minimize operational impact.

---

### 12.51 Retrieval Performance Targets

The Collective Memory Engine should satisfy the following targets:

| Operation                 | Target   |
| ------------------------- | -------- |
| Primary Key Lookup        | < 10 ms  |
| Filtered Query            | < 50 ms  |
| Semantic Search           | < 150 ms |
| Hybrid Retrieval          | < 250 ms |
| Knowledge Graph Traversal | < 300 ms |
| Context Assembly          | < 400 ms |

These objectives support real-time decision-making during emergency response.

---

### 12.52 Retrieval Security

Memory retrieval is governed by strict access controls.

Rules include:

* Organization isolation.
* Role-based filtering.
* Sensitive memory classification.
* Audit logging for retrieval operations.
* Attribute-level security for confidential fields.

Agents retrieve only the knowledge necessary for their assigned tasks.

---

### 12.53 Retrieval Lifecycle

```text
Query
   │
   ▼
Embedding Generation
   │
   ▼
Vector Search
   │
   ▼
Keyword Search
   │
   ▼
Graph Expansion
   │
   ▼
Business Rule Filtering
   │
   ▼
Ranking
   │
   ▼
Context Assembly
   │
   ▼
Agent Reasoning
   │
   ▼
Recommendation
```

This multi-stage pipeline ensures that recommendations are grounded in relevant, validated, and explainable evidence.

---

### 12.54 Why This Section Matters

The Vector Embeddings, Semantic Retrieval, Knowledge Graph, and Indexing Strategy form the operational heart of ReliefGrid's Collective Memory Engine. Rather than relying solely on static model knowledge, every AI agent actively retrieves organizational experience, relationships, and validated lessons before reasoning.

By combining semantic search, graph traversal, hybrid ranking, and explainable evidence selection, ReliefGrid enables persistent, context-aware intelligence that improves with every incident. CockroachDB serves not only as durable storage but as the distributed retrieval engine that makes organizational memory practical at scale.

For Antigravity, this chapter provides the implementation blueprint for the retrieval subsystem. For hackathon judges, it demonstrates a sophisticated understanding of retrieval-augmented generation (RAG), agentic memory, and distributed knowledge management—showcasing how CockroachDB's vector capabilities can underpin a production-grade cognitive platform.


---

## Part 5 — Complete Entity-by-Entity Schema Design

---

### Collective Memory Schema

#### Philosophy & Cognitive Design
The Collective Memory Schema is the core of the ReliefGrid database. Instead of treating database rows as static text fields, ReliefGrid models memory as first-class, versioned objects containing rich metadata, semantic links, and confidence metrics.

The schema answers crucial trace questions:
* *What did we learn from similar historical emergencies?*
* *Why did the coordinator agent suggest this specific evacuation path?*
* *Which specialized recommendations succeeded, and which failed?*
* *How did the system's prediction confidence change over the course of the incident?*

```text
Collective Memory Subsystem Domain
├── memories
├── memory_types
├── memory_embeddings
├── memory_relationships
├── memory_versions
├── memory_sources
├── memory_tags
├── memory_access_logs
├── memory_feedback
└── memory_archives
```

#### Schema Specifications & DDL Scripts

##### 1. memories Table
Stores the canonical metadata and content for every structured cognitive record.
```sql
CREATE TABLE memories (
    memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_type_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    detailed_content TEXT NOT NULL,
    incident_id UUID, -- NULL for generalized global semantic memories
    agent_id UUID,    -- Source agent ID (NULL if user created)
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    importance_score INT NOT NULL CHECK (importance_score BETWEEN 0 AND 100),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. memory_types Table
Enables dynamic categorization of memory (e.g. Working, Episodic, Semantic, Decision).
```sql
CREATE TABLE memory_types (
    memory_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    is_vector_indexed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. memory_embeddings Table
Hosts pgvector arrays for similarity ranking.
```sql
CREATE TABLE memory_embeddings (
    embedding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    embedding_vector VECTOR(1536) NOT NULL, -- Matched to Cohere / Bedrock vector outputs
    embedding_model VARCHAR(150) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. memory_relationships Table
Models the cognitive graph links connecting distinct memories.
```sql
CREATE TABLE memory_relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL CHECK (relationship_type IN (
        'derives_from', 'supports', 'contradicts', 'supersedes', 'references', 'caused_by', 'influenced_by'
    )),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT unique_memory_relationship UNIQUE (source_memory_id, target_memory_id, relationship_type)
);
```

##### 5. memory_versions Table
Preserves the audit history of edits, updates, and corrections.
```sql
CREATE TABLE memory_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    previous_content TEXT NOT NULL,
    revision_reason TEXT NOT NULL,
    edited_by_user_id UUID,
    edited_by_agent_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 6. memory_sources Table
Tracks data provenance (e.g. Weather API response, local gauges).
```sql
CREATE TABLE memory_sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    source_type VARCHAR(100) NOT NULL CHECK (source_type IN ('agent', 'user', 'external_api', 'sensor_payload', 'manual_import')),
    source_name VARCHAR(150) NOT NULL,
    api_endpoint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 7. memory_tags Table
Provides traditional index mapping for rapid operational lookups.
```sql
CREATE TABLE memory_tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT unique_memory_tag UNIQUE (memory_id, tag_name)
);
```

##### 8. memory_access_logs Table
Audit trails documenting which agent or user retrieved which memory.
```sql
CREATE TABLE memory_access_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    accessed_by_user_id UUID,
    accessed_by_agent_id UUID,
    purpose VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 9. memory_feedback Table
Records human feedback metrics (e.g., feedback on accuracy or relevance).
```sql
CREATE TABLE memory_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    rating VARCHAR(50) NOT NULL CHECK (rating IN ('helpful', 'outdated', 'inaccurate', 'incomplete')),
    comments TEXT,
    created_by_user_id UUID,
    created_by_agent_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 10. memory_archives Table
Moves outdated or low-importance memories out of active context search spaces.
```sql
CREATE TABLE memory_archives (
    archive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE CASCADE,
    archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    reason TEXT NOT NULL
);
```

#### Memory Lifecycle Transitions
```text
[Created] ──> [Validated] ──> [Embedded] ──> [Linked] ──> [Referenced] ──> [Refined] ──> [Archived]
```
* **Created:** Raw memories are written to the `memories` table by an agent session.
* **Validated:** Safety and data-completeness validation metrics are verified.
* **Embedded:** The system computes the vector embedding and commits it to `memory_embeddings`.
* **Linked:** Relational mapping triggers inserts into `memory_relationships` to establish cognitive graph hooks.
* **Referenced:** The memory is selected during incident searches, updating the `memory_access_logs`.
* **Refined:** Human validation or model corrections trigger entries in `memory_versions`.
* **Archived:** Aging memories trigger writes to `memory_archives` and have their status updated to prevent default vector matches.

#### Memory Retrieval Workflow
1. **Intake parameters:** Get `incident_id`, active query text, and geographical boundaries.
2. **Metadata filter:** Query `memories` joined with `memory_tags` to limit retrieval scope (e.g. only matching the tags "Flood" and "District A").
3. **Similarity query:** Compute distance calculations on `memory_embeddings` using pgvector cosine distance:
   ```sql
   SELECT memory_id, (embedding_vector <=> ?::VECTOR) AS distance FROM memory_embeddings ORDER BY distance LIMIT 5;
   ```
4. **Relationship search:** Query `memory_relationships` to expand the context (fetch derived or superseding memories linked to the selected IDs).
5. **Score & format:** Sort by confidence and format the resulting payload into the LLM system prompt context package.

### Incident Intelligence Schema

#### Philosophy & Cognitive Context
In ReliefGrid, an incident is not a passive database record. It is an **active operational context** that binds together agents, human commanders, tasks, resources, decisions, and outcomes. 

Every reasoning cycle executed by Bedrock requires the incident's state variables as the grounding source. The schema is designed to model the event workflow chronologically, preserving an immutable ledger of predictions, situation reports, and chronological timeline events to drive organizational learning.

```text
Incident Intelligence Domain
├── incidents
├── incident_timeline
├── situation_reports
├── incident_predictions
└── incident_snapshots
```

#### Schema Specifications & DDL Scripts

##### 1. incidents Table
Stores the root operational properties, location coordinate markers, and risk evaluation results.
```sql
CREATE TABLE incidents (
    incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'INC-2026-FLOOD-001'
    title VARCHAR(255) NOT NULL,
    disaster_type VARCHAR(100) NOT NULL CHECK (disaster_type IN (
        'flood', 'wildfire', 'earthquake', 'landslide', 'storm', 'hurricane', 'drought', 'disease_outbreak', 'industrial_accident', 'civil_emergency'
    )),
    severity_level VARCHAR(50) NOT NULL DEFAULT 'low' CHECK (severity_level IN (
        'informational', 'low', 'moderate', 'high', 'critical', 'catastrophic'
    )),
    status VARCHAR(50) NOT NULL DEFAULT 'detected' CHECK (status IN (
        'detected', 'validated', 'assessment', 'active_response', 'stabilization', 'recovery', 'closed'
    )),
    region VARCHAR(150) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90.0 AND 90.0),
    longitude NUMERIC(10, 6) NOT NULL CHECK (longitude BETWEEN -180.0 AND 180.0),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    end_time TIMESTAMP WITH TIME ZONE,
    lead_coordinator_id UUID, -- References users table
    confidence_score INT NOT NULL DEFAULT 100 CHECK (confidence_score BETWEEN 0 AND 100),
    risk_score INT NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. incident_timeline Table
Maintains an immutable chronological record of every event generated during response coordination.
```sql
CREATE TABLE incident_timeline (
    timeline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL CHECK (event_type IN (
        'incident_detected', 'agent_activated', 'telemetry_alert', 'prediction_generated',
        'decision_proposed', 'decision_approved', 'resource_dispatched', 'task_completed',
        'sitrep_published', 'incident_stabilized', 'incident_closed'
    )),
    originator VARCHAR(150) NOT NULL, -- e.g. 'coordinator_agent_v1' or 'user_uuid'
    related_entity_type VARCHAR(100), -- e.g. 'memories', 'tasks', 'decisions'
    related_entity_id UUID,          -- Reference UUID to matching table
    summary VARCHAR(255) NOT NULL,
    evidence_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. situation_reports Table (SITREPs)
Captures granular tactical summaries describing active constraints and priority objectives.
```sql
CREATE TABLE situation_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    author_user_id UUID,           -- Set if human commander drafted report
    author_agent_id UUID,          -- Set if synthesized by Communication Agent
    current_conditions TEXT NOT NULL,
    key_risks TEXT NOT NULL,
    resource_status TEXT NOT NULL,
    priorities TEXT NOT NULL,
    actions_taken TEXT NOT NULL,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. incident_predictions Table
Stores AI predictions. These are compared later with telemetry outcomes to calculate performance.
```sql
CREATE TABLE incident_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    agent_id UUID NOT NULL,        -- Generating specialist agent
    prediction_type VARCHAR(100) NOT NULL CHECK (prediction_type IN (
        'flood_expansion', 'hospital_overload', 'shelter_exhaustion', 'infrastructure_collapse', 'supply_shortage'
    )),
    expected_outcome TEXT NOT NULL,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    supporting_evidence TEXT NOT NULL,
    horizon_timestamp TIMESTAMP WITH TIME ZONE NOT NULL, -- Forecast target timeframe
    validation_status VARCHAR(50) NOT NULL DEFAULT 'unverified' CHECK (validation_status IN ('unverified', 'accurate', 'inaccurate', 'skewed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. incident_snapshots Table
Captures periodic inventory snapshots for historical state tracking.
```sql
CREATE TABLE incident_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    resource_counts JSONB NOT NULL,    -- Available personnel, beds, vehicles
    capacity_metrics JSONB NOT NULL,  -- Shelter/hospital occupancy levels
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

#### Incident Lifecycle Stages
```text
[Detected] ──> [Validated] ──> [Assessment] ──> [Active Response] ──> [Stabilization] ──> [Recovery] ──> [Closed]
```
1. **Detected:** Incident registered (e.g. from sensor threshold event). Coordinator agent activated.
2. **Validated:** Telemetry values verified by human commander. Regional bounds confirmed.
3. **Assessment:** Specialist agents (Weather, Infrastructure) execute context retrieval and compute local predictions.
4. **Active Response:** Tasks assigned to logistics and shelter agents. Action plans executed.
5. **Stabilization:** Resource occupancy rates plateau; telemetry levels return below hazard thresholds.
6. **Recovery:** Long-term displacement handling. Final reflection logs compiled.
7. **Closed:** Incident marked inactive. Active working memory promoted to episodic records.

#### Operational Memory Interaction Loop
* **Ingestion:** Telemetry updates write to `incident_snapshots` and check boundaries.
* **Retrieval context:** Agents join `incidents` with active `situation_reports` to build active state prompts.
* **Timeline Audit:** Every decision committed triggers writes to `incident_timeline` which binds directly to the active `incident_id` for compliance review.
* **Prediction Feedback:** When telemetry events hit forecast horizons, scheduled tasks verify actual sensor measurements against `incident_predictions` and update `validation_status` to measure agent drift.

### Agent Coordination Schema

#### Philosophy & Agent State Persistence
In ReliefGrid, AI agents are persistent operational participants rather than temporary compute functions. Each agent has an identity, specialized capabilities, a tracking configuration, execution heartbeats, and performance ledgers.

By preserving agent session states, task queues, and context snapshots in CockroachDB, compute environments can scale elastically or recover from crashes without losing memory.

```text
Agent Coordination Domain
├── agents
├── agent_sessions
├── agent_assignments
├── agent_health
├── agent_performance
├── agent_recovery_states
└── agent_collaboration
```

#### Schema Specifications & DDL Scripts

##### 1. agents Table
Acts as the central registry of all active AI agent profiles.
```sql
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    agent_type VARCHAR(100) NOT NULL CHECK (agent_type IN (
        'coordinator', 'weather', 'infrastructure', 'medical', 'shelter', 'logistics', 'communication'
    )),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'degraded', 'offline')),
    primary_domain VARCHAR(150) NOT NULL,
    model_provider VARCHAR(100) NOT NULL DEFAULT 'amazon_bedrock',
    model_version VARCHAR(100) NOT NULL DEFAULT 'claude-3-5-sonnet-v2',
    max_concurrent_tasks INT NOT NULL DEFAULT 1 CHECK (max_concurrent_tasks >= 1),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. agent_sessions Table
Records the historical execution durations and contexts of running agents.
```sql
CREATE TABLE agent_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    incident_id UUID REFERENCES incidents(incident_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'interrupted')),
    trigger_source VARCHAR(150) NOT NULL, -- e.g. 'incident_alert', 'coordinator_delegation', 'manual_refresh'
    memory_snapshot_version INT NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    ended_at TIMESTAMP WITH TIME ZONE
);
```

##### 3. agent_assignments Table
Maps active agents to incidents, defining operational priority and bounds.
```sql
CREATE TABLE agent_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'released', 'suspended')),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_agent_incident_assignment UNIQUE (agent_id, incident_id, status)
);
```

##### 4. agent_health Table
Stores health metrics for the coordinator's workload balancer.
```sql
CREATE TABLE agent_health (
    health_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'waiting', 'recovering', 'degraded', 'offline')),
    heartbeat_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    latency_ms INT NOT NULL DEFAULT 0,
    active_tasks_count INT NOT NULL DEFAULT 0 CHECK (active_tasks_count >= 0),
    failures_count INT NOT NULL DEFAULT 0 CHECK (failures_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. agent_performance Table
Tracks operational performance metrics over time.
```sql
CREATE TABLE agent_performance (
    performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    tasks_completed INT NOT NULL DEFAULT 0 CHECK (tasks_completed >= 0),
    avg_latency_ms INT NOT NULL DEFAULT 0 CHECK (avg_latency_ms >= 0),
    acceptance_rate NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (acceptance_rate BETWEEN 0.00 AND 100.00), -- Human command accept rate
    prediction_accuracy NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (prediction_accuracy BETWEEN 0.00 AND 100.00),
    avg_confidence NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (avg_confidence BETWEEN 0.00 AND 100.00),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 6. agent_recovery_states Table
Holds session serialization data to restore state if a node crashes.
```sql
CREATE TABLE agent_recovery_states (
    recovery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES agent_sessions(session_id) ON DELETE CASCADE,
    last_completed_task_id UUID,     -- References tasks table
    pending_objectives JSONB NOT NULL,
    last_reasoning_context TEXT NOT NULL,
    pending_memory_writes JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 7. agent_collaboration Table
Traces structural coordination pathways and data handoffs.
```sql
CREATE TABLE agent_collaboration (
    collaboration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiator_agent_id UUID NOT NULL REFERENCES agents(agent_id),
    receiver_agent_id UUID NOT NULL REFERENCES agents(agent_id),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    context_exchanged JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

#### Agent Coordination Lifecycle
```text
[Registered] ──> [Available] ──> [Assigned] ──> [Retrieving Memory] ──> [Reasoning] ──> [Collaborating] ──> [Persisting Memory] ──> [Waiting]
```
1. **Registered:** Agent profile added to `agents`.
2. **Available:** Agent marks status `idle` in `agent_health` and is ready for work.
3. **Assigned:** Coordinator assigns task, triggering writes to `agent_assignments` and `agent_sessions`.
4. **Retrieving Memory:** Specialist queries `memories` table for incident context.
5. **Reasoning:** Agent invokes Bedrock LLM with its structured context package.
6. **Collaborating:** Specialist requests information from another agent, writing to `agent_collaboration`.
7. **Persisting Memory:** Recommendations written to `memories`, state recorded in `agent_recovery_states`.
8. **Waiting:** Agent updates state to `idle` in `agent_health`, ready for the next task.

#### Recovery & Persistence Protocols
* **Heartbeat Verification:** A background scheduler monitors `agent_health`. If `heartbeat_at` is older than 30 seconds, status changes to `offline` and any active tasks are rescheduled.
* **Crash Recovery Flow:**
  1. Failed agent container is restarted.
  2. Agent queries `agent_sessions` joined with `agent_recovery_states` to locate its active `session_id`.
  3. The agent loads `last_reasoning_context` and `pending_objectives` to resume execution without repeating past API calls.

### Decision & Recommendation Schema

#### Philosophy & Decision Traceability
ReliefGrid treats AI recommendations as audit-ready candidates rather than raw truths. Every recommendation generated by an agent is captured, linked to its supporting evidence (memories, logs, telemetry snapshots), scored for confidence, and updated as it passes through human review and operational execution.

This structured mapping ensures that commander reviews are supported by clear evidence, and post-disaster reflections can link success metrics back to the exact reasoning vectors that triggered them.

```text
Decision Intelligence Domain
├── recommendations
├── decisions
├── decision_evidence
├── confidence_assessments
├── decision_execution
└── outcome_evaluations
```

#### Schema Specifications & DDL Scripts

##### 1. recommendations Table
Holds candidate operational plans proposed by specialist agents.
```sql
CREATE TABLE recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL CHECK (recommendation_type IN (
        'evacuation', 'shelter_activation', 'medical_redeployment', 'route_closure', 'supply_dispatch'
    )),
    summary VARCHAR(255) NOT NULL,
    detailed_rationale TEXT NOT NULL,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    expected_impact TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'validated', 'rejected', 'approved')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. decisions Table
Represents recommendations that have been approved for execution.
```sql
CREATE TABLE decisions (
    decision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID UNIQUE REFERENCES recommendations(recommendation_id) ON DELETE RESTRICT,
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    approver_user_id UUID, -- References users table (NULL if auto-approved by rules)
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executing', 'completed', 'failed')),
    executed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. decision_evidence Table
Links candidate recommendations to the supporting memories that guided the reasoning model.
```sql
CREATE TABLE decision_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(recommendation_id) ON DELETE CASCADE,
    memory_id UUID NOT NULL REFERENCES memories(memory_id) ON DELETE RESTRICT,
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. confidence_assessments Table
Stores the mathematical components of the agent's confidence calculation.
```sql
CREATE TABLE confidence_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID UNIQUE NOT NULL REFERENCES recommendations(recommendation_id) ON DELETE CASCADE,
    telemetry_score INT NOT NULL CHECK (telemetry_score BETWEEN 0 AND 100),         -- C_telemetry
    vector_similarity_score INT NOT NULL CHECK (vector_similarity_score BETWEEN 0 AND 100), -- S_vector
    checklist_score INT NOT NULL CHECK (checklist_score BETWEEN 0 AND 100),         -- V_variables
    reasoning_certainty INT NOT NULL CHECK (reasoning_certainty BETWEEN 0 AND 100), -- LLM probability
    evaluation_notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. decision_execution Table
Monitors implementation states, including anomalies or routing errors.
```sql
CREATE TABLE decision_execution (
    execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES decisions(decision_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'in_transit', 'deploying', 'active', 'finished', 'aborted')),
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    ended_at TIMESTAMP WITH TIME ZONE
);
```

##### 6. outcome_evaluations Table
Maintains post-incident reviews comparing goals to outcomes.
```sql
CREATE TABLE outcome_evaluations (
    evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID UNIQUE NOT NULL REFERENCES decisions(decision_id) ON DELETE CASCADE,
    objective_achieved BOOLEAN NOT NULL,
    response_time_seconds INT NOT NULL CHECK (response_time_seconds >= 0),
    resource_efficiency NUMERIC(5, 2) NOT NULL CHECK (resource_efficiency BETWEEN 0.00 AND 100.00), -- Used vs wasted assets
    prediction_accuracy NUMERIC(5, 2) NOT NULL CHECK (prediction_accuracy BETWEEN 0.00 AND 100.00),
    casualty_reduction NUMERIC(5, 2) CHECK (casualty_reduction BETWEEN 0.00 AND 100.00), -- Percentage compared to baseline
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

#### Decision Approval Workflow
```text
[Generated] ──> [Validated] ──> [Pending Review] ──> [Approved / Rejected] ──> [Executed] ──> [Evaluated]
```
1. **Generated:** The specialist agent writes a candidate to `recommendations` and details to `confidence_assessments`.
2. **Validated:** Automated system constraints parse inputs for safety violations.
3. **Pending Review:** The recommendation is placed in the Operator Dashboard queue.
4. **Approved / Rejected:** A user updates status in the `decisions` table.
5. **Executed:** System dispatches actions, logging updates in `decision_execution`.
6. **Evaluated:** The incident wraps up. A background evaluator inserts records in `outcome_evaluations` to complete the learning loop.

#### Decision Explainability Interface
* **The Justification Chain:** When an operator clicks a decision in the UI, the system runs a lookup:
  ```sql
  SELECT m.title, m.summary, de.description
  FROM decision_evidence de
  JOIN memories m ON de.memory_id = m.memory_id
  WHERE de.recommendation_id = ?;
  ```
  This returns the exact list of supporting memories and telemetry records the Bedrock model retrieved before formulating the candidate action, guaranteeing compliance.

### Resource Intelligence Schema

#### Philosophy & Dynamic Operational Assets
Traditional logistics platforms treat inventories as passive records. ReliefGrid, however, treats resource pools as **dynamic operational assets**. The database tracks not only where assets are, but how they perform, where they are most effective, and how supply shortages affect the overall disaster response timeline.

By logging utilization metrics and spatial movement histories in CockroachDB, specialist agents can query past allocation outcomes to optimize logistics paths during subsequent crises.

```text
Resource Intelligence Domain
├── resources
├── resource_allocations
├── resource_deployments
├── resource_utilization
└── resource_movement_logs
```

#### Schema Specifications & DDL Scripts

##### 1. resources Table
Maintains the master asset repository with availability indicators.
```sql
CREATE TABLE resources (
    resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'medical_supplies', 'emergency_vehicles', 'food_supplies', 'water_supplies', 'shelter_equipment', 'rescue_equipment', 'personnel', 'communication_equipment', 'fuel', 'power_systems'
    )),
    resource_type VARCHAR(100) NOT NULL, -- e.g., 'heavy_rescue_helicopter', 'icu_bed', 'mre_pack'
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN (
        'available', 'reserved', 'assigned', 'in_transit', 'deployed', 'damaged', 'maintenance', 'unavailable'
    )),
    owning_organization VARCHAR(150) NOT NULL, -- e.g., 'RedCross', 'NationalGuard', 'FEMA'
    latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90.0 AND 90.0),
    longitude NUMERIC(10, 6) NOT NULL CHECK (longitude BETWEEN -180.0 AND 180.0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    unit_of_measure VARCHAR(50) NOT NULL, -- e.g., 'units', 'liters', 'pallet', 'personnel_count'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. resource_allocations Table
Records assignments of specific resource types to active incident tasks.
```sql
CREATE TABLE resource_allocations (
    allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(resource_id) ON DELETE RESTRICT,
    recommendation_id UUID REFERENCES recommendations(recommendation_id) ON DELETE SET NULL, -- Connects allocation back to the AI suggestion
    allocated_quantity INT NOT NULL CHECK (allocated_quantity > 0),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'allocated' CHECK (status IN ('allocated', 'released', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. resource_deployments Table
Tracks routing paths, estimated times of arrival (ETAs), and dispatch stages.
```sql
CREATE TABLE resource_deployments (
    deployment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID NOT NULL REFERENCES resource_allocations(allocation_id) ON DELETE CASCADE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    arrival_time TIMESTAMP WITH TIME ZONE, -- Filled upon delivery completion
    status VARCHAR(50) NOT NULL DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'in_transit', 'arrived', 'delayed', 'aborted')),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. resource_utilization Table
Logs the actual tactical work accomplished by assets during deployment.
```sql
CREATE TABLE resource_utilization (
    utilization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id UUID UNIQUE NOT NULL REFERENCES resource_deployments(deployment_id) ON DELETE CASCADE,
    metrics_logged JSONB NOT NULL,       -- e.g. {"liters_purified": 5000, "families_served": 150}
    efficiency_score NUMERIC(5, 2) NOT NULL CHECK (efficiency_score BETWEEN 0.00 AND 100.00), -- Performance rating
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. resource_movement_logs Table
Captures telemetry path steps for spatial audits and routing calculations.
```sql
CREATE TABLE resource_movement_logs (
    movement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(resource_id) ON DELETE CASCADE,
    origin_latitude NUMERIC(9, 6) NOT NULL CHECK (origin_latitude BETWEEN -90.0 AND 90.0),
    origin_longitude NUMERIC(10, 6) NOT NULL CHECK (origin_longitude BETWEEN -180.0 AND 180.0),
    dest_latitude NUMERIC(9, 6) NOT NULL CHECK (dest_latitude BETWEEN -90.0 AND 90.0),
    dest_longitude NUMERIC(10, 6) NOT NULL CHECK (dest_longitude BETWEEN -180.0 AND 180.0),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    ended_at TIMESTAMP WITH TIME ZONE
);
```

#### Resource Allocation Lifecycle
```text
[Available] ──> [Reserved] ──> [Allocated] ──> [Deployed] ──> [Utilized] ──> [Returned] ──> [Available]
```
1. **Available:** Resource listed in inventory. Status set to `available`.
2. **Reserved:** Recommendation generated. Quantities marked `reserved` to block double-allocation.
3. **Allocated:** Human commander approves recommendation. Status updated to `assigned`.
4. **Deployed:** Dispatch team initiates shipping, generating a row in `resource_deployments`.
5. **Utilized:** Resource arrives at destination. Telemetry and metric outcomes written to `resource_utilization`.
6. **Returned:** Reusable vehicles and personnel return to depots, updating location coordinates and returning status to `available`.

#### Cognitive Logistics Retrieval Loop
* **Resource Constraint Checks:** When Logistics Agent generates path plans, it retrieves availability metrics:
  ```sql
  SELECT name, resource_type, quantity, status
  FROM resources
  WHERE status = 'available' AND category = 'emergency_vehicles';
  ```
* **Performance Grounding:** When allocating high-importance cargo, the system queries past outcomes to favor high-efficiency assets:
  ```sql
  SELECT r.name, AVG(ru.efficiency_score) as avg_efficiency
  FROM resources r
  JOIN resource_allocations ra ON r.resource_id = ra.resource_id
  JOIN resource_deployments rd ON ra.allocation_id = rd.allocation_id
  JOIN resource_utilization ru ON rd.deployment_id = ru.deployment_id
  GROUP BY r.name
  ORDER BY avg_efficiency DESC;
  ```

### Identity & Access Management (IAM) Schema

#### Philosophy & Unified Identity Model
ReliefGrid implements a unified identity model where **human operators** and **AI agents** are both treated as first-class operational identities. Both types of accounts possess unique IDs, belong to agencies or services, are assigned granular RBAC permissions, and write audit trails.

Treating AI agents as structural entities within the IAM schema guarantees that every decision, prediction, and memory committed to CockroachDB is authenticated and authorized under least-privilege policies.

```text
Identity & Access Domain
├── organizations
├── users
├── user_sessions
├── roles
├── permissions
├── role_permissions
└── authentication_events
```

#### Schema Specifications & DDL Scripts

##### 1. organizations Table
Represents participating emergency agencies (e.g., FEMA, RedCross).
```sql
CREATE TABLE organizations (
    organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    organization_type VARCHAR(100) NOT NULL CHECK (organization_type IN ('government', 'ngo', 'private', 'military', 'healthcare')),
    jurisdiction VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. users Table
Stores identity credentials, links to organizations, and default operational roles.
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'commander', 'coordinator', 'medical_officer', 'logistics_officer', 'public_info_officer', 'sys_admin'
    )),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deactivated')),
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. user_sessions Table
Tracks active human dashboard logins.
```sql
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL, -- SHA-256 hash of API bearer token
    device_info TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. roles Table
Holds role labels mapping to operational responsibilities.
```sql
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. permissions Table
Contains granular permissions codes used for API gatekeeping.
```sql
CREATE TABLE permissions (
    permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'create_incident', 'approve_recommendation'
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 6. role_permissions Table
Connects roles to permissions in a standard RBAC mapping.
```sql
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (role_id, permission_id)
);
```

##### 7. authentication_events Table
Logs all authentication activities for forensic review and security monitoring.
```sql
CREATE TABLE authentication_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_type VARCHAR(50) NOT NULL CHECK (identity_type IN ('user', 'agent', 'service_account')),
    identity_id UUID NOT NULL, -- References user_id, agent_id or service_account_id
    event_result VARCHAR(50) NOT NULL CHECK (event_result IN ('success', 'failure', 'blocked')),
    ip_address VARCHAR(45) NOT NULL, -- Supports IPv4 and IPv6
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

#### Authorization & Access Policies
* **Least Privilege:** Agents are only authorized for their domain (e.g. the Weather Agent has read access to weather sensors, but cannot allocate shelter beds).
* **Command Validation Guard:** Any endpoint updating decision execution status calls a permission validation check:
  ```sql
  SELECT COUNT(1)
  FROM users u
  JOIN role_permissions rp ON u.role = rp.role_id
  JOIN permissions p ON rp.permission_id = p.permission_id
  WHERE u.user_id = ? AND p.code = 'approve_recommendation';
  ```
* **AI Security Context:** When specialist agents execute tasks, their service tokens are parsed by the API Gateway to restrict SQL access boundaries to authorized memory types only.

### Audit & Observability Schema

#### Philosophy & Observability Stack
Production-grade systems cannot run blindly. ReliefGrid implements a dedicated **Audit & Observability Schema** to capture operational telemetry, system failures, automated restarts, and execution traces.

Because every recommendation and memory update must be auditable, CockroachDB serves as the immutable ledger for system events, agent performance latency, and explainability metrics.

```text
Audit & Observability Domain
├── audit_logs
├── system_events
├── agent_telemetry
├── system_health
├── failure_records
└── recovery_records
```

#### Schema Specifications & DDL Scripts

##### 1. audit_logs Table
Captures immutable logs of all security-sensitive actions and configuration modifications.
```sql
CREATE TABLE audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL,            -- Can reference user_id, agent_id or system account
    actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('user', 'agent', 'system')),
    action VARCHAR(100) NOT NULL,      -- e.g. 'update_privilege', 'override_allocation', 'purge_cache'
    target_table VARCHAR(100) NOT NULL, -- e.g. 'users', 'resources', 'memories'
    target_id UUID NOT NULL,           -- UUID of target row
    previous_state JSONB,              -- Row state prior to modification
    new_state JSONB,                   -- Row state post-modification
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 2. system_events Table
Maintains a general event log of high-level state shifts across ReliefGrid.
```sql
CREATE TABLE system_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(incident_id) ON DELETE CASCADE,
    event_name VARCHAR(150) NOT NULL, -- e.g., 'shelter_capacity_breached', 'prediction_verification_started'
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 3. agent_telemetry Table
Logs token usage, execution durations, and database query latencies.
```sql
CREATE TABLE agent_telemetry (
    telemetry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES agent_sessions(session_id) ON DELETE CASCADE,
    latency_ms INT NOT NULL CHECK (latency_ms >= 0),
    tokens_used INT NOT NULL DEFAULT 0 CHECK (tokens_used >= 0),
    llm_duration_ms INT NOT NULL DEFAULT 0 CHECK (llm_duration_ms >= 0),
    memory_lookup_duration_ms INT NOT NULL DEFAULT 0 CHECK (memory_lookup_duration_ms >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 4. system_health Table
Tracks the heartbeat status and latency of connected infrastructure integrations.
```sql
CREATE TABLE system_health (
    health_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_name VARCHAR(150) UNIQUE NOT NULL, -- e.g. 'amazon_bedrock', 'fastapi_backend', 'cockroachdb_cluster'
    status VARCHAR(50) NOT NULL CHECK (status IN ('healthy', 'degraded', 'offline')),
    latency_ms INT NOT NULL DEFAULT 0 CHECK (latency_ms >= 0),
    last_heartbeat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 5. failure_records Table
Documents errors, stack traces, and mitigation paths.
```sql
CREATE TABLE failure_records (
    failure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_name VARCHAR(150) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    recovery_action_attempted VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'recovering', 'resolved', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

##### 6. recovery_records Table
Logs the duration and state values used to successfully recover crashed agent loops.
```sql
CREATE TABLE recovery_records (
    recovery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    failure_id UUID REFERENCES failure_records(failure_id) ON DELETE SET NULL,
    session_id UUID NOT NULL REFERENCES agent_sessions(session_id) ON DELETE CASCADE,
    restored_state_version INT NOT NULL CHECK (restored_state_version >= 1),
    duration_ms INT NOT NULL CHECK (duration_ms >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
);
```

#### Observability & Explainability Tracing
* **Workflow Trace Mapping:** When a multi-agent task triggers, the FastAPI backend assigns a global `X-Trace-ID` UUID to the request header.
* **Trace Propagation Loop:**
  1. The API Gateway forwards the `X-Trace-ID` to the Coordinator Agent.
  2. Every specialist agent session spawned logs telemetry rows using the same session/incident attributes.
  3. Every memory write stores the originating `session_id` in the `memories` table, allowing engineers to reconstruct the complete execution timeline of a recommendation by querying:
     ```sql
     SELECT t.created_at, a.name, t.latency_ms, m.title
     FROM agent_telemetry t
     JOIN agent_sessions s ON t.session_id = s.session_id
     JOIN agents a ON t.agent_id = a.agent_id
     LEFT JOIN memories m ON m.agent_id = a.agent_id AND m.created_at >= s.started_at
     WHERE s.session_id = ?
     ORDER BY t.created_at ASC;
     ```

### Indexing & Transaction Strategy

#### Philosophy & Performance Mechanics
ReliefGrid relies on CockroachDB as its shared cognitive substrate. Because multiple autonomous agents concurrently read, query, and write to the same operational state, the database must enforce:
* **Strict Serializability (ACID):** Preventing race conditions such as duplicate resource allocations or divergent memory versions.
* **Hybrid Vector Retrieval:** Coupling SQL metadata queries with pgvector similarity searches for contextual relevance.
* **Distributed Optimizations:** Leveraging UUIDv4 keys and secondary indexes to prevent hotspotting and query latency spikes across regional nodes.

```text
Performance & Consistency Architecture
├── UUIDv4 Distributed Keys
├── Secondary Indexes
├── pgvector Cosine Similarity HNSW Indexes
└── Serializable (ACID) Transaction Boundaries
```

#### DDL Index Specifications

##### 1. Secondary Indexes
These indexes optimize common operational filter lookups (e.g., status filters and geographic region queries).
```sql
-- Incident management optimizations
CREATE INDEX idx_incidents_status_severity ON incidents (status, severity_level);
CREATE INDEX idx_incidents_region ON incidents (region);
CREATE INDEX idx_incidents_created ON incidents (created_at DESC);

-- Memory lookup optimizations
CREATE INDEX idx_memories_incident_type ON memories (incident_id, memory_type_id);
CREATE INDEX idx_memories_status_importance ON memories (status, importance_score DESC);

-- Resource allocation optimization
CREATE INDEX idx_resources_category_status ON resources (category, status);
```

##### 2. Distributed Vector Indexing (pgvector)
To speed up semantic memory lookups, we define HNSW (Hierarchical Navigable Small World) index tables on the 1536-dimension embeddings:
```sql
-- Create vector extension (already supported in CockroachDB Cloud)
CREATE EXTENSION IF NOT EXISTS vector;

-- Define HNSW cosine distance index for memories
CREATE INDEX idx_memory_embeddings_vector ON memory_embeddings USING hnsw (embedding_vector vector_cosine_ops);
```

#### Serializable ACID Transaction Boundaries

##### 1. Incident Creation Transaction
Guarantees that an incident profile, initial timeline log, and system notification log are committed atomically.
```sql
BEGIN;

INSERT INTO incidents (incident_code, title, disaster_type, severity_level, region, latitude, longitude)
VALUES ('INC-2026-FLOOD-001', 'District A Flooding', 'flood', 'critical', 'Region North', 45.1234, -73.5678)
RETURNING incident_id;

-- Insert into timeline using returned incident_id
INSERT INTO incident_timeline (incident_id, event_type, originator, summary)
VALUES ('[incident_id_from_above]', 'incident_detected', 'sensor_gateway_01', 'Critical water level threshold reached.');

-- Record system-wide notification
INSERT INTO system_events (incident_id, event_name, payload)
VALUES ('[incident_id_from_above]', 'incident_created', '{"triggered_by": "sensor_gateway_01", "severity": "critical"}');

COMMIT;
```

##### 2. Resource Allocation Transaction
Enforces availability validation, reserves the allocated quantity, and registers the deployment record.
```sql
BEGIN;

-- Check availability and lock the row to prevent race conditions (SELECT FOR UPDATE)
SELECT quantity, status FROM resources 
WHERE resource_id = 'e3b0c442-98fc-11ed-a8fc-0242ac120002' AND status = 'available'
FOR UPDATE;

-- If quantity satisfies allocation request (e.g. 50 medical packs requested):
UPDATE resources 
SET quantity = quantity - 50,
    status = CASE WHEN quantity - 50 = 0 THEN 'assigned' ELSE 'available' END,
    updated_at = clock_timestamp()
WHERE resource_id = 'e3b0c442-98fc-11ed-a8fc-0242ac120002';

-- Record the assignment link
INSERT INTO resource_allocations (incident_id, resource_id, allocated_quantity, priority, status)
VALUES ('[incident_id]', 'e3b0c442-98fc-11ed-a8fc-0242ac120002', 50, 'high', 'allocated')
RETURNING allocation_id;

-- Initialize deployment
INSERT INTO resource_deployments (allocation_id, origin, destination, status)
VALUES ('[allocation_id_from_above]', 'Medical Warehouse Depot A', 'District A Field Hospital', 'dispatched');

COMMIT;
```

##### 3. Recommendation Approval Transaction
Converts an advisory recommendation into an actionable operational decision, establishing the audit trace.
```sql
BEGIN;

-- Lock and update the recommendation
UPDATE recommendations
SET status = 'approved'
WHERE recommendation_id = 'd4c0b551-98fc-11ed-a8fc-0242ac120003' AND status = 'generated'
FOR UPDATE;

-- Insert into the decisions ledger
INSERT INTO decisions (recommendation_id, incident_id, approver_user_id, status)
VALUES ('d4c0b551-98fc-11ed-a8fc-0242ac120003', '[incident_id]', '[approver_user_uuid]', 'pending')
RETURNING decision_id;

-- Log the event in the incident timeline
INSERT INTO incident_timeline (incident_id, event_type, originator, summary)
VALUES ('[incident_id]', 'decision_approved', 'commander_uuid', 'Commander approved evacuation routing recommendation.');

COMMIT;
```

#### Optimistic Concurrency Control (OCC)
For fields subject to concurrent edits (e.g. `memories` updates or `agents` health markers), ReliefGrid uses a timestamp-based OCC check. Writes verify that the record has not been updated since it was read:
```sql
-- Read phase returns: memory_id = 'uuid', content = '...', updated_at = '2026-07-15 19:30:00+00'
-- Write phase check:
UPDATE memories 
SET detailed_content = 'new content',
    updated_at = clock_timestamp()
WHERE memory_id = 'uuid' AND updated_at = '2026-07-15 19:30:00+00';

-- If rows affected is 0, transaction aborts and retries.
```

#### CockroachDB Capability Mapping
| CockroachDB Feature | ReliefGrid Integration Rationale |
| :--- | :--- |
| **Strict Serializability** | Guarantees that concurrent agent tasks (e.g., medical and shelter allocations) do not create double-booking anomalies or divergent memory states. |
| **Distributed Vector Search** | Speeds up multi-agent cognitive context lookups by embedding similar historical records directly inside SQL indices. |
| **Serializable Retries** | Handles transient transaction conflicts gracefully in the backend client wrapper. |
| **UUID Primary Keys** | Prevents distributed write hotspots, spreading INSERT workloads evenly across the cluster. |

## UI/UX Architecture

### 6.1 Design Philosophy
The ReliefGrid interface is the operational command center through which emergency managers, government agencies, and AI agents collaborate in real time.

Unlike traditional dashboards that simply visualize data, ReliefGrid presents a **shared operational intelligence workspace** where human decision-makers and autonomous AI systems work from the same persistent memory.

The interface is designed to minimize cognitive load during high-pressure emergency situations while maximizing situational awareness, explainability, and trust.

Every interaction should reinforce the platform's core principle:
> **Memory is not hidden behind the interface—it is visible, explorable, and actionable.**

---

### 6.2 Information Architecture

#### 6.2.1 Principles
The Information Architecture (IA) defines how information is organized, discovered, and navigated throughout ReliefGrid. Rather than exposing technical modules such as databases or AI services, the interface is structured around the workflows of emergency operations personnel.

* **Operational First:** Information is organized according to emergency response workflows, not system components.
* **Memory-Centric:** Historical knowledge is accessible from every major workflow.
* **Context Preservation:** Navigation never causes users to lose operational context.
* **Progressive Exploration:** Users begin with summaries and progressively reveal deeper operational intelligence.
* **Explainability:** Every AI-generated recommendation can be traced back to supporting evidence and memory.

#### 6.2.2 Application Hierarchy & Navigation Structure
The application is organized into seven primary operational domains, which form the vertical navigation sidebar structure:
* **Dashboard:** The central mission-control screen hosting real-time maps, pending AI proposals, and health logs.
  * *Primary Content:* Active incidents, threat overview, AI recommendations, agent activity, resource summary, system health, and recent memory updates.
* **Incident Operations:** Manage the complete lifecycle of disaster events.
  * *Subsections:* Active Incidents, Incident Details, Incident Timeline, Situation Reports, Decision History, Incident Documents.
* **Collective Memory:** Explore the organization's accumulated operational knowledge.
  * *Subsections:* Memory Explorer, Semantic Search, Historical Incidents, Lessons Learned, Reflections, Decision Memory, Episodic Memory, Semantic Memory.
* **AI Coordination:** Monitor and manage autonomous AI collaboration.
  * *Subsections:* Specialized agent sub-panels (Weather, Infrastructure, Medical, Shelter, Logistics, Communication) housing tasks, heartbeats, and memory traces.
* **Resource Operations:** Manage emergency assets and logistics.
  * *Subsections:* Resource Inventory, Deployments, Allocations, Logistics Dashboard, Movement Tracking, Availability Monitor.
* **Analytics & Intelligence:** Strategic operational insight.
  * *Subsections:* Operational Analytics, Memory Analytics, Agent Performance, Decision Quality, Prediction Accuracy, Resource Utilization.
* **Administration:** Configure and govern the platform.
  * *Subsections:* Users, Organizations, Roles, Permissions, System Configuration, Audit Logs.

#### 6.2.3 Cross-Domain Relationships & Context Preservation
The domains are interconnected rather than isolated. If a user is viewing an active incident, transitioning to the Memory Explorer automatically filters memories related to that incident. Navigating to Resource Operations highlights assets currently assigned to that incident.
```text
Dashboard ──> Incident ──> AI Recommendation ──> Supporting Memories ──> Historical Incident ──> Lessons Learned ──> Resource Allocation
```

#### 6.2.4 Workspace Layout & Three-Panel Structure
Each major page follows a consistent three-panel structure:
* **Left Panel — Navigation:** Contains primary navigation and contextual filters.
* **Center Panel — Operational Workspace:** Displays the primary content relevant to the selected module.
* **Right Panel — Intelligence Sidebar:** Provides contextual information such as related memories, AI insights, recent events, recommendations, and linked resources.

```text
ReliefGrid Workspace Command Center Layout
┌────────────────────────────────────────────────────────────────────────┐
│  [Top Banner] System Status Alert Feed & Live Agent Heartbeat Timeline  │
├───────────────┬────────────────────────────────────────────────────────┤
│               │  [Main Workspace: Leaflet Map / Incident Analytics]    │
│  [Left Nav]   │                                                        │
│  - Dashboard  │                                                        │
│  - Incidents  ├────────────────────────────────────────────────────────┤
│  - Memory     │  [Active Recommendation Workspace & Approval Queue]     │
│  - Agents     │  - Code: INC-FLOOD-01 | Evacuate Route 4 | Appr | Rej  │
│  - Resources  ├────────────────────────────────────────────────────────┤
│  - Settings   │  [Secondary Panel: Context-Aware Memory Retrieval Feed]│
│               │  - Similarity Match: 94% | flood_2024_ref.md (Episodic)│
└───────────────┴────────────────────────────────────────────────────────┘
```

#### 6.2.5 Search & Notification Architecture
* **Universal Search:** Accessible from every screen, combining structured filters with semantic retrieval powered by CockroachDB Distributed Vector Indexing.
* **Notification Hierarchy:** Grouped by urgency (Critical, Important, Informational), linking directly to target workflow detail pages.
* **Global Header:** Persistent navigation containing organization selector, active incident counts, notification centers, and user profile panels.
* **Breadcrumb Strategy:** Reflects operational context rather than directory files (e.g., `Dashboard > Flood Response > AI Recommendation > Supporting Memory`).
* **Navigation States:** Supports expanded desktop sidebar, collapsed mode, responsive layouts, and keyboard navigation.

#### 6.2.6 Information Flow & Lifecycle Loop
The UI architecture supports the chronological path:
```text
Monitor Situation ──> Investigate Incident ──> Review AI Analysis ──> Explore Memory ──> Allocate Resources ──> Approve Decisions ──> Monitor Outcomes ──> Capture Lessons
```
Every completed incident dashboard phase feeds directly back into the Collective Memory Engine.

#### 6.2.7 Alignment with Collective Memory
* **Dashboard** surfaces memory insights.
* **Incident Operations** generates new memories.
* **AI Coordination** retrieves and writes memories.
* **Resource Operations** contributes deployment history.
* **Analytics** measures memory effectiveness.
* **Administration** governs access to memory.

---

### 6.3 Dashboard Architecture & Emergency Operations Command Center

#### 6.3.1 Philosophy & Key Visual Goals
The Dashboard is the operational heart of ReliefGrid. It is designed to immediately communicate three ideas within the first 10 seconds:
1. **Multiple AI agents are actively collaborating:** Visualized through the live collaboration ticker and nodes.
2. **CockroachDB is functioning as a shared, persistent memory layer:** Surfaced through vector search metrics and the memory retrieval log.
3. **The system is helping humans make faster, better decisions:** Proving that agent-guided proposals accelerate commander response operations.

#### 6.3.2 Workspace Panels

##### A. Interactive Situation Map (Leaflet)
* **Visuals:** An interactive map taking up 50% of the screen height, overlaying geographical incident polygons (flood bounds, wildfire radii) on dark-themed geographical map tiles.
* **Interactions:** Hovering over markers shows real-time sensors (e.g. water levels, wind speed). Clicking a marker anchors the secondary context panel to the selected coordinate range.
* **Layers:** Toggle switches to display shelters, hospital beds, active dispatch routes, and hazard heatmaps.

##### B. Active Recommendation Queue
* **Visuals:** Placed directly beneath the map. Presents AI recommendation cards styled by priority (e.g., Catastrophic/Critical highlighted in soft crimson gradients).
* **Interactions:** Each card contains side-by-side action buttons: `Approve` (triggers the decision execution transaction) and `Reject` (notifies the coordinator agent).
* **Progressive Disclosure:** Clicking "Review Evidence" expands an inline drawer revealing the contributing confidence metrics (telemetry weight, reasoning certainty, memory hits).

##### C. Live Memory Stream & Explainability Panel
* **Visuals:** A sidebar module docked on the right side of the screen. Updates in real-time as agents perform vector lookups.
* **Content:** Displays clickable snippets of retrieved memories with similarity percentages (e.g., *"94% Cosine Match: 2024 River A Flood Analysis"*). Clicking a snippet opens the full memory in the Memory Explorer.

##### D. Agent Collaboration Network
* **Visuals:** A structural node graph (rendered via D3.js or Mermaid-like UI) mapping current inter-agent communication channels (e.g. Weather Agent $\rightarrow$ Coordinator $\rightarrow$ Shelter Agent).
* **States:** Nodes pulse during active Bedrock reasoning cycles, light up green on successful data handoff, and pulse yellow during transaction conflict retries or recovery stages.

##### E. Notifications & Heartbeat Banner
* **Visuals:** A slim top bar highlighting incident state shifts (e.g., *"INC-2026-FLOOD-001 severity elevated to critical"*).
* **Heartbeat Ticker:** Small glowing indicators for each agent. If a heartbeat log is missed, the indicator turns red and warns: *"Weather Agent offline. Initiating state recovery..."*

##### F. Bottom Analytics Bar
* **Content:** Real-time statistics showing the collective health of the platform: Active incidents, total memories created during this session, cumulative vector queries processed, average agent reasoning latency (ms), and database transaction execution duration.

#### 6.3.3 Hackathon Demonstration Flow
The dashboard is structurally configured to tell the ReliefGrid story during a 3-minute live judging demo:
1. **Prepare:** The dashboard displays a normal monitoring status. The AI Collaboration Feed shows the Weather Agent scanning forecast patterns.
2. **Detect & Coordinate:** An anomaly is simulated. The Weather Agent generates a high-confidence flood prediction and writes it to CockroachDB. The Coordinator Agent automatically updates the dashboard, creates the incident, and displays the incident card and map bounds.
3. **Reason & Retrieve:** The Medical and Shelter Agents query historical memories of similar past floods using `pgvector` similarity matching. The Collective Memory Feed updates live to display these matching documents (e.g., "Lessons Learned: 2024 Flood Shelter Logistics").
4. **Propose & Decide:** An evacuation recommendation card appears in the main queue with a 94% confidence score, citing the 2024 lessons. The operator clicks `Approve`, and the dashboard updates live to show the resource allocation transaction committing successfully.
5. **Fail & Recover:** To prove resilience, the Logistics Agent process is terminated. The dashboard shows the agent icon turn red in the health panel. A backup process starts, reads the `agent_recovery_states` serialized in CockroachDB, and resumes routing logistics context-intact. The icon glows green, proving the platform is production-ready.

---

### 6.4 Collective Memory Explorer Architecture

#### 6.4.1 Philosophy & Key Visual Goals
The **Collective Memory Explorer** is the cognitive center of ReliefGrid. Rather than treating memory as a hidden backend implementation, this module provides a dedicated visual workspace where operators and judges can explore episodic, semantic, task, decision, and reflection memories, inspect vector similarity relationships, trace reasoning paths, and observe how organizational knowledge evolves over time.

#### 6.4.2 Navigation & Workspace Panels
The Memory Explorer workspace is divided into three key panels:

##### A. Memory Dashboard & Stats Bar
* **Visuals:** Located at the top of the interface. Displays cognitive health metrics: Total memory rows stored in CockroachDB, percent of tasks utilizing past memories, semantic clustering density score, and learning yield of reflections promoted to lessons learned.

##### B. Search & Filter Workspace (pgvector Simulator)
* **Keyword & Type Filters:** Filter cards to isolate memory types or disaster categories.
* **Vector Semantic Search Bar:** Natural-language search (e.g. *"hospital evacuation routes under power failure"*).
* **Similarity Diagnostics:** Displays results with similarity indicators (e.g., *"91% match"*), the source agent UUID, timestamp, and metadata payload details.

##### C. Dynamic Relationship Graph (D3.js Node Visualization)
* **Visuals:** An interactive force-directed graph mapping memory relationships.
* **Nodes:** Represent incidents, recommendations, decisions, and reflections. Hovering over a node displays its summary.
* **Edges:** Color-coded lines representing relationships such as *influenced*, *referenced*, *superseded*, or *contradicted*.
* **Interactions:** Double-clicking a node refocuses the search workspace on that node's neighbors, showing the historical decision lineage.

##### D. Detail Drawer & Version Inspector
* **Content:** Displays the full text content, creation timestamp, author (human/agent), and confidence score metrics.
* **Audit Trail:** Shows the version lineage of the memory (original state, subsequent revisions, and validation status updates).

#### 6.4.3 Explanatory Reasoning Chains
When analyzing an active recommendation, the UI generates a step-by-step reasoning tree displaying: The Root (situation report trigger), The Retrieval (vector queries and corresponding memories), The Logic (reasoning steps written by agents), and The Decision (resulting proposal and human controls).

---

### 6.5 AI Agent Operations Center

#### 6.5.1 Philosophy & Key Visual Goals
The **AI Agent Operations Center** provides complete visibility into the autonomous intelligence powering ReliefGrid. Rather than presenting AI as a black-box assistant, this panel exposes a coordinated ecosystem of specialized agents working together. Judges and operators can watch seven specialized agents thinking independently, exchanging knowledge, retrieving memories from CockroachDB, and coordinating through the Coordinator Agent in real time.

#### 6.5.2 Layout & Workspace Sections
The Operations Center is organized into five visual zones:

##### A. Agent Status Overview & Header
* **Metrics:** Active agent counts, running/pending tasks, average response times (ms), total vector query requests, and overall collaboration volume.

##### B. Agent Directory Cards
Cards representing each agent (Coordinator, Weather, Infrastructure, Medical, Shelter, Logistics, Communication) displaying:
* Operational Status (Available, Busy, Waiting, Offline)
* Workload intensity meter
* Last heartbeat latency
* Accumulated memory lookup counts

##### C. Agent Detail Workspace & Queue
* Clicking an agent card highlights its specific panel. Displays its active objective, assigned incident context, private task queue, and local confidence assessments.

##### E. Live Message & Communication Feed
* **Visuals:** Real-time log showing inter-agent coordination messages (e.g., `[WeatherAgent -> Coordinator] Dispatching flood forecast data. Payload ID: uuid`).
* **Interactive Tracing:** Clicking a message node displays the serialized payload contents, JSON payload schema, and transaction IDs.

##### F. Failure Recovery Dashboard
* Visualizes the resilience workflow when an agent goes offline:
  * 🔴 **Failure detected:** Health status switches to offline, throwing a warning.
  * 🟡 **Context Saved:** Displays that the agent's workspace and task state have been successfully serialized to `agent_recovery_states` table in CockroachDB.
  * 🟢 **Recovery Activated:** A backup agent is spun up, reads the recovery record, and resumes execution seamlessly.

#### 6.5.3 Performance & Collaboration Graph
* An interactive D3 chord diagram or node matrix showing messaging frequency and memory-sharing overlap between agents. Highlights which agent profiles are most dependent on one another, helping diagnose coordination bottlenecks.

---

### 6.6 Incident Operations Workspace

#### Purpose
The **Incident Operations Workspace** is the primary environment where emergency response teams manage an incident throughout its lifecycle. It consolidates operational intelligence, AI collaboration, historical memory, resource management, and human decision-making into a unified workspace. Rather than forcing users to navigate between multiple systems, the workspace provides a complete operational context in a single interface. Every action taken within this workspace contributes to the Collective Memory Engine, ensuring that operational experience continuously improves future responses.

#### 6.6.1 Design Philosophy
The Incident Operations Workspace is designed around the concept of **Operational Context**. Operators should never need to gather information from multiple screens before making decisions. Every recommendation, resource, memory, and timeline event is presented within the context of the active incident. This minimizes cognitive overhead and enables rapid, informed decision-making during high-pressure situations.

#### 6.6.2 Primary Objectives
The workspace enables users to:
* monitor incident progression,
* coordinate AI-assisted response,
* allocate operational resources,
* review historical precedents,
* approve recommendations,
* communicate with response teams,
* document operational decisions,
* preserve organizational knowledge.

#### 6.6.3 Workspace Layout
The workspace is organized into five coordinated regions.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Incident Header                                                            │
├───────────────────────────────┬────────────────────────────────────────────┤
│ Operational Map               │ Decision Intelligence Panel               │
│                               │                                            │
│ Impact Zones                  │ AI Recommendations                         │
│ Resources                     │ Memory Insights                            │
│ Shelters                      │ Decision Queue                             │
│ Weather Layers                │ Confidence Indicators                      │
├───────────────────────────────┼────────────────────────────────────────────┤
│ Operational Timeline          │ Resource Coordination                      │
├───────────────────────────────┴────────────────────────────────────────────┤
│ Incident Activity Feed                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Each region updates in real time as new information becomes available.

#### 6.6.4 Incident Header
The header establishes the operational context. Displayed information includes:
* Incident identifier
* Incident title
* Disaster category
* Geographic location
* Severity level
* Operational phase
* Time since detection
* Lead organization
* Current commander
* AI coordination status

Quick actions include:
* Update incident
* Generate report
* Request resources
* Escalate incident
* Close incident

#### 6.6.5 Operational Map
The Operational Map is the geographical center of the workspace. Supported layers include:
* **Disaster Impact:** Affected regions and projected expansion.
* **Infrastructure:** Road closures, damaged bridges, utilities, and transportation status.
* **Medical:** Hospitals, clinics, emergency facilities, and capacity indicators.
* **Shelters:** Active shelters, occupancy, available capacity, and accessibility.
* **Logistics:** Supply routes, warehouses, distribution centers, and delivery progress.
* **Weather:** Current conditions, forecasts, rainfall, wind, temperature, and severe weather alerts.

Each map element is interactive and linked to relevant memories, reports, and recommendations.

#### 6.6.6 Decision Intelligence Panel
This panel presents AI-generated operational guidance. Each recommendation displays:
* responsible agent,
* recommendation summary,
* priority,
* confidence,
* supporting evidence,
* historical precedents,
* estimated impact,
* approval status.

Operators may:
* approve,
* reject,
* request revision,
* assign for further review.

Every action is recorded as Decision Memory.

#### 6.6.7 Memory Insights Panel
The workspace continuously surfaces relevant historical knowledge. Displayed insights include:
* similar historical incidents,
* successful response strategies,
* failed operational approaches,
* lessons learned,
* previous resource allocations,
* recurring infrastructure vulnerabilities.

Each insight includes semantic similarity scores generated through CockroachDB Distributed Vector Indexing. This ensures that operational knowledge actively informs current decisions.

#### 6.6.8 Resource Coordination Panel
This panel provides comprehensive visibility into emergency resources. Categories include:
* Personnel: Emergency responders, medical teams, engineers, volunteers.
* Vehicles: Ambulances, helicopters, rescue boats, transport vehicles.
* Medical Supplies: Medication, blood units, emergency kits, protective equipment.
* Shelter Resources: Beds, food, water, sanitation, power.
* Logistics Assets: Warehouses, fuel, communications equipment, transportation capacity.

Operators can:
* allocate,
* reassign,
* reserve,
* release,
* prioritize resources.

Resource updates immediately propagate to all participating AI agents.

#### 6.6.9 Operational Timeline
The timeline captures every significant event throughout the incident. Example sequence:
```text
08:05 Incident reported
↓
08:09 Weather analysis completed
↓
08:14 Historical memories retrieved
↓
08:18 Infrastructure assessment finished
↓
08:22 Medical capacity warning generated
↓
08:28 AI recommendation approved
↓
08:34 Resources deployed
↓
08:47 Shelter activated
↓
09:02 Reflection generated
```
Every timeline event links directly to supporting memories, reports, and decisions.

#### 6.6.10 Incident Activity Feed
The Activity Feed provides a continuous stream of operational updates. Examples:
* Coordinator assigned Weather Agent.
* Logistics Agent updated delivery route.
* Shelter Agent increased available capacity.
* Medical Agent reported hospital overload.
* Reflection Memory created.
* New lesson learned validated.

Each entry includes:
* timestamp,
* contributing agent,
* related incident,
* associated memory,
* operational impact.

#### 6.6.11 Decision Approval Workflow
Critical recommendations follow a structured approval lifecycle.
```text
AI Recommendation
↓
Supporting Memory Retrieved
↓
Evidence Reviewed
↓
Human Approval
↓
Operational Execution
↓
Outcome Captured
↓
Reflection Generated
↓
Lesson Learned Stored
```
This process balances AI autonomy with human accountability.

#### 6.6.12 Collaboration View
The workspace visualizes how specialist agents contribute to the incident. Displayed contributions include:
* Weather forecasts,
* Infrastructure assessments,
* Medical risk evaluations,
* Shelter recommendations,
* Logistics optimization,
* Public communication plans.

The Coordinator Agent synthesizes these inputs into a unified operational strategy.

#### 6.6.13 Explainability Workspace
Every operational recommendation can be expanded into a detailed explanation. The explanation includes:
* originating agent,
* consulted memories,
* collaborating agents,
* supporting evidence,
* confidence rationale,
* alternative strategies,
* historical comparisons.

This enables users to understand not only the recommendation but also the reasoning behind it.

#### 6.6.14 Operational Reporting
Users can generate structured reports directly from the workspace. Available reports include:
* Situation Report (SITREP)
* Resource Deployment Report
* Medical Assessment Report
* Infrastructure Status Report
* Executive Briefing
* Lessons Learned Report
* Incident Closure Report

Reports automatically reference the Collective Memory Engine, ensuring consistency and traceability.

#### 6.6.15 Multi-Incident Coordination
Future enterprise deployments may require simultaneous management of multiple disasters. The workspace is designed to support:
* parallel incident monitoring,
* cross-incident resource coordination,
* regional prioritization,
* shared organizational memory,
* conflict detection,
* unified command oversight.

This architecture supports expansion without redesign.

#### 6.6.16 Hackathon Demonstration Flow
During the demonstration:
1. A severe flood incident is created.
2. The workspace immediately displays operational context.
3. Specialist agents analyze the situation.
4. Historical flood memories are retrieved from CockroachDB.
5. AI recommendations appear with supporting evidence.
6. Resources are allocated through the Resource Coordination Panel.
7. The operational timeline updates in real time.
8. A recommendation is approved.
9. Deployment outcomes are recorded.
10. Reflections and lessons learned are automatically added to the Collective Memory Engine.

#### 6.6.17 Why This Workspace Matters
The Incident Operations Workspace is where ReliefGrid\'s architectural vision becomes operational reality. It integrates situational awareness, autonomous AI collaboration, persistent memory, explainable recommendations, and human oversight into a single cohesive environment. For emergency responders, it reduces decision latency while improving confidence and coordination. For hackathon judges, it provides a concrete demonstration of how CockroachDB-powered persistent memory enables production-grade multi-agent systems that remain resilient, transparent, and continuously improving.

---

## Phase 9 — Design System & Component Library

> **Creating a Consistent, Accessible, and Production-Grade User Experience**

---

### 9.1 Design Philosophy
ReliefGrid is not designed as a consumer application. It is an enterprise emergency intelligence platform intended for government agencies, humanitarian organizations, emergency operations centers (EOCs), and disaster response teams.

The interface must prioritize: Situational awareness, Information hierarchy, Operational speed, Cognitive clarity, Explainability, Accessibility, Consistency, and Trust. Every visual decision should reduce cognitive load during high-pressure situations.

### 9.2 Design Principles
The entire product follows eight core design principles:
* **Clarity Before Decoration:** Every component must communicate information before aesthetics. Visual effects should never compete with operational data.
* **Information First:** Dashboards should surface the most important operational information immediately. Critical alerts must always have the highest visual priority.
* **Explainable Intelligence:** Every AI recommendation should provide supporting evidence, confidence, and memory references. Users must never encounter unexplained AI outputs.
* **Progressive Disclosure:** Advanced information should remain available without overwhelming first-time users. Complex workflows should reveal additional detail only when required.
* **Consistency:** Identical actions should always behave identically. Buttons, dialogs, forms, and interactions must remain predictable across the application.
* **Memory-Centric Design:** Persistent memory is ReliefGrid's defining capability. Memory interactions should be visually distinct from ordinary operational data. Dedicated visual language reinforces this concept throughout the interface.
* **Accessibility by Default:** Interfaces must remain usable under stressful operational conditions. Typography, contrast, spacing, and interaction targets should exceed standard accessibility requirements.
* **Operational Resilience:** Interfaces should gracefully handle failures, slow connections, partial data, and unavailable services without confusing users.

### 9.3 Typography System
#### Primary Typeface
**Aspekta Variable** — All typography throughout ReliefGrid uses the Aspekta font family to establish a modern, geometric, and highly legible visual identity.

#### Font Weights
* **300:** Secondary supporting text
* **400:** Body content
* **500:** Labels and metadata
* **600:** Cards, tables, section titles
* **700:** Page headings, KPIs, dashboards

#### Typography Scale
* **Display XL:** 64px | Weight: 700 | Line Height: 72px
* **Display:** 48px | Weight: 700 | Line Height: 56px
* **H1:** 40px | Weight: 700 | Line Height: 48px
* **H2:** 32px | Weight: 700 | Line Height: 40px
* **H3:** 28px | Weight: 600 | Line Height: 36px
* **H4:** 24px | Weight: 600 | Line Height: 32px
* **H5:** 20px | Weight: 600 | Line Height: 28px
* **Body Large:** 18px | Weight: 400 | Line Height: 28px
* **Body:** 16px | Weight: 400 | Line Height: 24px
* **Small:** 14px | Weight: 400 | Line Height: 20px
* **Caption:** 13px | Weight: 400 | Line Height: 18px
* **Label:** 12px | Weight: 500 | Line Height: 16px

### 9.4 Color System
The color system follows semantic meaning rather than decorative usage.
* **Primary (Deep Charcoal):** `#34495E` — Primary text, Navigation, Charts, Icons.
* **Secondary (Slate Blue):** `#1C3D5A` — Cards, Panels, Navigation backgrounds, Borders.
* **Accent (Vibrant Cyan):** `#00D2FF` — Interactive controls, Primary buttons, Selection states, AI indicators, Links.
* **Warning (Safety Orange):** `#FF6B00` — Incident alerts, Critical recommendations, Warning banners.
* **Success:** `#22C55E` — Completed tasks, Healthy agents, Operational systems, Successful deployments.
* **Danger:** `#E53935` — System failures, Critical incidents, Offline agents, Fatal errors.
* **Information:** `#2563EB` — Status indicators, General notifications, Information banners.
* **Memory (ReliefGrid Purple):** `#7C4DFF` — Memory Explorer, Knowledge Graph, Semantic Search, Reflection Memory, Lessons Learned, Vector Search. (Reserved exclusively for memory-related experiences to reinforce the platform's cognitive architecture).
* **Neutral Backgrounds:**
  * Primary Surface: `#FFFFFF`
  * Secondary Surface: `#F7F9FA`
  * Elevated Surface: `#EEF3F6`
  * Divider: `#D7E1E8`

### 9.5 Spacing System
A strict spacing scale ensures visual consistency. No arbitrary spacing values should be introduced outside this scale:
* **XS:** 4px
* **S:** 8px
* **M:** 12px
* **L:** 16px
* **XL:** 24px
* **2XL:** 32px
* **3XL:** 40px
* **4XL:** 48px
* **5XL:** 64px

### 9.6 Grid System
* **Desktop Layout:** 12-column responsive grid
* **Maximum Content Width:** 1440px
* **Sidebar Width:** 280px
* **Panel Gap:** 24px
* **Card Padding:** 24px
* Mobile layouts collapse into a single-column structure while preserving information hierarchy.

### 9.7 Border Radius
* **Small:** 8px
* **Medium:** 12px
* **Large:** 16px
* **Extra Large:** 24px

### 9.8 Elevation
ReliefGrid uses subtle elevation to separate content without creating unnecessary visual noise:
* **Level 1 (Cards):** `0 1px 2px rgba(0,0,0,.04)`
* **Level 2 (Dialogs):** `0 6px 16px rgba(0,0,0,.06)`
* **Level 3 (Command Palettes):** `0 12px 32px rgba(0,0,0,.08)`
* Heavy shadows and floating effects are intentionally avoided.

### 9.9 Motion System
Animations communicate system state and improve usability without distracting operators:
* **Hover:** 150ms
* **Button Press:** 120ms
* **Card Expansion:** 250ms
* **Panel Transition:** 300ms
* **Modal Appearance:** 250ms
* **Page Transition:** 450ms
* **Animation Curve:** `cubic-bezier(.2,.8,.2,1)`
* Animations should never delay critical workflows.

### 9.10 Iconography
ReliefGrid adopts a **Lucide-inspired** outline icon language. Specifications:
* 2px stroke
* Rounded joins
* No fills
* Geometric construction
* Pixel-perfect at 24px and 32px
* Minimal visual complexity
Agent-specific icons should maintain identical proportions and stroke weights to reinforce consistency across the AI ecosystem.

### 9.11 Visual Language for Collective Memory
Persistent memory is the defining feature of ReliefGrid and receives its own visual identity. Memory-related elements use:
* Purple accent color, connected node motifs, relationship lines, knowledge graph animations, semantic similarity indicators, and memory lineage timelines.
* Whenever AI recommendations reference historical knowledge, subtle visual connectors should indicate the relationship between the recommendation and its supporting memories.
This creates an intuitive understanding that the system is reasoning from accumulated experience rather than generating isolated responses.

### 9.12 Accessibility Standards
The interface targets WCAG 2.2 AA compliance:
* Minimum contrast ratio of 4.5:1 for text.
* Full keyboard navigation.
* Visible focus indicators.
* Screen reader compatibility.
* Scalable typography without layout degradation.
* Color is never the sole indicator of meaning.
* Minimum 44×44px interactive touch targets.

---

## Part 2 — Enterprise Component Library

> **Reusable Building Blocks for a Mission-Critical Emergency Intelligence Platform**

---

### 9.13 Component Design Philosophy

Every UI component must satisfy the following principles:

* Consistent appearance across all pages.
* Fully reusable.
* Accessible by default.
* Responsive across screen sizes.
* Keyboard navigable.
* Support loading, empty, success, warning, and error states.
* Optimized for dense operational data without overwhelming users.
* Designed around composability rather than duplication.

Components should be implemented as independent, reusable modules that can be assembled into larger workflows.

---

### 9.14 Buttons

Buttons communicate intent through hierarchy.

#### Primary Button

Purpose:
Primary user action.

Examples:
* Create Incident
* Deploy Resources
* Approve Recommendation
* Generate Report

Style:
* Cyan background
* White text
* Medium elevation
* 12px border radius
* 48px minimum height

---

#### Secondary Button

Purpose:
Supporting actions.

Examples:
* Cancel
* Preview
* View Details

Style:
* White background
* Slate Blue border
* Deep Charcoal text

---

#### Tertiary Button

Purpose:
Low-priority actions.

Examples:
* Learn More
* Expand
* Copy

Style:
* Text only
* No border
* Hover underline

---

#### Destructive Button

Purpose:
Irreversible actions.

Examples:
* Delete Memory
* Close Incident
* Remove User

Style:
* Red background
* White text

Requires confirmation before execution.

---

### 9.15 Input Components

Supported controls include:
* Text Input
* Search Field
* Password Input
* Text Area
* Numeric Input
* Date Picker
* Time Picker
* Multi-select
* Dropdown
* Checkbox
* Radio Button
* Toggle Switch

All inputs support:
* Label
* Helper Text
* Validation
* Error Messages
* Disabled State
* Loading State

---

### 9.16 Search Components

ReliefGrid relies heavily on semantic search.

Search inputs support:
* Keyword Search
* Natural Language Search
* Vector Search
* Saved Searches
* Recent Searches
* Search Suggestions
* Filter Chips

Example placeholder:
> Search incidents, memories, agents, reports, or lessons learned...

---

### 9.17 Cards

Cards are the primary organizational component.

Supported card types include:

#### KPI Card

Displays:
* Metric
* Trend
* Percentage Change
* Mini Chart

---

#### Incident Card

Displays:
* Incident Name
* Severity
* Status
* Location
* Assigned Commander
* Last Updated

---

#### Memory Card

Displays:
* Memory Type
* Similarity Score
* Confidence
* Related Incident
* Originating Agent

Memory Cards always use the dedicated Memory Purple accent.

---

#### Agent Card

Displays:
* Agent Status
* Running Tasks
* Health
* Confidence
* Memory Reads
* Memory Writes

---

#### Recommendation Card

Displays:
* Recommendation
* Confidence
* Supporting Memories
* Required Approval
* Related Agents

---

### 9.18 Tables

Enterprise tables support:
* Sorting
* Filtering
* Pagination
* Column Selection
* Export
* Sticky Headers
* Inline Status Badges
* Expandable Rows

Tables should maintain readability with large operational datasets.

---

### 9.19 Status Badges

Status badges communicate system state consistently.

Examples:

| Status     | Color  |
| ---------- | ------ |
| Active     | Cyan   |
| Healthy    | Green  |
| Pending    | Orange |
| Processing | Blue   |
| Archived   | Gray   |
| Failed     | Red    |
| Memory     | Purple |

---

### 9.20 Alerts

Alert hierarchy includes:

#### Information

Blue

General updates

---

#### Success

Green

Completed actions

---

#### Warning

Orange

Potential operational risks

---

#### Critical

Red

Immediate attention required

---

#### Memory Insight

Purple

Highlights retrieved historical knowledge or lessons learned.

---

### 9.21 Timelines

Timelines visualize:
* Incident evolution
* Agent orchestration
* Memory creation
* Resource deployment
* Decision history

Features:
* Zoom
* Filters
* Expand events
* Jump to timestamp

---

### 9.22 Charts

Supported visualizations include:
* Line Charts
* Area Charts
* Bar Charts
* Stacked Bars
* Donut Charts
* Heat Maps
* Scatter Plots
* Network Graphs
* Sankey Diagrams
* Timeline Charts

Charts should avoid unnecessary decoration and prioritize readability.

---

### 9.23 Maps

Interactive maps support:

Layers:
* Flood Zones
* Fire Spread
* Infrastructure
* Medical Facilities
* Shelters
* Logistics Routes
* Weather
* Population Density

Capabilities:
* Zoom
* Layer Toggle
* Region Selection
* Incident Overlay
* Resource Overlay
* Heat Maps

Maps synchronize with incident timelines and memory retrieval results.

---

### 9.24 Memory Components

ReliefGrid introduces components dedicated to organizational memory.

#### Memory Node

Displays:
* Type
* Confidence
* Similarity
* Source Agent

---

#### Memory Relationship

Animated connector between related memories.

---

#### Memory Timeline Card

Displays:
* Creation
* Validation
* Reflection
* Promotion
* Retrieval

---

#### Semantic Match Card

Displays:
* Similarity Score
* Matching Concepts
* Supporting Evidence

---

#### Lesson Learned Card

Displays:
* Lesson
* Applicable Incidents
* Confidence
* Adoption Rate

---

### 9.25 AI Components

Specialized components represent autonomous intelligence.

#### Agent Avatar

Minimal icon representing each specialist agent.

---

#### Agent Activity Indicator

Animated status showing:
* Thinking
* Retrieving Memory
* Collaborating
* Waiting
* Recovering

---

#### Recommendation Panel

Displays:
* Recommendation
* Supporting Memories
* Confidence
* Approval Actions

---

#### Consensus Panel

Visualizes agreement among specialist agents before coordinator synthesis.

---

### 9.26 Navigation Components

Navigation includes:
* Primary Sidebar
* Secondary Context Navigation
* Breadcrumbs
* Command Palette
* Quick Actions
* Tabs
* Context Menus

The active navigation state should remain visible at all times to reinforce orientation within the platform.

---

### 9.27 Modal Components

Supported dialog types include:
* Confirmation
* Incident Details
* Memory Details
* AI Reasoning
* User Management
* Export Report
* Settings
* Approval Workflow

Dialogs should trap keyboard focus and support dismissal through explicit user actions.

---

### 9.28 Loading States

Loading experiences communicate progress without blocking interaction.

Patterns include:
* Skeleton Loaders
* Progressive Rendering
* Spinner Indicators
* Streaming Updates
* Placeholder Cards

Loading states should preserve layout stability to prevent content shifting.

---

### 9.29 Empty States

Every major component must define a meaningful empty state.

Examples:
* "No incidents have been created yet."
* "No historical memories match your search."
* "No active recommendations require approval."

Each empty state should guide users toward the next logical action.

---

### 9.30 Error States

Errors should be descriptive and actionable.

Example:
**Unable to retrieve historical memories.**
The system will retry automatically. You may continue managing the incident while memory synchronization resumes.

Error messages should explain impact and recovery behavior rather than exposing technical details.

---

### 9.31 Responsive Behavior

The component library supports:

Desktop:
* Full multi-panel layouts.

Tablet:
* Reduced side panels.
* Collapsible navigation.

Mobile:
* Single-column layouts.
* Prioritized information.
* Simplified navigation.

Operational functionality should remain available across supported devices.

---

### 9.32 Component Quality Standards

Every reusable component must satisfy the following requirements before production use:
* Accessibility compliant.
* Fully responsive.
* Keyboard navigable.
* Theme compatible.
* Consistent spacing.
* Semantic HTML.
* Reusable API.
* Unit test coverage.
* Clear loading, error, and empty states.
* Performance optimized.

These standards ensure long-term maintainability and consistency as the platform evolves.

---

## Phase 10 — Frontend Implementation Specification

> **Translating Product Specifications into a Production-Ready Frontend**

---

### 10.1 Objective

This phase defines how the ReliefGrid user interface should be implemented.

Previous sections established:

* Product requirements
* System architecture
* Multi-agent architecture
* Collective Memory Engine
* Design system
* Component library
* Complete page specifications

This phase converts those design artifacts into an implementation blueprint for frontend development.

It specifies application structure, routing, state management, data flow, rendering strategy, performance targets, accessibility, responsiveness, and engineering standards.

---

### 10.2 Frontend Philosophy

The ReliefGrid frontend is designed as a modern, responsive, enterprise-grade application optimized for mission-critical operations.

The interface should:

* Prioritize operational awareness.
* Render large datasets efficiently.
* Support real-time updates.
* Remain responsive during heavy system activity.
* Clearly communicate AI reasoning.
* Visualize Collective Memory interactions.
* Maintain consistent performance across supported devices.

Every interaction should feel deliberate, predictable, and fast.

---

### 10.3 Technology Stack

The frontend should be implemented using the following stack.

| Layer            | Technology           |
| ---------------- | -------------------- |
| Framework        | Next.js (App Router) |
| Language         | TypeScript           |
| Styling          | Tailwind CSS         |
| Components       | shadcn/ui            |
| Icons            | Lucide React         |
| Animations       | Framer Motion        |
| Charts           | Tremor + Recharts    |
| Maps             | Mapbox GL JS         |
| State Management | Zustand              |
| Server State     | TanStack Query       |
| Forms            | React Hook Form      |
| Validation       | Zod                  |
| Tables           | TanStack Table       |
| Command Palette  | cmdk                 |
| Notifications    | Sonner               |
| Authentication   | Clerk or Auth.js     |
| Theme            | next-themes          |

The selected technologies align with modern frontend engineering practices and provide a balance between developer productivity, maintainability, and performance.

---

### 10.4 Application Structure

The frontend follows a feature-oriented architecture rather than organizing code by file type.

```text
apps/
└── web/
    ├── app/
    ├── components/
    ├── features/
    ├── hooks/
    ├── services/
    ├── store/
    ├── lib/
    ├── types/
    ├── utils/
    ├── styles/
    └── assets/
```

Each feature encapsulates its own UI components, business logic, API interactions, and tests.

---

### 10.5 Routing Strategy

The application uses Next.js App Router with nested layouts.

Example route structure:

```text
/
├── login
├── dashboard
├── incidents
│   ├── new
│   ├── [incidentId]
│   └── timeline
├── memory
├── ai-operations
├── analytics
├── resources
├── communications
├── reports
├── administration
└── settings
```

Shared layouts ensure consistent navigation and persistent UI elements across all authenticated routes.

---

### 10.6 Global Layout

Every authenticated page follows a consistent shell.

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Navigation                                                │
├──────────────┬───────────────────────────────────────────────┤
│ Sidebar      │                                               │
│ Navigation   │ Main Workspace                                │
│              │                                               │
│              │                                               │
├──────────────┴───────────────────────────────────────────────┤
│ Status Bar                                                   │
└──────────────────────────────────────────────────────────────┘
```

The layout minimizes context switching and maintains persistent access to navigation, notifications, and system status.

---

### 10.7 Navigation Model

The application uses three levels of navigation:

#### Primary Navigation

Persistent sidebar providing access to major modules.

#### Secondary Navigation

Context-specific tabs within individual modules.

#### Contextual Actions

Page-level commands presented in toolbars and command palettes.

Navigation should remain predictable and consistent across all workflows.

---

### 10.8 State Management

State is divided according to responsibility.

#### Local UI State

Managed within individual components.

Examples:

* Dialog visibility
* Form inputs
* Selected tabs

#### Global Client State

Managed with Zustand.

Examples:

* Sidebar state
* Theme
* Selected organization
* Notification preferences

#### Server State

Managed with TanStack Query.

Examples:

* Incidents
* AI agents
* Memory objects
* Reports
* Analytics

This separation improves maintainability and reduces unnecessary re-renders.

---

### 10.9 Data Fetching Strategy

Data fetching follows a cache-first approach.

Principles include:

* Server-side rendering for initial page loads where appropriate.
* Client-side updates for interactive dashboards.
* Automatic background refetching.
* Optimistic updates for user actions.
* Request deduplication.
* Intelligent cache invalidation.

Real-time operational data should refresh without disrupting user workflows.

---

### 10.10 Real-Time Communication

The frontend consumes live updates for operational awareness.

Real-time events include:

* Incident creation
* Incident updates
* Agent status changes
* Memory creation
* Recommendations
* Alerts
* Resource allocation
* System health

Live updates should be streamed incrementally rather than requiring full page refreshes.

---

### 10.11 Performance Targets

The interface should meet the following performance objectives:

| Metric                         | Target        |
| ------------------------------ | ------------- |
| Initial Page Load              | < 2 seconds   |
| Dashboard Interaction          | < 100 ms      |
| Search Response                | < 300 ms      |
| Memory Visualization Update    | < 500 ms      |
| Route Transition               | < 300 ms      |
| Largest Contentful Paint (LCP) | < 2.5 seconds |
| Cumulative Layout Shift (CLS)  | < 0.1         |

Performance should remain stable even during periods of high operational activity.

---

### 10.12 Error Handling Strategy

The frontend should gracefully handle failures.

Patterns include:

* Inline validation for forms.
* Contextual error messages.
* Retry mechanisms for transient failures.
* Global error boundaries.
* Offline indicators.
* Recovery suggestions.

Errors should provide actionable guidance without exposing internal implementation details.

---

### 10.13 Accessibility Requirements

The implementation must satisfy WCAG 2.2 AA standards.

Requirements include:

* Semantic HTML.
* Keyboard navigation.
* Visible focus indicators.
* Screen reader support.
* High-contrast color combinations.
* Accessible charts and tables.
* Responsive typography.

Accessibility should be integrated throughout development rather than addressed retrospectively.

---

### 10.14 Frontend Engineering Standards

All frontend code should adhere to consistent engineering practices.

Standards include:

* Strict TypeScript configuration.
* Reusable component architecture.
* Modular feature organization.
* Comprehensive error handling.
* Unit and integration testing.
* Consistent naming conventions.
* Clear documentation for shared components.
* Minimal code duplication.

These practices support long-term maintainability and scalability.

---

### 10.15 Why This Phase Matters

The Frontend Implementation Specification bridges the gap between design and development.

It ensures that the user experience envisioned in previous sections is translated into a robust, maintainable, and high-performance application.

For Antigravity, this phase provides clear implementation guidance while allowing flexibility in code generation. For hackathon judges, it demonstrates that ReliefGrid has been planned with production-quality frontend engineering practices rather than ad hoc interface development.


---

## Phase 11 — Backend Implementation Specification

> **Building the Intelligent Coordination Layer Behind ReliefGrid**

---

### 11.1 Objective

This phase defines the backend architecture that powers ReliefGrid's multi-agent emergency intelligence platform.

The backend is responsible for:

* Orchestrating AI agents.
* Managing disaster incidents.
* Persisting organizational memory.
* Coordinating workflows.
* Executing semantic retrieval.
* Maintaining system consistency.
* Integrating CockroachDB and AWS services.
* Exposing secure APIs to the frontend.

The backend functions as the operational brain of the platform, coordinating autonomous agents while ensuring that every decision is grounded in persistent collective memory.

---

### 11.2 Architectural Philosophy

The backend follows a service-oriented, modular architecture designed around clear separation of responsibilities.

Core principles include:

* Single Responsibility Principle
* Event-Driven Coordination
* Stateless Service Design
* Persistent Shared Memory
* Fault Isolation
* Horizontal Scalability
* Idempotent Operations
* Explainable Decision Support

Business logic should reside within dedicated services rather than API endpoints, enabling reuse across multiple interfaces and workflows.

---

### 11.3 Backend Technology Stack

| Layer             | Technology                              |
| ----------------- | --------------------------------------- |
| Framework         | FastAPI                                 |
| Language          | Python 3.12+                            |
| ASGI Server       | Uvicorn                                 |
| Data Validation   | Pydantic v2                             |
| ORM               | SQLAlchemy 2.0                          |
| Database Driver   | asyncpg                                 |
| Database          | CockroachDB                             |
| Vector Search     | CockroachDB Distributed Vector Indexing |
| AI Models         | Amazon Bedrock                          |
| Object Storage    | Amazon S3                               |
| Background Tasks  | AWS Lambda                              |
| Authentication    | JWT / OAuth2                            |
| API Documentation | OpenAPI / Swagger                       |
| Logging           | Structlog                               |
| Configuration     | Pydantic Settings                       |

The stack is selected to maximize maintainability, performance, and compatibility with the CockroachDB × AWS hackathon requirements.

---

### 11.4 Backend Layered Architecture

The backend is organized into distinct architectural layers.

```text
┌────────────────────────────────────────────┐
│ API Layer                                 │
├────────────────────────────────────────────┘
│ Authentication & Authorization             │
├────────────────────────────────────────────┘
│ Application Services                       │
├────────────────────────────────────────────┘
│ Multi-Agent Orchestration Engine           │
├────────────────────────────────────────────┘
│ Collective Memory Engine                   │
├────────────────────────────────────────────┘
│ Repository Layer                           │
├────────────────────────────────────────────┘
│ CockroachDB + AWS Services                 │
└────────────────────────────────────────────┘
```

Each layer has clearly defined responsibilities and communicates only with adjacent layers.

---

### 11.5 API Layer

The API layer serves as the entry point for all frontend requests.

Responsibilities include:

* Request validation
* Authentication
* Authorization
* Response formatting
* Error handling
* Rate limiting
* API versioning

The API layer contains minimal business logic, delegating processing to application services.

---

### 11.6 Application Service Layer

Application services implement business workflows.

Examples include:

* Incident Service
* Resource Service
* Memory Service
* Agent Service
* Analytics Service
* Reporting Service
* User Service
* Notification Service

Each service coordinates repositories, AI agents, and external integrations to complete business operations.

---

### 11.7 Multi-Agent Orchestration Layer

This layer manages autonomous AI collaboration.

Responsibilities include:

* Task decomposition.
* Agent assignment.
* Workflow orchestration.
* Consensus management.
* Agent communication.
* Failure detection.
* Recovery initiation.
* Reflection scheduling.

The Coordinator Agent acts as the central orchestrator while specialist agents execute domain-specific analyses.

---

### 11.8 Collective Memory Engine

The Collective Memory Engine is the cognitive core of ReliefGrid.

Responsibilities include:

* Memory creation.
* Memory retrieval.
* Semantic search.
* Reflection generation.
* Episodic storage.
* Knowledge graph maintenance.
* Similarity ranking.
* Memory versioning.
* Confidence scoring.

All agents interact with this layer rather than communicating directly with the database.

---

### 11.9 Repository Layer

Repositories abstract database operations from business logic.

Examples include:

* Incident Repository
* Memory Repository
* Agent Repository
* Resource Repository
* User Repository
* Analytics Repository

Repositories expose clean interfaces for data access while encapsulating CockroachDB-specific implementation details.

---

### 11.10 Event-Driven Coordination

ReliefGrid adopts an event-driven architecture to decouple services.

Representative events include:

* IncidentCreated
* IncidentUpdated
* TaskAssigned
* AgentStarted
* AgentCompleted
* MemoryCreated
* MemoryValidated
* RecommendationGenerated
* ReflectionStored
* ResourceAllocated

Services subscribe to relevant events and react asynchronously where appropriate.

---

### 11.11 Request Lifecycle

A typical incident workflow proceeds as follows:

```text
Client Request
      │
      ▼
API Validation
      │
      ▼
Authentication
      │
      ▼
Application Service
      │
      ▼
Coordinator Agent
      │
      ▼
Specialist Agents
      │
      ▼
Collective Memory Engine
      │
      ▼
CockroachDB
      │
      ▼
Recommendation Generated
      │
      ▼
Response Returned
```

This pipeline ensures consistent validation, orchestration, persistence, and response generation.

---

### 11.12 Background Processing

Long-running tasks execute asynchronously to maintain responsive user interactions.

Examples include:

* Reflection generation.
* Semantic embedding creation.
* Historical similarity analysis.
* Report generation.
* Analytics aggregation.
* Memory indexing.

Background processing isolates computationally intensive work from user-facing API requests.

---

### 11.13 Backend Engineering Standards

All backend modules should adhere to the following standards:

* Strict type annotations.
* Asynchronous I/O where appropriate.
* Dependency injection.
* Comprehensive logging.
* Centralized exception handling.
* Modular package organization.
* Unit and integration testing.
* Clear API documentation.

Business logic should remain framework-agnostic wherever practical.

---

### 11.14 Observability

Operational visibility is essential for a distributed AI platform.

The backend should expose:

* Structured logs.
* Request tracing.
* Service metrics.
* Agent lifecycle events.
* Memory operations.
* Database latency.
* External service health.
* Error rates.

These signals support debugging, performance tuning, and operational monitoring.

---

### 11.15 Why This Phase Matters

The Backend Implementation Specification transforms ReliefGrid from a conceptual architecture into an implementable software platform.

It establishes clear boundaries between APIs, services, orchestration, memory management, and persistence, ensuring that the system remains modular, testable, and scalable.

For Antigravity, this phase provides the structural guidance required to generate a maintainable FastAPI backend. For hackathon judges, it demonstrates that the platform has been engineered with production-quality backend practices rather than a collection of isolated API endpoints.

---

## Phase 11 — Backend Implementation Specification

## Part 2 — Service-by-Service Backend Architecture

> **Defining the Core Business Services of ReliefGrid**

---

### 11.16 Service Design Principles

Every backend service must conform to the following architectural principles:

#### Single Business Responsibility

A service owns one business capability.

For example:

* Incident Service manages incidents.
* Memory Service manages memories.
* Analytics Service manages analytics.

No service should directly implement another service's responsibilities.

---

#### Loose Coupling

Services communicate through well-defined interfaces and domain events.

Dependencies should remain minimal to simplify testing, deployment, and future expansion.

---

#### High Cohesion

Related business logic should remain within the same service.

For example, all incident lifecycle operations belong to the Incident Service.

---

#### Idempotency

Operations that may be retried (such as event processing or background jobs) must produce the same result when executed multiple times.

---

#### Observability

Every service must emit structured logs, metrics, and domain events to support monitoring and troubleshooting.

---

### 11.17 Incident Service

#### Purpose

The Incident Service manages the complete lifecycle of disaster incidents.

It serves as the authoritative source for incident data.

---

#### Responsibilities

* Create incidents.
* Update incident status.
* Track severity.
* Assign ownership.
* Manage incident timelines.
* Coordinate resource requests.
* Publish incident events.

---

#### Owned Data

* Incident metadata
* Status
* Severity
* Geographic location
* Incident timeline
* Assigned personnel

---

#### Consumed Services

* Memory Service
* Agent Service
* Notification Service

---

#### Published Events

* IncidentCreated
* IncidentUpdated
* IncidentEscalated
* IncidentResolved
* IncidentArchived

---

#### Transaction Boundaries

All incident updates execute within a single CockroachDB transaction to ensure consistency between incident records and associated timeline events.

---

### 11.18 Memory Service

#### Purpose

The Memory Service governs the lifecycle of Collective Memory.

It is the only service authorized to create, update, retrieve, validate, archive, or promote memory objects.

---

#### Responsibilities

* Create memories.
* Retrieve memories.
* Perform semantic search.
* Generate embeddings.
* Promote validated memories.
* Archive obsolete memories.
* Manage confidence scores.
* Maintain relationships between memories.

---

#### Owned Data

* Working memories
* Episodic memories
* Semantic memories
* Reflection memories
* Decision memories
* Lessons learned
* Memory relationships

---

#### Consumed Services

* Agent Service
* Analytics Service

---

#### Published Events

* MemoryCreated
* MemoryValidated
* MemoryRetrieved
* MemoryPromoted
* ReflectionGenerated
* EmbeddingCreated

---

#### Design Constraint

No other service may write directly to memory tables.

All memory operations flow through the Memory Service to preserve integrity and consistency.

---

### 11.19 Agent Service

#### Purpose

The Agent Service manages the lifecycle and coordination of AI agents.

---

#### Responsibilities

* Register agents.
* Assign tasks.
* Track execution status.
* Monitor health.
* Restart failed agents.
* Record agent metrics.
* Manage collaboration.

---

#### Owned Data

* Agent profiles
* Health status
* Task assignments
* Execution history
* Collaboration metrics

---

#### Published Events

* AgentRegistered
* AgentStarted
* AgentCompleted
* AgentFailed
* AgentRecovered
* TaskAssigned

---

#### Integration

The Agent Service communicates with the Multi-Agent Orchestration Layer rather than directly invoking foundation models.

---

### 11.20 Resource Service

#### Purpose

The Resource Service manages operational assets required during emergency response.

---

#### Responsibilities

* Track shelters.
* Monitor medical supplies.
* Manage vehicles.
* Allocate personnel.
* Record resource movements.
* Forecast shortages.

---

#### Owned Data

* Resources
* Inventory
* Availability
* Allocation history
* Capacity

---

#### Published Events

* ResourceAllocated
* ResourceReleased
* CapacityExceeded
* InventoryUpdated

---

### 11.21 Analytics Service

#### Purpose

The Analytics Service transforms operational data into organizational intelligence.

---

#### Responsibilities

* Aggregate KPIs.
* Generate dashboards.
* Compute trends.
* Produce executive summaries.
* Evaluate AI performance.
* Measure memory utilization.

---

#### Owned Data

* Aggregated metrics
* Historical KPIs
* Trend analyses
* Executive insights

---

#### Published Events

* ReportGenerated
* KPIUpdated
* TrendCalculated

---

### 11.22 Reporting Service

#### Purpose

The Reporting Service produces operational and executive documentation.

---

#### Responsibilities

* Incident reports.
* After-action reviews.
* AI decision reports.
* Memory reports.
* Compliance exports.

---

#### Generated Outputs

* PDF
* CSV
* JSON

---

#### Dependencies

* Incident Service
* Memory Service
* Analytics Service

---

### 11.23 Notification Service

#### Purpose

Coordinate all user-facing notifications.

---

#### Responsibilities

* In-app notifications.
* Email delivery.
* Alert routing.
* Notification history.
* Escalation reminders.

---

#### Supported Events

* Incident escalation
* Recommendation approval
* Agent failure
* Memory validation
* Resource shortage

---

### 11.24 Authentication Service

#### Purpose

Authenticate users and authorize access to platform resources.

---

#### Responsibilities

* Login
* Logout
* Token issuance
* Token refresh
* Role validation
* Permission enforcement
* Session management

---

#### Security Features

* JWT authentication
* Role-Based Access Control
* Multi-factor authentication support
* Session expiration
* Device tracking

---

### 11.25 Integration Service

#### Purpose

Provide a unified abstraction layer for external systems.

---

#### Managed Integrations

* CockroachDB
* Amazon Bedrock
* Amazon S3
* AWS Lambda

Future integrations:

* GIS platforms
* Weather APIs
* Satellite imagery
* Government systems

---

#### Responsibilities

* Connection management
* Health monitoring
* Retry policies
* Credential management
* Error handling

---

### 11.26 Audit Service

#### Purpose

Maintain a complete, immutable history of significant system actions.

---

#### Responsibilities

* Record administrative actions.
* Capture AI decisions.
* Track configuration changes.
* Monitor memory updates.
* Preserve compliance records.

---

#### Stored Information

* Actor
* Action
* Timestamp
* Resource
* Previous state
* New state
* Result

---

### 11.27 Service Communication Matrix

| Service        | Reads From                  | Publishes To            |
| -------------- | --------------------------- | ----------------------- |
| Incident       | Memory, Agent               | Notification, Analytics |
| Memory         | CockroachDB                 | Agent, Analytics        |
| Agent          | Memory                      | Incident, Analytics     |
| Resource       | Incident                    | Notification            |
| Analytics      | All Services                | Reporting               |
| Reporting      | Incident, Memory, Analytics | Users                   |
| Notification   | All Events                  | Users                   |
| Authentication | User Repository             | API Layer               |
| Integration    | External Platforms          | All Services            |
| Audit          | All Services                | Compliance Logs         |

This matrix defines the permitted communication pathways between services and reduces unintended coupling.

---

### 11.28 Cross-Service Transactions

Operations that span multiple services should use coordinated workflows rather than long-running distributed transactions.

Example:

1. Incident Service creates a new incident.
2. IncidentCreated event is published.
3. Agent Service assigns specialist agents.
4. Memory Service initializes working memory.
5. Notification Service alerts stakeholders.
6. Analytics Service updates operational metrics.

Each step is independently recoverable, improving resilience.

---

### 11.29 Why This Section Matters

By defining ownership boundaries, event contracts, and communication rules for every backend service, ReliefGrid avoids the tightly coupled architectures that often emerge in hackathon projects.

This modular design supports scalability, maintainability, and future expansion while making the responsibilities of each service explicit.

For Antigravity, these definitions provide clear guidance on how to organize backend modules, reducing ambiguity during code generation. For hackathon judges, they demonstrate disciplined software engineering practices consistent with production-ready distributed systems.


---

## User Journey & User Flows

### Introduction
The ReliefGrid user journey follows the complete lifecycle of a disaster response operation. Unlike traditional workflows that focus only on user actions, ReliefGrid also models how autonomous AI agents and the Collective Memory Engine participate in each stage.

Every interaction contributes to a continuously evolving body of operational intelligence. This means that each disaster does not simply end—it becomes a source of knowledge that improves future responses.

The journey is organized into four operational phases:
1. Before Incident (Preparedness)
2. During Incident (Response)
3. After Incident (Assessment)
4. Recovery (Learning & Readiness)

Across every phase, four actors collaborate: human decision-makers, specialized AI agents, the Coordinator Agent, and the Collective Memory Engine.

---

### Phase 1 — Before Incident (Preparedness)

#### Objective
Establish situational awareness, identify risks, prepare response plans, and strengthen readiness before an emergency occurs.

#### User Goals
Emergency personnel aim to:
* Monitor environmental conditions.
* Identify emerging risks.
* Review historical disasters.
* Validate resource readiness.
* Prepare response strategies.
* Ensure operational teams are coordinated.

#### AI Agent Activities
* **Weather Agent:** Continuously analyzes weather forecasts, rainfall patterns, drought indicators, and environmental conditions to create weather observations, risk predictions, and confidence scores.
* **Infrastructure Agent:** Reviews infrastructure vulnerabilities such as bridges, roads, utilities, and critical facilities to create infrastructure assessments, vulnerability summaries, and risk relationships.
* **Logistics Agent:** Evaluates inventory levels, transportation routes, warehouses, and supply readiness to create resource availability memories and route readiness assessments.
* **Medical Agent:** Analyzes healthcare readiness including hospital capacity, emergency staff, and medical inventories to create preparedness memories.
* **Shelter Agent:** Evaluates shelter availability, tracking occupancy, capacity, and accessibility.
* **Communication Agent:** Prepares draft public advisories for identified risks.
* **Coordinator Agent:** Combines outputs from every specialist into an operational preparedness summary.

#### Collective Memory Activities
During preparedness, the memory engine stores:
* **Semantic Memory:** (e.g. Flood-prone communities, seasonal weather behavior, historical evacuation patterns)
* **Prediction Memory:** (e.g. Heavy rainfall expected, infrastructure stress forecast, expected shelter demand)
* **Resource Memory:** (e.g. Available ambulances, food inventory, medical stock, shelter capacity)
* **Organizational Memory:** Historical policies, best practices, standard operating procedures.

#### System Outputs
* Risk dashboard
* Preparedness score
* Resource readiness summary
* Recommended preventive actions
* Historical incident comparisons

#### User Decisions
The Emergency Operations Commander decides:
* Whether to elevate readiness.
* Which agencies should prepare.
* Whether to pre-position supplies.
* Whether public warnings should be issued.

---

### Phase 2 — During Incident (Response)

#### Objective
Coordinate multiple autonomous agents while maintaining a continuously evolving operational picture. This phase demonstrates the platform's core innovation.

#### Trigger
A severe flood warning is received. The Weather Agent detects conditions exceeding predefined thresholds, and the Coordinator Agent automatically creates a new incident.

#### User Goals
Users need to:
* Understand the situation.
* Prioritize actions.
* Allocate resources.
* Coordinate agencies.
* Monitor response progress.
* Make confident decisions.

#### AI Agent Activities
* **Step 1: Weather Agent** creates rainfall prediction, flood probability, and confidence score, writing these to Collective Memory.
* **Step 2: Infrastructure Agent** retrieves weather memories, historical flood memories, and road vulnerability records. Predicts bridge failures, road closures, and power disruptions, writing findings back to memory.
* **Step 3: Medical Agent** reads infrastructure memories, population exposure, and historical casualty patterns. Predicts hospital demand, ambulance requirements, and emergency staffing, then stores recommendations.
* **Step 4: Shelter Agent** reads medical updates, infrastructure conditions, and weather forecasts. Calculates shelter allocation, occupancy prediction, and evacuation priorities.
* **Step 5: Logistics Agent** reads every previous agent's output. Optimizes supply movement, transportation, and inventory allocation.
* **Step 6: Communication Agent** reads verified collective memory and produces evacuation notices, public alerts, and safety instructions (only verified memories are used).
* **Coordinator Agent** monitors all activities, identifies conflicts, prioritizes recommendations, and maintains operational consistency.

#### Memory Evolution
Every decision creates new memory:
$$\text{Observation Memory} \rightarrow \text{Prediction Memory} \rightarrow \text{Decision Memory} \rightarrow \text{Outcome Memory} \rightarrow \text{Reflection Memory} \rightarrow \text{Lessons Learned} \rightarrow \text{Organizational Memory}$$
Memory continuously grows throughout the incident.

#### System Outputs
* Live incident map
* Agent activity timeline
* Resource dashboard
* Decision recommendations
* Confidence indicators
* Explainability panel
* Memory Explorer updates

#### User Decisions
* Commander approves evacuation.
* Medical officer reallocates ambulances.
* Logistics reroutes supplies.
* Shelter coordinator opens new shelters.
* Communication officer issues alerts.
* *Every decision is permanently recorded.*

---

### Phase 3 — After Incident (Assessment)

#### Objective
Transform operational experience into structured organizational intelligence.

#### User Goals
Understand what happened, why decisions were made, which actions succeeded, which failed, and what should improve.

#### AI Agent Activities
Every specialist reviews observations, recommendations, outcomes, and performance to generate structured reflections:
* **Weather Agent:** Forecast accuracy.
* **Infrastructure Agent:** Road prediction accuracy.
* **Medical Agent:** Hospital utilization.
* **Shelter Agent:** Occupancy efficiency.
* **Logistics Agent:** Delivery effectiveness.
* **Communication Agent:** Public message effectiveness.

#### Collective Memory Activities
Creates Reflection Memory, Decision Memory, Outcome Memory, Lessons Learned, Confidence Adjustments, Organizational Memory Updates, and Historical Embeddings (searchable for future incidents).

#### System Outputs
* Post-incident report
* Operational timeline
* Decision analysis
* Performance dashboard
* Agent comparison
* Memory growth visualization

#### User Decisions
Leadership decides policy changes, training improvements, infrastructure investments, and preparedness updates.

---

### Phase 4 — Recovery

#### Objective
Convert historical experience into future preparedness.

#### User Goals
Strengthen resilience, improve readiness, preserve institutional knowledge, and prepare for future disasters.

#### AI Agent Activities
Agents periodically revisit historical memories to identify recurring failures, successful interventions, infrastructure weaknesses, and changing environmental patterns. New predictions are generated using accumulated organizational memory.

#### Collective Memory Activities
Long-term memory becomes richer through memory consolidation, relationship discovery, confidence recalibration, semantic clustering, historical indexing, vector embedding optimization, and knowledge graph expansion.

#### System Outputs
* Preparedness improvements
* Policy recommendations
* Infrastructure priorities
* Training recommendations
* Forecast updates
* Risk trend analysis

#### User Decisions
Government administrators decide budget priorities, resilience investments, emergency planning updates, and policy revisions (becoming new organizational memories).

---

### End-to-End Journey Summary
The ReliefGrid lifecycle can be summarized as:
$$\text{Prepare} \rightarrow \text{Detect} \rightarrow \text{Coordinate} \rightarrow \text{Respond} \rightarrow \text{Assess} \rightarrow \text{Learn} \rightarrow \text{Improve}$$
Every completed incident strengthens the platform's collective intelligence, enabling faster, more informed, and more resilient responses in the future.

#### Architectural Decisions
* The user journey is organized around the disaster lifecycle rather than isolated application screens, ensuring that product design aligns with real operational workflows.
* Memory creation and evolution are embedded into every phase, making collective memory an active participant rather than a passive repository.
* AI agents contribute specialized expertise while the Coordinator Agent maintains a unified operational picture, reflecting the platform's collaborative architecture.

#### Hackathon Alignment
This journey directly supports:
* **Agentic Memory Design:** Demonstrates continuous creation, retrieval, and evolution of persistent collective memory.
* **Technical Implementation:** Highlights coordinated interactions between multiple specialized agents.
* **Real-World Impact:** Mirrors established emergency operations center workflows.
* **Production Readiness:** Shows explainable decisions, lifecycle management, and institutional learning.

## Phase 13 — API Design & Service Contracts

> **Defining the Communication Layer of ReliefGrid**

---

### 13.1 Objective

The API layer provides the standardized interface through which all clients, AI agents, and external systems interact with ReliefGrid.

It serves as the contract between:

* Web Application
* Mobile Applications (Future)
* AI Agents
* Administration Tools
* Analytics Services
* External Integrations

The API is designed to be:

* Consistent
* Versioned
* Secure
* Observable
* Idempotent
* Extensible

---

### 13.2 API Design Principles

Every endpoint must follow the same engineering philosophy.

#### Resource-Oriented

Endpoints expose business resources rather than implementation details.

Example:

```text
/incidents
```

instead of

```text
/createIncident
```

---

#### Predictable

Similar resources behave similarly.

Examples:

```text
GET
POST
PATCH
DELETE
```

follow identical conventions throughout the platform.

---

#### Versioned

Every public endpoint belongs to an API version.

```text
/api/v1/
```

Future versions can evolve independently while preserving backward compatibility.

---

#### Stateless

Each request contains all information necessary for processing.

The backend does not rely on conversational session state.

---

#### Explainable

AI-related endpoints should return evidence alongside recommendations.

Responses should never contain opaque AI outputs.

---

### 13.3 API Categories

The API surface is divided into logical domains.

#### Authentication

Identity management.

---

#### Incident

Incident lifecycle.

---

#### Collective Memory

Memory operations.

---

#### AI Agents

Agent orchestration.

---

#### Resources

Operational assets.

---

#### Analytics

Business intelligence.

---

#### Reports

Report generation.

---

#### Administration

System governance.

---

#### Notifications

Communication.

---

#### Health

Operational monitoring.

---

### 13.4 Standard Request Lifecycle

Every request follows the same pipeline.

```text
Client
   │
   ▼
Authentication
   │
   ▼
Authorization
   │
   ▼
Validation
   │
   ▼
Business Service
   │
   ▼
Memory Retrieval
   │
   ▼
Agent Processing
   │
   ▼
Database Transaction
   │
   ▼
Audit Logging
   │
   ▼
Response
```

This consistent lifecycle simplifies debugging, auditing, and monitoring.

---

### 13.5 Standard Response Format

Every successful response follows a common structure.

```json
{
  "success": true,
  "data": {},
  "metadata": {
    "requestId": "...",
    "timestamp": "...",
    "version": "v1"
  }
}
```

---

Errors follow a similar pattern.

```json
{
  "success": false,
  "error": {
    "code": "INCIDENT_NOT_FOUND",
    "message": "...",
    "details": {}
  }
}
```

Uniform response structures simplify frontend integration.

---

### 13.6 Authentication API

Responsibilities:

* Login
* Logout
* Refresh Tokens
* MFA Verification
* Password Reset
* Session Management

Representative endpoints:

```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

---

### 13.7 Incident API

Supports the complete incident lifecycle.

Representative endpoints:

```
GET    /incidents
GET    /incidents/{id}
POST   /incidents
PATCH  /incidents/{id}
DELETE /incidents/{id}
```

Additional operations:

```
POST /incidents/{id}/assign
POST /incidents/{id}/close
POST /incidents/{id}/archive
```

---

### 13.8 Collective Memory API

Provides direct interaction with organizational memory.

Representative endpoints:

```
GET  /memory
GET  /memory/{id}
POST /memory/search
POST /memory/promote
POST /memory/reflect
```

Capabilities:

* Semantic search
* Similar incident retrieval
* Reflection creation
* Lesson promotion
* Memory relationships

---

### 13.9 Agent API

Manages autonomous agents.

Representative endpoints:

```
GET /agents
GET /agents/{id}
POST /agents/tasks
POST /agents/restart
POST /agents/synchronize
```

Responses include:

* Agent health
* Running tasks
* Confidence
* Memory statistics

---

### 13.10 Recommendation API

Supports AI-generated operational guidance.

Representative endpoints:

```
GET /recommendations
POST /recommendations/generate
POST /recommendations/{id}/approve
POST /recommendations/{id}/reject
```

Recommendations include:

* Evidence
* Supporting memories
* Confidence
* Participating agents

---

### 13.11 Resource API

Manages operational assets.

Representative endpoints:

```
GET /resources
POST /resources
PATCH /resources/{id}
POST /resources/allocate
POST /resources/release
```

---

### 13.12 Analytics API

Supports dashboards and reporting.

Representative endpoints:

```
GET /analytics/dashboard
GET /analytics/trends
GET /analytics/performance
GET /analytics/predictions
```

---

### 13.13 Reporting API

Provides document generation.

Representative endpoints:

```
POST /reports/generate
GET /reports
GET /reports/{id}
```

Supported formats:

* PDF
* CSV
* JSON

---

### 13.14 Administration API

Platform governance.

Endpoints include:

```
GET /users
GET /roles
GET /organizations
PATCH /settings
```

Administrative operations require elevated privileges.

---

### 13.15 Health & Monitoring API

Supports infrastructure monitoring.

Representative endpoints:

```
GET /health
GET /ready
GET /live
GET /metrics
```

These endpoints integrate with deployment platforms and monitoring systems.

---

### 13.16 Pagination Standards

Large collections support consistent pagination.

Parameters:

```
page
limit
sort
order
filter
```

Cursor-based pagination may be adopted for high-volume resources such as memories and audit logs.

---

### 13.17 Filtering Standards

Every list endpoint supports filtering.

Examples:

```
status

severity

region

disasterType

createdAfter

createdBefore

confidence
```

Filtering should remain composable across endpoints.

---

### 13.18 Idempotency

Operations that may be retried must be idempotent.

Examples:

* Incident creation
* Resource allocation
* Recommendation approval

Clients may provide idempotency keys to prevent duplicate processing during network retries.

---

### 13.19 API Security

Security measures include:

* JWT authentication.
* Role-Based Access Control.
* Organization isolation.
* Input validation.
* Rate limiting.
* Request signing for service-to-service communication.
* Audit logging.

Sensitive endpoints require additional authorization checks.

---

### 13.20 API Documentation

Every endpoint should be documented using OpenAPI.

Documentation includes:

* Purpose.
* Parameters.
* Request schema.
* Response schema.
* Error conditions.
* Authentication requirements.
* Example payloads.

This documentation serves as the authoritative reference for client developers.

---

### 13.21 Why This Phase Matters

The API Design & Service Contracts establish a consistent communication layer across ReliefGrid. By standardizing resource models, request lifecycles, authentication, responses, and error handling, the platform ensures reliable interaction between the frontend, backend services, AI agents, and external systems.

For Antigravity, these contracts provide clear guidance for generating REST endpoints, validation logic, and client integrations. For hackathon judges, they demonstrate disciplined interface design, emphasizing maintainability, interoperability, and production readiness.


---

## Part 2 — Core Endpoint Specifications

---


### 1. Incidents API (`/incidents`)

#### `POST /incidents`
* **Purpose:** Initialize a new emergency incident manually or via automated weather sensor triggers.
* **Access Level:** Commander, Coordinator, or System Agent
* **Request Schema:**
  ```json
  {
    "title": "string (required)",
    "category": "string (Flood | Fire | Weather | Infrastructure | Medical)",
    "severity": "string (Low | Medium | High | Critical)",
    "location_name": "string (required)",
    "latitude": "number (required, -90.0 to 90.0)",
    "longitude": "number (required, -180.0 to 180.0)",
    "lead_organization_id": "uuid (required)"
  }
  ```
* **Response Example (201 Created):**
  ```json
  {
    "id": "e238cbcf-b91c-4b53-90ea-471a2be10c14",
    "title": "Northern District Flood Event 2026",
    "category": "Flood",
    "severity": "Critical",
    "status": "Active",
    "location_name": "Northern District Sector 4",
    "latitude": 45.1097,
    "longitude": -122.6784,
    "lead_organization_id": "84c8a2ef-9f3a-4db3-bc1a-6df3ab21e330",
    "created_at": "2026-07-15T22:07:00Z",
    "updated_at": "2026-07-15T22:07:00Z"
  }
  ```

#### `GET /incidents`
* **Purpose:** Retrieve a paginated list of incidents. Filterable by status and severity.
* **Access Level:** All Authenticated Users
* **Query Parameters:**
  * `status`: `Active | Archived`
  * `severity`: `Low | Medium | High | Critical`
  * `page`: `integer (default 1)`
  * `limit`: `integer (default 10)`
* **Response Example (200 OK):**
  ```json
  {
    "incidents": [
      {
        "id": "e238cbcf-b91c-4b53-90ea-471a2be10c14",
        "title": "Northern District Flood Event 2026",
        "category": "Flood",
        "severity": "Critical",
        "status": "Active",
        "created_at": "2026-07-15T22:07:00Z"
      }
    ],
    "pagination": {
      "total_items": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 10
    }
  }
  ```

#### `GET /incidents/:id/timeline`
* **Purpose:** Retrieve the full chronological sequence of operations, agent observations, and human approvals for a specific incident.
* **Access Level:** All Authenticated Users
* **Response Example (200 OK):**
  ```json
  {
    "incident_id": "e238cbcf-b91c-4b53-90ea-471a2be10c14",
    "timeline": [
      {
        "timestamp": "2026-07-15T22:07:00Z",
        "event_type": "Incident Created",
        "description": "Northern District Flood Event 2026 created automatically.",
        "actor": "System"
      },
      {
        "timestamp": "2026-07-15T22:08:15Z",
        "event_type": "Memory Retrieved",
        "description": "Historical memory '2025 flood response: Sector 4 bridge collapse' retrieved via vector search.",
        "actor": "agent-coordinator-01"
      }
    ]
  }
  ```

---

### 2. Collective Memory Engine API (`/memories`)

#### `GET /memories/search`
* **Purpose:** Execute a high-performance pgvector cosine similarity search to retrieve relevant lessons learned or historical responses based on natural language queries.
* **Access Level:** Coordinator Agent, Specialist Agents, Commanders
* **Query Parameters:**
  * `query`: `string (required, e.g., 'bridge collapse evacuation routes')`
  * `limit`: `integer (default 5)`
  * `min_similarity`: `number (0.0 to 1.0 threshold, default 0.7)`
* **Response Example (200 OK):**
  ```json
  {
    "query": "bridge collapse evacuation routes",
    "matches": [
      {
        "memory_id": "4a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "type": "Lesson Learned",
        "content": "2025 flood response: Northern District Sector 4 bridge collapsed after 36 hours of rainfall exceeding 150mm. Recommend staging rescue boats at high-elevation depot.",
        "similarity_score": 0.892,
        "confidence": 0.95,
        "originating_agent_id": "agent-weather-01",
        "created_at": "2025-06-12T14:32:00Z"
      }
    ]
  }
  ```

#### `POST /memories`
* **Purpose:** Insert a new cognitive memory (observation, prediction, reflection, or decision outcome) to the CockroachDB `memories` table. Generates vector embeddings synchronously or asynchronously via Bedrock (Cohere Embed).
* **Access Level:** Coordinator Agent, Specialist Agents, PIO, or System Admin
* **Request Schema:**
  ```json
  {
    "type": "string (Observation | Prediction | Decision | Outcome | Reflection | Lesson Learned)",
    "incident_id": "uuid (optional)",
    "content": "string (required, detail text to embed)",
    "confidence": "number (0.00 to 1.00)",
    "originating_agent_id": "string (optional)",
    "metadata": "object (optional key-value mappings)"
  }
  ```
* **Response Example (210 Created / Embedded):**
  ```json
  {
    "memory_id": "8b9a23c4-df22-491a-8bb4-20a8d3e911c4",
    "type": "Reflection",
    "content": "Logistics deployment delayed by 45 minutes due to unmapped road blockage at coordinates (45.1120, -122.6810).",
    "confidence": 0.88,
    "originating_agent_id": "agent-logistics-01",
    "embedding_generated": true,
    "created_at": "2026-07-15T22:09:44Z"
  }
  ```

---

### 3. AI Agent Operations API (`/agents`)

#### `GET /agents`
* **Purpose:** Retrieve operational status, workload parameters, heartbeats, and memory reads/writes for the coordinator and specialist agents.
* **Access Level:** All Authenticated Users
* **Response Example (200 OK):**
  ```json
  {
    "agents": [
      {
        "id": "agent-coordinator-01",
        "role": "Coordinator",
        "status": "Available",
        "active_assignments_count": 0,
        "health": "Healthy",
        "last_heartbeat": "2026-07-15T22:06:55Z",
        "statistics": {
          "total_memory_reads": 451,
          "total_memory_writes": 98
        }
      },
      {
        "id": "agent-weather-01",
        "role": "Weather",
        "status": "Busy",
        "active_assignments_count": 1,
        "health": "Healthy",
        "last_heartbeat": "2026-07-15T22:06:58Z",
        "statistics": {
          "total_memory_reads": 122,
          "total_memory_writes": 84
        }
      }
    ]
  }
  ```

#### `POST /agents/:id/simulate-crash`
* **Purpose:** Force-kill the targeted agent process to demonstrate autonomous state preservation and context resumption.
* **Access Level:** System Admin or Developer
* **Response Example (200 OK):**
  ```json
  {
    "agent_id": "agent-weather-01",
    "status": "Terminated",
    "recovery_record_id": "rec-55f2-49ee-b12a-39c8942b101a",
    "message": "Process terminated. Task state serialized to agent_recovery_states in CockroachDB. Backup agent initialization scheduled immediately."
  }
  ```

---

### 4. Decision & Recommendation Engine API (`/recommendations`)

#### `GET /recommendations`
* **Purpose:** List recommendations generated by agents awaiting review, sorted by priority.
* **Access Level:** Commanders, Coordinators
* **Response Example (200 OK):**
  ```json
  {
    "recommendations": [
      {
        "id": "reco-99f1-4db8-99ac-1823ab1190bc",
        "incident_id": "e238cbcf-b91c-4b53-90ea-471a2be10c14",
        "title": "Stage Rescue Boats at Sector 4 North Depot",
        "summary": "Stage 4 rescue boats at high-elevation North Depot to counter imminent bridge failure and isolate residents.",
        "priority": "High",
        "confidence_score": 0.92,
        "approval_status": "Pending Approval",
        "created_at": "2026-07-15T22:08:45Z"
      }
    ]
  }
  ```

#### `GET /recommendations/:id/explain`
* **Purpose:** Retrieve the full explainability trace showing how the AI agent formulated the decision from its logical chain and pgvector-retrieved evidence.
* **Access Level:** Commanders, Coordinators
* **Response Example (200 OK):**
  ```json
  {
    "recommendation_id": "reco-99f1-4db8-99ac-1823ab1190bc",
    "title": "Stage Rescue Boats at Sector 4 North Depot",
    "confidence_score": 0.92,
    "originating_agent_id": "agent-logistics-01",
    "reasoning_steps": [
      "1. WeatherAgent predicted 180mm cumulative rainfall for next 24 hours.",
      "2. InfrastructureAgent identified Sector 4 bridge collapse vulnerability.",
      "3. Vector search retrieved 2025 flood event memory where Sector 4 evacuation was blocked for 8 hours due to lack of local boats.",
      "4. CoordinatorAgent synthesized advice: stage 4 rescue boats at high-elevation North Depot."
    ],
    "supporting_evidence": [
      {
        "memory_id": "4a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "similarity_score": 0.892,
        "summary": "2025 flood response: Northern District Sector 4 bridge collapsed. evacuate paths failed..."
      }
    ]
  }
  ```

#### `POST /recommendations/:id/approve`
* **Purpose:** Approve the recommendation, initiating action execution, notifying field units, and recording a new decision memory row.
* **Access Level:** Commander (Requires human-in-the-loop validation)
* **Request Schema:**
  ```json
  {
    "approved_by": "user-uuid (required)",
    "comments": "string (optional)"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "recommendation_id": "reco-99f1-4db8-99ac-1823ab1190bc",
    "status": "Approved",
    "decision_id": "dec-a3f2-4911-bb0c-44e8d8ee2910",
    "recorded_memory_id": "mem-e389-49dd-9a1c-b873a90eeab1",
    "message": "Recommendation approved. Decision record stored and execution flow dispatched."
  }
  ```

---

### 5. Resources API (`/resources`)

#### `POST /resources/allocate`
* **Purpose:** Allocate specific medical, logistical, or rescue resources to an active incident.
* **Access Level:** Coordinator, Logistics Officer, Medical Officer
* **Request Schema:**
  ```json
  {
    "incident_id": "uuid (required)",
    "resource_ids": ["array of uuid strings (required)"],
    "allocated_by": "uuid (required)"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "allocation_id": "alloc-992a-4db3-bc1a-6df3ab21e330",
    "allocated_resources": ["res-boat-01", "res-boat-02"],
    "incident_id": "e238cbcf-b91c-4b53-90ea-471a2be10c14",
    "status": "Allocated"
  }
  ```

---

### 6. Simulation Engine API (`/simulation`)

#### `POST /simulation/trigger`
* **Purpose:** Trigger a scripted disaster timeline (e.g., the Northern District flood event) to demonstrate the platform's multi-agent coordination, memory retrieval, agent crash resiliency, and dashboard updates.
* **Access Level:** Developers, Hackathon Judges (Demo Access)
* **Request Schema:**
  ```json
  {
    "scenario": "string (Flood Northern District | Wildfire Sector B)",
    "simulation_speed": "string (1x | 2x | 5x)"
  }
  ```
* **Response Example (202 Accepted):**
  ```json
  {
    "simulation_id": "sim-881c-4be2-ba11-209fae331c19",
    "scenario": "Flood Northern District",
    "status": "Running",
    "current_step": "Initialization",
    "estimated_duration_seconds": 300
  }
  ```

## Phase 15 — Security, Identity & Compliance

> **Designing a Zero-Trust Security Architecture for an AI-Native Emergency Response Platform**

---

### 15.1 Objective

This phase defines the security architecture that protects ReliefGrid's users, data, AI services, and operational workflows.

The objectives are to:

* Protect sensitive operational information.
* Prevent unauthorized access.
* Ensure data integrity.
* Preserve AI explainability.
* Maintain auditability.
* Enable secure multi-tenant deployments.
* Support regulatory compliance.

Security is designed as an architectural concern rather than a feature added after implementation.

---

### 15.2 Security Design Principles

The platform follows these foundational principles.

#### Zero Trust

No user, service, or device is implicitly trusted.

Every request must be authenticated, authorized, validated, and audited.

---

#### Least Privilege

Every identity receives only the permissions required to perform assigned responsibilities.

Permissions are continuously evaluated and minimized.

---

#### Defense in Depth

Multiple independent security controls protect every layer of the platform.

Examples include:

* Authentication
* Authorization
* Encryption
* Network isolation
* Monitoring
* Auditing

No single control is relied upon exclusively.

---

#### Secure by Default

Security-sensitive configuration should require explicit opt-out rather than opt-in.

Examples include:

* HTTPS only
* Encryption enabled
* Audit logging enabled
* Secure cookies
* MFA support

---

#### Continuous Verification

Identity and authorization decisions are continuously re-evaluated throughout a session.

Risk signals may trigger additional verification or restrict access.

---

### 15.3 Identity Architecture

Every actor within ReliefGrid possesses a verifiable digital identity.

Identity types include:

* Human users.
* AI agents.
* Backend services.
* AWS infrastructure.
* External integrations.

Each identity is authenticated independently.

---

### 15.4 Authentication

Authentication verifies identity before any protected operation.

Supported mechanisms include:

* Email and password.
* OAuth providers.
* Multi-factor authentication.
* Short-lived access tokens.
* Refresh tokens.
* Service-to-service credentials.

Future enterprise deployments may integrate with external identity providers through SAML or OpenID Connect.

---

### 15.5 Authorization

Authorization determines what authenticated identities are permitted to do.

ReliefGrid implements Role-Based Access Control (RBAC).

Representative roles include:

| Role                   | Capabilities                              |
| ---------------------- | ----------------------------------------- |
| Administrator          | Full platform administration              |
| Emergency Coordinator  | Manage incidents, approve recommendations |
| Operations Officer     | View and update operational data          |
| Medical Officer        | Access medical-specific workflows         |
| Infrastructure Officer | Manage infrastructure assessments         |
| Logistics Officer      | Coordinate resource allocation            |
| Analyst                | Read analytics and reports                |
| Observer               | Read-only access                          |

Permissions are enforced consistently across APIs, background jobs, and AI workflows.

---

### 15.6 Multi-Tenant Isolation

Organizations operate within isolated security boundaries.

Isolation applies to:

* Users.
* Incidents.
* Memories.
* Reports.
* AI recommendations.
* Analytics.
* Audit records.

Cross-organization access is prohibited unless explicitly authorized through administrative mechanisms.

---

### 15.7 Encryption Strategy

Data is protected both in transit and at rest.

#### In Transit

* HTTPS for all external communication.
* TLS for internal service communication where applicable.

---

#### At Rest

Sensitive data is encrypted within persistent storage, including:

* User information.
* Incident records.
* Collective Memory.
* Stored files.
* Generated reports.

Encryption keys are centrally managed.

---

### 15.8 Secret Management

Application secrets are never embedded within source code or container images.

Protected secrets include:

* Database credentials.
* API tokens.
* OAuth credentials.
* AWS access configuration.
* Third-party integration keys.

Secrets are rotated periodically and retrieved securely at runtime.

---

### 15.9 AI Security

AI introduces additional security considerations.

Controls include:

* Prompt validation.
* Context sanitization.
* Sensitive data filtering.
* Maximum context limits.
* Output validation.
* Recommendation explainability.
* Confidence thresholds.

AI responses should never bypass authorization or expose restricted information.

---

### 15.10 Collective Memory Security

Collective Memory contains organizational knowledge that may include sensitive operational information.

Security controls include:

* Organization-level isolation.
* Memory classification.
* Attribute-level access restrictions.
* Immutable audit history.
* Controlled promotion of institutional knowledge.

Agents retrieve only memories relevant to their assigned tasks.

---

### 15.11 API Security

Every API request passes through multiple security stages.

```text
Client
   │
   ▼
HTTPS
   │
   ▼
Authentication
   │
   ▼
Authorization
   │
   ▼
Input Validation
   │
   ▼
Business Rules
   │
   ▼
Audit Logging
   │
   ▼
Response
```

This layered approach reduces the likelihood of unauthorized or malformed requests affecting system behavior.

---

### 15.12 Input Validation

All external input is validated before processing.

Validation includes:

* Data type verification.
* Required fields.
* Length constraints.
* Enumeration validation.
* Geographic coordinate validation.
* File type restrictions.
* Payload size limits.

Invalid requests fail before reaching business logic.

---

### 15.13 Audit & Accountability

Every security-sensitive operation generates an immutable audit record.

Examples include:

* User authentication.
* Incident updates.
* Recommendation approvals.
* Memory promotion.
* Administrative configuration changes.
* Role assignments.

Each record captures:

* Actor.
* Action.
* Target resource.
* Timestamp.
* Outcome.
* Correlation identifier.

---

### 15.14 AI Decision Traceability

Every AI-generated recommendation maintains a complete evidence trail.

Stored metadata includes:

* Contributing agents.
* Supporting memories.
* Source incidents.
* Confidence values.
* Model version.
* Prompt version.
* Retrieval identifiers.

Users can inspect why a recommendation was generated.

---

### 15.15 Rate Limiting & Abuse Prevention

The platform protects against excessive or malicious requests.

Measures include:

* Request rate limits.
* Burst controls.
* Authentication throttling.
* API quotas.
* Automated temporary blocking for repeated failures.

These controls help maintain availability during both normal operations and attempted abuse.

---

### 15.16 Compliance Considerations

The architecture is designed to support organizational compliance requirements.

Key considerations include:

* Data minimization.
* Access accountability.
* Retention policies.
* Auditability.
* Secure deletion workflows.
* Explainable AI.
* Privacy by design.

Specific compliance frameworks can be adopted according to deployment requirements.

---

### 15.17 Incident Response for Security Events

Security incidents follow a structured lifecycle.

```text
Detection
    │
    ▼
Classification
    │
    ▼
Containment
    │
    ▼
Investigation
    │
    ▼
Remediation
    │
    ▼
Recovery
    │
    ▼
Post-Incident Review
```

Lessons learned from security incidents may be promoted into the Collective Memory to improve future resilience.

---

### 15.18 Security Monitoring

Operational security is continuously monitored.

Metrics include:

* Failed authentication attempts.
* Privilege escalation attempts.
* API anomalies.
* AI request failures.
* Suspicious retrieval patterns.
* Infrastructure alerts.
* Configuration drift.

Monitoring supports rapid detection of abnormal behavior.

---

### 15.19 Security Architecture Summary

```text
Users / Services
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Input Validation
        │
        ▼
Business Services
        │
        ▼
Collective Memory
        │
        ▼
Audit Logging
        │
        ▼
Monitoring & Alerts
```

Every request traverses multiple independent security layers before interacting with protected resources.

---

### 15.20 Why This Phase Matters

Security underpins the trustworthiness of ReliefGrid. By adopting zero-trust principles, role-based authorization, encryption, comprehensive auditing, and explainable AI governance, the platform is designed to protect sensitive emergency response data while enabling accountable collaboration between users and autonomous agents.

This architecture demonstrates that ReliefGrid is intended for mission-critical environments where operational integrity, transparency, and resilience are essential. It provides Antigravity with clear security requirements for implementation and shows hackathon judges that security has been integrated into every layer of the system rather than treated as an afterthought.


---

## Part 2 — Operational Access Controls & Governance Policies

---

### Security Philosophy & Governance
ReliefGrid follows a **trust-by-design architecture** where security controls are built directly into agents, memory, databases, cloud configurations, and human approval workflows. The system guarantees confidentiality, integrity, availability, and auditability.
The central governance principle:
> AI agents recommend and coordinate, but critical decisions must remain transparent, traceable, and governed.

### Security Architecture Layers
```text id="5m3h5a"
              User Security Layer
                       │
          Application Security Layer
                       │
              Agent Security Layer
                       │
              Memory Security Layer
                       │
         Infrastructure Security Layer
```

### Role-Based Access Control (RBAC)
ReliefGrid defines five operational user roles:
1. **Emergency Operations Commander:** Can view all incidents, approve recommendations, access reports, and monitor agents. Restrained from modifying base system configs.
2. **Disaster Response Coordinator:** Can create incidents, assign tasks, and review agent outputs.
3. **Medical Operations Officer:** Can access healthcare-specific memories and update medical resource tables. Restricted from access to unrelated logistics/transportation operations.
4. **Government Administrator:** Accesses regional analytics and generates high-level summaries/reports.
5. **Public Information Officer (PIO):** Can review and modify generated communication drafts and authorize public announcements.

### Agent Permission Architecture
Agents operate under strict **least-privilege access**:
* *Weather Agent:* Permitted to read weather records, environmental predictions, and historical climate tables. Restricted from medical resources and government reports.
* *Medical Agent:* Permitted to read/write healthcare memories and medical resource tables. Restricted from infrastructure configurations.
* *Logistics Agent:* Accesses transport resources and supply distribution tables.
* *Coordinator Agent:* Broad read access across tables to orchestrate collaboration and consolidate findings, restricted from direct action execution.

### Agent Action Governance & Human-in-the-Loop
Actions are classified into three risk tiers:
* *Low-Risk:* Automated execution (memory retrieval, data analysis, draft recommendations).
* *Medium-Risk:* Automated execution with alert logs (task reassignments, resource prioritization).
* *High-Risk:* **Human-in-the-Loop required** (evacuation declarations, public alerts, critical asset deployments).

```text
Agent Analysis ──> Recommendation ──> Human Review ──> Approval / Edit ──> Execution ──> Outcome Memory
```

### Memory Security & Integrity
* **Memory Access Controls:** Memory rows carry classification markers (e.g. Confidential, Public, Sensitive) and agent ownership metadata to restrict queries dynamically.
* **Integrity Protection:** Checks for inconsistent entries (e.g. conflicting fleet counts from Logistics vs Medical Agents). Conflicting data triggers a validation incident record requesting human clarification.
* **Audit Trail Architecture:** Every write, retrieval, decision, and system recovery event logs: timestamp, actor (agent/user ID), action type, affected row, and justification.

### AI Explainability & Data Privacy
* **Explainability Panel:** Every AI recommendation links to its supporting evidence (exact historical incident IDs retrieved), confidence score (percentage), reasoning chain, and alternatives evaluated.
* **Data Minimization & Encryption:** Sensitive data (personal details, hospital records) are encrypted at rest and in transit. Only necessary operational statistics are stored in memory.

### Platform-Level Security Integration
* **CockroachDB security:** Integrates SQL roles, serializable transactions to prevent race-condition exploits, and cluster audit logging.
* **AWS security:** IAM roles control Lambda function boundaries. S3 objects utilize bucket policies and customer-managed KMS keys.
* **Recovery Security:** If an agent crashes, the monitoring system terminates the process, writes an audit state snapshot, validates the replacement instance's identity, restores context permissions, and resumes execution.

## Phase 16 — DevOps, CI/CD & Observability

> **Designing the Engineering Lifecycle for Continuous Delivery, Reliability, and Operational Excellence**

---

### 16.1 Objective

This phase defines the software delivery and operational engineering practices used throughout ReliefGrid.

The objectives are to:

* Deliver software rapidly and safely.
* Maintain deployment consistency.
* Automate quality assurance.
* Improve operational visibility.
* Minimize production risk.
* Enable rapid recovery.
* Support future engineering growth.

Every change to the platform should be traceable, testable, observable, and reversible.

---

### 16.2 DevOps Philosophy

ReliefGrid adopts modern DevOps principles.

#### Automation First

Manual deployment steps should be eliminated wherever practical.

Builds, tests, deployments, and infrastructure provisioning are automated.

---

#### Continuous Integration

Every code change is validated before being merged.

Validation includes:

* Static analysis.
* Formatting.
* Unit testing.
* Type checking.
* Security scanning.

---

#### Continuous Delivery

Every successful build should be deployable at any time.

Deployment remains predictable and repeatable across all environments.

---

#### Observability by Design

Monitoring is integrated into every service.

Metrics, logs, and traces are treated as core engineering artifacts rather than optional diagnostics.

---

#### Infrastructure as Code

Infrastructure configuration is version-controlled and reproducible.

Environment provisioning should never depend on undocumented manual configuration.

---

### 16.3 Source Code Strategy

ReliefGrid is maintained within a monorepository.

```text
reliefgrid/
├── apps/
│   ├── web/
│   └── api/
├── agents/
├── packages/
├── infrastructure/
├── database/
├── docs/
└── scripts/
```

This structure simplifies dependency management, shared libraries, and coordinated releases.

---

### 16.4 Branching Model

Development follows a structured branching strategy.

```text
main
│
├── develop
│
├── feature/*
│
├── bugfix/*
│
├── hotfix/*
│
└── release/*
```

Branch protections require successful automated validation before merging into protected branches.

---

### 16.5 Pull Request Workflow

Every pull request follows a standardized review process.

Pipeline:

```text
Developer
    │
    ▼
Feature Branch
    │
    ▼
Pull Request
    │
    ▼
Automated Validation
    │
    ▼
Code Review
    │
    ▼
Approval
    │
    ▼
Merge
    │
    ▼
Deployment Pipeline
```

No direct commits are permitted to protected branches.

---

### 16.6 Continuous Integration Pipeline

Each commit triggers an automated CI workflow.

Pipeline stages include:

1. Dependency installation.
2. Code formatting verification.
3. Linting.
4. Type checking.
5. Unit testing.
6. Integration testing.
7. Build verification.
8. Security scanning.
9. Artifact generation.

A failed stage blocks downstream deployment.

---

### 16.7 Build Artifacts

Every successful build produces immutable artifacts.

Artifacts include:

* Frontend build.
* Backend container image.
* Documentation.
* API specification.
* Database migration package.

Artifacts are versioned and traceable to the originating commit.

---

### 16.8 Deployment Environments

ReliefGrid supports multiple isolated environments.

| Environment | Purpose                    |
| ----------- | -------------------------- |
| Local       | Developer workstation      |
| Development | Active feature integration |
| Staging     | Pre-production validation  |
| Production  | Live operational system    |

Configuration differences are managed through environment variables and infrastructure definitions.

---

### 16.9 Containerization Strategy

Backend services are packaged as Docker containers.

Container principles:

* Immutable images.
* Minimal base images.
* Non-root execution.
* Versioned releases.
* Reproducible builds.

Containers ensure consistent behavior across environments.

---

### 16.10 Infrastructure as Code

Infrastructure definitions are maintained alongside application code.

Managed resources include:

* Networking.
* IAM roles.
* Storage.
* Monitoring.
* Compute resources.
* Security policies.

Version-controlled infrastructure simplifies auditing and disaster recovery.

---

### 16.11 Deployment Strategy

Deployments follow progressive rollout principles.

Typical workflow:

```text
Build
   │
   ▼
Validation
   │
   ▼
Deploy to Staging
   │
   ▼
Smoke Tests
   │
   ▼
Approval
   │
   ▼
Production Deployment
```

Future production deployments may adopt blue-green or canary strategies to minimize operational risk.

---

### 16.12 Rollback Strategy

Every deployment must be reversible.

Rollback includes:

* Application version.
* Infrastructure changes.
* Database migrations (where supported).
* Configuration updates.

Rollback procedures are documented and tested.

---

### 16.13 Logging Architecture

All platform components emit structured logs.

Standard fields include:

* Timestamp.
* Service name.
* Severity.
* Correlation ID.
* Request ID.
* User ID (when applicable).
* Organization ID.
* Incident ID.

Logs are centrally aggregated for analysis and troubleshooting.

---

### 16.14 Metrics Collection

Operational metrics provide visibility into platform health.

Representative metrics:

* API latency.
* Request throughput.
* Error rates.
* Active incidents.
* AI response time.
* Memory retrieval latency.
* Recommendation generation duration.
* Agent utilization.

Metrics support both operational monitoring and capacity planning.

---

### 16.15 Distributed Tracing

Every request is assigned a correlation identifier.

Tracing enables engineers to follow requests across:

* Frontend.
* API.
* AI orchestration.
* Collective Memory.
* AWS services.
* Background jobs.

This is particularly valuable in distributed, event-driven architectures.

---

### 16.16 Health Checks

Each service exposes health endpoints.

Checks include:

* Application readiness.
* Database connectivity.
* External dependency status.
* AI service availability.
* Queue health.

Health information supports automated orchestration and recovery.

---

### 16.17 Alerting Strategy

Operational alerts are generated for conditions such as:

* Elevated error rates.
* Service downtime.
* Failed deployments.
* High latency.
* Database connectivity issues.
* AI service failures.
* Resource exhaustion.

Alerts are prioritized by severity to reduce alert fatigue.

---

### 16.18 Engineering Dashboards

Operational dashboards provide a unified view of platform health.

Dashboards include:

* Deployment status.
* API performance.
* Agent activity.
* Memory engine performance.
* Incident volume.
* Infrastructure health.
* Security events.

These dashboards enable rapid situational awareness for engineering teams.

---

### 16.19 Operational Runbooks

Common operational procedures are documented.

Runbooks cover:

* Deployment.
* Rollback.
* Database recovery.
* Incident response.
* AI service degradation.
* Infrastructure failures.

Standardized procedures improve consistency during operational events.

---

### 16.20 Continuous Improvement

Operational data feeds back into engineering processes.

Examples include:

* Performance optimization.
* Reliability improvements.
* Deployment refinements.
* Test coverage expansion.
* AI workflow tuning.

Lessons learned become part of the Collective Memory, reinforcing the platform's philosophy of continuous organizational learning.

---

### 16.21 DevOps Lifecycle

```text
Plan
   │
   ▼
Develop
   │
   ▼
Commit
   │
   ▼
Continuous Integration
   │
   ▼
Automated Testing
   │
   ▼
Artifact Generation
   │
   ▼
Staging Deployment
   │
   ▼
Validation
   │
   ▼
Production Deployment
   │
   ▼
Monitoring
   │
   ▼
Feedback
   │
   ▼
Continuous Improvement
```

This lifecycle establishes a repeatable engineering process from code creation through ongoing operations.

---

### 16.22 Why This Phase Matters

DevOps, CI/CD, and observability transform ReliefGrid from a software project into an operational platform. Automated pipelines, reproducible infrastructure, structured deployments, centralized monitoring, and comprehensive telemetry ensure that changes can be delivered safely while maintaining high reliability.

For Antigravity, this chapter defines the engineering practices that should accompany the generated codebase. For hackathon judges, it demonstrates that ReliefGrid has been designed with production operations in mind, emphasizing maintainability, resilience, and long-term sustainability alongside technical innovation.

## Phase 17 — Testing & Quality Assurance

> **Verifying the Reliability, Correctness, and Trustworthiness of ReliefGrid**

---

### 17.1 Objective

This phase defines the comprehensive testing strategy for ReliefGrid.

The objectives are to:

* Validate business functionality.
* Verify AI reasoning quality.
* Ensure data integrity.
* Confirm system resilience.
* Detect regressions.
* Protect security.
* Measure operational performance.

Testing spans every layer of the platform, from user interfaces to distributed infrastructure and autonomous agent collaboration.

---

### 17.2 Testing Philosophy

Testing follows several core principles.

#### Shift Left

Testing begins during development rather than after implementation.

Developers are responsible for validating changes before code review.

---

#### Automation First

Repeatable tests should be automated wherever practical.

Manual testing is reserved for exploratory, usability, and acceptance scenarios.

---

#### Layered Verification

Every architectural layer is independently validated before end-to-end testing.

---

#### AI-Aware Testing

LLM-based functionality is evaluated using measurable quality metrics rather than assuming deterministic outputs.

---

#### Continuous Validation

Testing occurs throughout the software lifecycle, including development, deployment, and production monitoring.

---

### 17.3 Testing Pyramid

```text id="testing-pyramid"
                Manual Acceptance
                      ▲
                 End-to-End Tests
                      ▲
             Integration & API Tests
                      ▲
          Unit Tests & Component Tests
```

Lower-level tests provide broad coverage and fast feedback, while higher-level tests validate complete user workflows.

---

### 17.4 Unit Testing

#### Purpose

Verify individual functions, classes, and modules in isolation.

---

#### Coverage

Frontend:

* Components
* Hooks
* Utility functions
* State management

Backend:

* Business services
* Validation
* Domain models
* Utility modules

Agents:

* Planning logic
* Decision scoring
* Memory selection
* Recommendation generation

---

#### Success Criteria

* Fast execution.
* Deterministic results.
* High code coverage.
* No external dependencies.

---

### 17.5 Integration Testing

#### Purpose

Verify interactions between components.

Examples include:

* API ↔ CockroachDB
* Backend ↔ Bedrock
* Backend ↔ S3
* Agent ↔ Memory Engine
* Coordinator ↔ Specialist Agents

---

#### Objectives

Ensure data flows correctly across service boundaries.

---

### 17.6 API Contract Testing

Every API endpoint is validated against its published contract.

Verification includes:

* Request validation.
* Response schema.
* Error handling.
* Authentication.
* Authorization.
* Pagination.
* Filtering.

Breaking changes are detected before deployment.

---

### 17.7 End-to-End Testing

Complete operational scenarios are executed from the user's perspective.

Example scenario:

```text id="e2e-flow"
Create Incident
      │
      ▼
Coordinator Activated
      │
      ▼
Agents Collaborate
      │
      ▼
Memory Retrieved
      │
      ▼
Recommendation Generated
      │
      ▼
User Approval
      │
      ▼
Report Produced
```

Success is measured by the correctness and completeness of the entire workflow.

---

### 17.8 Multi-Agent Testing

The autonomous agent ecosystem requires dedicated validation.

Tests include:

* Task delegation.
* Agent collaboration.
* Consensus formation.
* Failure recovery.
* Retry behavior.
* Coordination latency.
* Concurrent execution.

These tests confirm that specialist agents operate cohesively under orchestration.

---

### 17.9 Collective Memory Testing

The Collective Memory Engine is validated independently.

Test areas include:

* Memory creation.
* Promotion workflows.
* Reflection generation.
* Version control.
* Relationship integrity.
* Lifecycle transitions.
* Retention rules.

No memory should become institutional knowledge without satisfying governance requirements.

---

### 17.10 Semantic Retrieval Evaluation

Retrieval quality directly influences AI recommendations.

Evaluation metrics include:

| Metric            | Purpose                       |
| ----------------- | ----------------------------- |
| Precision         | Relevant memories retrieved   |
| Recall            | Important memories not missed |
| Relevance Score   | Semantic quality              |
| Retrieval Latency | Response speed                |
| Ranking Accuracy  | Ordering quality              |

Benchmark datasets are used to compare retrieval performance over time.

---

### 17.11 AI Recommendation Evaluation

AI outputs are assessed against objective criteria.

Evaluation dimensions:

* Correctness.
* Explainability.
* Evidence quality.
* Confidence calibration.
* Completeness.
* Actionability.
* Safety.

Recommendations should consistently reference supporting memories and operational evidence.

---

### 17.12 Memory Regression Testing

Changes to embedding models, ranking algorithms, or retrieval logic must not degrade existing performance.

Regression tests compare:

* Retrieval quality.
* Recommendation consistency.
* Memory relevance.
* Confidence distributions.

Historical benchmarks provide reference points for comparison.

---

### 17.13 Performance Testing

Performance tests validate system responsiveness under expected operational load.

Representative scenarios:

* Concurrent incident creation.
* Simultaneous AI requests.
* Large-scale memory retrieval.
* Bulk report generation.
* High-volume API traffic.

Performance targets established in earlier phases are verified.

---

### 17.14 Load & Stress Testing

Load testing evaluates sustained operational capacity.

Stress testing explores system behavior beyond expected limits.

Metrics include:

* Throughput.
* Latency.
* Error rates.
* Recovery time.
* Resource utilization.

Graceful degradation is preferred over catastrophic failure.

---

### 17.15 Security Testing

Security validation includes:

* Authentication testing.
* Authorization testing.
* Session management.
* Input validation.
* Injection resistance.
* Access control verification.
* Rate limiting.
* Secret handling.

Security testing complements architectural controls defined in Phase 15.

---

### 17.16 Resilience Testing

Failure scenarios are intentionally introduced.

Examples:

* Agent failure.
* Database latency.
* AI service unavailability.
* Network interruption.
* Storage failure.
* Partial infrastructure outage.

The platform should recover predictably without compromising data integrity.

---

### 17.17 Disaster Simulation Testing

Representative emergency scenarios are replayed.

Examples:

* Flood.
* Earthquake.
* Wildfire.
* Disease outbreak.
* Infrastructure collapse.

These simulations validate the platform's operational behavior under realistic conditions.

---

### 17.18 User Acceptance Testing (UAT)

Representative stakeholders validate the platform against operational expectations.

Example participants:

* Emergency coordinators.
* Medical responders.
* Logistics officers.
* Infrastructure specialists.

Feedback informs usability improvements and workflow refinements.

---

### 17.19 Test Data Strategy

Testing uses representative datasets that mirror real operational conditions.

Data includes:

* Historical incidents.
* Synthetic disaster scenarios.
* Resource inventories.
* Geographic information.
* Communication records.

Sensitive production information should never be used directly.

---

### 17.20 Continuous Quality Dashboard

Quality metrics are continuously monitored.

Dashboard indicators include:

* Test pass rate.
* Code coverage.
* API reliability.
* AI evaluation score.
* Retrieval quality.
* Security findings.
* Performance trends.

Engineering teams use these metrics to prioritize improvements.

---

### 17.21 Testing Lifecycle

```text id="testing-lifecycle"
Requirements
      │
      ▼
Unit Testing
      │
      ▼
Integration Testing
      │
      ▼
API Validation
      │
      ▼
AI Evaluation
      │
      ▼
Performance Testing
      │
      ▼
Security Testing
      │
      ▼
End-to-End Validation
      │
      ▼
User Acceptance
      │
      ▼
Production Monitoring
```

This lifecycle ensures quality assurance extends beyond development into ongoing operations.

---

### 17.22 Why This Phase Matters

Testing for ReliefGrid extends beyond traditional software verification to encompass autonomous reasoning, collective memory, semantic retrieval, and multi-agent coordination. By validating not only functional correctness but also AI explainability, retrieval quality, resilience, and operational performance, the platform builds confidence that recommendations are reliable and evidence-based.

For Antigravity, this chapter provides clear quality requirements that can guide test generation alongside application code. For hackathon judges, it demonstrates a mature engineering approach to AI systems, emphasizing measurable quality, safety, and continuous verification rather than treating large language model outputs as inherently trustworthy.


## Phase 18 — Production Deployment & Operations

## Part 1 — Enterprise Operational Strategy

> **Operating ReliefGrid as a Mission-Critical Emergency Response Platform**

---

### 18.1 Objective

This phase defines the operational strategy for deploying, operating, maintaining, and evolving ReliefGrid in production.

The objectives are to:

* Ensure continuous availability.
* Support safe software releases.
* Minimize operational risk.
* Enable rapid incident recovery.
* Maintain AI service reliability.
* Preserve organizational knowledge.
* Provide operational governance.

Deployment is viewed as the beginning of the operational lifecycle rather than its conclusion.

---

### 18.2 Production Operating Principles

ReliefGrid is designed according to the following operational principles.

#### Reliability First

Emergency response systems must prioritize availability and correctness over feature velocity.

---

#### Controlled Change

Every production change follows an approved deployment process.

Uncontrolled production modifications are prohibited.

---

#### Continuous Monitoring

Operational health is continuously measured through telemetry, metrics, logs, and alerts.

---

#### Recoverability

Failures are expected.

Recovery procedures must be documented, automated where practical, and regularly validated.

---

#### Operational Transparency

Engineers and administrators should always understand:

* System health.
* AI health.
* Memory health.
* Infrastructure health.
* Deployment status.

---

### 18.3 Deployment Topology

ReliefGrid is deployed as a collection of independently scalable services.

```text id="deployment-topology"
                   Users
                     │
                     ▼
             Next.js Frontend
                     │
                     ▼
              API Gateway Layer
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
Incident Service  Agent Service  Memory Service
      │              │              │
      └───────┬──────┴──────┬───────┘
              ▼             ▼
         CockroachDB    Amazon Bedrock
              │
              ▼
         Amazon S3
```

Each service can scale independently based on operational demand.

---

### 18.4 Environment Promotion Strategy

Software progresses through controlled environments.

```text id="promotion-flow"
Local
   │
   ▼
Development
   │
   ▼
Staging
   │
   ▼
Production
```

Promotion requires successful validation at each stage.

---

### 18.5 Release Management

Each production release follows a standardized lifecycle.

1. Feature completion.
2. Automated validation.
3. Code review.
4. Staging deployment.
5. Smoke testing.
6. Operational approval.
7. Production deployment.
8. Post-release verification.

Each release is versioned and documented.

---

### 18.6 Production Readiness Checklist

Before deployment, every release should confirm:

* All automated tests pass.
* Database migrations are verified.
* API contracts remain compatible.
* Infrastructure changes are reviewed.
* Monitoring dashboards are updated.
* Alert rules are configured.
* Rollback procedures are documented.
* Security scans show no critical issues.

Deployment proceeds only when readiness criteria are satisfied.

---

### 18.7 Scaling Strategy

The platform supports horizontal scaling across major components.

Scalable services include:

* API instances.
* AI orchestration workers.
* Specialist agents.
* Background processing.
* Memory indexing.
* Report generation.

CockroachDB expands by adding nodes rather than vertically scaling a single database instance.

---

### 18.8 Operational Capacity Planning

Capacity planning considers:

* Active incidents.
* Concurrent users.
* AI inference volume.
* Memory growth.
* Report generation frequency.
* File storage consumption.

Regular capacity reviews ensure infrastructure remains aligned with operational demand.

---

### 18.9 Operational Monitoring

The operations team monitors:

* Service availability.
* API latency.
* AI inference success.
* Collective Memory indexing.
* Recommendation generation.
* Database performance.
* Infrastructure utilization.

Monitoring supports early detection of abnormal behavior.

---

### 18.10 Incident Management

Operational incidents follow a structured process.

```text id="ops-incident-flow"
Detection
     │
     ▼
Assessment
     │
     ▼
Assignment
     │
     ▼
Mitigation
     │
     ▼
Resolution
     │
     ▼
Root Cause Analysis
     │
     ▼
Lessons Learned
```

Lessons from operational incidents may be promoted into the Collective Memory.

---

### 18.11 Disaster Recovery Strategy

Disaster recovery addresses catastrophic failures affecting infrastructure or data.

Recovery objectives include:

* Restoration of critical services.
* Preservation of organizational memory.
* Verification of data integrity.
* Controlled return to normal operations.

Recovery procedures are documented and periodically exercised.

---

### 18.12 Recovery Objectives

Representative operational targets:

| Metric                         | Target       |
| ------------------------------ | ------------ |
| Recovery Time Objective (RTO)  | ≤ 30 minutes |
| Recovery Point Objective (RPO) | ≤ 5 minutes  |
| Critical API Availability      | ≥ 99.9%      |
| Collective Memory Availability | ≥ 99.95%     |

These targets provide measurable operational expectations and may evolve as the platform matures.

---

### 18.13 Backup Strategy

Critical data is protected through multiple backup layers.

Coverage includes:

* CockroachDB backups.
* Amazon S3 object versioning.
* Configuration snapshots.
* Infrastructure definitions.
* Deployment artifacts.

Backup verification is performed regularly to ensure recoverability.

---

### 18.14 Operational Runbooks

Standardized runbooks guide engineers during common operational tasks.

Examples include:

* Production deployment.
* Rollback.
* AI service degradation.
* CockroachDB recovery.
* Memory re-indexing.
* Infrastructure scaling.
* Security incident response.

Runbooks reduce operational variability and improve response consistency.

---

### 18.15 Maintenance Windows

Routine maintenance activities are planned and communicated.

Activities include:

* Infrastructure updates.
* Database maintenance.
* Security patching.
* Dependency upgrades.
* Performance tuning.

Critical emergency fixes may occur outside scheduled maintenance windows when necessary.

---

### 18.16 Service Lifecycle Management

Every service follows a defined lifecycle.

```text id="service-lifecycle"
Design
   │
   ▼
Development
   │
   ▼
Testing
   │
   ▼
Deployment
   │
   ▼
Monitoring
   │
   ▼
Optimization
   │
   ▼
Retirement
```

This lifecycle promotes consistent governance across all platform services.

---

### 18.17 Operational Governance

Operational governance defines accountability for production systems.

Responsibilities include:

* Release approval.
* Infrastructure ownership.
* Security oversight.
* AI model governance.
* Collective Memory governance.
* Compliance reporting.

Clear ownership supports effective operational decision-making.

---

### 18.18 Continuous Operational Improvement

Operational telemetry feeds continuous improvement initiatives.

Insights drive:

* Performance optimization.
* Reliability enhancements.
* AI workflow refinement.
* Retrieval improvements.
* Capacity adjustments.
* User experience enhancements.

Operational learning reinforces the platform's philosophy of continuous organizational intelligence.

---

### 18.19 Production Operations Overview

```text id="production-operations"
Deploy
   │
   ▼
Validate
   │
   ▼
Monitor
   │
   ▼
Detect Issues
   │
   ▼
Respond
   │
   ▼
Recover
   │
   ▼
Review
   │
   ▼
Improve
```

This operational loop ensures that ReliefGrid remains resilient, observable, and continuously improving throughout its lifecycle.

---

### 18.20 Why This Phase Matters

Production deployment and operations define how ReliefGrid functions beyond development. By documenting deployment topology, release management, scaling strategies, monitoring, disaster recovery, governance, and operational improvement, the platform demonstrates readiness for sustained, mission-critical use.

For Antigravity, this chapter establishes the operational expectations that should inform deployment automation, infrastructure configuration, and maintenance tooling. For hackathon judges, it shows that ReliefGrid has been designed not merely as a prototype, but as a resilient, continuously operated platform capable of supporting real-world emergency response scenarios.


## Part 2 — MVP Deployment Configuration & Local Setup

ReliefGrid uses a two-layer deployment strategy. For the hackathon, the architecture is minimized to a focused MVP that proves agentic memory and distributed consistency without running into networking complexity. Post-hackathon, the platform scales to support multi-agency governance and geo-distributed disaster response.

### MVP Deployment Architecture
The hackathon environment maps local components directly to CockroachDB Cloud and serverless AWS resources:

```text
                  Local Desktop (Dev)              AWS Cloud & CockroachDB
             ┌───────────────────────────┐      ┌───────────────────────────┐
             │    ReliefGrid Dashboard   │      │       Amazon Bedrock      │
             │         (Vite/React)      │      │     (Claude 3.5 Sonnet)   │
             └─────────────┬─────────────┘      └─────────────┬─────────────┘
                           │                                  │
                           ▼                                  ▼
             ┌───────────────────────────┐      ┌───────────────────────────┐
             │      Backend API &        │      │        AWS Lambda         │
             │   Agent Orchestrator      ├─────>│    (Triggered Workflows)  │
             │       (Node.js)           │      └─────────────┬─────────────┘
             └─────────────┬─────────────┘                    │
                           │                                  ▼
                           ▼                    ┌───────────────────────────┐
             ┌───────────────────────────┐      │         Amazon S3         │
             │    CockroachDB Client     ├─────>│     (Artifact Buckets)    │
             │       (PG Driver)         │      └───────────────────────────┘
             └─────────────┬─────────────┘
                           │
                           ▼
             ┌───────────────────────────┐
             │     CockroachDB Cloud     │
             │   (SQL + pgvector memory) │
             └───────────────────────────┘
```

### Local Development Setup
* **Frontend:** A React application served via Vite, hosting the Operator Dashboard, Agent Monitor, and Memory Explorer.
* **Backend:** A Node.js API server coordinating the specialized agent workflows, parsing natural language queries, and interfacing with the CockroachDB database.
* **Agent Runtime:** A consolidated, unified process containing the Coordinator, Weather, Medical, Logistics, Shelter, and Infrastructure Agents. Consolidation minimizes runtime footprint and speeds up debugging during local iterations.
* **Database Connection:** Connects directly to a secure, remote CockroachDB Cloud Serverless instance via Postgres protocol.

### AWS Infrastructure Integration
* **Amazon Bedrock:** Accesses Claude 3.5 Sonnet and Cohere Embed for text generation, translation, planning, and vector embeddings.
* **AWS Lambda:** Hosts event-driven functions for background processing (e.g. periodically checking incident updates, parsing incoming reports, and compiling post-disaster PDFs).
* **Amazon S3:** Stores unstructured incident attachments, generated PDF summaries, and map image outputs.

### MVP Feature Prioritization
1. **Mandatory Core (Must Build):**
   * *Multi-Agent Coordination:* Coordinator agent successfully breaking down problems and assigning tasks.
   * *Persistent Collective Memory:* Agents writing to and reading from a shared CockroachDB instance.
   * *CockroachDB Vector Search:* Real-time semantic memory retrieval using pgvector.
   * *Agent Recovery:* Simulating agent crash, restoring task state from CockroachDB, and continuing execution.
   * *AWS Integration:* Powering agent reasoning with Amazon Bedrock.
2. **Key Differentiators (Demo Highlighters):**
   * *Memory Explorer UI:* A visualization panel allowing judges to browse the vector memory database in real-time.
   * *Agent Activity Timeline:* A visual trace showing agent message passing and database writes.
   * *Explainability Panel:* Explicit links in the UI showing exactly which historical memory records justified a recommendation.
   * *Incident Simulation Engine:* A dashboard control to trigger a pre-defined disaster scenario and observe agent workflows.

## Phase 19 — Error Handling, Exception Management & Fault Tolerance Architecture

> **Designing a High-Availability, Fault-Tolerant, Self-Healing System for Mission-Critical Coordination**

---

### 19.1 Error Handling Philosophy

ReliefGrid treats errors and operational failures as expected events rather than exceptional conditions. The platform is designed around the following architectural tenets:

* **Fail Fast:** Stop execution immediately when an unrecoverable condition occurs (e.g. invalid configuration or signature mismatch) to prevent cascading state corruption.
* **Fail Safe:** If a sub-system degrades, fall back to a secure, predictable state (e.g. read-only mode, using cached data).
* **Graceful Degradation:** Disable secondary capabilities (e.g. real-time weather analytics) while preserving the core lifecycle of incident management and manual coordination.
* **Self Healing:** Automated retry policies, container restarts, and database reconnection logic resolve transient outages without operator intervention.
* **Retry Before Failure:** Perform intelligent exponential backoff with jitter on network operations.
* **Never Lose Data:** Transaction logs, message queues, and persistent task tables guarantee that agent state is saved even during system crashes.
* **User Friendly Errors:** Shield operators from stack traces, showing clear explanations, correlation IDs, and actionable recovery steps in the UI.
* **Machine Friendly Errors:** Standardized structured JSON responses containing detailed machine-readable diagnostic details.
* **Structured Logging:** Output logs in unified JSON format with key metadata (Correlation ID, User ID, Agent ID, Incident ID).
* **Complete Traceability:** Correlate user operations, API requests, background worker tasks, and AI inference steps.

---

### 19.2 Global Exception Architecture

The platform defines a strict exception hierarchy, inherited from a base `ApplicationException`.

```text id="exception-hierarchy"
ApplicationException
├── ValidationException
├── AuthenticationException
├── AuthorizationException
├── BusinessRuleException
├── ResourceNotFoundException
├── ConflictException
├── RateLimitException
├── MemoryException
├── AgentException
├── AIException
├── DatabaseException
├── ExternalServiceException
├── InfrastructureException
├── ConfigurationException
├── TimeoutException
├── RetryExceededException
└── InternalServerException
```

Every exception within the system is initialized with a standard schema:

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_TRANSACTION_CONFLICT",
    "message": "The transaction could not be completed due to a concurrent write conflict. It will be automatically retried.",
    "severity": "ERROR",
    "correlation_id": "corr_9a8b7c6d5e4f",
    "timestamp": "2026-07-15T22:58:00.123Z",
    "details": {
      "table": "incident_tasks",
      "constraint": "uniq_task_coordinator"
    },
    "retry": {
      "should_retry": true,
      "retry_after_seconds": 2
    }
  }
}
```

---

### 19.3 Checked Exceptions

Checked exceptions represent expected operational failures that the system must detect and recover from:

* **Database Unavailable:** Pool exhaustion is mitigated by queuing writes locally and failing back to read replicas.
* **Memory / Vector Search Timeout:** Slow vector calculations trigger a fallback to traditional SQL keyword search.
* **Bedrock Timeout:** Network lag triggers fallback to alternative models or regions.
* **S3 Upload Failure:** Large uploads fail back to local temporary storage and retry periodically.
* **Embedding Generation Failure:** The memory engine queues the raw text and schedules offline embedding generation.
* **Conflict Retry / Serialization Failures:** Transactions aborted due to serializable read/write conflicts are immediately re-executed.
* **Rate Limiting:** Throttling limits trigger a client-side wait-and-retry cycle.

---

### 19.4 Unchecked Exceptions

Unchecked exceptions represent fatal programming bugs or corrupt runtime states:

* **Null Pointer References & Programming Bugs:** Standardized uncaught exception handlers catch these, log the stack trace, and quarantine the affected thread or process.
* **Serialization Failures:** Internal data corruption triggers service restarts.
* **Infinite Recursion / Stack Overflow:** Caught by execution boundary watchdogs.
* **Dependency Injection Failures:** Blocks startup during configuration checks.

If an unchecked exception occurs within an AI agent worker, the agent process is terminated immediately, and its current active tasks are reassigned to a new instance.

---

### 19.5 HTTP Exception Specification

Every REST and WebSocket endpoint maps exceptions to standard HTTP status codes:

* **400 Bad Request:** Payload malformed.
* **401 Unauthorized:** Invalid JWT token or expired session.
* **403 Forbidden:** Insufficient RBAC roles for the resource.
* **404 Not Found:** Entity does not exist.
* **409 Conflict:** State conflict (e.g. concurrent edits on the same incident).
* **422 Unprocessable Entity:** Failed schema validation (e.g. latitude out of range).
* **429 Too Many Requests:** Rate limit exceeded.
* **500 Internal Server Error:** Unexpected unchecked exception.
* **503 Service Unavailable:** Critical downstream dependency (e.g. database) is down.

---

### 19.6 CockroachDB Exception Handling

Because CockroachDB enforces strict transaction boundaries (SERIALIZABLE isolation), transaction conflicts (SQLState `40001` - Serialization Failure) are expected:

* **Serialization Retries:** Backend repositories implement automatic retry decorators. A query aborted due to a write skew or serialization conflict is automatically retried up to 5 times using exponential backoff with jitter.
* **Connection Failure & Node Outages:** Connection pool drivers monitor node health, routing queries away from unresponsive nodes to healthy nodes in the cluster.
* **Migration & Schema Conflicts:** Migrations execute with long lock timeouts and run asynchronously where possible to prevent blocking incident read/write queries.

---

### 19.7 AWS Exception Handling

* **Amazon Bedrock:** Throttling (`ThrottlingException`) is handled by scaling requests across multiple regions (e.g. falling back from `us-east-1` to `us-west-2`).
* **AWS Lambda:** Timeout limits are guarded by client-side timeouts. If a background worker Lambda hangs, the orchestration engine spawns a backup task.
* **Amazon S3:** S3 API errors trigger a local write buffer cache, ensuring user coordinate reports are preserved even during S3 outages.

---

### 19.8 Bedrock Exception Handling

* **Context Window Exceeded / Prompt Too Large:** The context management service detects prompt size limits beforehand and summarizes older working memory records.
* **Guardrail / Content Filter Triggers:** If Bedrock flags a prompt or response, the Agent Orchestrator intercepts it, writes a safety incident record, and falls back to a deterministic, rule-based template.
* **Model Unavailability:** If Claude 3.5 Sonnet is unavailable, the orchestrator automatically routes the task to Claude 3.5 Haiku or a locally hosted backup model.

---

### 19.9 Agent Exception Architecture

Autonomous reasoning requires dedicated fault boundaries:

* **Recursive Agent Loops:** A task monitor detects if two agents are repeatedly passing identical messages. The monitor interrupts the loop, revokes the task, and notifies the coordinator.
* **Hallucination Detection:** Out-of-bounds metrics (e.g. recommending non-existent resource IDs) flag recommendations for manual operator triage.
* **Confidence Score Warnings:** Recommendations with confidence levels under 65% are flagged as "low confidence" and require supervisor sign-off.
* **Agent Quarantine:** If an agent continuously throws errors, it is disabled, its tasks are re-assigned, and it is marked for developer inspection.

---

### 19.10 Collective Memory Exceptions

* **Duplicate Memory Injection:** Avoided by enforcing unique content hashing on memories.
* **Embedding Model Drift:** The vector storage system stores the model version alongside embeddings. If models change, old vectors are flagged for background regeneration.
* **Semantic Memory Conflicts:** Conflicting institutional instructions (e.g. contradictory shelter rules from different disaster logs) trigger a clarification request assigned to the admin user.

---

### 19.11 API Exception Framework

The API layer implements an interceptor middleware that:

* Validates the presence of an `X-Correlation-ID` header.
* Validates `Idempotency-Key` headers on all POST and PATCH calls.
* Maps Pydantic/TypeScript validation errors directly to structured 422 JSON envelopes.

---

### 19.12 Validation Exceptions

Data validation rules are strictly enforced:

* **DTO Schemas:** Strict boundaries on values (e.g., coordinate pairs must fall within valid geographic boundaries).
* **AI Output Schema Validation:** If an agent outputs invalid JSON that cannot be parsed into the expected schema, the orchestrator returns the error to the agent with feedback, requesting a corrected output schema.

---

### 19.13 Frontend Error Handling

The React application implements a robust UI resilience strategy:

* **React Error Boundaries:** Catch layout rendering errors and display a localized "Section unavailable" component rather than crashing the whole dashboard.
* **Offline Synchronization:** Local updates are saved to IndexedDB. When the internet connection is restored, a background synchronization worker commits changes to the API server.
* **Hydration & Suspense Fallbacks:** Sleek skeleton screens display during data fetching or server-side rendering delays.

---

### 19.14 Background Job Failure

Background processing uses transactional queues in CockroachDB:

* **Transactional Job Queuing:** Tasks are written to the database in the same transaction as the incident updates.
* **Dead Letter Queue (DLQ):** Jobs that fail repeatedly are moved to a DLQ table, notifying operational engineers.
* **Poison Message Protection:** Limits on task executions prevent bad input from repeatedly crashing workers.

---

### 19.15 Event Bus Exception Handling

Event dispatching is managed through transactional outboxes:

* **Outbox Pattern:** Events are written to a database table within the same transaction as business data changes, ensuring event publishing is tied to commit status.
* **Idempotent Handlers:** Event consumers use unique event IDs to detect and discard duplicate notifications.

---

### 19.16 Logging Strategy

Logging formats stack traces cleanly, masking private personal data (PII) before outputs are written:

```json
{
  "timestamp": "2026-07-15T22:58:10.456Z",
  "level": "ERROR",
  "service": "agent-orchestrator",
  "correlation_id": "corr_f3b2a1c0",
  "incident_id": "inc_9988",
  "agent_id": "agent_weather_01",
  "message": "Bedrock inference request timed out.",
  "exception": {
    "type": "AIException",
    "details": "Model bedrock.anthropic.claude-3-sonnet took longer than 15000ms"
  }
}
```

---

### 19.17 Retry Strategy

Network retries apply exponential backoff with full jitter to avoid storming downstream services:

$$t_{retry} = 2^{attempt} \times \text{base} + \text{random\_jitter}$$

* **Circuit Breaker Pattern:** Downstream services (e.g. external mapping APIs) are protected. If error rates exceed 50% in a 10-second window, the circuit opens, immediately returning cached data without querying the downstream server.

---

### 19.18 Compensation Transactions

ReliefGrid coordinates multi-service updates using a Saga design pattern:

```text id="saga-flow"
Step 1: Reserve Resources (Success) ──> Step 2: Dispatch Team (Fail)
                                                │
                                                ▼
Step 1 Comp: Cancel Reservation <───────────────┘
```

If dispatching fails, a compensation transaction is automatically executed to release reserved resources.

---

### 19.19 User Error Experience

The user interface uses non-intrusive notification patterns:

* **Dynamic Toast Notifications:** Explain transient issues (e.g., "Network reconnecting...").
* **Blocking Modals:** Used only for fatal authentication or connectivity loss.
* **Inline Error States:** Show direct options (e.g. "Retry Loading Map") inside failed visual panels.

---

### 19.20 AI Safety Exceptions

AI governance boundaries are actively monitored:

* **Prompt Injection Defense:** Input text is scanned for system override keywords (e.g., "ignore previous instructions").
* **Hallucination Detection:** Outputs are validated against the database. If an AI agent invents a resource that doesn't exist, the task is rejected and rescheduled.

---

### 19.21 Monitoring & Alerting

Exceptions are routed to monitoring tools based on severity:

* **Severity Info/Warn:** Logged to CloudWatch.
* **Severity Error:** Triggers dashboard notifications.
* **Severity Critical:** Triggers direct alerts (PagerDuty, Slack integration) and automatically spawns a local platform incident record.

---

### 19.22 Production Recovery

Operational recovery procedures are fully documented in automated runbooks:

* **Fast Rollback:** Containers deploy using image hash references, allowing instant rollback within seconds.
* **Database State Restore:** Point-in-Time Recovery (PITR) in CockroachDB allows restoring data to any millisecond within the backup retention window.
* **Memory Re-indexing:** A background utility can rebuild pgvector indexes without taking semantic retrieval offline.


## Phase 20 — Behavioral Architecture, Sequence Diagrams & State Machines

## Part 1 — Behavioral Modeling Specifications

> **Defining the Dynamic Behavior of ReliefGrid Through Interactions, Lifecycles, and State Transitions**

---

### 20.1 Objective

This phase documents the runtime behavior of ReliefGrid by describing how users, services, AI agents, memory systems, and cloud infrastructure interact over time.

While previous chapters define the platform's structure, this chapter defines its behavior.

The objectives are to:

* Visualize runtime workflows.
* Standardize interaction patterns.
* Document state transitions.
* Define asynchronous event flows.
* Specify recovery behavior.
* Improve implementation consistency.
* Support testing and debugging.

Behavioral models provide a shared understanding of how the platform operates under both normal and exceptional conditions.

---

### 20.2 Behavioral Modeling Principles

ReliefGrid's runtime behavior adheres to the following principles.

#### Event-Driven Execution

Components communicate through domain events rather than direct dependencies whenever practical.

---

#### Asynchronous Processing

Long-running tasks execute independently of user requests to improve responsiveness and resilience.

---

#### Deterministic State Transitions

Every entity transitions through explicitly defined states.

Unexpected state changes are treated as errors.

---

#### Idempotent Operations

Repeated execution of the same operation should produce consistent results without unintended side effects.

---

#### Observable Workflows

Every significant interaction emits logs, metrics, traces, and events to support monitoring and diagnostics.

---

### 20.3 System Interaction Overview

```text
+---------+      +-----------+      +-------------+      +--------------+
|  User   | ---> | Frontend  | ---> |  FastAPI    | ---> | Coordinator  |
+---------+      +-----------+      +-------------+      +--------------+
                                                       |
                 +-------------------------------------+--------------------------------------+
                 |               |                |                 |               |          |
                 ▼               ▼                ▼                 ▼               ▼          ▼
          Weather Agent   Medical Agent   Infrastructure   Shelter Agent   Logistics Agent  Communication Agent
                 \               |                |                 |               |          /
                  \______________|________________|_________________|_______________|_________/
                                         |
                                         ▼
                               Collective Memory Engine
                                         |
                                         ▼
                                  CockroachDB Vector Store
                                         |
                                         ▼
                                   Recommendation Engine
                                         |
                                         ▼
                                      User Response
```

This interaction model illustrates the collaboration between user interfaces, backend services, AI agents, and persistent memory.

---

### 20.4 Incident Lifecycle Sequence

```text
User
 │
 ▼
Create Incident
 │
 ▼
API Validation
 │
 ▼
Incident Stored
 │
 ▼
Coordinator Activated
 │
 ▼
Specialist Agents Spawned
 │
 ▼
Memory Retrieved
 │
 ▼
Risk Analysis
 │
 ▼
Recommendations Generated
 │
 ▼
Evidence Compiled
 │
 ▼
Coordinator Consensus
 │
 ▼
User Review
 │
 ▼
Approval
 │
 ▼
Execution
 │
 ▼
Incident Closed
 │
 ▼
Reflection Generated
 │
 ▼
Memory Updated
```

This sequence represents the primary operational workflow of the platform.

---

### 20.5 AI Agent Collaboration Sequence

```text
Coordinator
      │
      ▼
Task Decomposition
      │
      ▼
Assign Specialist Tasks
      │
      ▼
Agents Execute Independently
      │
      ▼
Retrieve Relevant Memories
      │
      ▼
Generate Findings
      │
      ▼
Return Structured Results
      │
      ▼
Consensus Evaluation
      │
      ▼
Conflict Resolution
      │
      ▼
Recommendation Generation
```

The Coordinator Agent orchestrates specialist agents while preserving loose coupling and independent execution.

---

### 20.6 Collective Memory Lifecycle

```text
Observation
      │
      ▼
Working Memory
      │
      ▼
Validation
      │
      ▼
Episodic Memory
      │
      ▼
Reflection
      │
      ▼
Semantic Knowledge
      │
      ▼
Knowledge Graph Linking
      │
      ▼
Vector Indexing
      │
      ▼
Future Retrieval
```

This lifecycle reflects the transformation of operational experience into reusable organizational knowledge.

---

### 20.7 Incident State Machine

```text
[DRAFT]
    │
    ▼
[REPORTED]
    │
    ▼
[VALIDATED]
    │
    ▼
[ANALYZING]
    │
    ▼
[RECOMMENDED]
    │
    ▼
[APPROVED]
    │
    ▼
[ACTIVE]
    │
    ▼
[RESOLVED]
    │
    ▼
[CLOSED]
    │
    ▼
[ARCHIVED]
```

Each state transition is governed by explicit business rules and authorization checks.

---

### 20.8 Recommendation State Machine

```text
CREATED
   │
   ▼
UNDER REVIEW
   │
   ├────────► REJECTED
   │
   ▼
APPROVED
   │
   ▼
EXECUTED
   │
   ▼
VERIFIED
```

Recommendations maintain a complete audit trail throughout their lifecycle.

---

### 20.9 Agent Task State Machine

```text
IDLE
 │
 ▼
ASSIGNED
 │
 ▼
INITIALIZING
 │
 ▼
RETRIEVING MEMORY
 │
 ▼
ANALYZING
 │
 ▼
GENERATING RESPONSE
 │
 ▼
WAITING FOR CONSENSUS
 │
 ▼
COMPLETED
```

Failure paths transition to RETRYING or FAILED depending on recovery outcomes.

---

### 20.10 Memory State Machine

```text
CREATED
   │
   ▼
VALIDATED
   │
   ▼
INDEXED
   │
   ▼
ACTIVE
   │
   ▼
REFLECTED
   │
   ▼
PROMOTED
   │
   ▼
ARCHIVED
```

Memory promotion requires governance approval and successful validation.

---

### 20.11 API Request Sequence

```text
Client
   │
   ▼
Authentication
   │
   ▼
Authorization
   │
   ▼
Input Validation
   │
   ▼
Business Logic
   │
   ▼
Memory Retrieval
   │
   ▼
Agent Invocation
   │
   ▼
Persistence
   │
   ▼
Audit Logging
   │
   ▼
Response
```

Every protected request follows this standardized execution path.

---

### 20.12 Event Processing Lifecycle

```text
Domain Event Created
        │
        ▼
Event Published
        │
        ▼
Interested Services Consume
        │
        ▼
Business Logic Executed
        │
        ▼
Follow-Up Events Generated
        │
        ▼
Event Archived
```

This model enables asynchronous communication while maintaining loose coupling.

---

### 20.13 Retry Sequence

```text
Request
   │
   ▼
Failure
   │
   ▼
Retry Policy Evaluated
   │
   ├── Retry Allowed
   │       │
   │       ▼
   │   Exponential Backoff
   │       │
   │       ▼
   │   Retry
   │
   └── Retry Limit Reached
           │
           ▼
     Fallback Workflow
```

Retry behavior is governed by the policies defined in the Reliability Architecture.

---

### 20.14 Failure Recovery Sequence

```text
Failure Detected
      │
      ▼
Health Verification
      │
      ▼
Automatic Recovery
      │
      ▼
Recovery Successful?
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Yes       No
 │         │
 ▼         ▼
Resume   Escalate
          │
          ▼
 Manual Recovery
```

The platform prioritizes automated recovery before requiring operator intervention.

---

### 20.15 Deployment Sequence

```text
Developer Commit
       │
       ▼
CI Pipeline
       │
       ▼
Automated Testing
       │
       ▼
Artifact Generation
       │
       ▼
Staging Deployment
       │
       ▼
Validation
       │
       ▼
Production Release
       │
       ▼
Monitoring
```

Deployment follows a controlled progression to minimize operational risk.

---

### 20.16 User Authentication Sequence

```text
User Login
    │
    ▼
Credential Verification
    │
    ▼
MFA Challenge (Optional)
    │
    ▼
JWT Issued
    │
    ▼
Access Granted
```

Authentication events are logged for audit and security monitoring.

---

### 20.17 Operational Monitoring Lifecycle

```text
Service Activity
      │
      ▼
Metrics Generated
      │
      ▼
CloudWatch Collection
      │
      ▼
Threshold Evaluation
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Normal   Threshold Exceeded
 │         │
 ▼         ▼
Store    Alert Generated
          │
          ▼
Operations Response
```

This lifecycle supports proactive detection of operational issues.

---

### 20.18 Behavioral Architecture Summary

ReliefGrid's behavior is modeled through explicit sequences, state machines, and event lifecycles. By defining interactions, transitions, retries, recoveries, and governance workflows, the platform ensures that every runtime scenario is predictable, observable, and testable.

These behavioral specifications complement the structural architecture documented in earlier phases and provide implementation guidance for backend services, frontend workflows, AI agents, and operational tooling.

---

### 20.19 Why This Phase Matters

Behavioral architecture is the bridge between design and implementation. It translates static components into dynamic, executable workflows that describe how the system responds to user actions, internal events, failures, and recovery scenarios.

For Antigravity, these diagrams define the runtime logic needed to generate services, orchestrations, and state management consistently. For hackathon judges, they demonstrate that ReliefGrid has been designed not only as a collection of components, but as a coordinated, resilient system with clearly defined operational behavior.


## Part 2 — Executable UML Diagrams & State Machines

> **Visualizing System Lifecycles, Multi-Agent Collaboration, and Fault Recovery**

---

### 20.1 Incident Lifecycle State Machine

An incident transitions through a series of deterministic states, controlled by the backend engine and audited in the database.

```mermaid
stateDiagram-v2
    [*] --> Draft : User creates draft
    Draft --> Initialized : User submits incident
    Initialized --> Triaging : Coordinator Agent activated
    Triaging --> Active : Action Brief compiled
    Active --> Active : Specialist updates memory
    Active --> Resolving : Coordinator verifies resolution
    Resolving --> Resolved : Coordinator & Operator approve
    Resolved --> Archived : Automatically archived after 30 days
    
    Active --> Suspended : Operator manual pause
    Suspended --> Active : Operator resumes
```

---

### 20.2 Agent Collaboration Sequence Diagram

This diagram maps the standard workflow when a new incident is submitted, showing the orchestration and memory retrieval phases.

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Emergency Operator
    participant API as API Gateway
    participant Coord as Coordinator Agent
    participant DB as CockroachDB Memory
    participant Bedrock as Amazon Bedrock
    participant Spec as Specialist Agent

    Operator->>API: Post Incident Data
    API->>DB: Write Incident Record
    API->>Coord: Trigger Incident Analysis
    activate Coord
    Coord->>DB: Vector search past incidents & lessons
    DB-->>Coord: Return similar historical records
    Coord->>Bedrock: Formulate Action Plan
    Bedrock-->>Coord: Task List & Assignments
    Coord->>DB: Log assignments in task table
    Coord->>Spec: Dispatch specific tasks
    deactivate Coord

    activate Spec
    Spec->>DB: Read context & active tasks
    Spec->>Bedrock: Execute specialized reasoning
    Bedrock-->>Spec: Specialized plan/data
    Spec->>DB: Write decision & reflection to memory
    Spec-->>Coord: Task Completed
    deactivate Spec
```

---

### 20.3 Resilience & Agent Recovery Flow

This sequence visualizes how the platform detects and recovers from a crash in a specialist agent during analysis.

```mermaid
sequenceDiagram
    autonumber
    participant Coord as Coordinator Agent
    participant Spec as Specialist Agent
    participant Mon as Monitor Service
    participant DB as CockroachDB Memory

    Coord->>Spec: Assign Triage Task
    activate Spec
    Spec->>DB: Write Task State (RUNNING)
    Note over Spec: Process Crash (Out of Memory)
    deactivate Spec
    
    Mon->>Mon: Heartbeat timeout detected
    activate Mon
    Mon->>DB: Verify Task State (RUNNING but inactive)
    Mon->>Mon: Terminate old container
    Mon->>Mon: Spawn new Specialist Agent container
    deactivate Mon
    
    activate Spec
    Spec->>DB: Query pending tasks for container ID
    DB-->>Spec: Return Triaging Task details
    Spec->>DB: Restore context & task variables
    Spec->>Spec: Re-run reasoning
    Spec->>DB: Write output & set task to COMPLETED
    Spec-->>Coord: Notify completion
    deactivate Spec
```

---

### 20.4 Memory Lifecycle & Promotion State Machine

This diagram shows how memories flow from ephemeral agent thoughts to verified institutional knowledge.

```mermaid
stateDiagram-v2
    [*] --> WorkingMemory : Agent writes reasoning step
    WorkingMemory --> EpisodicMemory : Task completed (context archived)
    EpisodicMemory --> SemanticMemory : Reflection agent runs summaries
    SemanticMemory --> InstitutionalKnowledge : Human Operator promotes memory
    
    WorkingMemory --> Deleted : Expired/Unused
    EpisodicMemory --> Deleted : Retention threshold exceeded
    InstitutionalKnowledge --> Archived : Outdated / Deprecated
```

---

### 20.5 Saga Pattern Compensation Flow

This diagram illustrates how resources are rolled back when an emergency dispatch task fails.

```mermaid
sequenceDiagram
    autonumber
    participant Saga as Saga Orchestrator
    participant Logistics as Logistics Service
    participant Medical as Medical Service
    participant DB as CockroachDB

    Saga->>Logistics: Reserve 5 Evacuation Vehicles
    Logistics->>DB: Mark vehicles as RESERVED
    Logistics-->>Saga: Success

    Saga->>Medical: Allocate 3 Dispatch Teams
    activate Medical
    Note over Medical: Allocation fails (Teams unavailable)
    Medical-->>Saga: Fail (No capacity)
    deactivate Medical

    Note over Saga: Trigger Compensation Flow
    Saga->>Logistics: Release 5 Evacuation Vehicles
    Logistics->>DB: Mark vehicles as AVAILABLE
    Logistics-->>Saga: Compensation Completed
```

---

### 20.6 Idempotency Check Flow

This sequence demonstrates how duplicate API requests are safely handled without repeating database writes.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Operator / Agent
    participant API as API Gateway
    participant Cache as Cache / Lock Database
    participant Service as Business Service

    Client->>API: POST /incidents with Idempotency-Key
    API->>Cache: Set key if not exists (with 24h TTL)
    alt Key already exists (Duplicate Request)
        Cache-->>API: Return existing lock status & previous response
        API-->>Client: Return 200 (Previous cached response)
    else Key is new
        Cache-->>API: Lock acquired (Success)
        API->>Service: Process Request
        Service->>Service: Execute DB operations
        Service-->>API: Return Response
        API->>Cache: Save Response for key
        API-->>Client: Return Response
    end
```

## Phase 21 — Demo Strategy

### Simulated Disaster Scenario
To maximize judging impact, the live demo follows a scripted flood emergency scenario mapping the exact timeline of agent-memory interactions:

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Emergency Operator
    participant UI as Dashboard / UI
    participant Coord as Coordinator Agent
    participant DB as CockroachDB Memory
    participant Spec as Specialized Agents

    Operator->>UI: Submit Flood Incident (Zone A)
    UI->>DB: Store Incident Memory (Initial state)
    Coord->>DB: Retrieve past Zone A incidents (Vector search)
    DB-->>Coord: Return 2025 flood lessons & resource data
    Coord->>Spec: Assign tasks (Weather, Medical, Logistics)
    Note over Spec: Simulate Weather Agent crash
    Spec->>DB: Fetch saved task state
    Spec-->>Spec: Recover state & execute analysis
    Spec->>DB: Write predictions & decisions to memory
    Coord->>UI: Compile & display recommendation to Operator
```

### Scripted Timeline & Steps
* **Minute 0 — Incident Initialization:** The operator enters a new incident: *"Severe flooding reported in northern district, evacuation paths threatened."* This writes an initial incident record to CockroachDB.
* **Minute 1 — Orchestration & Context Pull:** The Coordinator Agent triggers, searches historical vectors for similar events, retrieves a matching 2025 flood record, and lists the previous successful actions. It creates specific tasks for the specialized agents.
* **Minute 2 — Collaborative Analysis:**
  * *Weather Agent* predicts water level crest times.
  * *Infrastructure Agent* detects bridge erosion risk.
  * *Medical Agent* forecasts peak hospital demand.
  * *Logistics Agent* locates available emergency vehicles.
* **Minute 3 — Decision Output:** The Coordinator compiles their findings, generating a comprehensive action brief (e.g. *"Open Shelter B and stage medical units at Point X because bridge failure probability is high"*).
* **Minute 4 — Resilience Check (Simulation):** The operator hits a "Simulate Agent Crash" button. The Weather Agent process is killed. The system automatically launches a replacement agent, which queries the CockroachDB task table, restores the active context, and resumes the workflow without losing progress.
* **Minute 5 — Verification:** The operator opens the *Memory Explorer* to show the newly written decision and reflection records, verifying that the system has successfully "learned" from this simulation run.

## Phase 22 — Future Roadmap

### Phase 1: Live Sensor Integration
Transition from scripted mock telemetry to real-time public feeds, including:
* Live NOAA weather alerts.
* Public USGS water level telemetry APIs.
* GeoJSON mapping datasets for route calculation.

### Phase 2: Geo-Distributed Resiliency
Deploy ReliefGrid backend services across multiple AWS regions, configuring CockroachDB multi-region replication to maintain extremely low-latency memory reads for local disaster hubs while ensuring strong global consistency during split-brain scenarios.

### Phase 3: Multilateral Agency Collaboration
Implement secure multi-tenant workspaces where different organizations (e.g., FEMA, local fire departments, international NGOs) run distinct specialized agents. Each agency manages private operational resource data in separate CockroachDB tables while contributing to a shared, global semantic memory ledger.

## Appendix A — UML Reference Diagrams

This appendix provides a summary index of the behavioral diagrams defined throughout the specification. All models are maintained in Mermaid syntax to enable live rendering and automated generation in developer portals.

| Model Title | Diagram Type | Section Reference | Primary Actors |
| ----------- | ------------ | ----------------- | -------------- |
| Incident Lifecycle | State Machine | Phase 20, Part 2.1 | User / API |
| Agent Collaboration | Sequence Diagram | Phase 20, Part 2.2 | Coordinator / Specialists |
| Agent Recovery | Sequence Diagram | Phase 20, Part 2.3 | Monitor / CockroachDB |
| Memory Lifecycle | State Machine | Phase 20, Part 2.4 | Memory Engine / LLM |
| Saga Compensation | Sequence Diagram | Phase 20, Part 2.5 | Orchestrator / Services |
| Idempotency Check | Sequence Diagram | Phase 20, Part 2.6 | API Gateway / Cache |

To edit or regenerate these diagrams, copy the corresponding `mermaid` block from the referenced section and paste it into any Mermaid-compatible parser or documentation engine.

---

## Appendix B — JSON Schemas & Event Catalog

This appendix catalogs the core payload schemas and asynchronous event message envelopes utilized across the ReliefGrid API Platform.

#### B.1 Core API Payload Schemas

#### Incident Creation Request (POST `/api/v1/incidents`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "IncidentCreate",
  "type": "object",
  "properties": {
    "title": { "type": "string", "maxLength": 100 },
    "description": { "type": "string" },
    "severity": { "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
    "latitude": { "type": "number", "minimum": -90.0, "maximum": 90.0 },
    "longitude": { "type": "number", "minimum": -180.0, "maximum": 180.0 },
    "tags": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["title", "description", "severity", "latitude", "longitude"]
}
```

#### Memory Query Request (POST `/api/v1/memory/search`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MemorySearch",
  "type": "object",
  "properties": {
    "query": { "type": "string" },
    "limit": { "type": "integer", "minimum": 1, "maximum": 50, "default": 5 },
    "min_relevance": { "type": "number", "minimum": 0.0, "maximum": 1.0, "default": 0.7 },
    "filters": {
      "type": "object",
      "properties": {
        "memory_type": { "enum": ["WORKING", "EPISODIC", "SEMANTIC", "DECISION", "REFLECTION"] },
        "incident_id": { "type": "string" }
      }
    }
  },
  "required": ["query"]
}
```

#### B.2 Asynchronous Event Catalog

All events processed via the transactional outbox pattern utilize a standardized cloud-event wrapper:

```json
{
  "event_id": "evt_abc123xyz",
  "event_type": "incident.created",
  "source": "incident-service",
  "timestamp": "2026-07-15T23:05:00Z",
  "correlation_id": "corr_9a8b7c6d5e4f",
  "data": {
    "incident_id": "inc_9988",
    "severity": "CRITICAL",
    "coordinates": {
      "latitude": 45.4215,
      "longitude": -75.6972
    }
  }
}
```

Available events:
* `incident.created` - Fired when a new incident is persisted.
* `incident.triaged` - Fired when the Coordinator Agent maps out initial tasks.
* `agent.task.assigned` - Fired when a task is dispatched to a specialist agent.
* `agent.task.completed` - Fired when a specialist agent writes its findings back to the database.
* `memory.created` - Fired when a new episodic or working memory is written.
* `memory.promoted` - Fired when a memory is approved as institutional knowledge.

---

## Appendix C — Architecture Decision Records (ADRs)

#### ADR 001: Choose CockroachDB for Transactional Memory & pgvector Store
* **Status:** Approved
* **Context:** ReliefGrid's multi-agent runtime requires strong transactional safety (ACID) to coordinate tasks and prevent write skews, alongside vector storage to execute semantic memory searches.
* **Decision:** Consolidate both relational data and vector embeddings within a single CockroachDB Serverless instance using the `pgvector` extension.
* **Consequences:** Eliminates the operational overhead of synchronizing separate transactional and vector databases. Guarantees that agent decisions and tasks are written atomically. Read replicas can scale horizontally.

#### ADR 002: Choose AWS Bedrock for Agent Inference & Embeddings
* **Status:** Approved
* **Context:** The agent reasoning engine requires high-throughput, low-latency access to state-of-the-art LLMs (e.g. Anthropic Claude 3.5 Sonnet) with robust data isolation and privacy controls.
* **Decision:** Utilize Amazon Bedrock for text generation, plan compilation, and embedding generation (Cohere Embed).
* **Consequences:** Ensures zero data retention by LLM providers, complying with governmental privacy regulations. Simplifies infrastructure through serverless billing and automated scaling. Requires implementing multi-region fallbacks to mitigate local Bedrock rate limits.

#### ADR 003: Choose Transactional Outbox Pattern for Event-Driven Communication
* **Status:** Approved
* **Context:** Relieving API latency during disaster responses requires processing agent reasoning out-of-band via asynchronous events, without risking missing events during network drops.
* **Decision:** Implement the Transactional Outbox pattern. Write event payloads into a `domain_events` table inside the same transaction as operational data writes, then dispatch events asynchronously via a relay worker.
* **Consequences:** Guarantees at-least-once delivery of events to coordinator and specialist agents. Prevents dual-write failures (where database writes succeed but message broker publishing fails). Introduces minor event-propagation latency (typically < 100ms).

---

## Appendix D — Engineering & Implementation Standards

#### D.1 Directory Structure
The monorepository must adhere to this standard:
```text
reliefgrid/
├── apps/
│   ├── web/          # Next.js / TypeScript Frontend
│   └── api/          # FastAPI / Python Backend
├── agents/           # Specialized Agent Modules
├── packages/         # Shared configurations (TS configs, Python helpers)
├── infrastructure/   # Terraform Configurations
├── database/         # Database Schema Migrations (Alembic)
└── docs/             # Technical specifications & ADRs
```

#### D.2 Coding Conventions
* **FastAPI Coding Standards:** Use Pydantic v2 for data validation, utilize Dependency Injection (`Depends`) for services, and enforce type hints on all functions.
* **TypeScript Standards:** Utilize functional components, strictly enforce type safety (avoid `any`), and manage state via lightweight stores.

#### D.3 Security Checklist
1. All API endpoints must require authentication via JWT unless explicitly whitelisted.
2. Direct SQL strings are prohibited; utilize the SQLAlchemy ORM or parameterized queries to prevent SQL injection.
3. Every input prompt sent to AWS Bedrock must pass through context-sanitization filters to prevent prompt injection attacks.
4. Secrets must be loaded via Environment Variables managed through AWS Secrets Manager; committing raw secrets is strictly prohibited.
