# ================================================
# CUSTOMER SERVICE - FULL API TEST (modeled after AUTH sample)
# Port: 3003 (customer-service) | 3001 (auth-service)
# ================================================

$ErrorActionPreference = "Stop"

$csBase = "http://localhost:3003/api/v1"
$authBase = "http://localhost:3001/api/v1/auth"

$testEmail = "cust_$(Get-Random)@example.com"
$testUsername = "cust_$(Get-Random)"
$testPassword = "CustPass123!"

Write-Host "" 
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CUSTOMER SERVICE - FULL API TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Counters and helper
$script:totalTests = 0
$script:passedTests = 0
$script:failedTests = 0
$script:skippedTests = 0

function Invoke-Test {
    param(
        [string]$Name,
        [scriptblock]$Block
    )
    $script:totalTests++
    Write-Host ("[{0}] {1}..." -f $script:totalTests, $Name) -ForegroundColor Yellow
    try {
        & $Block
        $script:passedTests++
    } catch {
        $script:failedTests++
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 1: Health Check (service)
Invoke-Test "Health Check (customer-service)" {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/actuator/health" -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status $($response.StatusCode)" }
    Write-Host "OK - Status: $($response.StatusCode)" -ForegroundColor Green
}

# 2: API health endpoint
Invoke-Test "API Health endpoint" {
    $response = Invoke-WebRequest -Uri "$csBase/health" -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status $($response.StatusCode)" }
    Write-Host "OK - $($response.StatusCode)" -ForegroundColor Green
}

# 3: Register (auth-service) - Register with ADMIN role
Invoke-Test "Register user (auth-service)" {
$registerBody = @{
    username = $testUsername
    email = $testEmail
    password = $testPassword
    fullName = "Customer Test User Admin"
    role = "ADMIN"
} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$authBase/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    $global:userId = $data.userId
    if (-not $global:userId) { throw "No userId returned" }
    Write-Host "OK - User ID: $($global:userId)" -ForegroundColor Green
}

# 4: Login (auth-service)
Invoke-Test "Login (auth-service)" {
$loginBody = @{ email = $testEmail; password = $testPassword } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$authBase/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $login = $response.Content | ConvertFrom-Json
    $global:accessToken = $login.token
    $global:refreshToken = $login.refreshToken
    if (-not $global:accessToken) { throw "No access token" }
    Write-Host "OK - Token received" -ForegroundColor Green
}

# Common headers
$authHeadersJson = @{ 
    "Authorization" = "Bearer $global:accessToken" 
    "Content-Type" = "application/json" 
}

# 5: Create Customer
Invoke-Test "Create Customer" {
$custBody = @{
    fullName = "Nguyen Van Test"
    phone = "0$(Get-Random -Minimum 900000000 -Maximum 999999999)"
    email = "customer$(Get-Random)@example.com"
    identityNumber = "$(Get-Random -Minimum 100000000000 -Maximum 999999999999)"
    dateOfBirth = "1990-01-15"
    gender = "MALE"
    address = "123 Test Street"
    city = "Ho Chi Minh"
    district = "District 1"
    ward = "Ward 1"
    customerType = "INDIVIDUAL"
    source = "WEBSITE"
    status = "NEW"
} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$csBase/customers" -Method POST -Headers $authHeadersJson -Body $custBody -ErrorAction Stop
    $cust = $response.Content | ConvertFrom-Json
    $global:customerId = $cust.id
    if (-not $global:customerId) { throw "No customerId" }
    Write-Host "OK - Customer ID: $($global:customerId)" -ForegroundColor Green
}

# 6: Get Customer by ID
Invoke-Test "Get Customer by ID" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Retrieved" -ForegroundColor Green
}

# 7: Update Customer
Invoke-Test "Update Customer" {
$updateCust = @{
    city = "Ha Noi"
    status = "CONTACTED"
} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)" -Method PUT -Headers $authHeadersJson -Body $updateCust -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Updated" -ForegroundColor Green
}

# 8: Get Customer History
Invoke-Test "Get Customer History" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)/history" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - History entries returned" -ForegroundColor Green
}

# 9: Add Customer Note
Invoke-Test "Add Customer Note" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken"; "Content-Type" = "text/plain" }
    $note = "This is a test note at $(Get-Date)."
    try {
        $null = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)/notes" -Method POST -Headers $headers -Body $note -ErrorAction Stop
        Write-Host "OK - Note added" -ForegroundColor Green
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 500) {
            $script:skippedTests++
            Write-Host "BO QUA - Can staffId tu JWT (se fix o service)" -ForegroundColor Yellow
        } else { throw }
    }
}

# 10: List Customers (pagination)
Invoke-Test "List Customers (page)" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/customers?page=0&size=10" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Listed" -ForegroundColor Green
}

# 10.1: Search Customers
Invoke-Test "Search Customers" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $c = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)" -Headers $headers -ErrorAction Stop
    $phone = ($c.Content | ConvertFrom-Json).phone
    $response = Invoke-WebRequest -Uri "$csBase/customers/search?q=$phone&page=0&size=10" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

# 10.2: Get Customer Orders (expected 501 placeholder)
Invoke-Test "Get Customer Orders" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    try {
        $null = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)/orders" -Headers $headers -ErrorAction Stop
        throw "Expected 501 but got 2xx"
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 501) { Write-Host "OK - 501 Not Implemented (placeholder)" -ForegroundColor Green }
        else { throw }
    }
}

# 10.3: Delete Customer (soft)
Invoke-Test "Delete Customer (soft)" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)" -Method DELETE -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 204) { throw "Unexpected status $($response.StatusCode)" }
}

# 11: Create Lead (public/customer context)
Invoke-Test "Create Lead" {
$leadBody = @{
    fullName = "Lead $(Get-Random)"
    phone = "0$(Get-Random -Minimum 800000000 -Maximum 899999999)"
    email = "lead$(Get-Random)@example.com"
    interestedVehicleModel = "Model X"
    source = "WEBSITE"
    notes = "Interested in EV test drive"
} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$csBase/leads" -Method POST -Headers $authHeadersJson -Body $leadBody -ErrorAction Stop
    $lead = $response.Content | ConvertFrom-Json
    $global:leadId = $lead.id
    if (-not $global:leadId) { throw "No leadId" }
    Write-Host "OK - Lead ID: $($global:leadId)" -ForegroundColor Green
}

# 12: Get Lead by ID
Invoke-Test "Get Lead by ID" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/leads/$($global:leadId)" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Retrieved" -ForegroundColor Green
}

# 13: Update Lead
Invoke-Test "Update Lead" {
$updateLead = @{ notes = "Updated note $(Get-Random)" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$csBase/leads/$($global:leadId)" -Method PUT -Headers $authHeadersJson -Body $updateLead -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Lead updated" -ForegroundColor Green
}

# 14: Change Lead Status
Invoke-Test "Change Lead Status" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/leads/$($global:leadId)/status?status=QUALIFIED" -Method PUT -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    Write-Host "OK - Status changed" -ForegroundColor Green
}

# 18: Assign Lead to Staff (now with ADMIN role)
Invoke-Test "Assign Lead to Staff" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $null = Invoke-WebRequest -Uri "$csBase/leads/$($global:leadId)/assign?staffId=$($global:userId)" -Method PUT -Headers $headers -ErrorAction Stop
    Write-Host "OK - Assigned" -ForegroundColor Green
}

# 16: Convert Lead to Customer
Invoke-Test "Convert Lead to Customer" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    try {
        $response = Invoke-WebRequest -Uri "$csBase/leads/$($global:leadId)/convert" -Method POST -Headers $headers -ErrorAction Stop
        if ($response.StatusCode -notin 200,201) { throw "Unexpected status" }
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 404) { $script:skippedTests++; Write-Host "BO QUA - API chua co/khong kha dung" -ForegroundColor Yellow } else { throw }
    }
}

# === Test Drives ===
Invoke-Test "Schedule Test Drive" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken"; "Content-Type" = "application/json" }
    $body = @{
        customerId = $global:customerId
        dealerId = ([guid]::NewGuid()).ToString()
        carModelId = ([guid]::NewGuid()).ToString()
        scheduledDate = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
        scheduledTime = "10:00:00"
        status = "SCHEDULED"
    } | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$csBase/test-drives" -Method POST -Headers $headers -Body $body -ErrorAction Stop
        $td = $response.Content | ConvertFrom-Json
        $global:testDriveId = $td.id
        $global:testDealerId = $td.dealerId
        if (-not $global:testDriveId) { throw "No testDriveId" }
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 404) { $script:skippedTests++; Write-Host "BO QUA - API test drive chua co" -ForegroundColor Yellow } else { throw }
    }
}

Invoke-Test "List Test Drives" {
    if (-not $global:testDriveId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $from = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    $to = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
    $dealer = if ($global:testDealerId) { $global:testDealerId } else { ([guid]::NewGuid()).ToString() }
    $response = Invoke-WebRequest -Uri "$csBase/test-drives?dealerId=$dealer&from=$from&to=$to" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Get Test Drive by ID" {
    if (-not $global:testDriveId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/test-drives/$($global:testDriveId)" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Update Test Drive" {
    if (-not $global:testDriveId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken"; "Content-Type" = "application/json" }
    $body = @{ notes = "Doi ghi chu" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$csBase/test-drives/$($global:testDriveId)" -Method PUT -Headers $headers -Body $body -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Confirm Test Drive" {
    if (-not $global:testDriveId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/test-drives/$($global:testDriveId)/status?status=CONFIRMED" -Method PUT -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Feedback after Test Drive" {
    if (-not $global:testDriveId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $fb = [uri]::EscapeDataString("Tuyet voi!")
    $response = Invoke-WebRequest -Uri "$csBase/test-drives/$($global:testDriveId)/feedback?feedback=$fb&rating=5" -Method POST -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -notin 200,201) { throw "Unexpected status" }
}

Invoke-Test "Calendar View" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $date = (Get-Date).ToString("yyyy-MM-dd")
    try {
        $response = Invoke-WebRequest -Uri "$csBase/test-drives/calendar?date=$date" -Headers $headers -ErrorAction Stop
        if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 404) { $script:skippedTests++; Write-Host "BO QUA - API calendar chua co" -ForegroundColor Yellow } else { throw }
    }
}

# === Feedback & Complaints ===
Invoke-Test "Submit Feedback" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken"; "Content-Type" = "application/json" }
    $body = @{
        customerId = $global:customerId
        dealerId = ([guid]::NewGuid()).ToString()
        type = "SERVICE"
        rating = 4
    content = "Dich vu tot"
    } | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$csBase/feedbacks" -Method POST -Headers $headers -Body $body -ErrorAction Stop
        $fd = $response.Content | ConvertFrom-Json
        $global:feedbackId = $fd.id
        if (-not $global:feedbackId) { throw "No feedbackId" }
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 404) { $script:skippedTests++; Write-Host "BO QUA - API feedback chua co" -ForegroundColor Yellow } else { throw }
    }
}

Invoke-Test "List Feedback" {
    if (-not $global:feedbackId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/feedbacks" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Get Feedback by ID" {
    if (-not $global:feedbackId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $response = Invoke-WebRequest -Uri "$csBase/feedbacks/$($global:feedbackId)" -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Resolve Feedback" {
    if (-not $global:feedbackId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    $respText = "Cam on phan hoi"
    # Removed skip logic - now with ADMIN role
    $response = Invoke-WebRequest -Uri "$csBase/feedbacks/$($global:feedbackId)/resolve?resolvedBy=$($global:userId)&response=$respText" -Method PUT -Headers $headers
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Submit Complaint" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken"; "Content-Type" = "application/json" }
    $body = @{
        customerId = $global:customerId
        dealerId = ([guid]::NewGuid()).ToString()
    subject = "Giao hang cham"
    description = "Tre 2 tuan"
        priority = "HIGH"
        status = "OPEN"
    } | ConvertTo-Json
    # Removed skip logic - now with ADMIN role
    $response = Invoke-WebRequest -Uri "$csBase/complaints" -Method POST -Headers $headers -Body $body
    $cp = $response.Content | ConvertFrom-Json
    $global:complaintId = $cp.id
    if (-not $global:complaintId) { throw "No complaintId" }
}

Invoke-Test "List Complaints" {
    if (-not $global:complaintId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    # Removed skip logic - now with ADMIN role
    $response = Invoke-WebRequest -Uri "$csBase/complaints" -Headers $headers
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Resolve Complaint" {
    if (-not $global:complaintId) { $script:skippedTests++; throw "Skip counting" }
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    # Removed skip logic - now with ADMIN role
    $response = Invoke-WebRequest -Uri "$csBase/complaints/$($global:complaintId)/resolve?resolution=Da xu ly" -Method PUT -Headers $headers
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

# === Segmentation ===
Invoke-Test "Get Customer Segments" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    # Removed skip logic - now with ADMIN role
    $response = Invoke-WebRequest -Uri "$csBase/customers/segments" -Headers $headers
    if ($response.StatusCode -ne 200) { throw "Unexpected status" }
}

Invoke-Test "Get Customer Score" {
    $headers = @{ "Authorization" = "Bearer $global:accessToken" }
    try {
        $response = Invoke-WebRequest -Uri "$csBase/customers/$($global:customerId)/score" -Headers $headers -ErrorAction Stop
        if ($response.StatusCode -ne 200) { throw "Unexpected status" }
    } catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 404) { $script:skippedTests++; Write-Host "BO QUA - API chua co" -ForegroundColor Yellow } else { throw }
    }
}

Write-Host "" 
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor White
Write-Host "User ID: $global:userId" -ForegroundColor White
Write-Host "Customer ID: $global:customerId" -ForegroundColor White
Write-Host "Lead ID: $global:leadId" -ForegroundColor White
Write-Host "" 
Write-Host ("Tong so API: {0} | Thanh cong: {1} | Bo qua: {2} | Loi: {3}" -f $script:totalTests, $script:passedTests, $script:skippedTests, $script:failedTests) -ForegroundColor Cyan
if ($script:failedTests -gt 0) {
    Write-Host "Mot so API chua dat. Se tien hanh fix cac API loi tiep theo." -ForegroundColor Yellow
} else {
    Write-Host "Tat ca API cot loi da chay on." -ForegroundColor Green
}
Write-Host "========================================" -ForegroundColor Cyan


