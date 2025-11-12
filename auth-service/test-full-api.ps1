# FULL AUTH SERVICE API TEST
# Test all 22 endpoints theo yêu cầu

$baseUrl = "http://localhost:3001/api/v1/auth"
$testEmail = "admin_$(Get-Random)@example.com"
$testUsername = "admin_$(Get-Random)"
$testPassword = "AdminPass123!"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AUTH SERVICE - FULL API TEST (22)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[1/22] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/actuator/health"
    Write-Host "OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 2: API Test
Write-Host "[2/22] API Test..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test"
    Write-Host "OK - $($response.Content)" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 3: Register
Write-Host "[3/22] Register User..." -ForegroundColor Yellow
$registerBody = @{
    username = $testUsername
    email = $testEmail
    password = $testPassword
    fullName = "Admin User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/register" -Method POST -Body $registerBody -ContentType "application/json"
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "OK - User ID: $($registerData.userId)" -ForegroundColor Green
    $userId = $registerData.userId
} catch { Write-Host "FAILED: $_" -ForegroundColor Red; exit 1 }

# Test 4: Login
Write-Host "[4/22] Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "OK - Role: $($loginData.role), Token received" -ForegroundColor Green
    $global:accessToken = $loginData.token
    $global:refreshToken = $loginData.refreshToken
} catch { Write-Host "FAILED: $_" -ForegroundColor Red; exit 1 }

# Test 5: Verify Token
Write-Host "[5/22] Verify Token..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/verify" -Headers $headers
    $data = $response.Content | ConvertFrom-Json
    Write-Host "OK - Valid: $($data.valid)" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 6: Get Profile
Write-Host "[6/22] Get Profile..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile" -Headers $headers
    $profileData = $response.Content | ConvertFrom-Json
    Write-Host "OK - Email: $($profileData.email)" -ForegroundColor Green
} catch { Write-Host "FAILED (403 expected if security enabled): $_" -ForegroundColor Yellow }

# Test 7: Update Profile
Write-Host "[7/22] Update Profile..." -ForegroundColor Yellow
$updateBody = @{
    fullName = "Updated Admin User"
    avatarUrl = "https://example.com/avatar.jpg"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile" -Method PUT -Headers $headers -Body $updateBody
    Write-Host "OK - Profile updated" -ForegroundColor Green
} catch { Write-Host "FAILED (403 expected if security enabled): $_" -ForegroundColor Yellow }

# Test 8: Upload Avatar
Write-Host "[8/22] Upload Avatar..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile/avatar?avatar=https://example.com/new-avatar.jpg" -Method PUT -Headers $headers
    Write-Host "OK - Avatar uploaded" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

# Test 9: Get Sessions
Write-Host "[9/22] Get Sessions..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/sessions" -Headers $headers
    $sessions = $response.Content | ConvertFrom-Json
    Write-Host "OK - Active sessions: $($sessions.Count)" -ForegroundColor Green
    if ($sessions.Count -gt 0) {
        $global:sessionId = $sessions[0].id
    }
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

# Test 10: Refresh Token
Write-Host "[10/22] Refresh Token..." -ForegroundColor Yellow
$refreshBody = @{ refreshToken = $global:refreshToken } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/refresh" -Method POST -Body $refreshBody -ContentType "application/json"
    $newTokens = $response.Content | ConvertFrom-Json
    Write-Host "OK - Token refreshed" -ForegroundColor Green
    $global:accessToken = $newTokens.accessToken
    $global:refreshToken = $newTokens.refreshToken
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 11: Forgot Password
Write-Host "[11/22] Forgot Password..." -ForegroundColor Yellow
$forgotBody = @{ email = $testEmail } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/forgot-password" -Method POST -Body $forgotBody -ContentType "application/json"
    $data = $response.Content | ConvertFrom-Json
    Write-Host "OK - Reset token generated" -ForegroundColor Green
    $global:resetToken = $data.token
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 12: Reset Password
Write-Host "[12/22] Reset Password..." -ForegroundColor Yellow
$resetBody = @{
    token = $global:resetToken
    newPassword = "NewPass123!"
} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/reset-password" -Method POST -Body $resetBody -ContentType "application/json"
    Write-Host "OK - Password reset" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Re-login with new password
Write-Host "[13/22] Re-Login with new password..." -ForegroundColor Yellow
$loginBody2 = @{
    email = $testEmail
    password = "NewPass123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody2 -ContentType "application/json"
    $loginData2 = $response.Content | ConvertFrom-Json
    Write-Host "OK - Logged in with new password" -ForegroundColor Green
    $global:accessToken = $loginData2.token
    $global:refreshToken = $loginData2.refreshToken
} catch { Write-Host "FAILED: $_" -ForegroundColor Red }

# Test 14: Change Password
Write-Host "[14/22] Change Password..." -ForegroundColor Yellow
$changeBody = @{
    currentPassword = "NewPass123!"
    newPassword = "FinalPass123!"
} | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/change-password" -Method POST -Headers $headers -Body $changeBody
    Write-Host "OK - Password changed" -ForegroundColor Green
    
    # Re-login to get new token after password change (changePassword revokes all sessions)
    $loginBody3 = @{
        email = $testEmail
        password = "FinalPass123!"
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody3 -ContentType "application/json"
    $loginData3 = $response.Content | ConvertFrom-Json
    $global:accessToken = $loginData3.token
    $global:refreshToken = $loginData3.refreshToken
    
    # Get new session ID
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/sessions" -Headers $headers
    $sessions = $response.Content | ConvertFrom-Json
    if ($sessions.Count -gt 0) {
        $global:sessionId = $sessions[0].id
    }
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

# Promote user to ADMIN for admin endpoint tests
try {
    $promoteBody = @{ userId = $userId } | ConvertTo-Json
    Invoke-WebRequest -Uri "$baseUrl/promote-to-admin" -Method POST -Body $promoteBody -ContentType "application/json" | Out-Null
    Write-Host "[SETUP] User promoted to ADMIN for admin endpoint tests" -ForegroundColor Cyan
    
    # Re-login to get new token with ADMIN role
    $loginBody5 = @{
        email = $testEmail
        password = "FinalPass123!"
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody5 -ContentType "application/json"
    $loginData5 = $response.Content | ConvertFrom-Json
    $global:accessToken = $loginData5.token
    $global:refreshToken = $loginData5.refreshToken
    Write-Host "[SETUP] Re-logged in with ADMIN role" -ForegroundColor Cyan
} catch {
    Write-Host "[SETUP] Failed to promote user to ADMIN: $_" -ForegroundColor Yellow
}

# Test 15-21: Admin Endpoints (will fail without ADMIN role)
Write-Host "[15/22] Get All Users (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/users" -Headers $headers
    $users = $response.Content | ConvertFrom-Json
    Write-Host "OK - Total users: $($users.Count)" -ForegroundColor Green
} catch { Write-Host "FAILED (403 expected without ADMIN role): $_" -ForegroundColor Yellow }

Write-Host "[16/22] Get User by ID (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/users/$userId" -Headers $headers
    Write-Host "OK - User found" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host "[17/22] Update User (Admin)..." -ForegroundColor Yellow
$updateUserBody = @{ fullName = "Updated by Admin" } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/users/$userId" -Method PUT -Headers $headers -Body $updateUserBody
    Write-Host "OK - User updated" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host "[18/22] Change User Role (Admin)..." -ForegroundColor Yellow
$roleBody = @{ role = "ADMIN" } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/users/$userId/role" -Method PUT -Headers $headers -Body $roleBody
    Write-Host "OK - Role changed to ADMIN" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host "[19/22] Change User Status (Admin)..." -ForegroundColor Yellow
$statusBody = @{ isActive = $false } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/users/$userId/status" -Method PUT -Headers $headers -Body $statusBody
    Write-Host "OK - User deactivated" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

# Re-activate for deletion test
$statusBody2 = @{ isActive = $true } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    Invoke-WebRequest -Uri "$baseUrl/users/$userId/status" -Method PUT -Headers $headers -Body $statusBody2 | Out-Null
} catch {}

Write-Host "[20/22] Logout..." -ForegroundColor Yellow
$logoutBody = @{ refreshToken = $global:refreshToken } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/logout" -Method POST -Headers $headers -Body $logoutBody
    Write-Host "OK - Logged out" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host "[21/22] Delete Session..." -ForegroundColor Yellow
try {
    # Re-login to get new session for deletion test
    $loginBody4 = @{
        email = $testEmail
        password = "FinalPass123!"
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody4 -ContentType "application/json"
    $loginData4 = $response.Content | ConvertFrom-Json
    $testToken = $loginData4.token
    
    # Get sessions
    $headers = @{ "Authorization" = "Bearer $testToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/sessions" -Headers $headers
    $sessions = $response.Content | ConvertFrom-Json
    if ($sessions.Count -gt 0) {
        $testSessionId = $sessions[0].id
        $response = Invoke-WebRequest -Uri "$baseUrl/sessions/$testSessionId" -Method DELETE -Headers $headers
        Write-Host "OK - Session deleted" -ForegroundColor Green
    } else {
        Write-Host "SKIP - No session" -ForegroundColor Yellow
    }
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host "[22/22] Logout All..." -ForegroundColor Yellow
try {
    $headers = @{
        "X-User-Id" = $userId
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/logout-all" -Method POST -Headers $headers
    Write-Host "OK - Logged out from all devices" -ForegroundColor Green
} catch { Write-Host "FAILED: $_" -ForegroundColor Yellow }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor White
Write-Host "Test Username: $testUsername" -ForegroundColor White
Write-Host "User ID: $userId" -ForegroundColor White
Write-Host ""
Write-Host "All 22 tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
