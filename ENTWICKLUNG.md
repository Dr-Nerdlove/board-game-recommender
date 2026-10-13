# Entwicklungsnotizen

Diese Datei richtet sich an Menschen oder Programme, die das Projekt später
weiterentwickeln. Sie erklärt, wie es aufgebaut ist und **warum** es so
aufgebaut ist — das Warum steht nirgends im Quelltext und geht sonst verloren.

## Der Kern: eine Datei

`index.html` ist die ganze Anwendung — Aufbau, Gestaltung und Logik in einer
Datei, rund 1400 Zeilen. Kein Baukasten, keine Abhängigkeiten, kein
Übersetzungsschritt. Datei öffnen genügt.

Darin stecken auch die beiden Schriften als Daten (rund 120 KB, Nachweis in
`SCHRIFTEN.md`). Das ist der Grund, warum die Datei 185 KB groß ist statt 65.
Der Gegenwert: Es gibt **keine einzige Anfrage ans Netz** mehr, und die Seite
sieht offline aus wie online. Vorher kamen die Schriften von Google — die App
versprach „kein Netz nötig" und hielt es beim Aussehen nicht.

Das ist eine bewusste Entscheidung, keine Nachlässigkeit. Das Projekt soll auch
in fünf Jahren noch laufen und von jemandem weiterentwickelt werden können, der
keine Werkzeugkette einrichten will. Wer hier Module, Bündler oder ein
Oberflächen-Gerüst einführt, tauscht diese Eigenschaft gegen Bequemlichkeit ein.
Gut begründbar, aber eine echte Abwägung.

Im Skriptteil von unten nach oben: Daten (`MOODS`, `DEFAULT_GAMES`), Speicher,
Bewertung (`evaluate`), Ausgabe (`render*`), Formular, Ereignisbehandlung.

## Die zwei Speicherwege

1. **Gerät** — `localStorage`, immer geschrieben. In der Android-App ist das der
   einzige Weg und der Normalfall.
2. **Claude-Konto** — `connectDb()` über die `db`-Fähigkeit des Artifacts, nur
   in der veröffentlichten Claude-Fassung.

`persist()` schreibt immer auf das Gerät und zusätzlich ins Konto, falls es
verbunden ist. Welcher Weg greift, steht für den Benutzer sichtbar über dem
Formular.

Bis 1.4.1 gab es einen dritten Weg: einen mitgelieferten Node-Server fürs
Heimnetz, samt Windows-Dienst. Der ist mit 2.0.0 entfallen — das Projekt ist
eine Android-App. Wer ihn sucht: `git log -- spieleabend-server.mjs`.

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
- **Nichts zweimal sagen.** Die Begründungszeile nennt die Stimmungen, die
  gepasst haben; die Etikettenzeile darunter lässt sie deshalb weg
  (`uebrigeTags()`) und entfällt ganz, wenn nichts übrig bleibt.
- **Keine Zeile, die auf jeder Karte steht.** Ein Hinweis, den alle teilen,
  sagt nichts. Deshalb erscheint „noch nie gespielt" erst, wenn es überhaupt
  eine Spielhistorie gibt, und die Begründungszeile bleibt ohne gesetzten
  Filter leer. Das war dreimal nötig — die Versuchung ist groß.
- **Erklärzeit kommt aus dem Anspruch**, nicht aus einer Pauschale: leicht +5,
  mittel +10, anspruchsvoll +20 Minuten.

## Android-App

`.github/workflows/apk.yml` baut die APK auf GitHubs Maschinen, weil dort das
Android-SDK vorinstalliert ist. Capacitor verpackt `index.html` zu einer
App; das Ergebnis hängt dauerhaft an der Veröffentlichung `apk`.

Der Bauplan springt **nur auf Versionsmarken** an (`v*`) und legt dafür je eine
eigene Veröffentlichung an, die danach unverändert bleibt. „Run workflow" baut
zum Ausprobieren, ohne zu veröffentlichen.

### Das Symbol

Quelle ist **`Board-Game-Recommender_Logo.png`**; alle `icon-*.png` und die
beiden `app-icon-*.png` sind daraus gerechnet. Wer eines davon von Hand
bearbeitet, bekommt beim nächsten Durchlauf Abweichungen.

Die Marke ist eine **Scheibe**: links das Dunkelgrün `(35, 84, 62)`, rechts das
Ocker `(234, 171, 54)`, Trennlinie genau in der Mitte — dieselbe Zweiteilung wie
im Logo. Darauf das Motiv, auf **118 % der Kreisdiagonale** skaliert und
1,5 % nach oben gerückt. Bei diesen Werten ist nichts angeschnitten und der Rand
bleibt gleichmäßig; sie stammen aus einem Vergleich von 112, 118 und 124 Prozent.

Drei Dinge, die beim Bauen schiefgingen und wieder schiefgehen können:

- **Der helle Rand des Originals muss weg**, sonst zeichnet sein
  Anti-Aliasing-Saum die Silhouette der alten Kachel in die Scheibe. Flutfüllung
  vom Bildrand her (Schwelle 225), danach zwei Punkte abtragen. Nach Farbe
  freistellen geht *nicht*: Der Würfel `(226, 162, 55)` liegt zu dicht am
  Hintergrund-Ocker.
- **Die hellen Umrisse der Sechsecke fallen dabei mit weg** und müssen
  zurückgeholt werden, sonst sind die Sechsecke auf dem Grün kaum noch zu
  ahnen. Sie hängen am Seitengrund, weil die Sechsecke unten aus der Kachel
  herausragen. Über die Helligkeit geht es nicht — der Seitengrund ist mit
  rund 248 genauso hell wie der Umriss. Über die Form schon: Ohne Umriss ist
  jedes Sechseck ein eigener zusammenhängender Teil, abgetrennt vom großen
  Teil aus Kachel und Inhalt. Also alles außer dem größten Teil nehmen und
  den Spalt wieder auffüllen, 18 Punkte breit (im Original gemessen).
- **Erst alles aufbauen, dann die Scheibe ausstanzen.** Das Motiv bringt den
  Kachelgrund mit — der gehört dazu, muss aber mit abgeschnitten werden.
- **Die beiden Ebenen des adaptiven Symbols füllen beide die ganze
  Bildfläche** — auch der Vordergrund. Das klingt falsch, weil Android von
  einer 108-dp-Ebene nur die mittleren 72 dp zeigt, und war auch mein erster
  Fehler: Ich habe das Motiv auf diese 66 Prozent gerechnet, und es erschien
  auf dem Startbildschirm nur halb so groß wie gedacht. Der Grund steht in
  `ic_launcher.xml`, das `capacitor-assets` schreibt: Es legt beide Ebenen mit
  `<inset android:inset="16.7%">` an. Damit landet unser Bild als Ganzes in
  der sichtbaren Fläche. Wer hier noch einmal auf 66 Prozent rechnet,
  verkleinert ein zweites Mal.

  Nachprüfen lässt sich das ohne Gerät: `npx cap add android`, dann
  `npx capacitor-assets generate --android`, und in
  `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` nachsehen.

### Die Sicherung als Datei

In der App ist `<a download>` wirkungslos. Die WebView von Capacitor bekommt
keinen `DownloadListener` gesetzt — im Quelltext von `@capacitor/android`
nachgesehen, es gibt dort keinen. Der Klick verpuffte also, und die Meldung
behauptete trotzdem „Datei gespeichert".

Darum schreibt die App die Datei jetzt selbst (`@capacitor/filesystem`) und
reicht sie an Androids Teilen-Blatt weiter (`@capacitor/share`). Geschrieben
wird in den Zwischenspeicher: Er ist der einzige Ort, den die App ohne
Berechtigung beschreiben darf und den das Teilen-Blatt lesen kann —
`android/app/src/main/res/xml/file_paths.xml` gibt mit `<cache-path>` genau
ihn frei.

**Direkt in den Download-Ordner geht nicht.** Seit Android 11 kommt keine App
mehr ohne Weiteres an die öffentlichen Ordner; die Verzeichnisse, die der
Dateisystem-Baustein dafür anbietet (`DOCUMENTS`, `EXTERNAL_STORAGE`), laufen
dort in die Berechtigung und scheitern. Über das Teilen-Blatt wählt der Benutzer
den Ort selbst, und „In Dateien speichern" führt in den Download-Ordner.

**Die Bausteine werden nicht angemeldet, sie sind schon da.** Die native Seite
schreibt beim Start für jeden eingetragenen Baustein ein fertiges Objekt nach
`window.Capacitor.Plugins` — `JSExport.getPluginJS` im Quelltext von
`@capacitor/android` erzeugt es Methode für Methode. Von dort wird es benutzt:
`window.Capacitor.Plugins.Filesystem.writeFile({…})`.

Ein `registerPlugin` gibt es dort **nicht**. Das steckt im Paket
`@capacitor/core`, das in einem Projekt mit Übersetzungsschritt mitgebündelt
wird — diese Seite lädt es bewusst nicht. Mein erster Versuch rief es trotzdem
auf; der Knopf brach ab, bevor irgendetwas passierte, und zwar lautlos. Wer
hier etwas ändert: `window.Capacitor` wird von drei Stellen zusammengesetzt
(`JSExport.getGlobalJS`, `native-bridge.js`, `JSExport.getPluginJS`), und nur
was dort steht, ist in der App vorhanden.

Nachstellen lässt sich das im Browser: Die Datei `echt.mjs` in den Notizen baut
genau diese drei Stellen nach — ausdrücklich ohne `registerPlugin` — und prüft
alle vier Fälle (Browser, App, Abbruch, App ohne die Bausteine). Ein Test, der
stattdessen die eigene Annahme nachbaut, geht durch und beweist nichts.

### Signatur

**Das Wichtigste am ganzen Bauplan.** Für Android ist die Signatur der Ausweis
einer App. Zwei Pakete mit verschiedenen Ausweisen sind zwei verschiedene Apps,
auch bei gleichem Namen und gleicher Kennung — eine Aktualisierung scheitert
dann mit „App nicht installiert", und es hilft nur Deinstallieren. Dabei löscht
Android den Speicher der App, also die ganze Sammlung.

Genau das ist bis einschließlich 1.2.0 passiert: Gebaut wurde mit
`assembleDebug`, und der Debug-Schlüssel liegt normalerweise auf dem
Entwicklerrechner unter `~/.android/debug.keystore`. GitHubs Maschinen sind bei
jedem Lauf frisch — die Datei fehlt dort, also legte Gradle **jedes Mal einen
neuen Zufallsschlüssel** an.

Seither: `assembleRelease` mit einem festen Schlüssel aus zwei Geheimnissen.

| Geheimnis | Inhalt |
| --- | --- |
| `SIGNIER_SCHLUESSEL` | die Schlüsseldatei, Base64-kodiert |
| `SIGNIER_PASSWORT` | das Passwort, für Speicher und Schlüssel dasselbe |

Anzulegen unter *Settings → Secrets and variables → Actions*. Fehlen sie,
bricht der Bau gleich im zweiten Schritt mit einer verständlichen Meldung ab —
lieber das als ein Paket, das sich später nicht aktualisieren lässt.

Der Schlüssel heißt innen `spieleabend` (Alias, steht fest im Bauplan). Jeder
Bau liest den Fingerabdruck der fertigen APK und vergleicht ihn mit
`ERWARTETE_SIGNATUR` im Bauplan; bei Abweichung bricht er ab, bevor etwas
veröffentlicht wird. Der Abdruck ist kein Geheimnis — er steht in jeder APK und
ist dazu da, geprüft zu werden.

Gelesen wird er mit **`apksigner`**, nicht mit `keytool`: Letzteres versteht nur
die alte JAR-Signatur (v1), die ab `minSdk 24` gar nicht mehr erzeugt wird.
Dieser Fehler ist schon passiert und blieb unbemerkt, weil in einer Rohrleitung
nur der Ausgang des letzten Glieds zählt — daher steht in dem Schritt
`set -o pipefail`.

Drei Dinge, die man wissen muss:

- **Geht der Schlüssel verloren, ist er weg.** Dann lässt sich keine
  Aktualisierung mehr bauen, und alle Benutzer müssten einmal deinstallieren.
  Eine Kopie gehört an einen sicheren Ort außerhalb von GitHub.
- **Der Schlüssel gehört nie ins Repository.** Deshalb die Geheimnisse.
- **Nie austauschen, solange es nicht sein muss.** Ein Tausch bedeutet für
  jeden Benutzer: deinstallieren, neu installieren, Sammlung vorher sichern.

### Eine neue Fassung herausgeben

Die Fassungsnummer steht an **drei** Stellen. Der Bauplan vergleicht sie und
bricht ab, wenn eine abweicht — dieser Vergleich ist die eigentliche Absicherung:

| Stelle | Form |
| --- | --- |
| `package.json` | `"version": "1.2.3"` |
| `index.html` | `Fassung 1.2.3` im Fuß |
| `CHANGELOG.md` | Abschnitt `## [1.2.3] – JJJJ-MM-TT` |

Danach gibt es zwei Wege, und beide landen an derselben Stelle:

**Im Browser** — Reiter „Actions" → „Android-App bauen" → „Run workflow",
Haken bei `veroeffentlichen`. Die Marke wird dabei angelegt.

**Auf der Kommandozeile**

```bash
git push origin main
git tag v1.2.3
git push origin v1.2.3
```

Den Rest macht GitHub: APK bauen, `spieleabend-1.2.3.apk` benennen,
Veröffentlichung `v1.2.3` anlegen und den passenden Abschnitt aus
`CHANGELOG.md` als Begleittext einsetzen.

Dass es den Browser-Weg gibt, hat einen handfesten Grund: Aus einer
Claude-Code-Sitzung heraus lassen sich **keine Marken schieben** — der Server
lehnt das mit HTTP 403 ab, während Branch-Pushes durchgehen. Ohne diesen Weg
könnte ein Assistent das Projekt zwar weiterentwickeln, aber keine Fassung
herausgeben.

Android verlangt zusätzlich eine ganze Zahl, die nie kleiner werden darf. Sie
wird aus der Nummer gerechnet: `1.2.3` → `10203`. Dadurch bleibt für jede
Stelle Platz bis 99 — wer eine dreistellige Unterfassung braucht, muss die
Formel ändern **und** darauf achten, dass die Zahl trotzdem wächst.

Welche Fassung auf einem Gerät läuft, steht im Fuß der Seite. Das ist die
einzige Stelle, an der ein Benutzer das ablesen kann — bitte mitführen.


### Systemleisten (Rand oben und unten)

Seit Android 15 zeichnet die App unter der Statusleiste und der Navigationsleiste
hindurch („edge-to-edge"). Ohne Gegenmaßnahme verdeckt die Uhr die Überschrift.

Gelöst **ohne zusätzliches Paket**: Capacitor 8 setzt die Variablen
`--safe-area-inset-top/right/bottom/left` auf `<html>`, sobald im
Viewport-Vermerk `viewport-fit=cover` steht. `index.html` rechnet sie in
`:root` auf eigene Variablen um (`--sicher-oben` …) und schlägt sie im
Innenabstand von `.wrap` auf — an **zwei** Stellen, der normalen Regel und der
unter `@media (max-width:520px)`.

Fällt das aus (sehr alte WebView-Fassung unter 140), schiebt Capacitor die
Ansicht selbst nach innen und setzt die Variablen auf `0px`. Doppelter Abstand
kann also nicht entstehen. Im Browser ohne Systemleisten greift `env(…)` und
liefert ebenfalls 0 — der Rand ist dann genau wie vorher.

Deshalb **muss** `viewport-fit=cover` im Viewport-Vermerk stehen bleiben, und
Capacitor darf nicht unter Fassung 8 zurückfallen. Capacitor 8 verlangt Node 22;
das ist im Bauplan eingestellt.

## Veröffentlichte Claude-Fassung

Die Seite lief zusätzlich als Claude-Artifact. Dafür wird aus `index.html` ein
Fragment gebaut: alles von `<title>` bis vor `</body>`, abzüglich der Zeilen,
die dort ins Leere zeigen würden:

```
<link rel="icon" …>            <link rel="apple-touch-icon" …>
<link rel="manifest" …>        <meta name="apple-mobile-web-app-… …>
<img class="logo" …>
```

Danach `</head>\n<body>\n` entfernen. Die `theme-color` bleibt — die braucht
keine Datei. Die `@font-face`-Blöcke bleiben ebenfalls: Sie zeigen auf Daten in
der Datei selbst, nicht auf eine Adresse.

## Ausgabe der Treffer

Die ersten `VOLLE_KARTEN` (drei) Treffer stehen als volle Karte da, der Rest als
Zeile; Antippen macht eine Karte daraus (`state.expanded`). Grund: Bei 19
Treffern war die Seite 6600 Pixel lang, das sind gut sieben Bildschirme.

Der Würfel schiebt sein Ergebnis in `renderResults()` an **Position 1** und
springt zur Überschrift, nicht zur Karte. Vorher landete man mitten in der
Liste, ohne Zusammenhang. Damit die Auskunft „das wäre die Rangfolge" nicht
verloren geht, wird der beste Treffer **vor** dem Umsortieren gemerkt und
behält sein Kennzeichen „Top-Treffer".

Der Block „Runde beschreiben" klappt zu (`state.filtersOpen`, gemerkt in den
Einstellungen). Zugeklappt steht nur noch die Zusammenfassung da, und der erste
Treffer rückt von Pixel 1065 auf 489 — also auf den ersten Bildschirm.

## Bedienung auf dem Handy

**44 Pixel sind die Untergrenze für alles, was angetippt wird.** Android
empfiehlt 48, Apple 44. Vorher lagen 72 von 112 Bedienelementen darunter — die
Chips bei 34, die Sortierknöpfe bei 27, eine Aufklappzeile bei 18. Das fällt am
Schreibtisch mit der Maus nie auf und im Zug sofort.

Prüfen lässt sich das in einem Durchgang: alle `button`, `input`, `summary` und
`textarea` einsammeln, die Höhe messen, alles unter 44 melden. Bei
Kontrollkästchen zählt die umgebende Beschriftung, nicht das Kästchen.

Zwei Stellen hängen daran:

- **Die Knopfzeile unter dem Filter klebt** (`position:sticky`), solange der
  Block offen ist. Ohne das beginnt „Würfel entscheiden" bei Pixel 882 von 915.
- **Die Spielerzahl ist ein Zähler**, kein Chip je Zahl. Das bezahlt den Platz,
  den die größeren Chips kosten — und hebt die willkürliche Grenze von 12 auf.

## Warum „Heute gespielt" nicht neu sortiert

Der Knopf setzt `lastPlayed` auf heute. In der Bewertung kostet das 25 Punkte,
das Spiel rutscht also ans Ende — und verschwindet damit genau in dem Moment
unter dem Finger, in dem man es bestätigt hat. Gemessen: Danach lag ein Etikett
einer fremden Karte an derselben Stelle.

Deshalb ruft der Knopf **nicht** `render()`, sondern `frischeKarte(g)`: Diese
eine Karte wird neu gebaut, die Reihenfolge bleibt. Die neue Rangfolge greift
beim nächsten Würfeln oder Filterwechsel. Wer hier auf `render()` zurückstellt,
holt das Problem zurück.

## Hell und dunkel

Es gibt **nur eine** Palette für dunkel, in `@media (prefers-color-scheme: dark)`.
Einen Schalter in der Seite gibt es nicht mehr; das Gerät entscheidet.

Damit das in der Android-App funktioniert, braucht es eine Kette, die man kennen
sollte, bevor man daran rührt:

1. Die WebView leitet `prefers-color-scheme` aus dem Attribut **`isLightTheme`**
   des App-Themes ab — nicht direkt aus der Systemeinstellung.
2. Capacitors Activity-Theme ist `Theme.AppCompat.DayNight.NoActionBar`, und
   DayNight setzt `isLightTheme` je nach Nachtmodus des Geräts.

Wer das Theme in `android/app/src/main/res/values/styles.xml` auf eine feste
helle oder dunkle Variante ändert, nagelt damit auch die Seite fest.

Falls sich die Seite auf einem Gerät **nicht** nach dem System richtet, ist der
nächste Schritt `WebSettingsCompat.setAlgorithmicDarkeningAllowed(true)` in
`MainActivity` — das müsste der Bauplan nach `npx cap add android`
hineinschreiben, weil der Ordner `android/` bei jedem Bau neu entsteht.

## Das Datumsfeld

`<input type="date">` zeigt das Format der **Systemsprache**, nicht das der
Seite. Ein `lang="de"` am Feld ändert nichts — nachgeprüft in Chromium, alle
drei Varianten ergaben `mm/dd/yyyy`. Es gibt keinen Weg, das zu erzwingen,
ohne den Kalender des Geräts aufzugeben; der ist auf dem Handy aber das
Wertvollste am Feld.

Deshalb steht der gewählte Tag darunter noch einmal ausgeschrieben
(`datumAusgeschrieben()`), fest mit `toLocaleDateString("de-DE", …)` und mit
Wochentag. Wer hier aufräumt und diese Zeile entfernt, holt sich das Problem
zurück.

## Was absichtlich fehlt

- **Keine automatischen Tests im Repository.** Geprüft wurde jeweils mit einem
  Browser im Kopflos-Modus, der die Oberfläche bedient und anschließend misst.
  Für eine Datei dieser Größe ist ein eingechecktes Testgerüst mehr Wartung als
  Nutzen — bei weiterem Wachstum kippt das.
- **Keine Übersetzung.** Alles ist deutsch, auch die Commits.
- **Keine Schachtelbilder.** Jede vergleichbare App lebt davon. Hier bräuchte es
  dafür entweder Netz oder viel Speicher, und die Rechtelage bei Verlagsbildern
  ist unklar. Der Gewinn wiegt den Verlust der Offline-Eigenschaft nicht auf.
- **Kein Heimserver mehr.** Bis 1.4.1 lag ein Node-Server bei, der die Sammlung
  im Heimnetz teilte, samt Windows-Dienst. Das Projekt ist eine Android-App; der
  Server war Wartungsaufwand ohne Nutzen. Geschichte: `git log --diff-filter=D`.
- **Keine Anmeldung.** Die Sammlung liegt auf dem Gerät, nicht auf einem Dienst.
