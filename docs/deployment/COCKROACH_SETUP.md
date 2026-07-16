# 🪳 CockroachDB Serverless Cluster Setup Guide

## 📌 Database Provisioning Steps

1. Create a free cluster on CockroachDB Cloud.
2. Enable `pgvector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Copy connection string with `sslmode=verify-full` to `DATABASE_URL`.
