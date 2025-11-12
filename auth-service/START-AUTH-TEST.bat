@echo off
REM Wrapper to run PowerShell without profile (avoids Pester conflicts)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-auth-api-validation.ps1"
pause
