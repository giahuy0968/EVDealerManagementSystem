# Makefile for EV Dealer Management System
# Usage: make <command>

.PHONY: help build up down logs clean test dev-up dev-down backup restore

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Production commands
build: ## Build all services
	docker-compose build

up: ## Start all services
	docker-compose up -d

up-build: ## Build and start all services
	docker-compose up --build -d

down: ## Stop all services
	docker-compose down

logs: ## View logs of all services
	docker-compose logs -f

logs-service: ## View logs of specific service (usage: make logs-service service=api-gateway)
	docker-compose logs -f $(service)

restart: ## Restart all services
	docker-compose restart

restart-service: ## Restart specific service (usage: make restart-service service=api-gateway)
	docker-compose restart $(service)

# Development commands
dev-up: ## Start development environment (database + tools only)
	docker-compose -f docker-compose.dev.yml up -d

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## View development environment logs
	docker-compose -f docker-compose.dev.yml logs -f

# Database commands
db-connect: ## Connect to PostgreSQL database
	docker-compose exec postgres psql -U evuser -d evdealerdb

db-backup: ## Backup database to backup.sql
	docker-compose exec postgres pg_dump -U evuser evdealerdb > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up to backup_$(shell date +%Y%m%d_%H%M%S).sql"

db-restore: ## Restore database from backup.sql (usage: make db-restore file=backup.sql)
	docker-compose exec -T postgres psql -U evuser -d evdealerdb < $(file)

# Testing commands
test: ## Run tests for all services
	@echo "Running tests for all services..."
	docker-compose exec api-gateway mvn test
	docker-compose exec auth-service mvn test
	docker-compose exec customer-service mvn test
	docker-compose exec dealer-service mvn test
	docker-compose exec manufacturer-service mvn test
	docker-compose exec notification-service mvn test
	docker-compose exec report-analytics-service mvn test

test-service: ## Run tests for specific service (usage: make test-service service=api-gateway)
	docker-compose exec $(service) mvn test

# Health check commands
health: ## Check health of all services
	@echo "Checking health of all services..."
	@curl -f http://localhost:8080/actuator/health 2>/dev/null && echo "✅ API Gateway: Healthy" || echo "❌ API Gateway: Unhealthy"
	@curl -f http://localhost:8081/actuator/health 2>/dev/null && echo "✅ Auth Service: Healthy" || echo "❌ Auth Service: Unhealthy"
	@curl -f http://localhost:8082/actuator/health 2>/dev/null && echo "✅ Customer Service: Healthy" || echo "❌ Customer Service: Unhealthy"
	@curl -f http://localhost:8083/actuator/health 2>/dev/null && echo "✅ Dealer Service: Healthy" || echo "❌ Dealer Service: Unhealthy"
	@curl -f http://localhost:8084/actuator/health 2>/dev/null && echo "✅ Manufacturer Service: Healthy" || echo "❌ Manufacturer Service: Unhealthy"
	@curl -f http://localhost:8085/actuator/health 2>/dev/null && echo "✅ Notification Service: Healthy" || echo "❌ Notification Service: Unhealthy"
	@curl -f http://localhost:8086/actuator/health 2>/dev/null && echo "✅ Report Analytics Service: Healthy" || echo "❌ Report Analytics Service: Unhealthy"

# Cleanup commands
clean: ## Stop services and remove containers, networks, volumes
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans

clean-all: ## Complete cleanup including images
	docker-compose down -v --rmi all --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans
	docker system prune -a -f

# Monitoring commands
ps: ## Show running containers
	docker-compose ps

stats: ## Show container resource usage
	docker stats

# Build individual services
build-api-gateway: ## Build API Gateway service
	docker-compose build api-gateway

build-auth: ## Build Auth service
	docker-compose build auth-service

build-customer: ## Build Customer service
	docker-compose build customer-service

build-dealer: ## Build Dealer service
	docker-compose build dealer-service

build-manufacturer: ## Build Manufacturer service
	docker-compose build manufacturer-service

build-notification: ## Build Notification service
	docker-compose build notification-service

build-analytics: ## Build Report Analytics service
	docker-compose build report-analytics-service

# Quick setup commands
setup: ## Initial setup (build and start all services)
	@echo "🚀 Starting EV Dealer Management System setup..."
	@make build
	@make up
	@echo "✅ Setup completed! Services are starting..."
	@echo "📊 Use 'make health' to check service status"
	@echo "📝 Access API Gateway at http://localhost:8080"

dev-setup: ## Setup development environment
	@echo "🛠️ Starting development environment setup..."
	@make dev-up
	@echo "✅ Development environment ready!"
	@echo "📊 PostgreSQL: localhost:5432"
	@echo "🔧 PgAdmin: http://localhost:8888 (admin@evdealer.com / admin123)"
	@echo "🔄 Redis Commander: http://localhost:8889"