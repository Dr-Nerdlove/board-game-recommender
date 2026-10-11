# Entwicklungsnotizen

Diese Datei richtet sich an Menschen oder Programme, die das Projekt später
weiterentwickeln. Sie erklärt, wie es aufgebaut ist und **warum** es so
aufgebaut ist — das Warum steht nirgends im Quelltext und geht sonst verloren.

## Der Kern: eine Datei

`index.html` ist die ganze Anwendung — Aufbau, Gestaltung und Logik in einer
Datei, rund 1300 Zeilen. Kein Baukasten, keine Abhängigkeiten, kein
Übersetzungsschritt. Datei öffnen genügt.

Das ist eine bewusste Entscheidung, keine Nachlässigkeit. Das Projekt soll auch
in fünf Jahren noch laufen und von jemandem weiterentwickelt werden können, der
keine Werkzeugkette einrichten will. Wer hier Module, Bündler oder ein
Oberflächen-Gerüst einführt, tauscht diese Eigenschaft gegen Bequemlichkeit ein.
Gut begründbar, aber eine echte Abwägung.

Im Skriptteil von unten nach oben: Daten (`MOODS`, `DEFAULT_GAMES`), Speicher,
Bewertung (`evaluate`), Ausgabe (`render*`), Formular, Ereignisbehandlung.

## Die drei Speicherwege

Die Sammlung kann an drei Orten liegen. Die Seite sucht sie in fester
Reihenfolge, der erste Treffer gewinnt:

1. **Eigener Server** — `connectServer()` fragt `api/sammlung` ab. Nur außerhalb
   des Claude-Viewers und nur über http(s), nicht bei `file://`.
2. **Claude-Konto** — `connectDb()` über die `db`-Fähigkeit des Artifacts.
3. **Browser** — `localStorage`, immer als Kopie mitgeschrieben, damit offline
   etwas da ist.

`persist()` schreibt in den jeweils aktiven Weg plus immer in den Browser.
Welcher Weg greift, steht für den Benutzer sichtbar über dem Formular.

**Wichtig beim Ändern:** Jedes neue Feld am Spiel muss an *vier* Stellen
mitgeführt werden, sonst geht es stillschweigend verloren:
`normalize()` (Einlesen und Begrenzen), `submitGame()` (beim Bearbeiten
übernehmen), die Export-Projektion in `renderCollection()` und — falls im
Formular pflegbar — `startEdit()` und `resetForm()`. Genau dieser Fehler ist
beim Feld `lastPlayed` einmal passiert.

## Wiederkehrende Entscheidungen

- **Nichts wird hart ausgeschlossen, was der Benutzer noch wollen könnte.**
  Frisch Gespieltes rutscht in der Rangfolge nach unten, verschwindet aber
  nicht: wer eine Revanche will, soll das Spiel finden.
- **Begründungen statt stillem Verschwinden.** Was durch einen Filter fällt,
  steht unten mit Grund („mit Erklärung ab 65 Min"). Das ist die Eigenschaft,
  die das Werkzeug benutzbar macht.
- **Keine Zeile, die auf jeder Karte steht.** Ein Hinweis, den alle teilen,
  sagt nichts. Deshalb erscheint „noch nie gespielt" erst, wenn es überhaupt
  eine Spielhistorie gibt, und die Begründungszeile bleibt ohne gesetzten
  Filter leer. Das war dreimal nötig — die Versuchung ist groß.
- **Erklärzeit kommt aus dem Anspruch**, nicht aus einer Pauschale: leicht +5,
  mittel +10, anspruchsvoll +20 Minuten.

## Der Server

`spieleabend-server.mjs`, eine Datei, nur Node-Bordmittel. Liefert die Seite
aus und verwahrt die Sammlung in `sammlung.json`.

- `GET`/`PUT` auf `api/sammlung`
- Geschrieben wird über eine Zwischendatei und `rename` — nie entsteht eine
  halb geschriebene Sammlung
- Vor jedem Überschreiben wandert der alte Stand nach `sicherungen/`, die
  letzten zehn bleiben. Inhaltsgleiche Speichervorgänge erzeugen keine Kopie
- Scheitert eine Sicherung, wird trotzdem gespeichert und nur protokolliert.
  **Das ist Absicht:** Datenverlust durch eine kaputte Sicherung wäre absurd
- `spieleabend.log` neben der Sammlung; gekürzt wird bei 200 KB **nach Bytes**,
  nicht nach Zeilen — eine einzelne Riesenzeile überlebt sonst jede Kürzung

## Windows-Dienst

`windows-dienst.ps1` mit vier Aktionen (`einrichten`, `status`, `neustart`,
`entfernen`), dazu je eine `.cmd` zum Doppelklicken, die sich
Administratorrechte holt. Angelegt wird eine geplante Aufgabe unter dem Konto
SYSTEM — dadurch läuft sie ohne Anmeldung und ohne Fenster.

Fallen, die dort schon zugeschlagen haben:

- **PowerShell unterscheidet bei Variablennamen keine Groß- und
  Kleinschreibung.** Eine lokale Variable `$aktion` kollidiert mit dem
  Parameter `$Aktion` und löst dessen Wertprüfung aus.
- **Alle Windows-Dateien sind reines ASCII.** Umlaute werden je nach Codepage
  zerschossen.
- **Nach dem Anhalten warten, bis der Port frei ist.** Sonst scheitert der neue
  Start an „Port belegt", der alte Prozess bedient weiter — und eine Prüfung
  „antwortet der Server?" meldet fälschlich Erfolg.

## Android-App

`.github/workflows/apk.yml` baut die APK auf GitHubs Maschinen, weil dort das
Android-SDK vorinstalliert ist. Capacitor verpackt `index.html` zu einer
App; das Ergebnis hängt dauerhaft an der Veröffentlichung `apk`.

Zu wissen: Capacitor liefert die Seite im App-Container unter `https://localhost`
aus. Dadurch ist `location.protocol` `https:`, und `connectServer()` versucht
einmal vergeblich `api/sammlung` — harmlos, fällt auf `localStorage` zurück.

## Veröffentlichte Claude-Fassung

Die Seite lief zusätzlich als Claude-Artifact. Dafür wird aus `index.html` ein
Fragment gebaut: alles von `<title>` bis vor `</body>`, abzüglich der Zeilen,
die dort ins Leere zeigen würden:

```
<link rel="preconnect" …>      <link rel="icon" …>
<link rel="apple-touch-icon" …> <link rel="manifest" …>
<meta name="apple-mobile-web-app-… …>  <img class="logo" …>
```

Danach `</head>\n<body>\n` entfernen. Die `theme-color` bleibt — die braucht
keine Datei.

## Was absichtlich fehlt

- **Keine automatischen Tests.** Geprüft wurde jeweils von Hand gegen den
  laufenden Server, mit einem Browser im Kopflos-Modus und einem eingebetteten
  Rahmen, der die Oberfläche bedient. Für eine Datei dieser Größe ist ein
  Testgerüst mehr Wartung als Nutzen — bei weiterem Wachstum kippt das.
- **Keine Übersetzung.** Alles ist deutsch, auch die Commits.
- **Kein Offline-Betrieb der Webfassung.** Dafür bräuchte es HTTPS, über eine
  Heimnetzadresse nicht zu haben. Die Android-App löst das anders.
- **Keine Anmeldung.** Server wie App sind für ein Heimnetz gedacht.
