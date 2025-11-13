# Start Auth Service with Supabase profile
# WARNING: This script sets sensitive environment variables for your local session.
# Consider using Windows Credential Manager or a .env file in production.

param(
  [string]$HostName = "aws-1-ap-southeast-1.pooler.supabase.com",
  [int]$Port = 6543,
  [string]$Database = "postgres",
  [string]$Username = "",
  [string]$Password = "",
  [string]$JwtSecret = "this-is-a-very-long-secret-key-for-jwt-token-validation-minimum-256-bits-required"
)

$ErrorActionPreference = 'Stop'

# Construct JDBC URL with SSL required
$env:SPRING_PROFILES_ACTIVE = 'supabase'
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://$($HostName):$($Port)/$($Database)?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME = $Username
$env:SPRING_DATASOURCE_PASSWORD = $Password
$env:SERVER_PORT = "3001"
$env:JWT_SECRET = $JwtSecret

Write-Host "Starting Auth Service with Supabase profile..." -ForegroundColor Cyan
Write-Host "URL: $($env:SPRING_DATASOURCE_URL)" -ForegroundColor DarkGray

# Kill ALL Java processes to release JAR lock (aggressive cleanup)
Write-Host "Stopping any running Java processes..." -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Build
Write-Host "Building service..." -ForegroundColor Yellow
mvn -q -e clean package -DskipTests

# Kill anything on :3001 again (safety check)
try {
  Get-NetTCPConnection -LocalPort 3001 -ErrorAction Stop | ForEach-Object {
    $pid = $_.OwningProcess
    if ($pid) { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue }
  }
} catch {}

# Start service
Write-Host "Starting service..." -ForegroundColor Yellow
Start-Process java -ArgumentList '-jar','target/auth-service-0.0.1-SNAPSHOT.jar' -WindowStyle Hidden
Start-Sleep -Seconds 5

# Health check
try {
  $res = Invoke-WebRequest -Uri 'http://localhost:3001/actuator/health' -UseBasicParsing -TimeoutSec 10
  Write-Host "Health: $($res.StatusCode)" -ForegroundColor Green
} catch {
  Write-Host "Service did not respond to health check yet." -ForegroundColor DarkYellow
}

Write-Host "Done. Press Ctrl+C to stop if running in foreground session." -ForegroundColor Green
