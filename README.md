# Was spielen wir heute?

Kleine Entscheidungshilfe für den Spieleabend: Du sagst, wie viele ihr seid,
worauf ihr Lust habt, wie viel Kopf ihr habt und wie viel Zeit — die Seite
sortiert die eigene Sammlung danach durch und schlägt vor, was heute passt.

## Benutzen

`index.html` im Browser öffnen. Keine Installation, kein Server, kein Internet
nötig (nur die Schriften kommen aus dem Netz, sonst greifen Systemschriften).
Läuft auch auf dem Handy — die Filter sind Antippknöpfe, keine Dropdowns.

## Was die Seite macht

- **Harte Filter**: Spielerzahl, Zeitbudget, Anspruch, Stimmung. Was rausfällt,
  steht unten mit Begründung („nur bis 4", „dauert ab 60 Min").
- **Rangfolge**: Treffer werden nach Passung sortiert. Der beste Vorschlag steht
  oben groß, die Balken zeigen, wie gut ein Spiel zur Runde passt.
- **Glanzform**: Ein Spiel, das bei genau dieser Spielerzahl am besten läuft,
  bekommt ein eigenes Kennzeichen.
- **Würfel entscheiden**: Wenn die Diskussion zu lange dauert, zieht der Knopf
  zufällig aus der oberen Hälfte der Treffer.
- Die letzte Einstellung wird im Browser gemerkt.

## Sammlung pflegen

Unten auf der Seite: **Sammlung bearbeiten**.

- **Hinzufügen** — Name, Spielerzahl, Dauer, Anspruch und mindestens eine
  Stimmung; „Am besten zu" ist optional und meint die Spielerzahl, bei der das
  Spiel wirklich glänzt (davon hängt das Glanzform-Kennzeichen ab).
- **Daten vorschlagen** — nur den Titel eintippen, den Rest füllt Claude aus
  (siehe unten).
- **Ändern** — füllt dasselbe Formular mit dem vorhandenen Spiel.
- **Entfernen** — sofort, mit „Rückgängig" direkt daneben.
- **Zurücksetzen** — holt die 21 Ausgangsspiele zurück (Sicherheitsklick).
- **Sicherung & Umzug** — die ganze Sammlung als Text zum Aufheben, Ergänzen
  („Dazu einspielen") oder Ersetzen; auch der Weg für BGG-Daten (siehe unten).

### Nur den Titel eintippen

Neben dem Namensfeld steht in der veröffentlichten Seite ein Knopf
**„Daten vorschlagen"**. Er fragt Claude nach Spielerzahl, bester Besetzung,
Dauer, Anspruch, Stimmung und einem Notizsatz und trägt alles ins Formular
ein — gespeichert wird nichts, bis du auf „Ins Regal stellen" tippst. Der
Vorschlag steht also immer zur Korrektur, und genau so ist er gemeint:

- Claude kennt viele Spiele, aber nicht alle, und Auflagen unterscheiden sich.
  Kennt es das Spiel nicht sicher, sagt es das, statt Zahlen zu erfinden.
  Trotzdem: **die Werte vor dem Speichern kurz ansehen.**
- Der Titel wird auf die offizielle Schreibweise gesetzt, wenn sie abweicht —
  die Zeile unter dem Feld sagt es dann.
- Die Abfrage läuft über deine Claude-Nutzung; beim ersten Mal fragt die Seite
  um Erlaubnis. Ein zweiter Klick auf den Knopf bricht eine laufende Abfrage ab.

Der Knopf erscheint nur in der veröffentlichten Seite. Die lokal geöffnete
`index.html` hat keinen Zugang zu Claude und blendet ihn aus.

### Daten von BoardGameGeek holen

Die Seite selbst kann BGG nicht abfragen — veröffentlichte Artifact-Seiten
dürfen aus Sicherheitsgründen keine fremden Server ansprechen. Außerhalb des
Browsers geht es aber: `tools/bgg.mjs` holt die Daten und gibt sie in genau dem
Format aus, das die Seite einliest. Node 18 oder neuer, keine Abhängigkeiten.

```
node tools/bgg.mjs "Sky Team" "Hive Pocket"        einzelne Titel
node tools/bgg.mjs --user DeinBggName              ganze BGG-Sammlung (nur Besitz)
node tools/bgg.mjs --id 224517                     direkt über die BGG-Nummer
node tools/bgg.mjs --user X --out sammlung.json    in eine Datei schreiben
```

Die Ausgabe auf der Seite unter „Sammlung bearbeiten" → „Sicherung & Umzug"
einfügen und **„Dazu einspielen"** (ergänzt, überspringt Namensdubletten) oder
**„Sammlung ersetzen"** tippen.

Was von BGG übernommen wird:

| Feld der Seite | Quelle bei BGG |
| --- | --- |
| Spielerzahl | `minplayers` / `maxplayers` |
| Am besten zu | Umfrage „suggested_numplayers" — alle Spielerzahlen mit mindestens 70 % der Bestmarke |
| Dauer | `minplaytime` / `maxplaytime` |
| Anspruch | `averageweight` (BGG-Skala 1–5, dieselbe wie hier) |
| Stimmung | grob aus Kategorien und Mechaniken geraten |
| Notiz | bleibt leer (BGG-Beschreibungen sind lang und englisch) |

Die Stimmungen sind der schwache Teil — BGG kennt keine „Stimmung", die Regeln
in `MOOD_RULES` sind eine Heuristik. Nach dem Einspielen also durchgehen und
nachbessern; die Zahlen daneben stimmen dafür verlässlich.

BGG bittet um gemächliche Abfragen: das Skript wartet 1,5 Sekunden zwischen den
Aufrufen, holt Details in Zwanzigerpaketen und wiederholt geduldig, wenn BGG mit
202 („steht in der Warteschlange", bei Sammlungen üblich) oder 429 antwortet.
Eine große Sammlung braucht darum ein paar Minuten.

Warum nicht direkt im Browser: Die BGG-XML-API schickt keine CORS-Freigabe, eine
Webseite darf sie also gar nicht abfragen — deshalb der Umweg über ein Skript
außerhalb des Browsers.

### Wo die Sammlung liegt

Die Zeile über dem Formular sagt es jeweils:

- **Als veröffentlichte Seite** in der `db`-Ablage des Artifacts, also im Konto —
  Handy und Laptop sehen dieselbe Sammlung, Änderungen erscheinen auf offenen
  Seiten von selbst.
- **Als lokale Datei** (`index.html` im Browser geöffnet) im `localStorage`
  dieses Browsers. Umzug auf ein anderes Gerät: über „Sicherung & Umzug".

Ist beim ersten Öffnen noch nichts gespeichert, gilt die Ausgangssammlung aus
`DEFAULT_GAMES` in `index.html`. Diese Liste ist nur der Startpunkt — wer lieber
im Code arbeitet, kann sie dort weiterhin bearbeiten:

```js
{ name:"Scout", min:2, max:5, best:[3,5], dur:[15,25], weight:1.6,
  moods:["schnell","gruebeln"],
  note:"Kartenhand, die du nicht sortieren darfst. …" },
```

- `min`/`max` — Spielerzahl laut Schachtel
- `best` — die Spanne, in der es wirklich glänzt
- `dur` — Dauer von/bis in Minuten
- `weight` — 1 (Absacker) bis 5 (Kennerstück); daraus ergeben sich die drei Pips
- `moods` — Schlüssel aus dem Objekt `MOODS` darüber

Achtung: Sobald über die Seite etwas geändert wurde, gilt die gespeicherte
Sammlung. Änderungen an `DEFAULT_GAMES` schlagen dann erst nach
„Auf Ausgangssammlung zurücksetzen" durch.
