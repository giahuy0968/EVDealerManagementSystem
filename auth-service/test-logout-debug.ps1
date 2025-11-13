# Debug logout issue
$rand = Get-Random -Min 10000 -Max 99999
$username = "logouttest$rand"
$email = "logouttest$rand@test.com"

Write-Host "=== REGISTER ===" -ForegroundColor Cyan
$regBody = @{ username=$username; email=$email; password="Pass123!@#"; fullName="Test"; role="ADMIN" } | ConvertTo-Json
$regResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" -Method POST -Body $regBody -ContentType "application/json"
Write-Host "[OK] User ID: $($regResp.userId)" -ForegroundColor Green

Write-Host "`n=== LOGIN ===" -ForegroundColor Cyan
$loginBody = @{ username=$username; password="Pass123!@#" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResp.token
$refreshToken = $loginResp.refreshToken
Write-Host "[OK] Token: $($token.Substring(0,30))..." -ForegroundColor Green
Write-Host "[OK] Refresh Token: $($refreshToken.Substring(0,30))..." -ForegroundColor Green

Write-Host "`n=== LOGOUT WITH REFRESH TOKEN ===" -ForegroundColor Cyan
try {
    $logoutBody = @{ refreshToken = $refreshToken } | ConvertTo-Json
    $headers = @{ "Authorization" = "Bearer $token" }
    
    Write-Host "Sending: refreshToken=$($refreshToken.Substring(0,30))..." -ForegroundColor Gray
    
    $logoutResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/logout" `
        -Method POST `
        -Headers $headers `
        -Body $logoutBody `
        -ContentType "application/json"
    
    Write-Host "[OK] Logout success: $($logoutResp.message)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Logout failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error: $errorBody"
        $reader.Close()
    }
}

Write-Host "`n=== TEST PROFILE AFTER LOGOUT (Should Fail) ===" -ForegroundColor Cyan
try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $profileResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" -Method GET -Headers $headers
    Write-Host "[FAIL] Profile still works! Blacklist not working" -ForegroundColor Red
    Write-Host "Username: $($profileResp.username)"
} catch {
    Write-Host "[OK] Profile blocked as expected (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}
