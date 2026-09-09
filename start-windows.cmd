@echo off
rem Startet den Spieleabend-Server im Vordergrund, mit sichtbaren Meldungen.
rem Fuer den Dauerbetrieb ist dienst-einrichten.cmd gedacht.
title Spieleabend (Vordergrund)
cd /d "%~dp0"
node spieleabend-server.mjs
if errorlevel 1 (
  echo.
  echo Laeuft der Server vielleicht schon als Dienst? Dann ist der Port belegt.
  echo Nachsehen mit dienst-status.cmd, beenden mit dienst-entfernen.cmd.
  echo.
  pause
)
