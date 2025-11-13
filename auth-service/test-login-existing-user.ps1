# Test login với user có trong DB
$username = "user_79176"
$password = "Pass123!@#"

$body = @{
    username = $username
    password = $password
} | ConvertTo-Json

Write-Host "Login attempt for: $username" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "[OK] Login success!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 30))..."
    Write-Host "Role: $($response.role)"
} catch {
    Write-Host "[FAIL] Login failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error: $errorBody"
    $reader.Close()
}
