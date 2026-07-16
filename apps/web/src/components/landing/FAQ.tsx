'use client';

import React, { useState } from 'react';

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CockroachDB vector memory differ from traditional vector database sidecars?',
      a: 'Unlike standalone vector sidecars that lack ACID transaction guarantees, CockroachDB integrates pgvector similarity indexing directly inside distributed PostgreSQL-compatible tables. This ensures vector embeddings and operational incident records remain transactionally consistent even during network partitions.',
    },
    {
      q: 'What role does AWS Bedrock play in the multi-agent reasoning pipeline?',
      a: 'AWS Bedrock hosts Claude 3.5 Sonnet foundation models and Titan Text Embeddings. The Coordinator and Specialist agents invoke Bedrock via async SDK calls to generate grounded operational plans with structured data source provenance.',
    },
    {
      q: 'How does ReliefGrid handle external API outages (e.g. Open-Meteo or OSM rate limits)?',
      a: 'ReliefGrid implements a hybrid telemetry fallback model. If external GIS APIs experience rate limits or timeouts, the platform seamlessly switches to deterministic cached boundary data while logging a telemetry warning in CockroachDB.',
    },
    {
      q: 'What happens if a specialist agent crashes or stalls during a live disaster scenario?',
      a: 'The Telemetry Watchdog background worker runs periodic health checks scanning for tasks stuck in IN_PROGRESS state for over 120 seconds. It automatically triggers serializable transaction retries, restoring task state from CockroachDB checkpoints.',
    },
    {
      q: 'Is the API standardized with unified error envelopes and correlation tracking?',
      a: 'Yes. Every response uses a uniform JSON envelope `{ success: true, data: ... }` or `{ success: false, error: { error_code, message, severity, trace_id } }`. All requests generate a unique correlation ID logged across backend services.',
    },
    {
      q: 'What visual indicators prove that memory altered an AI recommendation?',
      a: 'In the Recommendations Widget, any recommendation influenced by past historical events displays a glowing "🧠 Memory Override" visual badge with explicit cosine similarity matching metrics and source attribution links.',
    },
    {
      q: 'How are emergency dispatch locations geocoded?',
      a: 'ReliefGrid incorporates reverse-geocoding via OpenStreetMap Nominatim, converting raw GPS coordinates (e.g. 6.4698, 3.5852) into human-readable street addresses like "Lekki-Epe Expressway, Lagos State".',
    },
    {
      q: 'Can ReliefGrid be deployed on-premise or in sovereign cloud environments?',
      a: 'Yes. ReliefGrid is packaged as multi-stage Docker containers (`Dockerfile.api` and `Dockerfile.web`) with standard Kubernetes manifests, allowing deployment to AWS EC2/App Runner, Railway, Vercel, or local air-gapped clusters.',
    },
    {
      q: 'How is authentication and role-based access control (RBAC) enforced?',
      a: 'Requests require valid JWT bearer tokens signed via Argon2id hashed secret keys. Endpoints enforce role scopes (`ADMIN`, `OPERATOR`, `FIELD_OFFICER`) preventing unauthorized resource mutations.',
    },
    {
      q: 'What memory types are supported in the Collective Memory Engine?',
      a: 'The schema defines 7 operational memory types: DECISION_RECORD, LESSON_LEARNED, ACTION_PLAN, SPECIALIST_FINDINGS, SITUATION_REPORT, WEATHER_OBSERVATION, and FIELD_UPDATE.',
    },
    {
      q: 'How fast does the 6-agent parallel dispatch execute?',
      a: 'Using Python `asyncio.gather`, all 6 specialist agents execute concurrently. Response latency averages under 3.8 seconds for full multi-agent consensus generation.',
    },
    {
      q: 'Is the platform open source under MIT license?',
      a: 'Yes! ReliefGrid is built for the CockroachDB × AWS Hackathon and is fully open source under the MIT License on GitHub.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-900 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AF376]">
            Technical Documentation & FAQ
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Frequently Asked Technical Questions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Everything you need to know about the architecture, CockroachDB vector indexing, and AWS Bedrock integration.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-14 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 font-bold text-base text-slate-200 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-mono text-sm shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-4 bg-slate-950">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
