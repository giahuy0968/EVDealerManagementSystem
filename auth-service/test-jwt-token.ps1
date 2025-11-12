# Test JWT token validation
$rand = Get-Random -Min 10000 -Max 99999
$username = "jwttest$rand"
$email = "jwttest$rand@test.com"
$password = "Pass123!@#"

Write-Host "=== REGISTER ===" -ForegroundColor Cyan
$registerBody = @{
    username = $username
    email = $email
    password = $password
    fullName = "JWT Test $rand"
    role = "USER"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "[OK] Register success - User ID: $($regResponse.userId)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Register failed" -ForegroundColor Red
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
    Write-Host "Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "Role: $($loginResponse.role)" -ForegroundColor Gray
    $token = $loginResponse.token
} catch {
    Write-Host "[FAIL] Login failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host "Error: $($reader.ReadToEnd())"
    $reader.Close()
    exit 1
}

Write-Host "`n=== TEST CHANGE PASSWORD (Should work with valid token) ===" -ForegroundColor Cyan
$changePassBody = @{
    oldPassword = $password
    newPassword = "NewPass123!@#"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $changeResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/change-password" `
        -Method POST `
        -Headers $headers `
        -Body $changePassBody
    
    Write-Host "[OK] Change password success: $($changeResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Change password failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host "Error: $($reader.ReadToEnd())"
    $reader.Close()
}

Write-Host "`n=== TEST GET PROFILE (Should work with valid token) ===" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" `
        -Method GET `
        -Headers $headers
    
    Write-Host "[OK] Get profile success" -ForegroundColor Green
    Write-Host "Username: $($profileResponse.username)" -ForegroundColor Gray
    Write-Host "Email: $($profileResponse.email)" -ForegroundColor Gray
    Write-Host "Role: $($profileResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Get profile failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host "Error: $($reader.ReadToEnd())"
    $reader.Close()
}
