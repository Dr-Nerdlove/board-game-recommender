@echo off
title Spieleabend Status
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-dienst.ps1" -Aktion status
echo.
pause
