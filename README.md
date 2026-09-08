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
- **Ändern** — füllt dasselbe Formular mit dem vorhandenen Spiel.
- **Entfernen** — sofort, mit „Rückgängig" direkt daneben.
- **Zurücksetzen** — holt die 21 Ausgangsspiele zurück (Sicherheitsklick).
- **Sicherung & Umzug** — die ganze Sammlung als Text zum Aufheben oder
  Einspielen.

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
