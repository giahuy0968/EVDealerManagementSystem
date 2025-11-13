# Debug Login Issue
$body = @{
    username = "testuser_4821"
    password = "Test123!@#"
} | ConvertTo-Json

Write-Host "Request Body:" -ForegroundColor Cyan
Write-Host $body

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "`nSuccess! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "`nError! Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body: $responseBody"
    $reader.Close()
}
