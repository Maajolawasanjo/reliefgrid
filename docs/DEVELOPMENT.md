# ReliefGrid Local Development Guide

## Local Workspace Command Set

### Frontend Development
```bash
npm run dev --workspace=apps/web
```

### Backend Development
```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

### Database Migrations
```bash
alembic upgrade head
```

### Code Formatting & Quality Checks
```bash
# Python Formatters
black .
ruff check .

# TypeScript Checks
npm run type-check
npm run lint
```
