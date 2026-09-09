<#
  Richtet den Spieleabend-Server als Windows-Dienst ein: im Hintergrund,
  ohne Fenster, ab dem Einschalten des Rechners.

  Aufruf normalerweise ueber dienst-einrichten.cmd / dienst-entfernen.cmd.
  Direkt geht auch:
     powershell -ExecutionPolicy Bypass -File windows-dienst.ps1 -Aktion status
#>
param(
  [ValidateSet("einrichten","entfernen","status","neustart")] [string] $Aktion = "einrichten",
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
  Schreib ""
  Schreib "  Auf diesem PC:   http://localhost:$port" "White"
  Schreib "  Ueber den Namen: http://$($env:COMPUTERNAME):$port" "White"

  # Karte, ueber die der Rechner ins Netz geht - deren Adresse ist meist die richtige
  $hauptIndex = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue |
                 Sort-Object RouteMetric | Select-Object -First 1).InterfaceIndex

  # 169.254.* sind Karten ohne Verbindung und nuetzen niemandem
  $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
         Where-Object { $_.IPAddress -ne "127.0.0.1" -and
                        -not $_.IPAddress.StartsWith("169.254.") -and
                        $_.InterfaceAlias -notmatch "Loopback" }

  if($ips){
    Schreib ""
    Schreib "  Im Netzwerk erreichbar unter:" "White"
    foreach($ip in ($ips | Sort-Object { $_.InterfaceIndex -ne $hauptIndex })){
      $marke = ""
      if($ip.InterfaceIndex -eq $hauptIndex){ $marke = "   <-- vermutlich diese" }
      Schreib "    http://$($ip.IPAddress):$port   [$($ip.InterfaceAlias)]$marke" "White"
    }
    Schreib ""
    Schreib "  Mehrere Adressen sind normal: der Server lauscht auf allen Netzwerkkarten." "Gray"
    Schreib "  Adressen aus VPN-, WSL- oder Hyper-V-Karten gehoeren nicht ins Heimnetz." "Gray"
  }
}

function Laeuft-Server($port){
  try{
    $null = Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri "http://localhost:$port/api/sammlung"
    return $true
  }catch{ return $false }
}

# ---------------------------------------------------------------- Status
if($Aktion -eq "status"){
  Schreib "Spieleabend-Status"
  Schreib ""

  # Das Wichtigste zuerst, und ohne Sonderrechte pruefbar: antwortet der Server?
  $laeuft = Laeuft-Server $Port
  if($laeuft){ Schreib "  Server:   antwortet auf Port $Port" "Green" }
  else       { Schreib "  Server:   antwortet auf Port $Port nicht" "Yellow" }

  $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
  if($task){
    $info = Get-ScheduledTaskInfo -TaskName $Name -ErrorAction SilentlyContinue
    Schreib "  Aufgabe:  $($task.State)"
    if($info){ Schreib "  Zuletzt:  $($info.LastRunTime)  (Ergebnis $($info.LastTaskResult))" }
  }elseif($laeuft){
    Schreib "  Aufgabe:  nicht lesbar - dafuer fehlen Administratorrechte." "Gray"
    Schreib "            Der Server laeuft, das ist die Hauptsache." "Gray"
  }else{
    Schreib "  Aufgabe:  nicht gefunden." "Yellow"
    Schreib "            Entweder ist sie nicht eingerichtet, oder es fehlen" "Gray"
    Schreib "            Administratorrechte, um sie zu sehen." "Gray"
  }

  if($laeuft){ Adressen $Port }
  exit 0
}

# -------------------------------------------------------------- Neustart
if($Aktion -eq "neustart"){
  $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
  if(-not $task){
    Schreib "Der Dienst ist nicht eingerichtet." "Yellow"
    Schreib "Mit dienst-einrichten.cmd anlegen. Laeuft der Server im Vordergrund" "Gray"
    Schreib "(start-windows.cmd), reicht dort Strg+C und ein neuer Start." "Gray"
    exit 1
  }

  Schreib "Beende den Dienst ..."
  try{ Stop-ScheduledTask -TaskName $Name -ErrorAction Stop }
  catch{ Schreib "Beenden meldete: $($_.Exception.Message)" "Yellow" }

  # Warten, bis der Port wirklich frei ist - sonst scheitert der neue Start
  # mit "Port schon belegt", weil der alte Prozess noch haengt.
  $frei = $false
  foreach($i in 1..15){
    Start-Sleep -Milliseconds 400
    if(-not (Laeuft-Server $Port)){ $frei = $true; break }
  }
  if(-not $frei){
    Schreib "Der alte Server antwortet immer noch auf Port $Port." "Yellow"
    Schreib "Laeuft dort vielleicht ein zweiter, von Hand gestarteter Server?" "Yellow"
    Schreib "Nachsehen im Task-Manager unter Details bei node.exe." "Gray"
    exit 1
  }

  Schreib "Starte neu ..."
  try{ Start-ScheduledTask -TaskName $Name -ErrorAction Stop }
  catch{
    Schreib "Start fehlgeschlagen: $($_.Exception.Message)" "Red"
    exit 1
  }

  $ok = $false
  foreach($i in 1..10){ Start-Sleep -Seconds 1; if(Laeuft-Server $Port){ $ok = $true; break } }
  Schreib ""
  if($ok){
    Schreib "Neu gestartet, der Server antwortet wieder." "Green"
    Adressen $Port
  }else{
    Schreib "Der Server antwortet nach dem Neustart nicht." "Yellow"
    Schreib "Was schiefging, steht im Protokoll neben der Sammlung:" "White"
    Schreib "   $(Join-Path $PSScriptRoot 'spieleabend.log')" "White"
  }
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
try{
  $dienstAktion    = New-ScheduledTaskAction -Execute $node -Argument "`"$Skript`" --port $Port" -WorkingDirectory $PSScriptRoot
  $dienstAusloeser = New-ScheduledTaskTrigger -AtStartup
  $dienstKonto     = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
  $dienstOptionen  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
                                                  -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) `
                                                  -ExecutionTimeLimit ([TimeSpan]::Zero)
  Register-ScheduledTask -TaskName $Name -Action $dienstAktion -Trigger $dienstAusloeser `
                         -Principal $dienstKonto -Settings $dienstOptionen -Force `
                         -Description "Spieleabend-Server: liefert die Seite aus und verwahrt die Sammlung." | Out-Null
}catch{
  Schreib "Die Aufgabe konnte nicht angelegt werden:" "Red"
  Schreib "  $($_.Exception.Message)" "Red"
  exit 1
}
Schreib "Aufgabe eingerichtet (startet beim Hochfahren, ohne Fenster)." "Green"

try{
  Get-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue | Remove-NetFirewallRule
  New-NetFirewallRule -DisplayName $Name -Direction Inbound -Action Allow `
                      -Protocol TCP -LocalPort $Port -Profile Private | Out-Null
  Schreib "Firewall: Port $Port im privaten Netz freigegeben." "Green"
}catch{
  Schreib "Firewall-Regel fehlgeschlagen: $($_.Exception.Message)" "Yellow"
  Schreib "Der Server laeuft trotzdem, ist aber eventuell nur auf diesem PC erreichbar." "Yellow"
}

try{
  Start-ScheduledTask -TaskName $Name
}catch{
  Schreib "Die Aufgabe liess sich nicht starten: $($_.Exception.Message)" "Yellow"
}
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
