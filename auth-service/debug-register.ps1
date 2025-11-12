# Debug Auth Service Register
$body = @{
    username = "testuser123"
    email = "test123@example.com"
    password = "Test123!@#"
    fullName = "Test User"
    role = "USER"
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $body

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "`nSuccess!" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "`nError Details:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body: $responseBody"
}
