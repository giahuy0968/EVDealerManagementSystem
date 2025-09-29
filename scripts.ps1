# EV Dealer Management System - PowerShell Scripts
# Usage: .\scripts.ps1 <command>

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

function Show-Help {
    Write-Host "Available commands:" -ForegroundColor Green
    Write-Host "  build           - Build all services" -ForegroundColor Cyan
    Write-Host "  up              - Start all services" -ForegroundColor Cyan
    Write-Host "  up-build        - Build and start all services" -ForegroundColor Cyan
    Write-Host "  down            - Stop all services" -ForegroundColor Cyan
    Write-Host "  logs            - View logs of all services" -ForegroundColor Cyan
    Write-Host "  health          - Check health of all services" -ForegroundColor Cyan
    Write-Host "  dev-up          - Start development environment" -ForegroundColor Cyan
    Write-Host "  dev-down        - Stop development environment" -ForegroundColor Cyan
    Write-Host "  clean           - Clean up containers and volumes" -ForegroundColor Cyan
    Write-Host "  setup           - Initial setup" -ForegroundColor Cyan
    Write-Host "  test            - Run tests for all services" -ForegroundColor Cyan
}

function Start-Build {
    Write-Host "🔨 Building all services..." -ForegroundColor Yellow
    docker-compose build
}

function Start-Services {
    Write-Host "🚀 Starting all services..." -ForegroundColor Yellow
    docker-compose up -d
}

function Start-BuildAndUp {
    Write-Host "🔨🚀 Building and starting all services..." -ForegroundColor Yellow
    docker-compose up --build -d
}

function Stop-Services {
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    docker-compose down
}

function Show-Logs {
    Write-Host "📄 Showing logs..." -ForegroundColor Yellow
    docker-compose logs -f
}

function Test-Health {
    Write-Host "🏥 Checking health of all services..." -ForegroundColor Yellow
    
    $services = @(
        @{Name="API Gateway"; Url="http://localhost:8080/actuator/health"},
        @{Name="Auth Service"; Url="http://localhost:8081/actuator/health"},
        @{Name="Customer Service"; Url="http://localhost:8082/actuator/health"},
        @{Name="Dealer Service"; Url="http://localhost:8083/actuator/health"},
        @{Name="Manufacturer Service"; Url="http://localhost:8084/actuator/health"},
        @{Name="Notification Service"; Url="http://localhost:8085/actuator/health"},
        @{Name="Report Analytics Service"; Url="http://localhost:8086/actuator/health"}
    )
    
    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $($service.Name): Healthy" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "❌ $($service.Name): Unhealthy" -ForegroundColor Red
        }
    }
}

function Start-DevEnvironment {
    Write-Host "🛠️ Starting development environment..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml up -d
}

function Stop-DevEnvironment {
    Write-Host "🛑 Stopping development environment..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down
}

function Clear-Environment {
    Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
}

function Start-Setup {
    Write-Host "🚀 Starting EV Dealer Management System setup..." -ForegroundColor Green
    Start-Build
    Start-Services
    Write-Host "✅ Setup completed! Services are starting..." -ForegroundColor Green
    Write-Host "📊 Use '.\scripts.ps1 health' to check service status" -ForegroundColor Yellow
    Write-Host "📝 Access API Gateway at http://localhost:8080" -ForegroundColor Yellow
}

function Start-Tests {
    Write-Host "🧪 Running tests for all services..." -ForegroundColor Yellow
    $services = @("api-gateway", "auth-service", "customer-service", "dealer-service", "manufacturer-service", "notification-service", "report-analytics-service")
    
    foreach ($service in $services) {
        Write-Host "Testing $service..." -ForegroundColor Cyan
        docker-compose exec $service mvn test
    }
}

# Main switch statement
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "build" { Start-Build }
    "up" { Start-Services }
    "up-build" { Start-BuildAndUp }
    "down" { Stop-Services }
    "logs" { Show-Logs }
    "health" { Test-Health }
    "dev-up" { Start-DevEnvironment }
    "dev-down" { Stop-DevEnvironment }
    "clean" { Clear-Environment }
    "setup" { Start-Setup }
    "test" { Start-Tests }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host "Use '.\scripts.ps1 help' to see available commands" -ForegroundColor Yellow
    }
}