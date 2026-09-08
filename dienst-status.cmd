@echo off
title Spieleabend Status
net session >nul 2>&1
if errorlevel 1 (
  echo Hole Administratorrechte, um die Aufgabe sehen zu koennen ...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-dienst.ps1" -Aktion status
echo.
pause
