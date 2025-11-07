# Notification Service

EVDMS Notification Service handles Email, SMS, and Push notifications, templates CRUD, and user preferences.

Endpoints:
- POST /api/v1/notifications/send
- POST /api/v1/notifications/send-batch
- GET  /api/v1/notifications
- GET  /api/v1/notifications/:id
- POST /api/v1/notifications/:id/retry
- GET/POST/PUT/DELETE /api/v1/notifications/templates
- GET/PUT /api/v1/notifications/preferences

Environment: see docker-compose for SMTP, Redis, RabbitMQ and Postgres.
