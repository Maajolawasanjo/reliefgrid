# Multi-Stage Production Dockerfile for ReliefGrid FastAPI Backend Service
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local

COPY apps/api /app/apps/api
COPY database /app/database

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app/apps/api
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
