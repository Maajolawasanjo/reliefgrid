#!/usr/bin/env bash
set -e

echo "====================================================================="
echo "       🚀 Launching ReliefGrid Local Multi-Service Stack            "
echo "====================================================================="

# Ensure virtualenv exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv .venv
    .venv/bin/pip install --upgrade pip
    .venv/bin/pip install -r apps/api/requirements.txt
fi

# Function to handle shutdown signals
cleanup() {
    echo ""
    echo "🛑 Shutting down ReliefGrid services..."
    kill 0
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "🟢 Launching FastAPI Backend on http://localhost:8000 ..."
PYTHONPATH=apps/api .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &

echo "🟢 Launching Next.js Web Dashboard on http://localhost:3000 ..."
npm --prefix apps/web run dev &

wait
