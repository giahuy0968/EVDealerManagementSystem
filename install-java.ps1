# Script tự động tải và cài Java 21 cho Windows
Write-Host "Downloading Java 21 for Windows..." -ForegroundColor Green

$downloadUrl = "https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.zip"
$outputPath = "D:\jdk-21-windows.zip"
$extractPath = "D:\jdk-21-windows"

# Download Java 21
Write-Host "Downloading from: $downloadUrl"
Invoke-WebRequest -Uri $downloadUrl -OutFile $outputPath -UseBasicParsing

# Extract
Write-Host "Extracting to: $extractPath"
Expand-Archive -Path $outputPath -DestinationPath $extractPath -Force

# Find the actual JDK folder (it might be nested)
$jdkFolder = Get-ChildItem -Path $extractPath -Directory | Select-Object -First 1

Write-Host "`n==================================" -ForegroundColor Green
Write-Host "Java 21 installed successfully!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "`nJDK Location: $($jdkFolder.FullName)" -ForegroundColor Yellow
Write-Host "`nTo use this Java, run:" -ForegroundColor Cyan
Write-Host "`$env:JAVA_HOME = '$($jdkFolder.FullName)'" -ForegroundColor White
Write-Host "`$env:PATH = '$($jdkFolder.FullName)\bin;' + `$env:PATH" -ForegroundColor White
Write-Host "java -version`n" -ForegroundColor White
