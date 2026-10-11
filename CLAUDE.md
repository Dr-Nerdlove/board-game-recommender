# Hinweise für Claude

Kurzorientierung für eine neue Sitzung an diesem Projekt. Ausführlicher und
mit Begründungen: `ENTWICKLUNG.md`. Für Benutzer: `README.md`.

## Was das ist

Entscheidungshilfe für den Spieleabend: Welches Brettspiel aus der eigenen
Sammlung passt zur heutigen Runde (Spielerzahl, Stimmung, Anspruch, Zeit)?
Alles steckt in `index.html` — eine Datei, kein Baukasten, keine
Abhängigkeiten, kein Übersetzungsschritt.

## Sprache

**Alles auf Deutsch**: Oberfläche, Kommentare, Variablennamen in neuerem Code,
Dokumentation und Commit-Meldungen. Bitte beibehalten.

Ausnahme: **Windows-Dateien** (`*.cmd`, `*.ps1`) sind reines ASCII, Umlaute
umschrieben („moeglicherweise"). Je nach Codepage werden sie sonst
unleserlich.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | die ganze Anwendung |
| `spieleabend-server.mjs` | optionaler Heimserver, verwahrt die Sammlung |
| `windows-dienst.ps1` + `dienst-*.cmd` | Dienst einrichten, Status, Neustart, entfernen |
| `.github/workflows/apk.yml` | baut die Android-App auf GitHubs Maschinen |
| `icon-*.png`, `manifest.webmanifest` | Symbole fürs Handy |

## Vor dem Ändern von `index.html` lesen

Ein neues Feld am Spiel muss an **vier** Stellen mitgeführt werden, sonst geht
es beim Bearbeiten still verloren: `normalize()`, `submitGame()`, die
Export-Projektion in `renderCollection()` und gegebenenfalls `startEdit()` /
`resetForm()`. Dieser Fehler ist schon einmal passiert.

## Prüfen statt hoffen

Es gibt keine automatischen Tests. Bewährt hat sich:

```bash
# Syntax der Seite
python3 -c "s=open('index.html').read(); open('/tmp/app.js','w').write(s[s.index('<script>')+8:s.index('</script>')])"
node --check /tmp/app.js

# Server starten und gegen ihn prüfen (Chromium ist vorhanden)
node spieleabend-server.mjs --port 8099
```

Für Oberflächenprüfungen eine Hilfsseite neben die Anwendung legen, die
`index.html` in einem `<iframe>` lädt, dort Knöpfe anklickt und das Ergebnis
in ein `<pre>` schreibt; dann mit
`chromium --headless --dump-dom http://localhost:8099/pruefung.html` auslesen.
So wurden alle bisherigen Funktionen abgenommen.

**Vorsicht bei `pkill -f`**: Das Muster trifft auch die eigene
Kommandozeile und beendet die laufende Shell. `pkill -x node` benutzen oder
die Prozessnummer merken.

Windows-Skripte lassen sich hier **nicht** ausführen. Sie wurden statisch
geprüft: reines ASCII, ausgeglichene Klammern, keine Variable mit
Parameternamen, Funktionen vor ihrer Nutzung definiert.

## Haltung, die sich bewährt hat

- Erst nachsehen, dann behaupten. Mehrere Fehler in diesem Projekt entstanden
  aus geratenen Adressen und Annahmen über Dateien.
- Keine Zeile einbauen, die auf jeder Karte steht — was alle teilen, sagt
  nichts.
- Nichts hart ausschließen, was der Benutzer noch wollen könnte: lieber in der
  Rangfolge senken und den Grund nennen.
