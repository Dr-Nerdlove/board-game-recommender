<#
  Richtet den Spieleabend-Server als Windows-Dienst ein: im Hintergrund,
  ohne Fenster, ab dem Einschalten des Rechners.

  Aufruf normalerweise ueber dienst-einrichten.cmd / dienst-entfernen.cmd.
  Direkt geht auch:
     powershell -ExecutionPolicy Bypass -File windows-dienst.ps1 -Aktion status
#>
param(
  [ValidateSet("einrichten","entfernen","status")] [string] $Aktion = "einrichten",
  [int] $Port = 8099
)

$ErrorActionPreference = "Stop"
$Name   = "Spieleabend"
$Skript = Join-Path $PSScriptRoot "spieleabend-server.mjs"

function Schreib($text, $farbe = "Gray"){ Write-Host $text -ForegroundColor $farbe }

function Finde-Node {
  $c = Get-Command node.exe -ErrorAction SilentlyContinue
  if($c){ return $c.Source }
  foreach($p in @("$env:ProgramFiles\nodejs\node.exe", "${env:ProgramFiles(x86)}\nodejs\node.exe")){
    if(Test-Path $p){ return $p }
  }
  return $null
}

function Adressen($port){
  $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
         Where-Object { $_.IPAddress -ne "127.0.0.1" -and $_.InterfaceAlias -notmatch "Loopback" }
  Schreib ""
  Schreib "  Auf diesem PC:  http://localhost:$port" "White"
  foreach($ip in $ips){ Schreib "  Im Heimnetz:    http://$($ip.IPAddress):$port" "White" }
}

function Laeuft-Server($port){
  try{
    $null = Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri "http://localhost:$port/api/sammlung"
    return $true
  }catch{ return $false }
}

# ---------------------------------------------------------------- Status
if($Aktion -eq "status"){
  $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
  if(-not $task){ Schreib "Der Dienst ist nicht eingerichtet." "Yellow"; exit 0 }
  $info = Get-ScheduledTaskInfo -TaskName $Name
  Schreib "Aufgabe:      $($task.State)"
  Schreib "Zuletzt:      $($info.LastRunTime)  (Ergebnis $($info.LastTaskResult))"
  if(Laeuft-Server $Port){ Schreib "Server:       antwortet" "Green"; Adressen $Port }
  else { Schreib "Server:       antwortet auf Port $Port nicht" "Yellow" }
  exit 0
}

# ------------------------------------------------------------- Entfernen
if($Aktion -eq "entfernen"){
  if(Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue){
    try{ Stop-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue }catch{}
    Unregister-ScheduledTask -TaskName $Name -Confirm:$false
    Schreib "Aufgabe entfernt." "Green"
  }else{
    Schreib "Es war keine Aufgabe eingerichtet." "Yellow"
  }
  Get-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue | Remove-NetFirewallRule
  Schreib "Firewall-Regel entfernt." "Green"
  Schreib ""
  Schreib "Die Sammlung bleibt erhalten: sammlung.json im Programmordner." "Gray"
  exit 0
}

# ------------------------------------------------------------ Einrichten
if(-not (Test-Path $Skript)){
  Schreib "spieleabend-server.mjs fehlt neben dieser Datei." "Red"
  Schreib "Beide Dateien gehoeren in denselben Ordner." "Red"
  exit 1
}

$node = Finde-Node
if(-not $node){
  Schreib "Node wurde nicht gefunden." "Red"
  Schreib ""
  Schreib "Bitte zuerst installieren, dann diese Datei erneut starten:" "White"
  Schreib "   winget install OpenJS.NodeJS.LTS" "White"
  exit 1
}
Schreib "Node gefunden: $node"

if($node -like "*\Users\*"){
  Schreib ""
  Schreib "Achtung: Node liegt im Benutzerprofil. Der Dienst laeuft unter dem" "Yellow"
  Schreib "Systemkonto und findet es dort moeglicherweise nicht. Falls der Test" "Yellow"
  Schreib "unten fehlschlaegt, Node fuer alle Benutzer neu installieren." "Yellow"
}

# Aufgabe: beim Hochfahren, Systemkonto, ohne Fenster, mit Neustart nach Absturz
$aktion    = New-ScheduledTaskAction -Execute $node -Argument "`"$Skript`" --port $Port" -WorkingDirectory $PSScriptRoot
$ausloeser = New-ScheduledTaskTrigger -AtStartup
$konto     = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$optionen  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
                                          -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) `
                                          -ExecutionTimeLimit ([TimeSpan]::Zero)
Register-ScheduledTask -TaskName $Name -Action $aktion -Trigger $ausloeser `
                       -Principal $konto -Settings $optionen -Force `
                       -Description "Spieleabend-Server: liefert die Seite aus und verwahrt die Sammlung." | Out-Null
Schreib "Aufgabe eingerichtet (startet beim Hochfahren, ohne Fenster)." "Green"

Get-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue | Remove-NetFirewallRule
New-NetFirewallRule -DisplayName $Name -Direction Inbound -Action Allow `
                    -Protocol TCP -LocalPort $Port -Profile Private | Out-Null
Schreib "Firewall: Port $Port im privaten Netz freigegeben." "Green"

Start-ScheduledTask -TaskName $Name
Schreib "Gestartet, warte auf Antwort ..."
$ok = $false
foreach($i in 1..10){ Start-Sleep -Seconds 1; if(Laeuft-Server $Port){ $ok = $true; break } }

Schreib ""
if($ok){
  Schreib "Fertig. Der Server laeuft im Hintergrund und startet ab jetzt von selbst." "Green"
  Adressen $Port
}else{
  Schreib "Der Server antwortet auf Port $Port noch nicht." "Yellow"
  Schreib "Haeufige Ursachen:" "White"
  Schreib "  - Port schon belegt: mit anderem Port einrichten, z. B." "White"
  Schreib "      powershell -ExecutionPolicy Bypass -File windows-dienst.ps1 -Port 8100" "White"
  Schreib "  - Node nur fuer den eigenen Benutzer installiert (siehe Hinweis oben)" "White"
  Schreib "Nachsehen mit: -Aktion status" "White"
}
