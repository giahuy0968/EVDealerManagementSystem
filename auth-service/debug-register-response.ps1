# Debug register response
$body = @{
    username = "testuser_$(Get-Random -Min 1000 -Max 9999)"
    email = "test$(Get-Random -Min 1000 -Max 9999)@example.com"
    password = "Test123!@#"
    fullName = "Test User"
    role = "USER"
} | ConvertTo-Json

Write-Host "Testing register..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "`nSuccess! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`nFailed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
