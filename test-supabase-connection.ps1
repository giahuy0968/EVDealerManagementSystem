# ========================================
# Test Supabase Database Connection
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUPABASE CONNECTION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$host = "aws-1-ap-southeast-1.pooler.supabase.com"
$port = 6543
$database = "postgres"
$username = "postgres.grgbbhzjlddgocgyhekd"
$password = "Abc@123456!"

Write-Host "Testing connection to Supabase..." -ForegroundColor Yellow
Write-Host "Host: $host" -ForegroundColor Gray
Write-Host "Port: $port" -ForegroundColor Gray
Write-Host "Database: $database" -ForegroundColor Gray
Write-Host "Username: $username" -ForegroundColor Gray
Write-Host ""

# Test 1: TCP connection
Write-Host "[1] Testing TCP connection..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($host, $port)
    if ($tcpClient.Connected) {
        Write-Host "  ✓ TCP connection successful" -ForegroundColor Green
        $tcpClient.Close()
    }
} catch {
    Write-Host "  ✗ TCP connection failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: PostgreSQL connection using psql (if available)
Write-Host "`n[2] Testing PostgreSQL connection..." -ForegroundColor Yellow

$env:PGPASSWORD = $password
$psqlCommand = "psql -h $host -p $port -U $username -d $database -c 'SELECT version();'"

try {
    $result = Invoke-Expression $psqlCommand 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ PostgreSQL connection successful" -ForegroundColor Green
        Write-Host "  Database version:" -ForegroundColor Gray
        Write-Host "  $result" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ PostgreSQL connection failed" -ForegroundColor Red
        Write-Host "  Error: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "  ⚠ psql not found, trying Java JDBC..." -ForegroundColor Yellow
    
    # Test 3: Using Java JDBC (if psql not available)
    Write-Host "`n[3] Testing with Java JDBC..." -ForegroundColor Yellow
    
    $jdbcUrl = "jdbc:postgresql://${host}:${port}/${database}?sslmode=require"
    
    # Create temp Java test file
    $javaCode = @"
import java.sql.*;
public class TestConnection {
    public static void main(String[] args) {
        String url = "$jdbcUrl";
        String user = "$username";
        String password = "$password";
        
        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✓ JDBC connection successful");
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT version()");
            if (rs.next()) {
                System.out.println("Database version: " + rs.getString(1));
            }
            
            rs.close();
            stmt.close();
            conn.close();
        } catch (Exception e) {
            System.err.println("✗ JDBC connection failed: " + e.getMessage());
            System.exit(1);
        }
    }
}
"@
    
    $javaCode | Out-File -FilePath "TestConnection.java" -Encoding UTF8
    
    try {
        javac TestConnection.java
        java -cp ".;$env:USERPROFILE\.m2\repository\org\postgresql\postgresql\42.7.4\postgresql-42.7.4.jar" TestConnection
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Java JDBC connection successful" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Java JDBC connection failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ⚠ Java test failed: $_" -ForegroundColor Yellow
    } finally {
        # Cleanup
        Remove-Item "TestConnection.java" -ErrorAction SilentlyContinue
        Remove-Item "TestConnection.class" -ErrorAction SilentlyContinue
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETED" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
