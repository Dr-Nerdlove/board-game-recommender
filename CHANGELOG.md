# Änderungshistorie

Alle nennenswerten Änderungen stehen hier, neueste zuerst.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Nummerierung [Semantic Versioning](https://semver.org/lang/de/):
bei **X**.y.z ändert sich etwas Grundlegendes, bei x.**Y**.z kommt etwas dazu,
bei x.y.**Z** wird etwas repariert.

## [Unveröffentlicht]

## [1.0.1] – 2026-10-12

### Behoben

- Beim Scrollen lief der Inhalt weiterhin sichtbar unter die Statusleiste und
  die Navigationsleiste. 1.0.0 hatte nur den Abstand beim Start gesetzt — das
  ist etwas anderes. Oben und unten liegt jetzt je ein mitlaufendes Band in
  der Seitenfarbe, hinter dem der Inhalt verschwindet.

## [1.0.0] – 2026-10-12

Erste gezählte Fassung. Sie fasst zusammen, was bis hierher entstanden ist.

### Enthalten

- **Empfehlung.** Spielerzahl, Stimmung, Anspruch und Zeit eingeben, die
  Sammlung wird bewertet und geordnet. Was durchfällt, steht mit Begründung
  darunter statt einfach zu verschwinden.
- **Erklärzeit.** Auf Wunsch wird die Zeit zum Erklären eingerechnet —
  abgestuft nach Anspruch, nicht pauschal.
- **Sammlung bearbeiten.** Spiele anlegen, ändern, entfernen; Suche und
  Sortierung; „zuletzt gespielt" pflegen, damit frisch Gespieltes nach unten
  rutscht.
- **Titel genügt.** In der Claude-Fassung füllt sich der Rest der Angaben
  selbst; sonst führt ein Knopf zur Suche auf BoardGameGeek.
- **Drei Speicherwege.** Eigener Server, Claude-Konto oder Browser — in dieser
  Reihenfolge, der erste Treffer gewinnt. Welcher greift, steht sichtbar da.
- **Sicherung und Umzug.** Sammlung als Text kopieren, als Datei sichern und
  wieder einlesen.
- **Android-App.** Die Seite als installierbare App, ohne Netz und ohne Server.
- **Heimserver für Windows** (optional, für mehrere Geräte): Hintergrunddienst,
  Sicherungskopien, Protokoll, Skripte zum Einrichten, Prüfen, Neustarten und
  Entfernen.

### Behoben

- Unter Android 15 zeichnete die App unter der Statusleiste hindurch; die
  Überschrift lag hinter der Uhr. Die Seite hält jetzt Abstand zu Status- und
  Navigationsleiste.
- Das App-Symbol wurde von Androids runder Maske beschnitten. Vorder- und
  Hintergrund liegen nun als eigene Ebenen vor.

[Unveröffentlicht]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.1
[1.0.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.0
