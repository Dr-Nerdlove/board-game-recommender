# Änderungshistorie

Alle nennenswerten Änderungen stehen hier, neueste zuerst.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Nummerierung [Semantic Versioning](https://semver.org/lang/de/):
bei **X**.y.z ändert sich etwas Grundlegendes, bei x.**Y**.z kommt etwas dazu,
bei x.y.**Z** wird etwas repariert.

## [Unveröffentlicht]

## [1.2.2] – 2026-10-12

An der App selbst ändert sich nichts; 1.2.1 war bereits richtig signiert. Was
fehlte, war der Nachweis darüber.

### Behoben

- **Der Fingerabdruck der Signatur blieb leer.** Gelesen wurde er mit
  `keytool`, das nur die alte JAR-Signatur (v1) versteht — ab `minSdk 24`
  erzeugt Gradle die aber nicht mehr. Der Fehlschlag blieb unbemerkt, weil in
  einer Rohrleitung nur der Ausgang des letzten Glieds zählt und das
  nachfolgende `sed` mit leerer Eingabe zufrieden war. Jetzt liest `apksigner`
  den Abdruck, und `set -o pipefail` lässt solche Fehler nicht mehr
  durchrutschen.
- **Der Bauplan prüft die Signatur gegen einen erwarteten Fingerabdruck** und
  bricht ab, bevor etwas veröffentlicht wird, falls sie abweicht. Außerdem
  verifiziert er die Signatur der fertigen APK.

## [1.2.1] – 2026-10-12

### Behoben

- **Die App ließ sich nicht über die vorige Fassung aktualisieren.** Gebaut
  wurde bisher mit `assembleDebug`. Debug-Pakete werden mit dem Debug-Schlüssel
  signiert, der auf dem Entwicklerrechner liegt — GitHubs Maschinen sind bei
  jedem Lauf frisch, also legte Gradle jedes Mal einen neuen Zufallsschlüssel
  an. Für Android ist die Signatur der Ausweis einer App; mit neuem Ausweis ist
  es eine fremde App, und die Aktualisierung scheitert. Jede Fassung bis
  einschließlich 1.2.0 war davon betroffen.

  Gebaut wird jetzt mit `assembleRelease` und einem festen Schlüssel aus den
  GitHub-Geheimnissen. Der Fingerabdruck der Signatur steht im Bauprotokoll
  und bei jeder Veröffentlichung.

  **Einmalig nötig:** Die installierte App trägt noch einen der alten
  Zufallsausweise. Sie muss ein letztes Mal deinstalliert werden — **vorher
  die Sammlung sichern**, Deinstallieren löscht den Speicher der App mit.
  Ab 1.2.1 laufen Aktualisierungen dann normal durch.

## [1.2.0] – 2026-10-12

Der Kleinkram aus dem Rundgang.

### Hinzugefügt

- **Das Datum steht ausgeschrieben darunter.** Welches Format das Eingabefeld
  anzeigt, bestimmt allein die Systemsprache des Geräts — bei englischer
  Einstellung also `mm/dd/yyyy`. Die Seite kann das nicht ändern (`lang` am
  Feld wirkt nicht, nachgeprüft). Stattdessen steht der gewählte Tag jetzt
  darunter deutsch ausgeschrieben, samt Wochentag: „Montag, 12.10.2026 —
  heute". Damit ist egal, was das Feld selbst zeigt.
- **Knöpfe „Heute", „Gestern" und „Leeren"** am Datumsfeld. Nach einem
  Spieleabend will man meist genau eines davon.
- **Der Balken ist erklärt.** Unter „Passt heute" steht einmal, was er bedeutet
  und warum einer ocker ist — bisher stand das nirgends. Einmal, nicht auf
  jeder Karte.

## [1.1.0] – 2026-10-12

Ein Rundgang durch die App auf einem Handy hat fünf Stellen zutage gefördert,
an denen sie mehr Arbeit macht als nötig. Alle fünf sind hier erledigt.

### Geändert

- **Der Würfel zeigt sein Ergebnis oben.** Bisher landete man mitten in einer
  langen Liste — das gewürfelte Spiel stand auf Platz 6 von 19, und warum,
  stand nirgends. Jetzt rückt es an die erste Stelle, bekommt das Kennzeichen
  „Der Würfel sagt" und einen Knopf „Nochmal würfeln". Welches Spiel die beste
  Passung hat, steht weiterhin daneben.
- **„Runde beschreiben" klappt zu.** Zugeklappt bleibt die Zusammenfassung
  stehen, und der erste Vorschlag rückt von Pixel 1065 auf 489 — auf den ersten
  Bildschirm statt dahinter. Ob auf- oder zugeklappt, wird gemerkt.
- **Nur die ersten drei Treffer sind volle Karten**, der Rest je eine Zeile mit
  Name, Eckwerten und Grund. Antippen macht eine Karte daraus. Die Seite ist
  damit 3500 statt 6600 Pixel lang.
- **Die Regalliste ist halb so hoch.** „Ändern" und „Entfernen" standen unter
  jedem der 21 Einträge und sagten dort nichts; sie erscheinen jetzt an der
  Zeile, die man antippt.

### Hinzugefügt

- **Die Schriften stecken in der Datei.** Vorher kamen sie von Google: ohne
  Internet sah die App anders aus, obwohl sie „kein Netz nötig" verspricht.
  Jetzt gibt es keine einzige Anfrage mehr nach draußen. Kostet 120 KB,
  Lizenznachweis in `SCHRIFTEN.md`.
- Die Seite nennt ihre Fassung unten im Fuß.

### Behoben

- Sprungziele landeten hinter dem Band der Statusleiste.

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

[Unveröffentlicht]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/compare/v1.2.2...HEAD
[1.2.2]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.2
[1.2.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.1
[1.2.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.0
[1.1.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.1.0
[1.0.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.1
[1.0.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.0
