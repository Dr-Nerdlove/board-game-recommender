# Was spielen wir heute?

**Welches Brettspiel passt zur heutigen Runde?** Du sagst, wie viele ihr seid,
worauf ihr Lust habt, wie viel Kopf ihr habt und wie viel Zeit — die Seite
sortiert deine Sammlung danach durch und schlägt vor, was heute auf den Tisch
kommt. Was nicht passt, verschwindet nicht kommentarlos, sondern steht unten mit
Begründung.

![Die Seite mit fünf Spielern und Party-Stimmung](screenshot.png)

Eine einzelne HTML-Datei, ohne Baukasten, ohne Abhängigkeiten, ohne Konto und
**ohne eine einzige Anfrage ans Internet** — die Schriften stecken mit drin.
Doppelklick genügt. Wer die Sammlung auf allen Geräten gleich haben
will, startet den mitgelieferten kleinen Server (Node, eine Datei) im Heimnetz —
für Windows liegen fertige Skripte dabei, die ihn als Hintergrunddienst
einrichten.

Die Ausgangssammlung sind 21 Spiele aus meinem Regal. Sie ist nur der
Startpunkt: Spiele lassen sich auf der Seite selbst hinzufügen, ändern und
entfernen.

**Kurz ausprobieren:** [`index.html`](index.html) herunterladen und im Browser
öffnen.

**Aufs Handy:** [neueste Android-App herunterladen](../../releases/latest) —
fertige APK, kein Server nötig.

---

## Als App auf dem Handy (Android)

1. Am Handy die [neueste Veröffentlichung](../../releases/latest) öffnen und
   die Datei `spieleabend-1.2.3.apk` herunterladen (die Nummer ist die Fassung).
2. Die heruntergeladene Datei antippen. Android fragt beim ersten Mal, ob Apps
   aus dieser Quelle installiert werden dürfen — einmalig bestätigen.
3. Fertig. Die App liegt im App-Menü, mit eigenem Symbol.

Eine neuere Fassung installiert sich über die alte, die Sammlung bleibt dabei
erhalten. **Ausnahme:** Wer noch eine Fassung bis 1.2.0 installiert hat, muss
einmalig deinstallieren — vorher die Sammlung sichern, Deinstallieren löscht sie
mit. Der Grund steht in der [Änderungshistorie](CHANGELOG.md) unter 1.2.1.

Jede Fassung bekommt eine eigene Veröffentlichung, die danach unverändert
bleibt. Was sich geändert hat, steht dort und in der
[Änderungshistorie](CHANGELOG.md). Welche Fassung bei dir läuft, steht ganz
unten auf der Seite.

Die App enthält die Seite vollständig und braucht **kein Netz und keinen
Server**. Deine Sammlung liegt im Speicher der App, auf diesem Handy.

**Sicherung — wichtig vor einem Handy-Wechsel.** Unter „Sammlung bearbeiten" →
„Sicherung & Umzug":

- **Text kopieren** — klappt immer. In eine Notiz oder E-Mail einfügen.
- **Als Datei sichern** — legt eine `.json`-Datei ab, wo dein Handy Downloads
  speichert. Falls nichts passiert: den Textweg nehmen.
- **Datei einlesen** — auf dem neuen Gerät die Sicherung auswählen, dann
  „Sammlung ersetzen".

**Neue Fassung bauen:** Im Reiter *Actions* → *APK bauen* → *Run workflow*.
Nach ein paar Minuten hängt die neue Datei an derselben Veröffentlichung. Das
passiert auch automatisch, sobald sich `index.html` ändert.

Die App ist mit einem Entwicklerschlüssel signiert — für den Eigengebrauch
genügt das. Android zeigt beim Installieren deshalb einen Hinweis. Käme eine
Fassung mit anderem Schlüssel, müsste die alte vorher deinstalliert werden.

---

## Benutzen

`index.html` im Browser öffnen — das genügt für den Anfang: keine Installation,
kein Server, kein Internet nötig (nur die Schriften kommen aus dem Netz, sonst
greifen Systemschriften). Läuft auch auf dem Handy, die Filter sind
Antippknöpfe statt Dropdowns.

Soll die Sammlung auf allen Geräten dieselbe sein, siehe „Auf dem eigenen
Windows-PC hosten".

## Was die Seite macht

- **Harte Filter**: Spielerzahl, Zeitbudget, Anspruch, Stimmung. Was rausfällt,
  steht unten mit Begründung („nur bis 4", „dauert ab 60 Min").
- **Erklärzeit**: Spiele, die noch niemand kann, lassen sich im Formular als
  „Muss noch erklärt werden" markieren. Das Zeitbudget rechnet den Aufschlag
  dann mit — abgeleitet aus dem Anspruch: leicht +5, mittel +10,
  anspruchsvoll +20 Minuten. Ein 45-Minuten-Kennerspiel braucht damit
  65 Minuten und fällt aus einer Stunde heraus, mit Begründung
  („mit Erklärung ab 65 Min"). Ist das Spiel eingeführt, Haken raus.
- **Rangfolge**: Treffer werden nach Passung sortiert. Der beste Vorschlag steht
  oben groß, die Balken zeigen, wie gut ein Spiel zur Runde passt.
- **Glanzform**: Ein Spiel, das bei genau dieser Spielerzahl am besten läuft,
  bekommt ein eigenes Kennzeichen.
- **Würfel entscheiden**: Wenn die Diskussion zu lange dauert, zieht der Knopf
  zufällig aus der oberen Hälfte der Treffer.
- **Zuletzt gespielt**: Auf jeder Karte sitzt unten „Heute gespielt". Einmal
  antippen, und die Seite merkt sich das Datum — nochmal antippen nimmt es
  zurück. Ältere Termine trägst du unter „Sammlung bearbeiten" → „Ändern" von
  Hand nach. Lange Ungespieltes steigt danach in der Rangfolge, gerade Gespieltes
  fällt (unter zwei Tagen deutlich), verschwindet aber nie ganz: eine Revanche
  soll auffindbar bleiben. Der Chip **„Lange nicht gespielt"** in der Filterreihe
  „Regal" zeigt nur, was seit über 90 Tagen nicht dran war.
- Die letzte Einstellung wird im Browser gemerkt.

## Auf dem eigenen Windows-PC hosten

**Nur nötig, wenn mehrere Geräte dieselbe Sammlung teilen sollen.** Wer die
Android-App nutzt, braucht diesen Teil nicht.

Zwei Wege, je nachdem, was du brauchst.

### A) Nur die Seite ausliefern (IIS, ohne Installation)

Der Webserver steckt schon in Windows. Er liefert Dateien aus — mehr nicht,
also **ohne** gemeinsame Sammlung über mehrere Geräte.

1. Start → „Windows-Features aktivieren oder deaktivieren" → Haken bei
   **Internetinformationsdienste** → OK.
2. Ordner `C:\inetpub\wwwroot\spieleabend` anlegen, `index.html` hineinkopieren.
3. Aufrufen unter `http://localhost/spieleabend`, im Heimnetz unter
   `http://<IP-des-PCs>/spieleabend`.

Der Unterordner ist Absicht: `wwwroot` ist die Wurzel, jeder Unterordner darin
ist eine eigene Adresse. `\notizen`, `\fotos` und so weiter liegen daneben,
ohne sich zu stören. Andere Programme mit eigenem Port (Jellyfin auf 8096) sind
davon ohnehin unberührt — IIS nutzt Port 80.

### B) Sammlung auf allen Geräten gleich (mitgelieferter Server)

`spieleabend-server.mjs` liefert die Seite aus **und** verwahrt die Sammlung in
`sammlung.json`. Handy, Tablet und PC sehen dieselbe Liste; wer etwas ändert,
schreibt sie für alle.

1. **Node installieren** — in PowerShell `winget install OpenJS.NodeJS.LTS`,
   oder den Installer von nodejs.org. Einmalig.
2. Alle Dateien aus dem Projekt in einen Ordner legen, zum Beispiel
   `C:\Spieleabend` — `index.html`, `spieleabend-server.mjs`,
   `windows-dienst.ps1` und die drei `.cmd`-Dateien gehören zusammen.
3. **`dienst-einrichten.cmd` doppelklicken** und die Nachfrage nach
   Administratorrechten bestätigen. Das Fenster meldet, ob der Server läuft, und
   nennt die Adressen — danach kann es zu.
4. Im Browser `http://localhost:8099`, am Handy `http://<IP-des-PCs>:8099` oder
   `http://<PC-Name>:8099`.

Das Einrichtungsfenster listet mehrere Adressen — das ist normal: der Server
lauscht auf allen Netzwerkkarten des PCs, und Windows zählt VPN-, WSL- und
Hyper-V-Karten mit. Gemeint ist die Adresse der Karte, über die der PC ins
Netz geht (im Fenster markiert, meist `192.168.…`). Adressen mit `169.254.…`
gehören zu Karten ohne Verbindung und werden gar nicht erst angezeigt.

Praktischer als die IP ist der Rechnername: `http://<PC-Name>:8099` bleibt
gleich, auch wenn der Router dem PC irgendwann eine andere IP gibt. Wer lieber
bei der IP bleibt, vergibt sie im Router fest (DHCP-Reservierung).

Das Einrichten legt eine Aufgabe an, die beim Hochfahren startet — **ohne
Fenster, ohne Anmeldung, mit automatischem Neustart nach einem Absturz** — und
gibt Port 8099 in der Firewall für das private Netz frei.

Über dem Formular steht dann „Sammlung liegt auf deinem Server". Wechselst du
auf einem Gerät zurück in den Tab, holt die Seite die aktuelle Liste nach.

**Neu starten:** `dienst-neustart.cmd` doppelklicken. Nötig, wenn du
`spieleabend-server.mjs` ausgetauscht hast — für eine neue `index.html` reicht
das Neuladen der Seite. Das Skript beendet den Dienst, wartet, bis der Port
wirklich frei ist, startet neu und meldet, ob der Server wieder antwortet.

**Protokoll:** Der Server schreibt neben der Sammlung eine Datei
`spieleabend.log` — Start, Portkonflikte, fehlgeschlagene Sicherungen, Abstürze.
Als Hintergrunddienst sieht man ja keine Konsole; wenn etwas nicht läuft, steht
hier warum. Die Datei wird bei 200 KB automatisch gekürzt.

**Läuft er?** `dienst-status.cmd` doppelklicken — prüft zuerst, ob der Server
antwortet, und zeigt dann Zustand und letzten Lauf der Aufgabe. Für den Blick
auf die Aufgabe holt sich die Datei Administratorrechte: die Aufgabe läuft unter
dem Systemkonto und ist ohne diese Rechte nicht sichtbar.

**Wo steckt er im System?** Es ist eine *geplante Aufgabe*, kein Windows-Dienst
— im Task-Manager also nicht unter „Dienste" zu finden, sondern unter
**Details** als `node.exe` mit Benutzer `SYSTEM` (Spalte „Befehlszeile"
einblenden, dann steht `spieleabend-server.mjs` dabei). Verwaltet wird sie in
der Aufgabenplanung: Windows-Taste + R → `taskschd.msc` →
Aufgabenplanungsbibliothek → **Spieleabend**. Dort lässt sie sich auch
deaktivieren. Ein im Task-Manager beendeter Prozess gilt als Absturz und wird
nach einer Minute neu gestartet.

**Wieder loswerden:** `dienst-entfernen.cmd`. Entfernt Aufgabe und
Firewall-Regel; `sammlung.json` bleibt liegen.

**Anderer Port:** beim Einrichten mitgeben, zum Beispiel

```
powershell -ExecutionPolicy Bypass -File windows-dienst.ps1 -Port 8100
```

8099 ist frei gewählt und stört Jellyfin auf 8096 nicht.

**`start-windows.cmd`** startet den Server stattdessen im Vordergrund, mit
Fenster und sichtbaren Meldungen. Gut zum Ausprobieren oder zur Fehlersuche —
für den Dauerbetrieb ist der Dienst gedacht.

**Wenn es nicht klappt:** Fast immer liegt es an einem von zwei Dingen. Der Port
ist belegt (anderen Port wählen, siehe oben), oder Node wurde nur für den
eigenen Benutzer installiert — der Dienst läuft unter dem Systemkonto und findet
es dann nicht; in dem Fall Node für alle Benutzer neu installieren. Das
Einrichtungsfenster weist auf beides hin.

**Sicherung:** die ganze Sammlung steht in `sammlung.json`. Datei kopieren
genügt.

Der Server sichert außerdem selbst: Vor jedem Überschreiben legt er den bisherigen
Stand in `sicherungen/` ab und hält dort die letzten zehn vor. Identische
Speichervorgänge erzeugen keine neue Kopie. Ging etwas schief — etwa ein
versehentliches „Sammlung ersetzen" —, kopierst du die passende Datei aus
`sicherungen/` über `sammlung.json` und lädst die Seite neu. Ein Neustart des
Dienstes ist nicht nötig, der Server liest bei jeder Abfrage frisch von der
Platte.

### Aufs Handy legen

Die Seite bringt ein eigenes Symbol mit. Es entsteht aus
`Board-Game-Recommender_Logo.png`; die vier `icon-*.png` sind daraus verkleinert,
der Rand ist durchsichtig. So landet sie auf dem Startbildschirm:

- **iPhone:** Seite in Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm".
- **Android:** Seite in Chrome öffnen → Menü (drei Punkte) → „Zum Startbildschirm
  hinzufügen".

Darunter steht dann „Spieleabend". Getippt öffnet sie sich ohne Adressleiste,
also wie eine App.

Sie **ist** aber keine App: Es ist eine Verknüpfung, die weiterhin den Server im
Heimnetz braucht. Offline funktioniert sie nicht — das setzte HTTPS voraus, und
über `http://192.168.…` sperren Browser die dafür nötige Technik. Für den
Spieleabend am eigenen Tisch spielt das keine Rolle.

### Was wo gespeichert wird

| | veröffentlichte Seite | eigener Server (B) | nur Dateien (A oder Doppelklick) |
| --- | --- | --- | --- |
| Sammlung | im Claude-Konto | in `sammlung.json` auf dem PC | im jeweiligen Browser |
| Auf allen Geräten gleich | ja | ja, im Heimnetz | nein |
| „Daten vorschlagen" | ja | nein | nein |
| Erreichbar | überall | Heimnetz | nur dieser Rechner |

Die Sammlung umziehen: unter „Sammlung bearbeiten" → „Sicherung & Umzug" den
Text kopieren und auf der anderen Seite einfügen, dann „Sammlung ersetzen".

**Nicht am Router nach außen freigeben.** Weder die Seite noch der Server haben
eine Anmeldung: wer die Adresse erreicht, darf die Sammlung ändern. Im Heimnetz
ist das in Ordnung, im offenen Internet nicht. Soll die Seite von unterwegs
erreichbar sein, führt der sichere Weg über ein VPN ins Heimnetz (etwa
WireGuard oder Tailscale), nicht über eine Portfreigabe.

## Sammlung pflegen

Unten auf der Seite: **Sammlung bearbeiten**.

- **Hinzufügen** — Name, Spielerzahl, Dauer, Anspruch und mindestens eine
  Stimmung; „Am besten zu" ist optional und meint die Spielerzahl, bei der das
  Spiel wirklich glänzt (davon hängt das Glanzform-Kennzeichen ab).
- **Daten vorschlagen** — nur den Titel eintippen, den Rest füllt Claude aus
  (siehe unten).
- **Ändern** — füllt dasselbe Formular mit dem vorhandenen Spiel. Dort steht auch
  **„Zuletzt gespielt"** als Datumsfeld: nachtragen, korrigieren oder leeren
  (leer heißt „noch nie"). Datumsangaben in der Zukunft weist das Formular ab.
  Daneben der Haken **„Muss noch erklärt werden"**; markierte Spiele tragen in
  der Liste den Vermerk „erklären".
- **Entfernen** — sofort, mit „Rückgängig" direkt daneben.
- **Zurücksetzen** — holt die 21 Ausgangsspiele zurück (Sicherheitsklick).
- **Suchen und Sortieren** — Suchfeld über der Liste, dazu Sortierung nach Name,
  Spielerzahl, Dauer, Anspruch oder „Lange nicht gespielt".
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

### Ein einzelnes Spiel von BGG übernehmen (ohne Terminal)

Für ein einzelnes Spiel braucht es kein Skript:

1. Unter „Sammlung bearbeiten" den Titel ins Namensfeld tippen.
2. **„Auf BGG nachschlagen ↗"** öffnet die BGG-Suche zu diesem Titel in einem
   neuen Tab. Dort das Spiel anklicken.
3. Auf der BGG-Seite stehen oben rechts alle nötigen Zahlen: *Players*,
   *Playing Time*, *Weight* — und im Kasten *Community* unter „Best" die
   Spielerzahl, bei der es am besten läuft.
4. Zahlen ins Formular übertragen. Das *Weight* (1–5) wird zum Anspruch:
   bis 1,5 leicht, 1,5–2,6 mittel, ab 2,6 anspruchsvoll — die Umrechnung steht
   auch unter den Anspruch-Knöpfen.
5. Stimmung wählen, Notiz schreiben, „Ins Regal stellen".

Die Seite kann BGG nicht selbst abfragen: veröffentlichte Artifact-Seiten dürfen
keine fremden Server ansprechen, und die BGG-XML-API erlaubt Browser-Zugriffe von
fremden Seiten ohnehin nicht. Darum der Weg über den Link und das Formular.

### Wo die Sammlung liegt

Die Zeile über dem Formular sagt es jeweils:

- **Als veröffentlichte Seite** in der `db`-Ablage des Artifacts, also im Konto —
  Handy und Laptop sehen dieselbe Sammlung, Änderungen erscheinen auf offenen
  Seiten von selbst.
- **Hinter dem mitgelieferten Server** in `sammlung.json` auf dem eigenen PC.
  Die Seite erkennt ihn daran, dass `api/sammlung` antwortet, und benutzt dann
  ihn; beim Zurückkehren auf den Tab holt sie den Stand der anderen Geräte nach.
- **Als lokale Datei** (`index.html` im Browser geöffnet) im `localStorage`
  dieses Browsers. Umzug auf ein anderes Gerät: über „Sicherung & Umzug".

Die Reihenfolge ist fest: eigener Server, sonst Konto, sonst Browser. Der
Browser bekommt in allen Fällen eine Kopie, damit die Seite auch offline etwas
anzeigen kann.

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

## Fassungen

Die Nummerierung folgt [Semantic Versioning](https://semver.org/lang/de/): bei
**X**.y.z ändert sich etwas Grundlegendes, bei x.**Y**.z kommt etwas dazu, bei
x.y.**Z** wird etwas repariert. Was in welcher Fassung passiert ist, steht in
der [Änderungshistorie](CHANGELOG.md); jede Fassung hat außerdem eine eigene
[Veröffentlichung](../../releases) mit der passenden APK.

## Schriften

Die beiden mitgelieferten Schriften stehen unter der SIL Open Font License 1.1;
Nachweis in [`SCHRIFTEN.md`](SCHRIFTEN.md).

## Nutzungsrechte

Für dieses Projekt ist bewusst noch keine Lizenz vergeben. Damit gilt das
normale Urheberrecht: Der Quelltext ist einsehbar, eine Weiterverwendung ist
ohne Absprache aber nicht gestattet. Wenn du es verwenden möchtest, frag einfach.
