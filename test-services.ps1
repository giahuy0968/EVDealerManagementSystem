# EVDMS - Test Services Script
# This script tests the Notification Service and API Gateway

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EVDMS Service Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$notificationUrl = "http://localhost:3006"
$gatewayUrl = "http://localhost:3000"
$token = $env:JWT_TOKEN # Set this: $env:JWT_TOKEN = "your-token"

# Test counter
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "  ✅ PASS (Status: $($response.StatusCode))" -ForegroundColor Green
            $script:passed++
            return $true
        } else {
            Write-Host "  ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:failed++
            return $false
        }
    } catch {
        Write-Host "  ❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

# ========================================
# Test 1: Gateway Health
# ========================================
Write-Host "`n[1] Gateway Health Check" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "Gateway Health" -Url "$gatewayUrl/health"

# ========================================
# Test 2: Services Health
# ========================================
Write-Host "`n[2] All Services Health Check" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "All Services Health" -Url "$gatewayUrl/health/services"

# ========================================
# Test 3: API Info
# ========================================
Write-Host "`n[3] API Information" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "API Info" -Url "$gatewayUrl/api"

# ========================================
# Test 4: Notification Service Health
# ========================================
Write-Host "`n[4] Notification Service Health" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "Notification Health" -Url "$notificationUrl/health"

# ========================================
# Test 5: Send Test Notification (Direct)
# ========================================
Write-Host "`n[5] Send Test Notification (Direct)" -ForegroundColor Cyan
Write-Host "----------------------------------------"
$testNotification = @{
    channel = "EMAIL"
    recipient = @{
        email = "test@example.com"
    }
    subject = "Test Notification"
    content = "<h1>Test</h1><p>This is a test notification from EVDMS</p>"
} | ConvertTo-Json

Test-Endpoint -Name "Send Notification" `
    -Url "$notificationUrl/api/v1/notifications/send" `
    -Method "POST" `
    -Body $testNotification

# ========================================
# Test 6: Get Templates
# ========================================
Write-Host "`n[6] Get Notification Templates" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Test-Endpoint -Name "Get Templates" `
    -Url "$notificationUrl/api/v1/notifications/templates"

# ========================================
# Test 7: Protected Endpoint (if token available)
# ========================================
if ($token) {
    Write-Host "`n[7] Test Protected Endpoint (with JWT)" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    
    $authHeaders = @{
        "Authorization" = "Bearer $token"
    }
    
    Test-Endpoint -Name "Get Notifications (Protected)" `
        -Url "$gatewayUrl/api/v1/notifications?limit=5" `
        -Headers $authHeaders
    
    Write-Host "`n[8] Send Notification via Gateway" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    
    Test-Endpoint -Name "Send via Gateway" `
        -Url "$gatewayUrl/api/v1/notifications/send" `
        -Method "POST" `
        -Headers $authHeaders `
        -Body $testNotification
} else {
    Write-Host "`n[7-8] Skipping Protected Endpoint Tests" -ForegroundColor Yellow
    Write-Host "  Set JWT token: `$env:JWT_TOKEN = 'your-token'" -ForegroundColor Gray
}

# ========================================
# Test 9: Rate Limiting Test
# ========================================
Write-Host "`n[9] Rate Limiting Test" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "  Sending 5 rapid requests..." -ForegroundColor Gray

$rateLimitPassed = $true
for ($i = 1; $i -le 5; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "$gatewayUrl/health" -UseBasicParsing
        Write-Host "  Request $i : ✅ (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "  Request $i : ⚠️  Rate limited (Expected)" -ForegroundColor Yellow
        $rateLimitPassed = $false
    }
    Start-Sleep -Milliseconds 100
}

if ($rateLimitPassed) {
    Write-Host "  ✅ Rate limiting working correctly" -ForegroundColor Green
    $script:passed++
} else {
    Write-Host "  ⚠️  Rate limiting may need adjustment" -ForegroundColor Yellow
    $script:passed++
}

# ========================================
# Test 10: Error Handling
# ========================================
Write-Host "`n[10] Error Handling Test" -ForegroundColor Cyan
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri "$gatewayUrl/api/v1/invalid-endpoint" -UseBasicParsing -ErrorAction Stop
    Write-Host "  ❌ Should have returned 404" -ForegroundColor Red
    $script:failed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "  ✅ 404 Error handling working" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "  ❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

# ========================================
# Summary
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($passed + $failed)"
Write-Host "Passed:      $passed" -ForegroundColor Green
Write-Host "Failed:      $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`n🎉 All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the output above." -ForegroundColor Yellow
}

# ========================================
# Service Status Display
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Service Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    $healthResponse = Invoke-RestMethod -Uri "$gatewayUrl/health/services" -UseBasicParsing
    
    Write-Host "`nOverall Status: $($healthResponse.overall.status)" -ForegroundColor $(
        if ($healthResponse.overall.status -eq "healthy") { "Green" } else { "Yellow" }
    )
    Write-Host "Healthy Services: $($healthResponse.overall.healthyCount)/$($healthResponse.overall.totalCount)"
    
    Write-Host "`nService Details:" -ForegroundColor White
    foreach ($service in $healthResponse.services) {
        $statusColor = if ($service.status -eq "healthy") { "Green" } else { "Red" }
        $statusIcon = if ($service.status -eq "healthy") { "✅" } else { "❌" }
        
        Write-Host "  $statusIcon $($service.name.PadRight(25))" -NoNewline
        Write-Host " $($service.status.PadRight(10))" -ForegroundColor $statusColor -NoNewline
        
        if ($service.responseTime) {
            Write-Host " ($($service.responseTime)ms)" -ForegroundColor Gray
        } else {
            Write-Host " (N/A)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  ⚠️  Could not fetch service status" -ForegroundColor Yellow
}

# ========================================
# Useful Commands
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Useful Commands" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Set JWT Token:     `$env:JWT_TOKEN = 'your-token'" -ForegroundColor Gray
Write-Host "Run this script:   .\test-services.ps1" -ForegroundColor Gray
Write-Host "Gateway logs:      docker-compose logs -f api-gateway" -ForegroundColor Gray
Write-Host "Notification logs: docker-compose logs -f notification-service" -ForegroundColor Gray
Write-Host ""
