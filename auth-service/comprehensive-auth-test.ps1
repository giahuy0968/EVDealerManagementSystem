# ===================================================================
# AUTH SERVICE - COMPREHENSIVE API TEST SUITE (Postman Style)
# ===================================================================
# Chuẩn Postman: Pre-request, Test assertions, Auto-save variables
# Test coverage: 40+ test cases covering all Auth Service APIs
# ===================================================================

$ErrorActionPreference = "Stop"

# Test statistics
$script:totalTests = 0
$script:passedTests = 0
$script:failedTests = 0
$script:skippedTests = 0

# Global variables (like Postman environment)
$global:baseUrl = "http://localhost:3001/api/v1/auth"
$global:adminToken = ""
$global:userToken = ""
$global:refreshToken = ""
$global:userId = ""
$global:adminId = ""
$global:testUsername = "testuser_$(Get-Random -Min 1000 -Max 9999)"
$global:testEmail = "test$(Get-Random -Min 1000 -Max 9999)@example.com"
$global:adminUsername = "admin_$(Get-Random -Min 1000 -Max 9999)"
$global:adminEmail = "admin$(Get-Random -Min 1000 -Max 9999)@example.com"

# ===================================================================
# Helper Functions (like Postman pm.test())
# ===================================================================

function Test-API {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200,
        [scriptblock]$Assertions = $null,
        [bool]$ShouldFail = $false
    )
    
    $script:totalTests++
    $testPassed = $true
    $actualStatus = 0
    $response = $null
    
    Write-Host "`n[$script:totalTests] $TestName" -ForegroundColor Cyan
    Write-Host "    $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$global:baseUrl$Endpoint"
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params['Body'] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        try {
            $webResponse = Invoke-WebRequest @params -UseBasicParsing
            $actualStatus = $webResponse.StatusCode
            $response = $webResponse.Content | ConvertFrom-Json
        } catch {
            $actualStatus = $_.Exception.Response.StatusCode.value__
            if ($_.ErrorDetails.Message) {
                $response = $_.ErrorDetails.Message | ConvertFrom-Json
            }
            if (-not $ShouldFail) {
                throw
            }
        }
        
        # Status code check
        if ($actualStatus -ne $ExpectedStatus) {
            Write-Host "    [FAIL] Expected status $ExpectedStatus but got $actualStatus" -ForegroundColor Red
            $testPassed = $false
        } else {
            Write-Host "    [OK] Status: $actualStatus" -ForegroundColor Green
        }
        
        # Custom assertions
        if ($Assertions -and $testPassed) {
            try {
                & $Assertions $response
                Write-Host "    [OK] All assertions passed" -ForegroundColor Green
            } catch {
                Write-Host "    [FAIL] Assertion failed: $_" -ForegroundColor Red
                $testPassed = $false
            }
        }
        
    } catch {
        Write-Host "    [FAIL] $($_.Exception.Message)" -ForegroundColor Red
        $testPassed = $false
    }
    
    if ($testPassed) {
        $script:passedTests++
        Write-Host "    ✓ PASSED" -ForegroundColor Green
    } else {
        $script:failedTests++
        Write-Host "    ✗ FAILED" -ForegroundColor Red
    }
    
    return @{
        Passed = $testPassed
        Response = $response
        Status = $actualStatus
    }
}

# ===================================================================
# TEST SUITE START
# ===================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "      AUTH SERVICE - COMPREHENSIVE API TEST SUITE              " -ForegroundColor Cyan
Write-Host "      Chuan Postman voi Pre-request and Assertions             " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# ===================================================================
# A. USER MANAGEMENT TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ A. USER MANAGEMENT ═══" -ForegroundColor Yellow

# A1. Register - Valid User
$result = Test-API `
    -TestName "Register User with Valid Data" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = $global:testUsername
        email = $global:testEmail
        password = "Test123!@#"
        fullName = "Test User"
        role = "USER"
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if (-not $response.userId) { throw "Missing userId" }
        if (-not $response.message) { throw "Missing message" }
        $global:userId = $response.userId
    }

# A2. Register - Duplicate Username
Test-API `
    -TestName "Register with Duplicate Username (Should Fail)" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = $global:testUsername
        email = "different@example.com"
        password = "Test123!@#"
        fullName = "Test User"
        role = "USER"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# A3. Register - Invalid Email Format
Test-API `
    -TestName "Register with Invalid Email (Should Fail)" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = "newuser123"
        email = "invalid-email"
        password = "Test123!@#"
        fullName = "Test User"
        role = "USER"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# A4. Register - Weak Password
Test-API `
    -TestName "Register with Weak Password (Should Fail)" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = "newuser456"
        email = "newuser@example.com"
        password = "weak"
        fullName = "Test User"
        role = "USER"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# A5. Register Admin User
$adminResult = Test-API `
    -TestName "Register ADMIN User" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = $global:adminUsername
        email = $global:adminEmail
        password = "Admin123!@#"
        fullName = "Admin User"
        role = "ADMIN"
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if (-not $response.userId) { throw "Missing userId" }
        $global:adminId = $response.userId
    }

# ===================================================================
# B. AUTHENTICATION TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ B. AUTHENTICATION ═══" -ForegroundColor Yellow

# B1. Login - Valid Credentials
$loginResult = Test-API `
    -TestName "Login with Valid Credentials" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = $global:testUsername
        password = "Test123!@#"
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if (-not $response.token) { throw "Missing token" }
        if (-not $response.refreshToken) { throw "Missing refreshToken" }
        if ($response.username -ne $global:testUsername) { throw "Username mismatch" }
        $global:userToken = $response.token
        $global:refreshToken = $response.refreshToken
    }

# B2. Login - Admin User
$adminLoginResult = Test-API `
    -TestName "Login ADMIN User" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = $global:adminUsername
        password = "Admin123!@#"
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if ($response.role -ne "ADMIN") { throw "Role should be ADMIN" }
        $global:adminToken = $response.token
    }

# B3. Login - Invalid Password
Test-API `
    -TestName "Login with Invalid Password (Should Fail)" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = $global:testUsername
        password = "WrongPassword123!"
    } `
    -ExpectedStatus 401 `
    -ShouldFail $true

# B4. Login - Non-existent User
Test-API `
    -TestName "Login with Non-existent User (Should Fail)" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = "nonexistent_user_12345"
        password = "Test123!@#"
    } `
    -ExpectedStatus 401 `
    -ShouldFail $true

# B5. Verify Token - Valid
Test-API `
    -TestName "Verify Valid JWT Token" `
    -Method "GET" `
    -Endpoint "/verify" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if ($response.valid -ne $true) { throw "Token should be valid" }
        if (-not $response.username) { throw "Missing username" }
    }

# B6. Verify Token - Invalid
Test-API `
    -TestName "Verify Invalid Token (Should Fail)" `
    -Method "GET" `
    -Endpoint "/verify" `
    -Headers @{ "Authorization" = "Bearer invalid.token.here" } `
    -ExpectedStatus 401 `
    -ShouldFail $true

# B7. Verify Token - Missing
Test-API `
    -TestName "Verify without Token (Should Fail)" `
    -Method "GET" `
    -Endpoint "/verify" `
    -ExpectedStatus 401 `
    -ShouldFail $true

# B8. Refresh Token - Valid
if ($global:refreshToken) {
    Test-API `
        -TestName "Refresh Access Token" `
        -Method "POST" `
        -Endpoint "/refresh" `
        -Body @{ refreshToken = $global:refreshToken } `
        -ExpectedStatus 200 `
        -Assertions {
            param($response)
            if (-not $response.token) { throw "Missing new access token" }
            if (-not $response.refreshToken) { throw "Missing new refresh token" }
        }
}

# ===================================================================
# C. PASSWORD MANAGEMENT TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ C. PASSWORD MANAGEMENT ═══" -ForegroundColor Yellow

# C1. Change Password - Valid
Test-API `
    -TestName "Change Password with Correct Old Password" `
    -Method "POST" `
    -Endpoint "/change-password" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -Body @{
        oldPassword = "Test123!@#"
        newPassword = "NewTest123!@#"
    } `
    -ExpectedStatus 200

# C2. Login with New Password
$newLoginResult = Test-API `
    -TestName "Login with New Password" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = $global:testUsername
        password = "NewTest123!@#"
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        $global:userToken = $response.token
    }

# C3. Change Password - Wrong Old Password
Test-API `
    -TestName "Change Password with Wrong Old Password (Should Fail)" `
    -Method "POST" `
    -Endpoint "/change-password" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -Body @{
        oldPassword = "WrongPassword123!"
        newPassword = "AnotherNew123!@#"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# C4. Change Password - Weak New Password
Test-API `
    -TestName "Change Password to Weak Password (Should Fail)" `
    -Method "POST" `
    -Endpoint "/change-password" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -Body @{
        oldPassword = "NewTest123!@#"
        newPassword = "weak"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# C5. Forgot Password - Valid Email
Test-API `
    -TestName "Forgot Password with Valid Email" `
    -Method "POST" `
    -Endpoint "/forgot-password" `
    -Body @{ email = $global:testEmail } `
    -ExpectedStatus 200

# C6. Forgot Password - Invalid Email
Test-API `
    -TestName "Forgot Password with Non-existent Email" `
    -Method "POST" `
    -Endpoint "/forgot-password" `
    -Body @{ email = "nonexistent@example.com" } `
    -ExpectedStatus 404 `
    -ShouldFail $true

# ===================================================================
# D. PROFILE MANAGEMENT TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ D. PROFILE MANAGEMENT ═══" -ForegroundColor Yellow

# D1. Get Profile
Test-API `
    -TestName "Get Current User Profile" `
    -Method "GET" `
    -Endpoint "/profile" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if ($response.username -ne $global:testUsername) { throw "Username mismatch" }
        if ($response.email -ne $global:testEmail) { throw "Email mismatch" }
        if (-not $response.role) { throw "Missing role" }
    }

# D2. Update Profile - Valid
Test-API `
    -TestName "Update Profile with Valid Data" `
    -Method "PUT" `
    -Endpoint "/profile" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -Body @{
        fullName = "Updated Test User"
        email = $global:testEmail
    } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if ($response.fullName -ne "Updated Test User") { throw "FullName not updated" }
    }

# D3. Update Profile - Invalid Email
Test-API `
    -TestName "Update Profile with Invalid Email (Should Fail)" `
    -Method "PUT" `
    -Endpoint "/profile" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -Body @{
        fullName = "Test User"
        email = "invalid-email-format"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# D4. Get Profile - Unauthorized
Test-API `
    -TestName "Get Profile without Token (Should Fail)" `
    -Method "GET" `
    -Endpoint "/profile" `
    -ExpectedStatus 401 `
    -ShouldFail $true

# ===================================================================
# E. ADMIN USER MANAGEMENT TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ E. ADMIN USER MANAGEMENT ═══" -ForegroundColor Yellow

# E1. Get All Users - Admin
Test-API `
    -TestName "Get All Users (Admin)" `
    -Method "GET" `
    -Endpoint "/users" `
    -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
    -ExpectedStatus 200 `
    -Assertions {
        param($response)
        if ($response.Count -lt 2) { throw "Should have at least 2 users" }
    }

# E2. Get All Users - Regular User (Should Fail)
Test-API `
    -TestName "Get All Users as Regular User (Should Fail)" `
    -Method "GET" `
    -Endpoint "/users" `
    -Headers @{ "Authorization" = "Bearer $global:userToken" } `
    -ExpectedStatus 403 `
    -ShouldFail $true

# E3. Get User by ID - Admin
if ($global:userId) {
    Test-API `
        -TestName "Get User by ID (Admin)" `
        -Method "GET" `
        -Endpoint "/users/$global:userId" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -ExpectedStatus 200 `
        -Assertions {
            param($response)
            if ($response.id -ne $global:userId) { throw "User ID mismatch" }
        }
}

# E4. Update User - Admin
if ($global:userId) {
    Test-API `
        -TestName "Update User (Admin)" `
        -Method "PUT" `
        -Endpoint "/users/$global:userId" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -Body @{
            fullName = "Admin Updated User"
            email = $global:testEmail
        } `
        -ExpectedStatus 200
}

# E5. Change User Role - Admin
if ($global:userId) {
    Test-API `
        -TestName "Change User Role (Admin)" `
        -Method "PUT" `
        -Endpoint "/users/$global:userId/role" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -Body @{ role = "DEALER_STAFF" } `
        -ExpectedStatus 200
}

# E6. Deactivate User - Admin
if ($global:userId) {
    Test-API `
        -TestName "Deactivate User (Admin)" `
        -Method "PUT" `
        -Endpoint "/users/$global:userId/status" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -Body @{ isActive = $false } `
        -ExpectedStatus 200
}

# E7. Login as Deactivated User (Should Fail)
Test-API `
    -TestName "Login as Deactivated User (Should Fail)" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = $global:testUsername
        password = "NewTest123!@#"
    } `
    -ExpectedStatus 403 `
    -ShouldFail $true

# E8. Reactivate User - Admin
if ($global:userId) {
    Test-API `
        -TestName "Reactivate User (Admin)" `
        -Method "PUT" `
        -Endpoint "/users/$global:userId/status" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -Body @{ isActive = $true } `
        -ExpectedStatus 200
}

# E9. Delete User - Admin
if ($global:userId) {
    Test-API `
        -TestName "Delete User (Admin - Soft Delete)" `
        -Method "DELETE" `
        -Endpoint "/users/$global:userId" `
        -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
        -ExpectedStatus 200
}

# ===================================================================
# F. SESSION MANAGEMENT TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "═══ F. SESSION MANAGEMENT ═══" -ForegroundColor Yellow

# F1. Get Active Sessions
Test-API `
    -TestName "Get Active Sessions" `
    -Method "GET" `
    -Endpoint "/sessions" `
    -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
    -ExpectedStatus 200

# F2. Logout
Test-API `
    -TestName "Logout (Invalidate Current Session)" `
    -Method "POST" `
    -Endpoint "/logout" `
    -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
    -ExpectedStatus 200

# F3. Use Token After Logout (Should Fail)
Test-API `
    -TestName "Use Token After Logout (Should Fail)" `
    -Method "GET" `
    -Endpoint "/profile" `
    -Headers @{ "Authorization" = "Bearer $global:adminToken" } `
    -ExpectedStatus 401 `
    -ShouldFail $true

# ===================================================================
# G. SECURITY & EDGE CASE TESTS
# ===================================================================
Write-Host "`n" -NoNewline
Write-Host "=== G. SECURITY AND EDGE CASES ===" -ForegroundColor Yellow

# G1. SQL Injection Attempt
Test-API `
    -TestName "SQL Injection Attempt in Login (Should Fail)" `
    -Method "POST" `
    -Endpoint "/login" `
    -Body @{
        username = "admin' OR '1'='1"
        password = "anything"
    } `
    -ExpectedStatus 401 `
    -ShouldFail $true

# G2. XSS Attempt in Registration
Test-API `
    -TestName "XSS Attempt in Registration" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = "xss_user_$(Get-Random -Min 1000 -Max 9999)"
        email = "xss$(Get-Random -Min 1000 -Max 9999)@example.com"
        password = "Test123!@#"
        fullName = '<script>alert("XSS")</script>'
        role = "USER"
    } `
    -ExpectedStatus 200

# G3. Very Long Username
Test-API `
    -TestName "Register with Very Long Username (Should Fail)" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = "a" * 300
        email = "long@example.com"
        password = "Test123!@#"
        fullName = "Test User"
        role = "USER"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# G4. Missing Required Fields
Test-API `
    -TestName "Register without Required Fields (Should Fail)" `
    -Method "POST" `
    -Endpoint "/register" `
    -Body @{
        username = "incomplete_user"
    } `
    -ExpectedStatus 400 `
    -ShouldFail $true

# ===================================================================
# FINAL REPORT
# ===================================================================
Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "                    KET QUA TEST                                " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tong so test   : $script:totalTests" -ForegroundColor White
Write-Host "Thanh cong     : $script:passedTests" -ForegroundColor Green
Write-Host "That bai       : $script:failedTests" -ForegroundColor Red
Write-Host "Bo qua         : $script:skippedTests" -ForegroundColor Yellow
Write-Host ""

$passRate = [math]::Round(($script:passedTests / $script:totalTests) * 100, 2)
Write-Host "Ti le thanh cong: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

if ($script:failedTests -eq 0) {
    Write-Host "[SUCCESS] TAT CA CAC TEST DA PASS!" -ForegroundColor Green
} else {
    Write-Host "[WARNING] CO $script:failedTests TEST THAT BAI. Vui long kiem tra lai!" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Test hoan thanh luc $timestamp" -ForegroundColor Gray
Write-Host "================================================================" -ForegroundColor Cyan

# Exit with proper code
if ($script:failedTests -gt 0) {
    exit 1
} else {
    exit 0
}
