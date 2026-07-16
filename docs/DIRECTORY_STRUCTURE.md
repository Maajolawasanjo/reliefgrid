# ReliefGrid Monorepo Directory Tree

```text
reliefgrid/
├── apps/
│   ├── web/                     # Next.js 14 + Tailwind Operator Dashboard
│   └── api/                     # FastAPI Backend Gateway Service
├── agents/                      # Multi-Agent Reasoning Subsystem
│   ├── coordinator/
│   ├── weather/
│   ├── infrastructure/
│   ├── medical/
│   ├── shelter/
│   ├── logistics/
│   └── communication/
├── packages/                    # Monorepo Shared Packages
│   ├── shared-types/
│   ├── validation/
│   ├── logger/
│   └── config/
├── database/                    # CockroachDB Schema & Alembic Migrations
│   ├── migrations/
│   ├── schemas/
│   └── seeds/
├── infrastructure/              # Deployment Infrastructure
│   ├── docker/
│   ├── aws/
│   └── terraform/
├── docs/                        # Master Architectural Documentation
├── scripts/                     # Helper Utilities
├── tests/                       # Automated Pytest & Vitest Suites
└── README.md                    # Platform Master Readme
```
