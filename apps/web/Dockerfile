# Multi-Stage Dockerfile for ReliefGrid Next.js Command Center Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for workspace installation
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages ./packages

# Install dependencies
RUN npm ci

# Copy full repository source
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=apps/web

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]
