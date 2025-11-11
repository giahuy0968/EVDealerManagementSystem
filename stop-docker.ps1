# ====================================
# SCRIPT TỰ ĐỘNG DỪNG DOCKER COMPOSE
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EVDMS - Docker Compose Stopper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping all services..." -ForegroundColor Yellow
Write-Host ""

docker compose -f docker-compose.production.yml down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ All services stopped successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Failed to stop some services" -ForegroundColor Red
}

Write-Host ""
Write-Host "To remove all data (volumes), run:" -ForegroundColor Gray
Write-Host "  docker compose -f docker-compose.production.yml down -v" -ForegroundColor Cyan

Write-Host ""
Read-Host "Press Enter to exit"
