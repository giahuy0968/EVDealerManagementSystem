# ====================================
# SCRIPT TU DONG KHOI DONG DOCKER COMPOSE
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EVDMS - Docker Compose Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiem tra Docker Desktop dang chay
Write-Host "[1/5] Checking Docker Desktop..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not found"
    }
    Write-Host "* Docker Desktop is running" -ForegroundColor Green
    Write-Host "  $dockerVersion" -ForegroundColor Gray
}
catch {
    Write-Host "X Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "  Please open Docker Desktop and wait for it to start" -ForegroundColor Yellow
    Write-Host "  Then run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Kiem tra file docker-compose.production.yml
Write-Host "[2/5] Checking docker-compose.production.yml..." -ForegroundColor Yellow
if (-Not (Test-Path "docker-compose.production.yml")) {
    Write-Host "X File docker-compose.production.yml not found!" -ForegroundColor Red
    Write-Host "  Make sure you are in the project root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "* docker-compose.production.yml found" -ForegroundColor Green

Write-Host ""

# Dung cac containers cu (neu co)
Write-Host "[3/5] Stopping old containers (if any)..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml down 2>&1 | Out-Null
Write-Host "* Old containers stopped" -ForegroundColor Green

Write-Host ""

# Build va khoi dong containers
Write-Host "[4/5] Building and starting containers..." -ForegroundColor Yellow
Write-Host "  This may take 5-10 minutes for the first time..." -ForegroundColor Gray
Write-Host ""

docker compose -f docker-compose.production.yml up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "X Failed to start containers!" -ForegroundColor Red
    Write-Host "  Check the error messages above" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "* Containers started successfully" -ForegroundColor Green

Write-Host ""

# Doi services khoi dong
Write-Host "[5/5] Waiting for services to be healthy..." -ForegroundColor Yellow
Write-Host "  Please wait 30-60 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 10

$maxRetries = 12
$retryCount = 0
$allHealthy = $false

while ($retryCount -lt $maxRetries -and -not $allHealthy) {
    $retryCount++
    Write-Host "  Attempt $retryCount/$maxRetries..." -ForegroundColor Gray
    
    try {
        $containers = docker compose -f docker-compose.production.yml ps --format json | ConvertFrom-Json
        if ($containers -is [array]) {
            $unhealthy = $containers | Where-Object { $_.Health -ne "healthy" }
            if ($unhealthy.Count -eq 0) {
                $allHealthy = $true
                break
            }
        }
    }
    catch {
        Write-Host "  Waiting for containers to initialize..." -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 5
}

Write-Host ""

if ($allHealthy) {
    Write-Host "* All services are healthy!" -ForegroundColor Green
}
else {
    Write-Host "! Some services may still be starting..." -ForegroundColor Yellow
    Write-Host "  Run this command to check status:" -ForegroundColor Gray
    Write-Host "  docker compose -f docker-compose.production.yml ps" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker compose -f docker-compose.production.yml ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Access URLs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Auth Service:       http://localhost:3001" -ForegroundColor White
Write-Host "  Customer Service:   http://localhost:3003" -ForegroundColor White
Write-Host "  RabbitMQ UI:        http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host ""
Write-Host "  Health Checks:" -ForegroundColor Gray
Write-Host "  - Auth:     http://localhost:3001/actuator/health" -ForegroundColor Gray
Write-Host "  - Customer: http://localhost:3003/actuator/health" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Useful Commands" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  View logs:          docker compose -f docker-compose.production.yml logs -f" -ForegroundColor White
Write-Host "  Stop services:      docker compose -f docker-compose.production.yml stop" -ForegroundColor White
Write-Host "  Start services:     docker compose -f docker-compose.production.yml start" -ForegroundColor White
Write-Host "  Restart service:    docker compose -f docker-compose.production.yml restart [service-name]" -ForegroundColor White
Write-Host "  Remove all:         docker compose -f docker-compose.production.yml down" -ForegroundColor White

Write-Host ""
Write-Host "* Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
