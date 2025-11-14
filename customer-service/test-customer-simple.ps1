# Test Customer Service APIs - Simple Version
# Run: powershell -ExecutionPolicy Bypass -File test-customer-simple.ps1

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Global variables
$global:baseUrl = "http://localhost:3003/api/v1"
$global:authUrl = "http://localhost:3001/api/v1/auth"
$global:token = ""
$global:passCount = 0
$global:failCount = 0
$global:skipCount = 0
$global:customerId = $null
$global:leadId = $null
$global:testDriveId = $null
$global:feedbackId = $null
$global:complaintId = $null
$global:testRunId = [guid]::NewGuid().ToString().Substring(0,8)
$global:phonePrefix = "0" + (Get-Random -Minimum 1 -Maximum 10) + (Get-Random -Minimum 10000000 -Maximum 99999999)

# Test-API helper function
function Test-API {
    param(
        [string]$TestName,
        [string]$Method = "GET",
        [string]$Endpoint,
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [string]$Description = ""
    )
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "TEST: $TestName" -ForegroundColor Yellow
    if ($Description) {
        Write-Host "DESC: $Description" -ForegroundColor Gray
    }
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }
        
        if ($global:token) {
            $headers["Authorization"] = "Bearer $global:token"
        }
        
        $url = "$global:baseUrl$Endpoint"
        Write-Host "REQUEST: $Method $url" -ForegroundColor White
        
        if ($Body) {
            Write-Host "BODY: $Body" -ForegroundColor Gray
        }
        
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        try {
            $response = Invoke-WebRequest @params -UseBasicParsing
            $statusCode = $response.StatusCode
            $content = $response.Content
            
            Write-Host "STATUS: $statusCode" -ForegroundColor $(if ($statusCode -eq $ExpectedStatus) { "Green" } else { "Red" })
            Write-Host "RESPONSE: $content" -ForegroundColor Gray
            
            if ($statusCode -eq $ExpectedStatus) {
                Write-Host "RESULT: PASS" -ForegroundColor Green
                $global:passCount++
                return $content
            } else {
                Write-Host "RESULT: FAIL - Expected $ExpectedStatus but got $statusCode" -ForegroundColor Red
                $global:failCount++
                return $null
            }
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $errorBody = ""
            
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd()
                $reader.Close()
            }
            
            Write-Host "STATUS: $statusCode" -ForegroundColor $(if ($statusCode -eq $ExpectedStatus) { "Green" } else { "Red" })
            Write-Host "ERROR: $errorBody" -ForegroundColor Red
            
            if ($statusCode -eq $ExpectedStatus) {
                Write-Host "RESULT: PASS (Expected error)" -ForegroundColor Green
                $global:passCount++
                return $errorBody
            } else {
                Write-Host "RESULT: FAIL - Expected $ExpectedStatus but got $statusCode" -ForegroundColor Red
                $global:failCount++
                return $null
            }
        }
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "RESULT: FAIL (Exception)" -ForegroundColor Red
        $global:failCount++
        return $null
    }
}

# Setup: Register and Get Auth Token
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "SETUP: Register and Login" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# Register test user first
$registerBody = @{
    username = "testcustomer"
    email = "testcustomer@example.com"
    password = "Test123!@#"
    fullName = "Test Customer Admin"
    role = "ADMIN"
} | ConvertTo-Json

try {
    Write-Host "Registering test user..." -ForegroundColor Yellow
    $regResponse = Invoke-RestMethod -Uri "$global:authUrl/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "User registered successfully" -ForegroundColor Green
}
catch {
    # User might already exist, try login anyway
    Write-Host "Registration failed (user may exist): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Login to get token
$loginBody = @{
    username = "testcustomer"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$global:authUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    $global:token = $authResponse.token
    Write-Host "Token acquired successfully" -ForegroundColor Green
    Write-Host "Token: $($global:token.Substring(0, 50))..." -ForegroundColor Gray
}
catch {
    Write-Host "Failed to get auth token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ========================================
# MODULE 1: CUSTOMER MANAGEMENT
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "MODULE 1: CUSTOMER MANAGEMENT" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 1.1 Create Customer
$customerPhone1 = "0" + (Get-Random -Minimum 1 -Maximum 10) + (Get-Random -Minimum 10000000 -Maximum 99999999).ToString()
$customerBody = @{
    fullName = "Test Customer"
    firstName = "Test"
    lastName = "Customer"
    email = "test.customer.$global:testRunId@example.com"
    phone = $customerPhone1
    address = "123 Test Street"
    city = "Test City"
    status = "NEW"
} | ConvertTo-Json

$customerResult = Test-API -TestName "1.1 Create Customer" -Method "POST" -Endpoint "/customers" -Body $customerBody -ExpectedStatus 201 -Description "Create new customer"

if ($customerResult) {
    $customerData = $customerResult | ConvertFrom-Json
    $global:customerId = $customerData.id
    Write-Host "Created Customer ID: $global:customerId" -ForegroundColor Green
}

# 1.2 Get Customer by ID
Test-API -TestName "1.2 Get Customer by ID" -Method "GET" -Endpoint "/customers/$global:customerId" -ExpectedStatus 200 -Description "Get customer details"

# 1.3 Get All Customers (no pagination params)
Test-API -TestName "1.3 Get All Customers" -Method "GET" -Endpoint "/customers" -ExpectedStatus 200 -Description "List all customers"

# 1.4 Update Customer
$customerPhone2 = "0" + (Get-Random -Minimum 1 -Maximum 10) + (Get-Random -Minimum 10000000 -Maximum 99999999).ToString()
$updateBody = @{
    fullName = "Updated Customer"
    firstName = "Updated"
    lastName = "Customer"
    email = "updated.customer.$global:testRunId@example.com"
    phone = $customerPhone2
    address = "456 Updated Street"
    city = "Updated City"
    status = "CONTACTED"
} | ConvertTo-Json

Test-API -TestName "1.4 Update Customer" -Method "PUT" -Endpoint "/customers/$global:customerId" -Body $updateBody -ExpectedStatus 200 -Description "Update customer info"

# 1.5 Search Customer by Phone
Test-API -TestName "1.5 Search Customer by Phone" -Method "GET" -Endpoint "/customers/search?phone=$customerPhone2" -ExpectedStatus 200 -Description "Search customer by phone"

# 1.6 Search Customer by Email
Test-API -TestName "1.6 Search Customer by Email" -Method "GET" -Endpoint "/customers/search?email=updated.customer.$global:testRunId@example.com" -ExpectedStatus 200 -Description "Search customer by email"

# 1.7 Get Customer Interaction History
Test-API -TestName "1.7 Get Customer History" -Method "GET" -Endpoint "/customers/$global:customerId/history" -ExpectedStatus 200 -Description "Get customer interaction history"

# 1.8 Add Note to Customer
$noteBody = @{
    content = "Test note for customer"
    type = "general"
} | ConvertTo-Json

Test-API -TestName "1.8 Add Note to Customer" -Method "POST" -Endpoint "/customers/$global:customerId/notes" -Body $noteBody -ExpectedStatus 201 -Description "Add note to customer"

# 1.9 Get Customer Orders - SKIP (Not implemented yet)
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST: 1.9 Get Customer Orders" -ForegroundColor Cyan
Write-Host "DESC: Get customer order history" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULT: SKIPPED (Endpoint not implemented)" -ForegroundColor Yellow
$global:skipCount++

# ========================================
# MODULE 2: LEAD MANAGEMENT
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "MODULE 2: LEAD MANAGEMENT" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 2.1 Create Lead
$leadPhone1 = "0" + (Get-Random -Minimum 1 -Maximum 10) + (Get-Random -Minimum 10000000 -Maximum 99999999).ToString()
$leadBody = @{
    firstName = "Lead"
    lastName = "Test"
    fullName = "Lead Test"
    email = "lead.test.$global:testRunId@example.com"
    phone = $leadPhone1
    source = "website"
    status = "NEW"
    interestedVehicle = "Tesla Model 3"
} | ConvertTo-Json

$leadResult = Test-API -TestName "2.1 Create Lead" -Method "POST" -Endpoint "/leads" -Body $leadBody -ExpectedStatus 201 -Description "Create new lead"

if ($leadResult) {
    $leadData = $leadResult | ConvertFrom-Json
    $global:leadId = $leadData.id
    Write-Host "Created Lead ID: $global:leadId" -ForegroundColor Green
}

# 2.2 Get Lead by ID
Test-API -TestName "2.2 Get Lead by ID" -Method "GET" -Endpoint "/leads/$global:leadId" -ExpectedStatus 200 -Description "Get lead details"

# 2.3 Get All Leads
Test-API -TestName "2.3 Get All Leads" -Method "GET" -Endpoint "/leads" -ExpectedStatus 200 -Description "List all leads"

# 2.4 Update Lead
$leadPhone2 = "0" + (Get-Random -Minimum 1 -Maximum 10) + (Get-Random -Minimum 10000000 -Maximum 99999999).ToString()
$updateLeadBody = @{
    firstName = "Updated Lead"
    lastName = "Test"
    fullName = "Updated Lead Test"
    email = "updated.lead.$global:testRunId@example.com"
    phone = $leadPhone2
    source = "referral"
    status = "CONTACTED"
    interestedVehicle = "Tesla Model Y"
} | ConvertTo-Json

Test-API -TestName "2.4 Update Lead" -Method "PUT" -Endpoint "/leads/$global:leadId" -Body $updateLeadBody -ExpectedStatus 200 -Description "Update lead info"

# 2.5 Update Lead Status
$statusBody = @{
    status = "QUALIFIED"
} | ConvertTo-Json

Test-API -TestName "2.5 Update Lead Status" -Method "PUT" -Endpoint "/leads/$global:leadId/status" -Body $statusBody -ExpectedStatus 200 -Description "Change lead status"

# 2.6 Convert Lead to Customer
Test-API -TestName "2.6 Convert Lead to Customer" -Method "POST" -Endpoint "/leads/$global:leadId/convert" -ExpectedStatus 200 -Description "Convert lead to customer"

# 2.7 Assign Lead to Staff
$assignBody = @{
    staffId = "123e4567-e89b-12d3-a456-426614174000"
} | ConvertTo-Json

Test-API -TestName "2.7 Assign Lead to Staff" -Method "PUT" -Endpoint "/leads/$global:leadId/assign" -Body $assignBody -ExpectedStatus 200 -Description "Assign lead to staff member"

# ========================================
# MODULE 3: TEST DRIVE MANAGEMENT
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "MODULE 3: TEST DRIVE MANAGEMENT" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 3.1 Create Test Drive
$testDriveBody = @{
    customerId = $global:customerId
    vehicleId = "123e4567-e89b-12d3-a456-426614174001"
    scheduledDate = "2024-02-01T10:00:00Z"
    status = "SCHEDULED"
    notes = "Test drive appointment"
} | ConvertTo-Json

$testDriveResult = Test-API -TestName "3.1 Create Test Drive" -Method "POST" -Endpoint "/test-drives" -Body $testDriveBody -ExpectedStatus 201 -Description "Schedule test drive"

if ($testDriveResult) {
    $testDriveData = $testDriveResult | ConvertFrom-Json
    $global:testDriveId = $testDriveData.id
    Write-Host "Created Test Drive ID: $global:testDriveId" -ForegroundColor Green
}

# 3.2 Get Test Drive by ID
Test-API -TestName "3.2 Get Test Drive by ID" -Method "GET" -Endpoint "/test-drives/$global:testDriveId" -ExpectedStatus 200 -Description "Get test drive details"

# 3.3 Get All Test Drives
Test-API -TestName "3.3 Get All Test Drives" -Method "GET" -Endpoint "/test-drives" -ExpectedStatus 200 -Description "List all test drives"

# 3.4 Update Test Drive
$updateTDBody = @{
    customerId = $global:customerId
    vehicleId = "123e4567-e89b-12d3-a456-426614174001"
    scheduledDate = "2024-02-02T14:00:00Z"
    status = "SCHEDULED"
    notes = "Rescheduled test drive"
} | ConvertTo-Json

Test-API -TestName "3.4 Update Test Drive" -Method "PUT" -Endpoint "/test-drives/$global:testDriveId" -Body $updateTDBody -ExpectedStatus 200 -Description "Update test drive info"

# 3.5 Update Test Drive Status
$tdStatusBody = @{
    status = "COMPLETED"
} | ConvertTo-Json

Test-API -TestName "3.5 Update Test Drive Status" -Method "PUT" -Endpoint "/test-drives/$global:testDriveId/status" -Body $tdStatusBody -ExpectedStatus 200 -Description "Change test drive status"

# 3.6 Add Test Drive Feedback
$tdFeedbackBody = @{
    rating = 5
    comments = "Excellent test drive experience"
} | ConvertTo-Json

Test-API -TestName "3.6 Add Test Drive Feedback" -Method "POST" -Endpoint "/test-drives/$global:testDriveId/feedback" -Body $tdFeedbackBody -ExpectedStatus 200 -Description "Add feedback to test drive"

# 3.7 Get Test Drive Calendar
Test-API -TestName "3.7 Get Test Drive Calendar" -Method "GET" -Endpoint "/test-drives/calendar?month=2&year=2024" -ExpectedStatus 200 -Description "Get test drive calendar"

# ========================================
# MODULE 4: FEEDBACK & COMPLAINTS
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "MODULE 4: FEEDBACK & COMPLAINTS" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 4.1 Submit Feedback
$feedbackBody = @{
    customerId = $global:customerId
    category = "service"
    rating = 5
    comments = "Excellent service"
} | ConvertTo-Json

$feedbackResult = Test-API -TestName "4.1 Submit Feedback" -Method "POST" -Endpoint "/feedbacks" -Body $feedbackBody -ExpectedStatus 201 -Description "Submit customer feedback"

if ($feedbackResult) {
    $feedbackData = $feedbackResult | ConvertFrom-Json
    $global:feedbackId = $feedbackData.id
    Write-Host "Created Feedback ID: $global:feedbackId" -ForegroundColor Green
}

# 4.2 Get All Feedbacks
Test-API -TestName "4.2 Get All Feedbacks" -Method "GET" -Endpoint "/feedbacks" -ExpectedStatus 200 -Description "List all feedbacks"

# 4.3 Get Feedback by ID
Test-API -TestName "4.3 Get Feedback by ID" -Method "GET" -Endpoint "/feedbacks/$global:feedbackId" -ExpectedStatus 200 -Description "Get feedback details"

# 4.4 Submit Complaint
$complaintBody = @{
    customerId = $global:customerId
    category = "service"
    severity = "medium"
    description = "Test complaint description"
    status = "OPEN"
} | ConvertTo-Json

$complaintResult = Test-API -TestName "4.4 Submit Complaint" -Method "POST" -Endpoint "/complaints" -Body $complaintBody -ExpectedStatus 201 -Description "Submit customer complaint"

if ($complaintResult) {
    $complaintData = $complaintResult | ConvertFrom-Json
    $global:complaintId = $complaintData.id
    Write-Host "Created Complaint ID: $global:complaintId" -ForegroundColor Green
}

# 4.5 Get All Complaints
Test-API -TestName "4.5 Get All Complaints" -Method "GET" -Endpoint "/complaints" -ExpectedStatus 200 -Description "List all complaints"

# 4.6 Get Complaint by ID
Test-API -TestName "4.6 Get Complaint by ID" -Method "GET" -Endpoint "/complaints/$global:complaintId" -ExpectedStatus 200 -Description "Get complaint details"

# 4.7 Resolve Complaint
$resolveBody = @{
    resolution = "Issue resolved successfully"
} | ConvertTo-Json

Test-API -TestName "4.7 Resolve Complaint" -Method "PUT" -Endpoint "/complaints/$global:complaintId/resolve" -Body $resolveBody -ExpectedStatus 200 -Description "Resolve complaint"

# ========================================
# MODULE 5: CUSTOMER SEGMENTATION
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "MODULE 5: CUSTOMER SEGMENTATION" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 5.1 Get Customer Segments
Test-API -TestName "5.1 Get Customer Segments" -Method "GET" -Endpoint "/customers/segments" -ExpectedStatus 200 -Description "Get customer segmentation data"

# 5.2 Get Customer Score
Test-API -TestName "5.2 Get Customer Score" -Method "GET" -Endpoint "/customers/$global:customerId/score" -ExpectedStatus 200 -Description "Get customer loyalty score"

# ========================================
# FINAL REPORT
# ========================================

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "FINAL TEST REPORT" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$totalTests = $global:passCount + $global:failCount + $global:skipCount
$passRate = if ($totalTests -gt 0) { [math]::Round(($global:passCount / $totalTests) * 100, 2) } else { 0 }

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $global:passCount" -ForegroundColor Green
Write-Host "Failed: $global:failCount" -ForegroundColor Red
Write-Host "Skipped: $global:skipCount" -ForegroundColor Yellow
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 50) { "Yellow" } else { "Red" })
Write-Host ""

if ($global:failCount -gt 0) {
    Write-Host "RECOMMENDATION: Fix backend code for failed test cases" -ForegroundColor Red
} else {
    Write-Host "SUCCESS: All tests passed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
