@echo off
title Spieleabend neu starten
net session >nul 2>&1
if errorlevel 1 (
  echo Hole Administratorrechte ...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-dienst.ps1" -Aktion neustart
echo.
pause
