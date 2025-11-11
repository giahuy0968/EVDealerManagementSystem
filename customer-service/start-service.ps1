# Script để start Customer Service
Write-Host "=== Starting Customer Service ===" -ForegroundColor Cyan

# Build project
Write-Host "[1/3] Building project..." -ForegroundColor Yellow
mvn clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[2/3] Build successful!" -ForegroundColor Green

# Kill process on port 3003
Write-Host "[3/3] Checking port 3003..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "Port 3003 is in use. Killing process..." -ForegroundColor Yellow
    Stop-Process -Id $process.OwningProcess -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting Customer Service on port 3003..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

java -jar target/customer-service-0.0.1-SNAPSHOT.jar
