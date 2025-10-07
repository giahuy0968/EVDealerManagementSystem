# EVDMS Backend Microservices Architecture

This document outlines the recommended architecture and concrete steps to add the backend using microservices.

## 1. Service Catalog & Ownership
- Auth Service (PostgreSQL, Redis): users, roles, sessions, JWT issuance
- Dealer Service (PostgreSQL): dealers, branches, staff, inventory ownership
- Customer Service (PostgreSQL + MongoDB for analytics): customers, leads, test drives
- Manufacturer Service (PostgreSQL): manufacturers, models, trims, supply
- Report Service (MongoDB): aggregated KPIs, dashboards, ML/AI outputs
- Notification Service (RabbitMQ): emails/SMS/push from domain events

Each service owns its data. Prefer separate DB or schema per service (dev can share one DB with schemas; prod should isolate).

## 2. Communication
- External: REST via API Gateway (Node/Express + http-proxy-middleware)
- Internal async events: RabbitMQ (domain events e.g., UserRegistered, OrderCreated)
- Avoid direct DB access across services; share via REST or events.

## 3. API Gateway
- Routes: /api/v1/auth, /dealers, /customers, /manufacturers, /reports, /notifications
- Concerns: auth header passthrough, CORS, rate-limit, logging, request size limits
- Aggregation: optional BFF endpoints for frontend composition

## 4. Authentication & Authorization
- JWT access tokens (short-lived) + refresh token rotation
- Gateway passes Authorization header; services validate
- Role-based checks implemented inside services
- Service-to-service calls use service tokens or network ACLs

## 5. Data & Migrations
- PostgreSQL: transactional data per service; use schemas per service in dev
- MongoDB: analytics/time-series for reports & insights
- Migrations: choose Knex/Prisma/TypeORM; CI runs migrations before app start
- Seed data for local dev

## 6. Messaging & Reliability
- RabbitMQ with dead-letter queues
- Outbox pattern per service for atomic event publishing
- Idempotency keys for consumer handlers

## 7. Observability
- Structured logging (Winston)
- Health: /health, /ready per service
- Tracing: OpenTelemetry (optional initial)
- Metrics: Prometheus scraping (optional initial)

## 8. Local Development
- docker-compose orchestrates: postgres, mongo, redis, rabbitmq, gateway, services, frontends
- Env via .env files; secrets not committed
- Start: `docker-compose up --build`
- Or run service locally with Docker infra up (bind to localhost)

## 9. CI/CD
- Lint + test per package
- Build Docker images with tags per service
- Deploy per service independently

## 10. Next Steps Checklist
- [ ] Finalize API contracts (OpenAPI) per service
- [ ] Implement JWT middleware for all services
- [ ] Add migrations + seed scripts per service
- [ ] Implement minimal CRUD for Dealer/Customer/Manufacturer
- [ ] Publish/consume key domain events via RabbitMQ
- [ ] Add health/readiness endpoints
- [ ] Add GitHub Actions for build/test

Refer to docker-compose.yml for environment variables and ports.
