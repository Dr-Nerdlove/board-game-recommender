@AGENTS.md

# Hinweise für Claude

Die Projekthinweise stehen in **[`AGENTS.md`](AGENTS.md)** (oben eingebunden) —
das ist die werkzeugübergreifende Konvention, damit nicht jedes Programm eine
eigene Datei braucht. Bitte dort nachlesen, bevor du etwas änderst.
Ausführlicher und mit Begründungen: [`ENTWICKLUNG.md`](ENTWICKLUNG.md).

<!-- owner-rules v2: claude (CLAUDE.md) - begin -->

## Claude: Modelle und Nutzung

Der Besitzer zahlt einen Tarif mit Nutzungsgrenze, und je stärker ein Modell
ist, desto schneller verbraucht es diese Grenze. Die Kosten einer Aufgabe
hängen nicht von der Größe der Änderung ab, sondern von **der Zahl der Schritte
mal der Länge der Unterhaltung**: Jeder Schritt verarbeitet die ganze
Unterhaltung erneut.

### Das Modell wählen

Das **günstigste Modell nehmen, das die Aufgabe zuverlässig erledigt**. Stand
Ende 2026 gibt es drei Stufen; die Namen ändern sich mit der Zeit, das Prinzip
nicht. Die aktuell angebotenen Modelle prüfen (`/model`), statt dieser Liste zu
trauen, und wenn der Besitzer sagt, dass sich die Grenzen oder das Angebot
geändert haben, nach seinen Worten richten.

| Stufe | Wofür |
| --- | --- |
| Klein und schnell (jetzt: **Haiku**) | Nur für Subagenten: Dinge im Code finden, Protokolle und Testausgaben lesen, mechanische Änderungen über viele Dateien mit genauem Auftrag. Nicht für Entscheidungen, nicht für Gespräche mit dem Besitzer. |
| Mitte (jetzt: **Sonnet**) – **der Standard** | Kleine Korrekturen, Texte und Gestaltung, Dokumentation, Fragen dazu, wie etwas funktioniert oder was eine Meldung bedeutet, Datenanalysen und die Schritte einer Aufgabe, die Opus geplant hat. |
| Stärkste (jetzt: **Opus**; **Fable**, wo der Besitzer Zugang hat) | Ein Fehler mit unklarer Ursache, eine größere neue Funktion oder alles, was Sicherheit berührt, eine Entscheidung, die schwer rückgängig zu machen ist, ein Problem, an dem die mittlere Stufe zweimal gescheitert ist. |

- Die Sitzung läuft auf dem Modell, das der Besitzer gewählt hat; nur er kann
  wechseln (`/model`). **Das sagen**, wenn eine Aufgabe auf einer anderen Stufe
  besser aufgehoben wäre - hoch für etwas Schweres, runter, sobald der schwere
  Teil erledigt ist.
- Subagenten bekommen ihr Modell ausdrücklich gesetzt (`model: "haiku"`,
  `model: "sonnet"`), nie dem der Sitzung überlassen.

### Delegieren

- Auf der stärksten Stufe **die Schritte delegieren**. Alles mit mehreren
  Schritten - Ändern, Tests ausführen, Sabotageproben, Bildschirmfotos - geht
  an einen Subagenten auf der günstigsten Stufe, die es kann, mit kurzem
  Auftrag und der Anweisung, knapp zu berichten: was sich geändert hat, die
  Testergebnisse, sonst nichts. Das starke Modell plant, liest den Diff und den
  Bericht, entscheidet und committet.
- Das gilt auch für kleine Änderungen: Der kurze Kontext eines frischen
  Subagenten ist billiger, als wenn jeder Schritt eine lange Unterhaltung
  mitschleppt. Nicht darüber streiten, ob eine Aufgabe zu klein zum Abgeben
  ist.
- Einem Bericht nie blind trauen: den Diff lesen, bevor committet wird.

### Kosten niedrig halten

- **Bildschirmfotos** nur, wenn sich etwas Sichtbares geändert hat. Bilder sind
  teuer.
- **Eine lange Sitzung kostet bei jedem Schritt.** Ist ein Thema erledigt und
  committet, eine neue Sitzung für das nächste vorschlagen; alles
  Bewahrenswerte steht im Repository.
- Werkzeugausgaben kurz halten: Protokolle und Testläufe auf das Wesentliche
  filtern, statt sie ganz zu lesen.

<!-- owner-rules v2: claude (CLAUDE.md) - end -->
