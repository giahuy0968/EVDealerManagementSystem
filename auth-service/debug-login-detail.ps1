# Debug login detail
$username = "testuser_7982"
$password = "Test123!@#"

Write-Host "Password length: $($password.Length)" -ForegroundColor Cyan

$body = @{
    username = $username
    password = $password
} | ConvertTo-Json

Write-Host "Request:" -ForegroundColor Cyan
Write-Host $body

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "`nSuccess!" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    $data | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`nFailed!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error: $errorBody"
    $reader.Close()
}
