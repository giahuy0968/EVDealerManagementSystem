# Script để start Auth Service
# Giải thích: Script này sẽ build và chạy service với các bước rõ ràng

Write-Host "=== Starting Auth Service ===" -ForegroundColor Cyan

# Bước 1: Clean và build project
Write-Host "[1/3] Building project..." -ForegroundColor Yellow
mvn clean package -DskipTests

# Kiểm tra build có thành công không
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[2/3] Build successful!" -ForegroundColor Green

# Bước 2: Kill process đang chạy ở port 3001 (nếu có)
Write-Host "[3/3] Checking port 3001..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "Port 3001 is in use. Killing process..." -ForegroundColor Yellow
    Stop-Process -Id $process.OwningProcess -Force
    Start-Sleep -Seconds 2
}

# Bước 3: Start service
Write-Host "Starting Auth Service on port 3001..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

java -jar target/auth-service-0.0.1-SNAPSHOT.jar
