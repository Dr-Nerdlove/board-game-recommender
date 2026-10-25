# Entwicklungsnotizen

Diese Datei richtet sich an Menschen oder Programme, die das Projekt später
weiterentwickeln. Sie erklärt, wie es aufgebaut ist und **warum** es so
aufgebaut ist — das Warum steht nirgends im Quelltext und geht sonst verloren.

## Der Kern: eine Datei

`index.html` ist die ganze Anwendung — Aufbau, Gestaltung und Logik in einer
Datei, rund 2600 Zeilen. Kein Baukasten, keine Abhängigkeiten, kein
Übersetzungsschritt. Datei öffnen genügt.

Darin stecken auch die beiden Schriften als Daten (rund 120 KB, Nachweis in
`SCHRIFTEN.md`). Das ist der Grund, warum die Datei rund 250 KB groß ist statt
130. Der Gegenwert: Es gibt **keine Anfrage ans Netz, um die niemand gebeten
hat**, und die Seite sieht offline aus wie online. (Die einzige Ausnahme ist der
Knopf „Daten suchen", siehe „Daten suchen bei Wikidata".) Vorher kamen die
Schriften von Google — die App versprach „kein Netz nötig" und hielt es beim
Aussehen nicht.

Das ist eine bewusste Entscheidung, keine Nachlässigkeit. Das Projekt soll auch
in fünf Jahren noch laufen und von jemandem weiterentwickelt werden können, der
keine Werkzeugkette einrichten will. Wer hier Module, Bündler oder ein
Oberflächen-Gerüst einführt, tauscht diese Eigenschaft gegen Bequemlichkeit ein.
Gut begründbar, aber eine echte Abwägung.

Im Skriptteil von unten nach oben: Daten (`MOODS`, `BEISPIELSPIELE`), Speicher,
Bewertung (`evaluate`), Ausgabe (`render*`), Formular, Ereignisbehandlung.

## Der Speicher

Die Sammlung liegt **nur auf dem Gerät**: `localStorage`, geschrieben von
`persist()`. In der Android-App ist das der Speicher der App, in der Web-Version
der des Browsers. Es gibt kein Konto und keinen Abgleich; der Weg zwischen
Geräten ist die Sicherung. Die Zeile über dem Formular sagt das dem Benutzer.

Es gab einmal zwei weitere Wege, beide sind weg — nachzulesen in der
Git-Historie:

- ein **Claude-Konto** (`connectDb()` über die `db`-Fähigkeit eines Artifacts)
  für die Seite als Claude-Artifact, entfernt mit 2.9.2,
- bis 1.4.1 ein mitgelieferter **Node-Server** fürs Heimnetz samt
  Windows-Dienst, entfallen mit 2.0.0. Wer ihn sucht:
  `git log -- spieleabend-server.mjs`.

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
Android-SDK vorinstalliert ist. Capacitor verpackt `index.html` zu einer App.

Der Bauplan läuft **nur auf Abruf**: auf eine Versionsmarke (`v*`) oder über
„Run workflow". Mit dem Haken `veroeffentlichen` entsteht eine eigene
Veröffentlichung, die danach unverändert bleibt; ohne Haken ist es ein
Probelauf, dessen APK nur als Arbeitsergebnis anhängt (und nach sieben Tagen
verschwindet).

**Was der Bauplan dem frisch erzeugten Android-Projekt hinzufügt** — `npx cap
add android` legt `android/` bei jedem Bau neu an, deshalb steht alles
Angepasste als Heredoc im Bauplan:

- die nativen Bausteine `SystemfarbenPlugin` und `SprachePlugin` und eine
  `MainActivity`, die beide anmeldet (siehe „Material You" und „Zwei Sprachen"),
- `values-de/strings.xml` (deutscher App-Name), `locales_config.xml` samt
  Verweis im Manifest,
- die Signatur und die Fassungsnummer.

**Java lässt sich außerhalb des Baus nicht übersetzen.** Nach jeder Änderung an
diesen Bausteinen deshalb erst ein Probelauf ohne Haken, dann erst
veröffentlichen.

### Das Symbol

Quelle ist **`Board-Game-Recommender_Logo.png`**; alle `icon-*.png` und die
beiden `app-icon-*.png` sind daraus gerechnet. Wer eines davon von Hand
bearbeitet, bekommt beim nächsten Durchlauf Abweichungen.

Die Marke ist eine **Scheibe**: links das Dunkelgrün `(35, 84, 62)`, rechts das
Ocker `(234, 171, 54)`, Trennlinie genau in der Mitte — dieselbe Zweiteilung wie
im Logo. Darauf das Motiv, auf **118 % der Kreisdiagonale** skaliert und
1,5 % nach oben gerückt. Bei diesen Werten ist nichts angeschnitten und der Rand
bleibt gleichmäßig; sie stammen aus einem Vergleich von 112, 118 und 124 Prozent.

Vier Dinge, die beim Bauen schiefgingen und wieder schiefgehen können:

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

Nachstellen lässt sich das im Browser mit einer Attrappe, die genau diese drei
Stellen nachbaut — ausdrücklich ohne `registerPlugin` — und alle vier Fälle
prüft (Browser, App, Abbruch, App ohne die Bausteine). Ein Test, der
stattdessen die eigene Annahme nachbaut, geht durch und beweist nichts. (Die
Prüfskripte waren Wegwerf-Dateien und liegen nicht im Repo.)

### Material You

Android leitet ab Version 12 eine Palette aus dem Hintergrundbild ab und stellt
sie **nur nativen Apps** bereit. Der Browser-Maschine sind diese Farben bewusst
verborgen — über die Farbe ließe sich ein Gerät wiedererkennen. Nachgemessen:
Chromium kennt das dafür vorgesehene CSS-Schlüsselwort `AccentColor` nicht
einmal (`CSS.supports('color','AccentColor')` ist falsch). Es führt also kein
Weg an nativem Code vorbei.

`SystemfarbenPlugin.java` liest die Palette über
`getIdentifier("system_accent1_600", "color", "android")` — über den Namen statt
über `android.R.color.*`, damit es auf älteren Geräten einfach wegfällt statt zu
scheitern. Der Bauplan schreibt die Datei bei jedem Durchlauf neu, zusammen mit
einer `MainActivity`, die sie (und das `SprachePlugin`) anmeldet; `npx cap add
android` erzeugt das Projekt ja jedes Mal frisch. Das `registerPlugin` muss **vor** `super.onCreate`
stehen — dort wird die Brücke gebaut, danach angemeldete Bausteine kommen zu
spät (nachzulesen in `BridgeActivity.onCreate`).

Androids Stufen laufen umgekehrt zur Material-Zählung: **0 ist am hellsten,
1000 am dunkelsten.**

Das Heikle ist nicht das Auslesen, sondern der Kontrast: Die Palette kommt vom
Hintergrundbild und kann alles Mögliche sein. Darum rechnet `passtStufe()` jede
Schriftfarbe nach und geht nötigenfalls zur nächsten Stufe weiter. Ein Fall
lässt sich so nicht lösen und braucht `knopfPaar()`: Ist der Knopfton zu hell
für weiße Schrift, hilft kein Weitersuchen bei der Schrift — heller als Stufe 0
geht sie nicht, also wird die Fläche nachgedunkelt. Bei einem grünen
Hintergrundbild ist der Knopfton `#318c4f`, und Weiß darauf schafft nur 4,0.

Prüfen lässt sich das ohne Gerät: Eine Attrappe für
`Capacitor.Plugins.Systemfarben` schickt erfundene Paletten durch —
blau, rot, grün, gelb und eine untaugliche aus lauter Mittelgrau. Erwartet wird:
vier Paletten greifen in Hell und Dunkel mit allen Abständen über 4,5:1, die
untaugliche fällt auf die eigenen Farben zurück.

### Die Zurück-Taste

Ohne Zutun beendet Androids Zurück-Taste die App sofort — gleich ob man im
Formular steht, in der Sammlung blättert oder weit unten ist. Capacitor selbst
behandelt sie gar nicht (im Quelltext von `@capacitor/android` gibt es dazu
nichts). Erst `@capacitor/app` hängt sich ein, und zwar so: Gibt es **keinen**
JS-Horcher, geht es im Verlauf der Seite zurück — bei einer Seite ohne Verlauf
also nirgendwohin, und die App ließe sich mit Zurück gar nicht mehr verlassen.
Wer den Baustein einbaut, muss den Horcher also anmelden und selbst entscheiden,
wann beendet wird.

`eineEbeneZurueck()` in `index.html` hält die Reihenfolge fest: Formular,
Sicherungsabschnitt, Sammlung, Ausschussliste, nach oben scrollen — und erst
dann hinaus. Der ganze Horcher liegt in einem `try`, und schlägt irgendetwas
fehl, wird beendet. Das ist genau das Verhalten ohne den Zusatz; niemand soll
in der App festsitzen, weil dieser Code einen Fehler hat.

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
| `index.html` | `data-fassung="1.2.3"` am Fuß-Element |
| `CHANGELOG.md` | Abschnitt `## [1.2.3] – JJJJ-MM-TT` |

Ein Push auf `main` aktualisiert die **Web-Version** von selbst (siehe dort).
Die **APK** gibt es nur auf Abruf, und dafür gibt es zwei Wege, die an derselben
Stelle landen:

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

## Zwei Sprachen

Die Oberfläche spricht Deutsch und Englisch. **Einen eigenen Umschalter gibt es
bewusst nicht**: Die Sprache kommt vom Gerät. Auf Android 13 aufwärts lässt sie
sich zusätzlich für die App allein einstellen (Einstellungen → Apps →
Spieleabend → Sprache); die Web-Version folgt der Sprache des Browsers.

### Woher die Sprache kommt

Das ist die Stelle, an der es nicht so einfach ist, wie es aussieht.

`navigator.language` nennt in der WebView **immer die Sprache des Systems** —
auch dann, wenn für die App eine andere eingestellt ist. Das ist kein Fehler der
Seite: Die WebView bekommt die App-Sprache schlicht nicht mit, und Google
betrachtet das als beabsichtigt. Wer sich allein auf `navigator.language`
verlässt, baut eine App, deren Spracheinstellung sichtbar nichts tut.

Darum fragt die App zusätzlich nativ nach. Die Reihenfolge:

1. die zuletzt gemerkte Sprache aus `localStorage` — damit der erste Anblick
   schon stimmt und nichts umspringt,
2. sonst `navigator.language`,
3. in der App: die Antwort des Bausteins `Sprache`, die immer gewinnt und das
   Gemerkte auffrischt.

Schritt 3 kommt erst nach dem ersten Zeichnen an — eine Brücke zu Capacitor ist
immer asynchron. Deshalb muss die Umstellung **in beide Richtungen** gehen, auch
zurück nach Deutsch. Dafür merkt sich `spracheAnwenden()` beim ersten Durchgang
den deutschen Urtext jedes Elements (`URTEXT`, `URATTR`); ohne dieses Gedächtnis
wäre die Übersetzung eine Einbahnstraße.

Sichtbar ist davon nur ein kurzes Umspringen, und auch das nur beim allerersten
Start nach einer Umstellung — danach steht die Sprache gemerkt im Speicher.

### Was dafür am Android-Projekt hängt

- **`res/xml/locales_config.xml`** zählt auf, welche Sprachen die App kann, und
  `android:localeConfig` im Manifest verweist darauf. **Ohne beides erscheint
  der Punkt „Sprache" in den App-Einstellungen gar nicht.**
- **`SprachePlugin`** liest `getActivity().getResources().getConfiguration()` —
  nur die Einstellungen der Activity tragen die App-Sprache.
- **`MainActivity.onConfigurationChanged`** lädt die Seite neu, wenn sich die
  Sprache geändert hat. Nötig, weil im Manifest `locale` unter `configChanges`
  steht: Android baut die Activity dann *nicht* neu auf, und die Seite bliebe
  sonst in der alten Sprache stehen, bis jemand die App beendet.

Zwei Wörterbücher, weil sie zwei verschiedene Aufgaben haben:

| | wo der Urtext steht | wofür |
| --- | --- | --- |
| `MARKUP_EN` | im Markup (deutsch) | feste Beschriftungen; nur für Englisch ersetzt |
| `TEXTE` | im Wörterbuch (beide Sprachen) | alles, was das Skript selbst baut |

Das Markup behält also seinen deutschen Urtext. Das ist Absicht: Die Datei
bleibt beim Lesen verständlich, und wenn das Skript ausfällt, steht immer noch
etwas Sinnvolles da. `spracheAnwenden()` ersetzt die Beschriftungen beim Start
anhand von `data-t` (Inhalt) und `data-t-attr` (Attribute wie `placeholder`
oder `aria-label`).

**Was nicht übersetzt wird, und warum.** Die Schlüssel der gespeicherten Daten
bleiben in jeder Sprache dieselben: `party`, `gruebeln`, `leicht`, `mittel`,
`schwer` und die übrigen. Sie stecken in der gespeicherten Sammlung und in jeder
Sicherung. Wer sie übersetzt, macht jede vorhandene Sicherung unlesbar und
trennt die beiden Sprachfassungen voneinander. Nachgemessen: Eine Sicherung aus
der deutschen App spielt sich in der englischen ein und umgekehrt, Stimmungen
und Anspruch kommen richtig an.

Die Notizen der Beispielspiele gibt es zweimal (`note` und `noteEn`);
`beispielSammlung()` nimmt beim Laden die passende, gespeichert wird nur eine. Selbst
getippte Notizen rührt die Sprachwahl nicht an — es sind Daten des Benutzers,
keine Beschriftung.

**Die Fassungsnummer** steht im Fuß nicht mehr als Text, sondern als
`data-fassung` am Element; das Skript setzt daraus „Fassung 1.2.3" oder
„Version 1.2.3". So bleibt die Nummer eine einzige Stelle, und der Bauplan
prüft sie weiterhin — er sucht jetzt nach `data-fassung="…"`.

**Der Name im App-Menü** folgt derselben Regel, aber über Android:
`capacitor.config.json` liefert den englischen Namen, der Bauplan legt
zusätzlich `values-de/strings.xml` mit „Spieleabend" an. Android wählt anhand
der Systemsprache aus.

## Das leere Regal und die Beispiele

Bis 2.7 lagen 21 Spiele aus dem Regal des Autors als Ausgangssammlung im Code.
Seit 2.8 beginnt das Regal leer — wer die App bekommt, soll nicht erst fremde
Spiele löschen müssen. Damit ist das leere Regal der erste Anblick für jeden
Neuen und bekommt darum zwei Knöpfe statt eines Satzes: „Erstes Spiel
eintragen" und „Beispielspiele laden". „Würfel entscheiden" ist ausgegraut,
solange nichts passt.

Eine schon gespeicherte Sammlung bleibt beim Update unberührt (nachgemessen mit
21 Spielen im Speicher). Verloren ginge nur eine Sammlung, die nie gespeichert
wurde — also eine, an der nie etwas geändert wurde.

## Daten suchen bei Wikidata

**Warum nicht BGG:** Seit Juli 2025 verlangt BoardGameGeek für die
XML-Schnittstelle eine Registrierung und einen persönlichen Token, der nicht
weitergegeben werden soll. In einer App, die andere installieren, lässt er sich
nicht unterbringen.

**Wikidata** ist frei (CC0), braucht keinen Schlüssel und antwortet mit
`origin=*` auch Anfragen aus dem Browser. Zwei Anfragen pro Suche:

1. `list=search` mit `haswbstatement:P1872` — nur Einträge mit Spielerzahl.
   Ohne diesen Filter kommt bei „Catan" zuerst die Stadt Catania.
2. `wbgetentities` für bis zu sechs Treffer, mit Bezeichnungen und Aussagen.

Ausgewertet werden P1872/P1873 (Spielerzahl), P2047 (Dauer, in Minuten
umgerechnet, auch Spannen) sowie P136/P31 (Genre/Art → Stimmungsvorschlag,
Tabelle `WD_STIMMUNG`). Bei mehreren Aussagen gilt der bevorzugte Rang, sonst
alle normalen; verworfene nie. Beispiel Flügelschlag: Höchstspielerzahl 5, 7
und 2 eingetragen — ohne Rangbeachtung wäre die Erweiterung durchgerutscht.

Nicht vorhanden: Anspruch und beste Besetzung. Die Meldung sagt das, statt so
zu tun, als sei das Formular fertig.

**Drosselung:** Wikidata antwortet auf zu viele Anfragen mit 429 — und zwar
ohne CORS-Kopf. Der Browser meldet dann nur einen Netzfehler. Die App
unterscheidet darum über `navigator.onLine` zwischen „kein Netz" und „Wikidata
gerade nicht erreichbar oder überlastet". Beim Testen aus einer Cloud-Maschine
greift die Drosselung schon nach wenigen Anfragen; auf einem Handy ist das
nicht zu erwarten.

## Web-Version (GitHub Pages)

**Warum:** Für das iPhone gibt es keine APK, und der App Store verlangt ein
bezahltes Entwicklerkonto. Eine Seite auf GitHub Pages kostet nichts (das
Repo ist öffentlich) und lässt sich über „Zum Home-Bildschirm" wie eine App
ablegen.

**Veröffentlichen:** `.github/workflows/pages.yml` kopiert nur die Web-Dateien
(`index.html`, `sw.js`, `manifest.webmanifest`, `icon-*.png`) nach `site/` und
schiebt sie auf Pages. Jeder Push auf `main`, der eine davon berührt, aktualisiert
die Web-Version; einen Versionsmarken-Schritt gibt es nicht. Die Android-App baut
weiter allein `apk.yml`.

**`sw.js`:** Die Seite wird *Netz zuerst* geladen — wer online ist, hat immer die
neueste Fassung, und in `sw.js` steht keine Versionsnummer, die man vergessen
könnte. Nur ohne Netz springt der Cache ein. Symbole und Manifest kommen aus dem
Cache und werden im Hintergrund aufgefrischt. Fremde Adressen (Wikidata) fasst
der Dienst nicht an.

**Nicht in der Android-App:** Dort liefert die APK die Dateien selbst. Ein Dienst
könnte nach einem Update noch die alte Fassung festhalten. Registriert wird er
nur über https oder `localhost`, nie in der App.

**Hinweis für das iPhone:** Eine kleine, wegtippbare Box über dem Regal. Sie
erscheint nur auf iOS (auch iPad, das sich als Mac meldet), nur im Safari-Tab
(nicht vom Home-Bildschirm aus), nie in der App und nicht
mehr, nachdem sie weggetippt wurde (`spieleabend.ioshinweis`).

**Die Sieben-Tage-Regel:** Safari löscht per Intelligent Tracking Prevention den
Skriptspeicher von Seiten, die sieben Tage nicht besucht wurden. Web-Apps vom
Home-Bildschirm sind ausgenommen. Darum die Box — und darum der Rat zur
Sicherung. Das ist bei `localStorage` kein Fehler der Seite, sondern iOS.

### Zwei Fallen der Web-Version

**Getrennte Speicher auf iOS.** Safari-Tab und Home-Bildschirm-App teilen sich
keinen `localStorage`. Wer im Tab eine Sammlung anlegt und die Seite danach auf
den Home-Bildschirm legt, findet dort ein leeres Regal. Der iPhone-Hinweis sagt
darum ausdrücklich: erst auf den Home-Bildschirm, dann eintragen — und nennt den
Umzug über „Sicherung & Umzug".

**Speicher räumt der Browser selbst.** Ohne Weiteres darf ein Browser die Daten
einer Seite löschen, wenn Platz knapp wird. `speicherFestmachen()` bittet beim
ersten Speichern um dauerhaften Speicher (`navigator.storage.persist()`) —
bewusst nicht beim Öffnen, weil Firefox dafür nachfragt und die Frage erst
Sinn ergibt, wenn es etwas zu schützen gibt. Gegen Safaris 7-Tage-Regel hilft
das nicht.

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
- **Keine dritte Sprache.** Deutsch und Englisch reichen; jede weitere
  verdoppelt die Pflege, ohne dass jemand danach gefragt hätte.
- **Keine Schachtelbilder.** Jede vergleichbare App lebt davon. Hier bräuchte es
  dafür entweder Netz oder viel Speicher, und die Rechtelage bei Verlagsbildern
  ist unklar. Der Gewinn wiegt den Verlust der Offline-Eigenschaft nicht auf.
- **Kein Heimserver mehr.** Bis 1.4.1 lag ein Node-Server bei, der die Sammlung
  im Heimnetz teilte, samt Windows-Dienst. Das Projekt ist eine Android-App mit
  Web-Version; der Server war Wartungsaufwand ohne Nutzen. Geschichte:
  `git log --diff-filter=D`.
- **Keine native iOS-App.** Dafür bräuchte es ein bezahltes Apple-Entwicklerkonto
  (99 $ im Jahr); ohne läuft eine selbst gebaute App nur sieben Tage. Die
  Web-Version auf dem Home-Bildschirm ersetzt sie kostenlos.
- **Keine Claude-Artifact-Fassung mehr.** Die Seite lief einmal zusätzlich als
  Artifact, mit Konto-Speicher und „Daten vorschlagen" über Claude. Beides ist
  mit 2.9.2 entfernt.
- **Keine Anmeldung.** Die Sammlung liegt auf dem Gerät, nicht auf einem Dienst.
