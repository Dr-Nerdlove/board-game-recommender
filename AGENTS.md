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

**Keine zweistelligen Stellen** in der Nummer (Wunsch des Besitzers): nach x.9.z
kommt die nächste Hauptfassung, also 2.9.2 → 3.0.0, nicht 2.10.0. Niemals
zurück auf eine kleinere Nummer: Android rechnet 1.2.3 zu 10203 und verweigert
jede Aktualisierung auf eine kleinere Zahl.

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

**Wer der Besitzer ist und wie er arbeiten will:**

- Der Besitzer ist **kein Programmierer**. Antworten auf **Deutsch**, ohne
  Fachwörter, wo es auch einfacher geht; bei Entscheidungen ein klarer Vorschlag
  statt einer Aufzählung aller Möglichkeiten.
- **Bauen und veröffentlichen darf ohne Rückfrage geschehen**, wenn die Änderung
  geprüft ist („du darfst einfach bauen"). Fragen kosten ihn mehr, als sie
  nützen. Ausnahme: alles, was sich nicht zurücknehmen lässt (Schlüssel
  tauschen, Verlauf umschreiben, etwas löschen, das nicht im Repo liegt).
- **Direkt auf `main` arbeiten ist hier der eingespielte Weg**; Pull Requests
  nur, wenn er darum bittet.
- **Erst messen, dann behaupten — und Fehler offen sagen.** Er verlässt sich auf
  die Zusicherung „geprüft"; wo etwas nur im Browser statt auf einem echten
  Gerät geprüft werden konnte, gehört das dazu. Was sich hier nicht prüfen lässt
  (Wirkung auf dem Handy, Java-Übersetzung), ausdrücklich benennen.
- **Ein Gerät hat er nur zum Ausprobieren:** Rückmeldungen kommen mit
  Bildschirmfoto vom Handy. Danach messen, nicht nach Gefühl nachbessern.
- **Vor jedem Update mit Folgen für gespeicherte Daten** daran erinnern, vorher
  eine Sicherung zu machen („Sicherung & Umzug").
- **Kleine, klar umrissene Aufträge** darf ein günstigeres Modell als Hilfskraft
  erledigen; das Ergebnis trotzdem selbst nachmessen, bevor es veröffentlicht
  wird.

- Erst nachsehen, dann behaupten. Mehrere Fehler in diesem Projekt entstanden
  aus geratenen Adressen und Annahmen über Dateien.
- Keine Zeile einbauen, die auf jeder Karte steht — was alle teilen, sagt
  nichts.
- Nichts hart ausschließen, was der Benutzer noch wollen könnte: lieber in der
  Rangfolge senken und den Grund nennen.

<!-- owner-rules v6: general (AGENTS.md) - begin -->

## General rules

### People

- Unless "Project knowledge" says otherwise, assume that the people you work with **do not program**: they
  build their projects together with AI assistants and rely on you for the code, its quality and its
  explanation. "Project knowledge" lists who works on the project.
- Talk to them in **German**, in plain words, without jargon. Say what changes for them, not which file
  changed.
- When they ask for ideas or something is unclear, **offer choices and let them pick before building**, with
  a recommendation. Do not build a proposal nobody chose.
- **Report honestly**: a test that failed, a step that was skipped, a fix that turned out to be wrong. Say
  what was **really tested** and what was only built or compiled, and what it means for them.
- **Merge, release or publish only when the person asks for it.** Never merge or overwrite the work of
  someone else without their consent; propose it to them (pull request, comment) instead.

### Language

- **Everything in the repository is English**: files and documentation, code comments, commit messages,
  branch names, pull requests, issues and release notes. Only the conversation with the people is German.
- Text that the product itself shows to its users (an app's interface, a device's display, its store page)
  stays in the language or languages the product is made for. "Project knowledge" names them.
- **A product in several languages stays in all of them.** Every new or changed text goes into every
  language the product offers, in the same change; never leave one language behind, drop one, or fall back
  to another language silently. Write each language naturally (not word for word), with its proper
  characters (ä, ö, ü, ß in German). Check that no text is missing in any language before calling the change
  done.
- Where a project still has older content in another language, do not translate it on your own: offer it as
  a choice.

### Testing

- Where the project has automated tests, **every new behaviour that can be tested automatically gets a test,
  and a sabotage check**: break the behaviour on purpose (it must still compile, and it must break the
  behaviour, not just a selector or a text), run the test, see it fail, put the code back and confirm that
  the file is byte for byte what it was (`cmp`). A test that passes against broken code is worthless.
- **What cannot be tested automatically** (hardware, devices, displays, animations, things that need a real
  account or service) gets no test suite of its own. Check it as far as possible (build, compile, a preview),
  then on the real device or service, and say plainly which part is checked how.
- Where the project has no tests at all, do not set up a test suite on your own: when a change would be
  risky without one, offer it to the owner as a choice.
- Run the project's checks before pushing, as "Project knowledge" or the project's own instructions say.
  Where they say nothing: the checks that cover what changed, and the whole suite when the change could have
  effects elsewhere.

### Safety and data

- **Never put secrets into the repository**: passwords, API keys, tokens, private addresses. Use the
  project's way of keeping them out (environment, settings, `.gitignore`); if there is none, ask.
- **Personal data** (of the people or of the product's users) is not sent anywhere new, logged or published
  without asking.
- **What users have stays usable after an update**: their settings, saved data, accounts. When a change
  would break or reset them, say so before building and offer a way to carry them over.
- **Ask before anything hard to undo**: deleting data or files that are not part of the change, rewriting
  history, changing a live service, publishing to a store.
- **New libraries or services** only with a reason, said in plain words; prefer what the project already
  uses.

### Changes

- **One topic per change** (branch, pull request): easier to check, to release and to undo.
- Changes that users notice go into the release notes or changelog in plain words (in English, like
  everything in the repository; texts shown to users inside the product or in a store, such as "what's new",
  in every language the product offers).

### Showing changes

- Show visual changes rather than describing them: **screenshots** where the result runs on a computer.
- Where no screenshot is possible (a device, a display, a phone app, print): build a **preview** (a mock-up
  page, a pixel preview), or ask for a **photo** of the real thing.

### Checking facts at the source

- Do not build on memory where the real thing can be checked: read the actual source of a library, look at
  the real answer of a server or service, read the real data. Behaviour that "should" be so is often not.
- When a cause is unclear, **ask for a log or an error message before guessing**, and say what it would show.

### Keeping knowledge in the repository

- Sessions end and are deleted; the repository stays. What a later session needs to know goes into the
  project's files ("Project knowledge", the README, other docs, commit messages), not only into the
  conversation: decisions and why, traps that cost time, how to build, test and release, and the limits of
  the environment (what a cloud session cannot do there).

<!-- owner-rules v6: general (AGENTS.md) - end -->

## Project knowledge

Most of this project's knowledge is in the German sections above and in `ENTWICKLUNG.md`; this list points to it.

- **People:** the owner (GitHub: Dr-Nerdlove) works on it alone, with AI assistants, and does not program. They
  decide about merging and releases; as "Haltung, die sich bewährt hat" says, tested changes may be built and
  published without asking, and work happens directly on `main`.
- **Repository language:** this project keeps its instructions, code comments and commit messages in German (see
  "Sprache"; commit messages and the build workflow in plain ASCII). That is the project's own rule and wins over
  "everything in the repository is English"; `README.md` is English.
- **Product languages:** German and English, following the system language. Fixed labels in `MARKUP_EN`, script
  texts in `TEXTE` (both in `index.html`); Android language lists are written by `apk.yml`. Stored data keys are
  never translated.
- **Build and test:** no automated tests. Syntax check and local server as under "Prüfen statt hoffen";
  interface checks with puppeteer-core against the preinstalled Chromium. Not checkable here: the Java parts
  (only the GitHub build shows it) and the real effect on a phone (the owner sends a phone screenshot).
- **Release:** see "Eine neue Fassung herausgeben": version in `package.json`, `data-fassung` and
  `CHANGELOG.md`, no two-digit parts, never lower. A push to `main` publishes the web version; the APK comes from
  the `apk.yml` workflow with `veroeffentlichen`. Never change the signing key.
- **Traps:** a new game field must be carried in four places; the embedded fonts are not clutter; `.wrap`
  padding in two places; touch targets of at least 44 px; "Heute gespielt" must not re-sort; the test traps under
  "Prüfen statt hoffen" (`getComputedStyle` after `render()`, `pkill -f`, empty shelf, Capacitor bridge,
  Wikidata 429).
- **Limits of the environment:** a cloud session cannot push tags (HTTP 403; use the workflow instead) and cannot
  compile Java. Wikidata throttles cloud machines.
