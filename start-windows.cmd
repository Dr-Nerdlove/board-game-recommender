@echo off
rem Startet den Spieleabend-Server in diesem Ordner.
cd /d "%~dp0"
node spieleabend-server.mjs
if errorlevel 1 pause
