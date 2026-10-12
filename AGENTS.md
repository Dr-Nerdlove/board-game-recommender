# Hinweise für KI-Assistenten

Kurzorientierung für eine neue Sitzung an diesem Projekt — egal mit welchem
Werkzeug. Ausführlicher und mit Begründungen: `ENTWICKLUNG.md`. Für Benutzer:
`README.md`.

## Was das ist

Entscheidungshilfe für den Spieleabend: Welches Brettspiel aus der eigenen
Sammlung passt zur heutigen Runde (Spielerzahl, Stimmung, Anspruch, Zeit)?
Alles steckt in `index.html` — eine Datei, kein Baukasten, keine
Abhängigkeiten, kein Übersetzungsschritt.

**Das Ziel ist die Android-App.** Seit 2.0.0 gibt es keinen Heimserver und
keine Windows-Skripte mehr; was hier liegt, dient dem APK-Bau. Die Seite lässt
sich weiterhin einfach im Browser öffnen.

## Sprache

**Alles auf Deutsch**: Oberfläche, Kommentare, Variablennamen in neuerem Code,
Dokumentation und Commit-Meldungen. Bitte beibehalten.

Ausnahme: **Bauplan und Commit-Meldungen** sind reines ASCII, Umlaute
umschrieben („moeglicherweise").

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | die ganze Anwendung |
| `.github/workflows/apk.yml` | baut die Android-App auf GitHubs Maschinen |
| `icon-*.png`, `manifest.webmanifest` | Symbole fürs Handy |
| `CHANGELOG.md` | Änderungshistorie, gepflegt bei jeder Fassung |
| `SCHRIFTEN.md` | Lizenznachweis der eingebetteten Schriften |

## Vor dem Ändern von `index.html` lesen

Ein neues Feld am Spiel muss an **vier** Stellen mitgeführt werden, sonst geht
es beim Bearbeiten still verloren: `normalize()`, `submitGame()`, die
Export-Projektion in `renderCollection()` und gegebenenfalls `startEdit()` /
`resetForm()`. Dieser Fehler ist schon einmal passiert.

Die Datei ist 185 KB groß, weil zwei Schriften als Daten darin stecken. Nicht
erschrecken und nicht „aufräumen": Sie sind der Grund, warum die App ohne Netz
aussieht wie mit. Lizenznachweis in `SCHRIFTEN.md`, Begründung in
`ENTWICKLUNG.md`.

Der Innenabstand von `.wrap` steht an **zwei** Stellen (normale Regel und
`@media (max-width:520px)`) und enthält in beiden die Variablen `--sicher-*`.
Die halten in der Android-App die Statusleiste von der Überschrift fern;
Näheres in `ENTWICKLUNG.md` unter „Systemleisten".

## Signatur: nicht anfassen

Die APK wird mit einem festen Schlüssel aus den Geheimnissen
`SIGNIER_SCHLUESSEL` und `SIGNIER_PASSWORT` signiert. Ändert sich der Schlüssel,
lässt sich die App nicht mehr über die vorige Fassung aktualisieren, und jeder
Benutzer verliert beim nötigen Deinstallieren seine Sammlung. Jeder Bau schreibt
den Fingerabdruck ins Protokoll — er muss gleich bleiben. Hintergrund in
`ENTWICKLUNG.md`.

## Eine neue Fassung herausgeben

Die Nummer steht an drei Stellen und muss überall gleich sein, sonst bricht der
Bau ab: `package.json`, der Fuß in `index.html` (`Fassung 1.2.3`) und ein
Abschnitt `## [1.2.3]` in `CHANGELOG.md`.

Dann entweder `git tag v1.2.3 && git push origin v1.2.3` — oder, **aus einer
Sitzung heraus notwendig**, im Reiter „Actions" den Bauplan mit dem Haken
`veroeffentlichen` starten. Marken lassen sich von hier aus nicht schieben,
der Server antwortet mit HTTP 403; Branch-Pushes gehen. Näheres in
`ENTWICKLUNG.md`.

## Zwei Regeln für die Oberfläche

- **Nichts Antippbares unter 44 Pixel.** Chips, Textknöpfe, Aufklappzeilen,
  Kontrollkästchen samt Beschriftung. Das war schon einmal verletzt — 72 von
  112 Elementen.
- **„Heute gespielt" sortiert die Liste nicht neu** (`frischeKarte()` statt
  `render()`), sonst verschwindet die bestätigte Karte unter dem Finger.
  Begründung in `ENTWICKLUNG.md`.

## Prüfen statt hoffen

Es gibt keine automatischen Tests. Bewährt hat sich:

```bash
# Syntax der Seite
python3 -c "s=open('index.html').read(); open('/tmp/app.js','w').write(s[s.index('<script>')+8:s.index('</script>')])"
node --check /tmp/app.js

# Ausliefern, um sie im Browser zu pruefen
python3 -m http.server 8111
```

Für Oberflächenprüfungen hat sich **puppeteer-core** gegen das vorhandene
Chromium (`/opt/pw-browsers/...`) bewährt: echte Geräteemulation (412×915,
Pixeldichte 2), `emulateMediaFeatures` für hell/dunkel, Klicks auf die
Oberfläche, und am Ende messen statt schauen — Trefferflächen, Abstände,
Kontraste. Auf Konsolenfehler horchen (`pageerror`), sonst entgehen einem
stille Ausfälle.

**Achtung bei `getComputedStyle` nach einem Klick:** `render()` baut die Chips
neu auf, das alte Element ist dann abgehängt und liefert leere Werte. Nach dem
Klick neu suchen.

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
