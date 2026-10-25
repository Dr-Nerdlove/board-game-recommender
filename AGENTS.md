# Hinweise für KI-Assistenten

Kurzorientierung für eine neue Sitzung an diesem Projekt — egal mit welchem
Werkzeug. Ausführlicher und mit Begründungen: `ENTWICKLUNG.md`. Für Benutzer:
`README.md` (englisch).

## Was das ist

Entscheidungshilfe für den Spieleabend: Welches Brettspiel aus der eigenen
Sammlung passt zur heutigen Runde (Spielerzahl, Stimmung, Anspruch, Zeit)?
Alles steckt in `index.html` — eine Datei, kein Baukasten, keine
Abhängigkeiten, kein Übersetzungsschritt. Das Regal beginnt **leer**; die neun
`BEISPIELSPIELE` kommen nur auf Knopfdruck hinein.

**Zwei Wege zum Benutzer, dieselbe Datei:**

- **Android-App** (Capacitor): `apk.yml` baut sie, nur auf Abruf.
- **Web-Version auf GitHub Pages**, vor allem fürs iPhone: `pages.yml`
  veröffentlicht bei **jedem Push auf `main`**, der die Webdateien berührt.
  Das Repo ist deshalb öffentlich — es gehört nichts hinein, was geheim bleiben
  muss (Schlüssel und Passwort liegen als GitHub-Secrets).

Es gibt weder Heimserver noch Windows-Skripte noch eine Claude-Artifact-Fassung
mehr; die Geschichte steht in `ENTWICKLUNG.md`. Alles speichert auf dem Gerät,
ein Konto gibt es nicht.

## Sprache

**Die Entwicklung läuft auf Deutsch**: Kommentare, Variablennamen in neuerem
Code und Commit-Meldungen. Bitte beibehalten.

**Die Oberfläche ist zweisprachig** und folgt der Systemsprache — ohne
Einstellung im Programm; auf Android 13 aufwärts lässt sie sich über die
Systemeinstellungen der App festlegen. Wer Text ändert, ändert ihn in *beiden*
Sprachen (`MARKUP_EN` für feste Beschriftungen, `TEXTE` für alles, was das
Skript baut); Näheres in `ENTWICKLUNG.md` unter „Zwei Sprachen".

**Die Schlüssel der gespeicherten Daten werden nie übersetzt** (`party`,
`gruebeln`, `leicht` …). Sie stecken in jeder Sicherung; wer sie ändert, macht
vorhandene Sicherungen unlesbar.

**Das README ist englisch**, es ist die Außenseite des Projekts.

Ausnahme: **Bauplan und Commit-Meldungen** sind reines ASCII, Umlaute
umschrieben („moeglicherweise").

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | die ganze Anwendung |
| `.github/workflows/apk.yml` | baut die Android-App auf GitHubs Maschinen; schreibt dabei auch die nativen Bausteine (Java) und die Android-Sprachlisten |
| `sw.js` | Service Worker der Web-Version (nicht in der App) |
| `.github/workflows/pages.yml` | veröffentlicht die Web-Version auf GitHub Pages |
| `icon-*.png`, `app-icon-*.png`, `manifest.webmanifest` | Symbole |
| `logo.png`, `screenshots/` | Bilder für das README |
| `CHANGELOG.md` | Änderungshistorie, gepflegt bei jeder Fassung |
| `README.md` | Anleitung für Benutzer, auf Englisch |
| `ENTWICKLUNG.md` | Begründungen und Geschichte der Entscheidungen |
| `SCHRIFTEN.md` | Lizenznachweis der eingebetteten Schriften |
| `LICENSE` | GPL-3.0-oder-später (die Schriften behalten die OFL 1.1) |

## Vor dem Ändern von `index.html` lesen

Ein neues Feld am Spiel muss an **vier** Stellen mitgeführt werden, sonst geht
es beim Bearbeiten still verloren: `normalize()`, `submitGame()`, die
Export-Projektion in `renderCollection()` und gegebenenfalls `startEdit()` /
`resetForm()`. Dieser Fehler ist schon einmal passiert.

Die Datei ist rund 250 KB groß, weil zwei Schriften als Daten darin stecken. Nicht
erschrecken und nicht „aufräumen": Sie sind der Grund, warum die App ohne Netz
aussieht wie mit. Lizenznachweis in `SCHRIFTEN.md`, Begründung in
`ENTWICKLUNG.md`.

Die Fassungsnummer steht im Fuß als `data-fassung="1.2.3"` am Element, nicht
als Text; das Skript setzt daraus „Fassung" bzw. „Version". Der Bauplan sucht
genau diese Schreibweise.

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
Bau ab: `package.json`, `data-fassung="1.2.3"` in `index.html` und ein
Abschnitt `## [1.2.3]` in `CHANGELOG.md`.

Ein Push auf `main` aktualisiert die **Web-Version** von selbst. Die **APK**
entsteht nur auf Abruf, und zwar entweder `git tag v1.2.3 && git push origin v1.2.3` — oder, **aus einer
Sitzung heraus notwendig**, im Reiter „Actions" den Bauplan mit dem Haken
`veroeffentlichen` (über die GitHub-Werkzeuge: `run_workflow` mit der Eingabe
`veroeffentlichen`). Marken lassen sich von hier aus nicht schieben,
der Server antwortet mit HTTP 403; Branch-Pushes gehen. Näheres in
`ENTWICKLUNG.md`.

**Nach einer Änderung an den nativen Bausteinen** (Java in `apk.yml`,
Manifest, Sprachlisten) erst einen **Probelauf ohne Haken** machen: Java lässt
sich hier nicht übersetzen, erst der Bau zeigt, ob es trägt. Ein Fehler dort
kostet sonst eine verbrannte Fassungsnummer.

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
# Syntax der Seite (und des Service Workers)
sed -n '/^<script>/,/^<\/script>/p' index.html | sed '1d;$d' > /tmp/app.js
node --check /tmp/app.js && node --check sw.js

# Ausliefern, um sie im Browser zu pruefen (localhost darf den Service Worker)
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

**Das Regal ist beim Start leer.** Ein Test, der Spiele braucht, klickt zuerst
`[data-leer="beispiele"]` (oder schreibt `spieleabend.sammlung` in den Speicher).

**Die Capacitor-Brücke nachbauen**, wenn ein Test „in der App" laufen soll: als
fertige Objekte unter `window.Capacitor.Plugins` (`isNativePlatform`,
`Sprache.lesen`, …). Ein `registerPlugin` gibt es dort nicht — das hat schon
einmal einen Fehler verdeckt, weil der Test es still mitlieferte.

**Wikidata drosselt Cloud-Maschinen** mit HTTP 429 (ohne CORS-Kopf, der Browser
meldet nur einen Netzfehler). Die Auswertung darum mit Antworten im
Wikidata-Format testen (`page.setRequestInterception`), nur einzelne Fälle live.

## Haltung, die sich bewährt hat

- Erst nachsehen, dann behaupten. Mehrere Fehler in diesem Projekt entstanden
  aus geratenen Adressen und Annahmen über Dateien.
- Keine Zeile einbauen, die auf jeder Karte steht — was alle teilen, sagt
  nichts.
- Nichts hart ausschließen, was der Benutzer noch wollen könnte: lieber in der
  Rangfolge senken und den Grund nennen.
