# 🛠️ ReliefGrid Root Developer Automation Makefile

.PHONY: help dev dev-backend dev-frontend test lint build docker-up docker-down clean aws-push

help:
	@echo "====================================================================="
	@echo "               ReliefGrid Enterprise Platform Commands              "
	@echo "====================================================================="
	@echo "  make dev          - Start both Backend API and Frontend Dev Servers"
	@echo "  make test         - Run full Pytest integration suite & TypeScript check"
	@echo "  make lint         - Run Ruff linter and Next.js ESLint"
	@echo "  make docker-up    - Spin up full platform via Docker Compose"
	@echo "  make docker-down  - Stop all Docker Compose services"
	@echo "  make aws-push     - Build & push Docker images to AWS ECR"
	@echo "  make clean        - Remove Python bytecode and build caches"
	@echo "====================================================================="

dev:
	@echo "🚀 Starting ReliefGrid Local Development Environment..."
	@bash scripts/setup-dev.sh

test:
	@echo "🧪 Executing Test Suite & Type Check..."
	@npx tsc --noEmit -p "apps/web/tsconfig.json"
	@PYTHONPATH=apps/api .venv/bin/pytest tests/integration/test_api_flow.py -v

lint:
	@echo "🔍 Linting Backend & Frontend Codebases..."
	@ruff check apps/api
	@npm --prefix apps/web run lint

docker-up:
	@echo "🐳 Building and Launching Docker Containers..."
	@docker-compose up --build -d

docker-down:
	@echo "🛑 Stopping Docker Containers..."
	@docker-compose down

aws-push:
	@bash scripts/push-to-ecr.sh $(AWS_ACCOUNT_ID)

clean:
	@echo "🧹 Cleaning Cache Files..."
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@rm -rf apps/web/.next apps/web/out .pytest_cache .ruff_cache
