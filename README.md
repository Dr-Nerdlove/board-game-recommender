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

Alle Spiele stehen in `index.html` in der Liste `GAMES`:

```js
{ name:"Scout", min:2, max:5, best:[3,5], dur:[15,25], weight:1.6,
  moods:["schnell","gruebeln"],
  note:"Kartenhand, die du nicht sortieren darfst. …" },
```

- `min`/`max` — Spielerzahl laut Schachtel
- `best` — die Spanne, in der es wirklich glänzt
- `dur` — Dauer von/bis in Minuten
- `weight` — 1 (Absacker) bis 5 (Kennerstück); die drei Pips auf der Karte
  ergeben sich daraus
- `moods` — Schlüssel aus dem Objekt `MOODS` darüber

Neues Spiel: eine Zeile anhängen, Datei speichern, fertig. Die Zahlen sind
Erfahrungswerte für diese Sammlung und dürfen gern nach dem nächsten Abend
korrigiert werden.
