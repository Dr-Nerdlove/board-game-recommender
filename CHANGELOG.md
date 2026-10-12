# Änderungshistorie

Alle nennenswerten Änderungen stehen hier, neueste zuerst.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Nummerierung [Semantic Versioning](https://semver.org/lang/de/):
bei **X**.y.z ändert sich etwas Grundlegendes, bei x.**Y**.z kommt etwas dazu,
bei x.y.**Z** wird etwas repariert.

## [Unveröffentlicht]

## [2.2.1] – 2026-10-12

### Behoben

- **„Als Datei sichern" tat in der App nichts** — und meldete trotzdem „Datei
  gespeichert". Der Grund: Das Fenster, in dem die App läuft, hat niemanden,
  der einen Download entgegennimmt; der Klick verpuffte. Die App schreibt die
  Datei jetzt selbst und reicht sie an Androids Teilen-Blatt weiter. Dort
  wählst du, wohin — „In Dateien speichern" legt sie in den Download-Ordner,
  genauso gehen Mail, Drive oder ein Chat. Bricht man ab, sagt die App das
  auch. Im Browser bleibt alles wie es war.

## [2.2.0] – 2026-10-12

### Geändert

- **Der Zeitfilter ist jetzt ein Balken.** Vorher vier gleich aussehende
  Kacheln im Quadrat — als wären es Stimmungen, obwohl Zeit als einziges Feld
  eine Reihenfolge hat. Jetzt eine durchgehende Leiste, von links nach rechts
  zu lesen: Egal · 30 · 60 · 90 Minuten, das „höchstens" steht in der
  Überschrift. Angetippt wird weiter, nicht geschoben: Bei vier Werten ist ein
  Tipp eine Bewegung und Ziehen sind drei, und „Egal" ist kein Punkt auf einer
  Zeitachse. Der Block ist dabei von 128 auf 77 Punkte geschrumpft, jede
  Fläche misst weiterhin 86 × 44 Punkte.

## [2.1.3] – 2026-10-12

### Geändert

- **„Sammlung bearbeiten" steht jetzt rechts.** Der Kopf liest sich von links
  nach rechts, der Knopf ist der Absprung ans Seitenende — er sitzt am Ende
  der Zeile.

### Behoben

- **Die Überschriften im Filter klebten auf ihren Knöpfen.** Gemeint waren
  8 Punkte Abstand, tatsächlich waren es null: Ein `<legend>` ist kein
  Flex-Element, der dafür vorgesehene Spaltenabstand greift bei ihm nicht.
  Jetzt stehen überall 12 Punkte, im Filter wie im Formular.
- **Unter „Zurücksetzen" und „Würfel entscheiden" war zu viel Luft.** Der
  Platz für die Navigationsleiste des Handys wurde doppelt gerechnet — einmal
  in der Position der Knopfzeile, einmal in ihrer Polsterung. Gemessen
  80 Punkte statt 46.

## [2.1.2] – 2026-10-12

### Behoben

- **Die drei Sechsecke im Symbol haben ihre hellen Umrisse zurück.** Beim
  Freistellen des Motivs waren sie mit weggefallen; auf dem grünen Teil war
  das linke Sechseck danach kaum noch zu ahnen. Jetzt stehen alle drei wieder
  klar auf der Scheibe.

## [2.1.1] – 2026-10-12

### Behoben

- **Das Symbol saß zu klein in seiner Scheibe.** Der Rand war viel zu breit,
  das Motiv wirkte herausgezoomt. Ursache: Android zeigt von einer Symbolebene
  nur die mittlere Fläche, und darauf hatte ich das Motiv gerechnet — das
  Baukastenwerkzeug legt die Ebenen aber ohnehin schon passend hinein, so dass
  verkleinert wurde. Das Motiv füllt die Scheibe jetzt so aus wie überall
  sonst; es ist rund die Hälfte größer als in 2.1.0.

## [2.1.0] – 2026-10-12

### Geändert

- **Das App-Symbol ist jetzt eine runde Scheibe.** Vorher saß das Motiv auf
  einer Kachel, die Android je nach Startbildschirm selbst zurechtschnitt —
  mal rund, mal mit abgerundeten Ecken, und an den Rändern blieb die alte
  Kachelform sichtbar. Die Marke ist nun von sich aus rund: links grün,
  rechts ocker, das Motiv mittig darauf, nichts angeschnitten.
- Das Logo oben auf der Seite ist dazu passend rund statt abgerundet-eckig.

## [2.0.1] – 2026-10-12

### Behoben

- **Die Stimmungen standen zweimal auf der Karte.** Einmal grün als Begründung
  („deshalb passt es"), einmal grau als Etikett („das sind seine Stimmungen").
  Die Etikettenzeile zeigt jetzt nur noch, was die Begründung nicht schon
  genannt hat — und entfällt ganz, wenn nichts übrig bleibt.
- Die Begründung zählt auf Deutsch auf: „A, B und C" statt „A und B und C".

## [2.0.0] – 2026-10-12

Das Projekt ist von nun an eine Android-App. Alles, was zum Heimserver gehörte,
ist raus.

### Entfernt

- **Der mitgelieferte Heimserver und die Windows-Skripte.** `spieleabend-server.mjs`,
  `windows-dienst.ps1`, die vier `dienst-*.cmd` und `start-windows.cmd` sind
  gelöscht, ebenso der Code in der Seite, der nach `api/sammlung` suchte. Beim
  Start der App entfällt damit eine Anfrage, die ohnehin immer ins Leere lief.
  Wer den Server noch braucht: Er steht in der Geschichte, `git log`.
- Von drei Speicherwegen bleiben zwei: **Gerät** und, nur in der
  veröffentlichten Claude-Fassung, **Konto**. Der Hinweis über dem Formular
  sagt „auf diesem Gerät" statt „in diesem Browser" — in einer App ist Browser
  das falsche Wort.

### Geändert

- **Das App-Symbol füllt die Maske aus.** Vorher saß das Logo klein in einem
  ockernen Ring; jetzt reicht es bis an den Rand. Nachgemessen: bei jeder
  üblichen Maskenform ist kein Punkt Hintergrund mehr zu sehen. Die Ecken des
  Motivs werden dafür beschnitten.
- **Eine Abstandsleiter statt sieben Einzelwerten.** Im Quelltext standen
  8, 10, 14, 16, 18, 22 und 26 Pixel ohne Zusammenhang — das ist der Grund für
  einen unruhigen Satzspiegel, nicht ein einzelner falscher Wert. Jetzt vier
  Stufen: 8 innerhalb einer Beschriftung, 12 in einer Karte, 20 zwischen
  Feldern, 24 zwischen Blöcken.
- **Der Zähler für die Personenanzahl steht mittig**, Minus und Plus
  gleich weit vom Rand. Das Wort „Personen" ist entfallen: Es stand zwischen
  Zahl und Plus und riss die Gruppe auseinander — die Beschriftung darüber
  fragt ohnehin „Wie viele seid ihr?".

### Behoben

- **Der Filterblock klappte sich wieder auf**, wenn man unmittelbar nach dem
  Zuklappen einen Chip antippte. `renderFilters()` erzwang den Klappzustand bei
  jedem Neuaufbau, während das `toggle`-Ereignis verzögert eintrifft. Jetzt wird
  er einmal beim Start gesetzt; danach führt das Element selbst Buch.

## [1.4.1] – 2026-10-12

Aufräumen am Layout. An der Funktion ändert sich nichts.

### Geändert

- **Der Kopfbereich hing rechts.** Titel, Absatz und der Knopf standen alle in
  einer Spalte neben dem Logo; links davon blieb eine leere Fläche. Jetzt teilt
  sich nur die Titelzeile den Platz mit dem Logo, alles andere nutzt die volle
  Breite.
- **Die Chips brechen nicht mehr unregelmäßig um.** Acht Stimmungen und vier
  Zeiten standen mal zu zweit nebeneinander, mal einzeln — der rechte Rand war
  ausgefranst. Jetzt ein Raster mit gleich breiten Feldern, im Formular
  genauso wie im Filter.
- **„Würfel entscheiden" nimmt die freie Breite.** Vorher klebten beide Knöpfe
  rechts und ließen die halbe Zeile leer.
- **Die Etiketten auf den Karten sind keine Pillen mehr.** Zwei Reihen Knöpfe,
  die keine waren, sind jetzt eine ruhige Zeile mit Trennpunkten.
- **„Spieler 2–5 Spieler"** auf den Karten sagte das Wort zweimal.
- Kürzere Einleitung, kürzere Erklärung unter „Passt heute", etwas größere
  Abstände zwischen den Chips.

## [1.4.0] – 2026-10-12

Ein Durchgang auf Bedienfreundlichkeit, mit Messungen statt Meinungen.

### Geändert

- **Die Spielerzahl ist ein Zähler statt zwölf Knöpfen.** Minus, Feld, Plus.
  Die Obergrenze von 12 war keine Entscheidung, sondern eine Schleife im
  Quelltext — jetzt sind es 99, und wer zu fünfzehnt ist, tippt die Zahl
  einfach ein. Die Reihe schrumpft dabei von 93 auf 66 Pixel.
- **Alles, was angetippt wird, ist mindestens 44 Pixel hoch.** Vorher waren
  72 von 112 Bedienelementen kleiner: die Chips 34, die kleinen Textknöpfe
  ebenfalls 34, die Sortierknöpfe 27 und die Zeile „N Spiele fallen heute
  raus" ganze 18. Android empfiehlt 48, Apple 44.
- **Die Knopfzeile bleibt am unteren Rand stehen, solange der Filter offen
  ist.** „Würfel entscheiden" begann vorher bei Pixel 882 von 915 — also
  unterhalb des Bildschirms, obwohl es der Hauptknopf der App ist.
- **„Heute gespielt" zieht die Karte nicht mehr weg.** Frisch Gespieltes
  rutscht in der Rangfolge nach unten; dadurch verschwand genau die Karte, die
  man gerade bestätigt hatte, und eine fremde rutschte unter den Finger. Jetzt
  wird nur diese eine Karte aufgefrischt und bleibt stehen. Die neue Rangfolge
  greift beim nächsten Würfeln oder Filterwechsel.

### Hinzugefügt

- **Mehrfachauswahl ist erkennbar.** „Worauf habt ihr Lust?" und „Wie viel
  Kopf?" tragen den Zusatz „mehrere möglich", ausgewählte Chips ein Häkchen.
  Vorher sahen „eins von" und „mehrere davon" identisch aus.
- **„Sammlung bearbeiten ↓" im Kopfbereich.** Die Sammlung beginnt rund drei
  Bildschirmhöhen weiter unten; von hier ist sie einen Tipp entfernt.

### Nicht geändert

Der Kontrast wurde durchgerechnet: Der schlechteste Wert liegt bei 6,29 — die
Norm verlangt 4,5. Hier war nichts zu tun.

## [1.3.0] – 2026-10-12

### Entfernt

- **Der Schalter „Dunkel/Hell".** Hell oder dunkel entscheidet jetzt allein das
  Gerät. In der Android-App reicht die WebView die Systemeinstellung durch: Sie
  leitet `prefers-color-scheme` aus dem Attribut `isLightTheme` des App-Themes
  ab, und Capacitors `Theme.AppCompat.DayNight` schaltet genau danach um. Stellt
  man das Handy während des Betriebs um, geht die Seite ohne Neustart mit.

  Nebenbei verschwindet damit die doppelte Farbpalette: Vorher stand jeder
  dunkle Wert zweimal im Quelltext — einmal für die Systemeinstellung, einmal
  für den Schalter. Jetzt nur noch einmal.

### Hinzugefügt

- `color-scheme: light dark` als Vermerk und in der Gestaltung. Damit richten
  sich auch Eingabefelder, Bildlaufleisten und der Kalender des Datumsfelds
  nach dem gewählten Schema statt hell zu bleiben.

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

[Unveröffentlicht]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/compare/v2.2.1...HEAD
[2.2.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.2.1
[2.2.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.2.0
[2.1.3]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.1.3
[2.1.2]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.1.2
[2.1.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.1.1
[2.1.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.1.0
[2.0.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.0.1
[2.0.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v2.0.0
[1.4.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.4.1
[1.4.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.4.0
[1.3.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.3.0
[1.2.2]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.2
[1.2.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.1
[1.2.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.2.0
[1.1.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.1.0
[1.0.1]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.1
[1.0.0]: https://github.com/Dr-Nerdlove/Board-Game-Recommender/releases/tag/v1.0.0
