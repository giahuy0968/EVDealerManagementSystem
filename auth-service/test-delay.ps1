# Test with longer delay
$rand = Get-Random -Min 10000 -Max 99999
$username = "delay_$rand"
$email = "delay$rand@test.com"
$password = "Pass123!@#"

Write-Host "Testing with username: $username" -ForegroundColor Cyan

Write-Host "`n=== REGISTER ===" -ForegroundColor Cyan
$registerBody = @{
    username = $username
    email = $email
    password = $password
    fullName = "Delay Test $rand"
    role = "USER"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "[OK] Register success - User ID: $($regResponse.userId)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Register failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== WAITING 5 SECONDS FOR TRANSACTION COMMIT ===" -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n=== LOGIN WITH USERNAME ===" -ForegroundColor Cyan
$loginBody1 = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse1 = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $loginBody1 `
        -ContentType "application/json"
    
    Write-Host "[OK] Login with username success!" -ForegroundColor Green
    Write-Host "Role: $($loginResponse1.role)"
} catch {
    Write-Host "[FAIL] Login with username failed" -ForegroundColor Red
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host "Error: $($reader.ReadToEnd())"
    $reader.Close()
}

Write-Host "`n=== LOGIN WITH EMAIL ===" -ForegroundColor Cyan
$loginBody2 = @{
    username = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse2 = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $loginBody2 `
        -ContentType "application/json"
    
    Write-Host "[OK] Login with email success!" -ForegroundColor Green
    Write-Host "Role: $($loginResponse2.role)"
} catch {
    Write-Host "[FAIL] Login with email failed" -ForegroundColor Red
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host "Error: $($reader.ReadToEnd())"
    $reader.Close()
}
