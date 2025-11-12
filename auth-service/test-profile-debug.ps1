# Debug profile endpoint
$rand = Get-Random -Min 10000 -Max 99999
$username = "profiletest$rand"
$email = "profiletest$rand@test.com"

# Register
$regBody = @{ username=$username; email=$email; password="Pass123!@#"; fullName="Test" } | ConvertTo-Json
$regResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" -Method POST -Body $regBody -ContentType "application/json"
Write-Host "Registered: $($regResp.userId)" -ForegroundColor Green

# Login
$loginBody = @{ username=$username; password="Pass123!@#" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResp.token
Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Cyan

# Get Profile
Write-Host "`nTesting GET /profile with Authorization header:" -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $profileResp = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" -Method GET -Headers $headers
    Write-Host "[OK] Profile retrieved" -ForegroundColor Green
    Write-Host "Username: $($profileResp.username)"
    Write-Host "Email: $($profileResp.email)"
    Write-Host "Role: $($profileResp.role)"
} catch {
    Write-Host "[FAIL] Profile failed - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Error: $($reader.ReadToEnd())"
        $reader.Close()
    }
}
