#!/usr/bin/env pwsh
# Quick verification script for Docker setup
# Usage: .\quick-docker-check.ps1

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  EV Dealer Management System - Docker Check            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Check Docker Desktop
Write-Host "1. Checking Docker Desktop..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop!" -ForegroundColor Red
    exit 1
}

# 2. Check containers
Write-Host "`n2. Checking container status..." -ForegroundColor Yellow
$containers = docker-compose ps --format json 2>$null | ConvertFrom-Json

if ($null -eq $containers) {
    Write-Host "   ⚠️  No containers running. Run: docker-compose up -d" -ForegroundColor Yellow
    exit 0
}

$serviceStatus = @{
    "auth-service" = $false
    "customer-service" = $false
    "postgres" = $false
}

foreach ($container in $containers) {
    $name = $container.Name -replace "evdealermanagementsystem-", "" -replace "-1", ""
    $status = $container.State
    
    if ($serviceStatus.ContainsKey($name)) {
        $serviceStatus[$name] = ($status -eq "running")
        
        if ($status -eq "running") {
            Write-Host "   ✅ $name : RUNNING" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $name : $status" -ForegroundColor Red
        }
    }
}

# 3. Check logs for successful startup
Write-Host "`n3. Checking service startup logs..." -ForegroundColor Yellow

if ($serviceStatus["auth-service"]) {
    $authStarted = docker-compose logs auth-service 2>$null | Select-String "Started AuthServiceApplication"
    if ($authStarted) {
        Write-Host "   ✅ Auth Service started successfully" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Auth Service still starting..." -ForegroundColor Yellow
    }
}

if ($serviceStatus["customer-service"]) {
    $customerStarted = docker-compose logs customer-service 2>$null | Select-String "Started CustomerServiceApplication"
    if ($customerStarted) {
        Write-Host "   ✅ Customer Service started successfully" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Customer Service still starting..." -ForegroundColor Yellow
    }
}

# 4. Check database connections
Write-Host "`n4. Checking database connections..." -ForegroundColor Yellow

if ($serviceStatus["auth-service"]) {
    $authHikari = docker-compose logs auth-service 2>$null | Select-String "HikariPool-1 - Start completed"
    if ($authHikari) {
        Write-Host "   ✅ Auth Service connected to database" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Auth Service database connection issue" -ForegroundColor Red
    }
}

if ($serviceStatus["customer-service"]) {
    $customerHikari = docker-compose logs customer-service 2>$null | Select-String "HikariPool-1 - Start completed"
    if ($customerHikari) {
        Write-Host "   ✅ Customer Service connected to database" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Customer Service database connection issue" -ForegroundColor Red
    }
}

# 5. Test API endpoints
Write-Host "`n5. Testing API endpoints..." -ForegroundColor Yellow

try {
    $authResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Auth Service responding on port 3001" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "   [OK] Auth Service responding on port 3001 [403 auth required]" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Auth Service not responding on port 3001" -ForegroundColor Red
    }
}

try {
    $customerResponse = Invoke-WebRequest -Uri "http://localhost:3003/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Customer Service responding on port 3003" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "   [OK] Customer Service responding on port 3003 [403 auth required]" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Customer Service not responding on port 3003" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  SUMMARY                                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$allGood = $true
foreach ($service in $serviceStatus.Keys) {
    if (-not $serviceStatus[$service]) {
        $allGood = $false
        break
    }
}

if ($allGood) {
    Write-Host "`n🎉 ALL SYSTEMS OPERATIONAL! 🎉" -ForegroundColor Green
    Write-Host "`nYou can now test the APIs:" -ForegroundColor Cyan
    Write-Host "  • Auth Service:     http://localhost:3001" -ForegroundColor White
    Write-Host "  • Customer Service: http://localhost:3003" -ForegroundColor White
} else {
    Write-Host "`n⚠️  SOME SERVICES ARE NOT RUNNING" -ForegroundColor Yellow
    Write-Host "`nTry:" -ForegroundColor Cyan
    Write-Host "  docker-compose up -d" -ForegroundColor White
    Write-Host "`nOr check logs:" -ForegroundColor Cyan
    Write-Host "  docker-compose logs -f auth-service customer-service" -ForegroundColor White
}

Write-Host ""
