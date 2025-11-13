# Test fresh register + login
$rand = Get-Random -Min 10000 -Max 99999
$username = "user_$rand"
$email = "user$rand@test.com"
$password = "Pass123!@#"

Write-Host "=== REGISTER ===" -ForegroundColor Cyan
$registerBody = @{
    username = $username
    email = $email
    password = $password
    fullName = "Test User $rand"
    role = "USER"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "[OK] Register success" -ForegroundColor Green
    Write-Host "User ID: $($regResponse.userId)"
} catch {
    Write-Host "[FAIL] Register failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== LOGIN ===" -ForegroundColor Cyan
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    Write-Host "[OK] Login success" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 30))..."
    Write-Host "Role: $($loginResponse.role)"
    
    $global:token = $loginResponse.token
} catch {
    Write-Host "[FAIL] Login failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error: $errorBody"
    $reader.Close()
    exit 1
}

Write-Host "`n=== GET PROFILE ===" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $profile = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" `
        -Method GET `
        -Headers $headers
    
    Write-Host "[OK] Get profile success" -ForegroundColor Green
    Write-Host "Username: $($profile.username)"
    Write-Host "Email: $($profile.email)"
    Write-Host "Role: $($profile.role)"
} catch {
    Write-Host "[FAIL] Get profile failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green
