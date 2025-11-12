# Test with DB check
$rand = Get-Random -Min 10000 -Max 99999
$username = "dbtest_$rand"
$email = "dbtest$rand@test.com"
$password = "Pass123!@#"

Write-Host "=== REGISTER ===" -ForegroundColor Cyan
$registerBody = @{
    username = $username
    email = $email
    password = $password
    fullName = "DB Test $rand"
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

Write-Host "`n=== CHECK DATABASE ===" -ForegroundColor Cyan
docker-compose exec -T postgres psql -U postgres -d evdms -c "SELECT username, email, role FROM users WHERE username='$username';"

Write-Host "`n=== WAIT 2 SECONDS ===" -ForegroundColor Yellow
Start-Sleep -Seconds 2

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
    
    Write-Host "[OK] Login success!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 30))..."
} catch {
    Write-Host "[FAIL] Login failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error: $errorBody"
    $reader.Close()
}
