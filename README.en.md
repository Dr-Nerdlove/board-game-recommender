<p align="center">
  <img src="logo.png" width="160"
       alt="The app icon: a die, a magnifying glass, a meeple and hexes on a green-and-ochre disc">
</p>

# What shall we play tonight?

*[Deutsch](README.md)*

> **Note:** the app itself speaks German. Button and heading names are quoted
> here in German, the way they appear on screen, with the meaning in brackets.

**Which board game fits tonight's group?** You say how many of you there are,
what you are in the mood for, how much thinking you are up for and how much
time you have — the page sorts your collection by that and suggests what to put
on the table. Whatever does not fit is not dropped silently: it is listed below
with the reason.

An **Android app**, and underneath it a single HTML file: no build system, no
dependencies, no account and **not a single request to the internet** — even the
fonts are baked in. The same file opens in a browser by double-clicking it.

The starting collection is 21 games from my shelf. It is only a starting point:
games can be added, changed and removed on the page itself.

**On your phone:** [download the latest Android app](../../releases/latest).

**Just a quick look:** download [`index.html`](index.html) and open it in a
browser — the same application, no installation.

---

## As an app on your phone (Android)

1. On the phone, open the [latest release](../../releases/latest) and download
   the file `spieleabend-1.2.3.apk` (the number is the version).
2. Tap the downloaded file. The first time, Android asks whether apps from this
   source may be installed — confirm once.
3. Done. The app sits in the app drawer with its own icon.

A newer version installs over the old one and the collection survives.
**Exception:** anyone still on a version up to 1.2.0 has to uninstall once —
back up the collection first, uninstalling deletes it. The reason is in the
[changelog](CHANGELOG.md) under 1.2.1.

Every version gets its own release, which stays unchanged afterwards. What
changed is written there and in the [changelog](CHANGELOG.md). Which version you
are running is at the very bottom of the page.

The app contains everything and needs **no network**. Your collection lives in
the app's storage, on this phone.

**Backup — important before switching phones.** Under „Sammlung bearbeiten"
(edit collection) → „Sicherung & Umzug" (backup & moving):

- **„Text kopieren"** (copy as text) — always works. Paste it into a note or an
  e-mail.
- **„Als Datei sichern"** (save as file) — in the app, Android's share sheet
  opens and you choose where the `.json` file goes. „In Dateien speichern" (save
  to files) puts it in the Downloads folder, for example; mail, Drive or a chat
  work just as well. In a browser it lands in the Downloads folder directly.
- **„Datei einlesen"** (read a file) — on the new device, pick the backup, then
  „Sammlung ersetzen" (replace collection).

**Building a new version:** the *Actions* tab → *Android-App bauen* →
*Run workflow*, with the „veröffentlichen" (publish) box ticked. A few minutes
later the new release is there with its APK. Without the tick it is only a trial
build. Pushing a tag `v1.2.3` does the same thing. Nothing builds on its own — a
change to `index.html` does not trigger a build.

The app is signed with a fixed key of its own; the fingerprint is given with
every release. Because it does not come from the Play Store, Android still shows
a warning when installing.

---

## What the page does

- **Hard filters**: player count, time budget, difficulty, mood. Whatever drops
  out is listed below with the reason („nur bis 4" — up to 4 only; „dauert ab
  60 Min" — takes 60 minutes or more).
- **Teaching time**: games nobody knows yet can be marked „Muss noch erklärt
  werden" (needs explaining) in the form. The time budget then adds the
  surcharge, derived from the difficulty: easy +5, medium +10, demanding
  +20 minutes. A 45-minute medium-weight game therefore needs 65 minutes and
  falls out of a one-hour budget, with the reason given („mit Erklärung ab
  65 Min" — 65 minutes or more including the explanation). Once the game has
  been taught, untick it.
- **Ranking**: matches are sorted by fit. The best suggestion sits at the top in
  large type, and the bars show how well a game suits the group.
- **Sweet spot**: a game that plays best at exactly this player count gets a
  badge of its own.
- **„Würfel entscheiden"** (let the dice decide): when the discussion drags on,
  the button picks at random from the better half of the matches.
- **Last played**: every card has „Heute gespielt" (played today) at the bottom.
  Tap it once and the page remembers the date — tap again to undo. Older dates
  are entered by hand under „Sammlung bearbeiten" → „Ändern" (change). Games
  unplayed for a long time then rise in the ranking and recently played ones
  fall (sharply under two days), but they never disappear entirely: a rematch
  should stay findable. The chip **„Nur lange nicht Gespieltes"** (only
  long-unplayed) under „Zusätzlich" (additionally) shows only what has not been
  touched for over 90 days.
- The last settings are remembered in the browser.

## Keeping the collection up to date

At the bottom of the page: **„Sammlung bearbeiten"** (edit collection).

- **„Hinzufügen"** (add) — name, player count, duration, difficulty and at least
  one mood; „Glänzt bei" (shines at) is optional and means the player count at
  which the game really shines (the sweet-spot badge depends on it).
- **„Daten vorschlagen"** (suggest data) — type in just the title and Claude
  fills in the rest (see below).
- **„Ändern"** (change) — fills the same form with the existing game. It also
  holds **„Zuletzt gespielt"** (last played) as a date field: fill it in,
  correct it or clear it (empty means "never"). It only appears when changing —
  a freshly added game counts as never played. Next to it are five buttons for
  the common cases: *Heute* (today), *Gestern* (yesterday), *Vor einem Monat* (a
  month ago), *Vor einem halben Jahr* (six months ago), *Leeren* (clear). The
  two coarse ones are meant for games you played long ago but never entered here
  — without a date the page takes a game to be new, gives it a bonus and labels
  it "never played". The line under the field says in words what is entered.
  Dates in the future are rejected by the form.
  Beside it is the **„Muss noch erklärt werden"** (needs explaining) tickbox;
  games marked that way carry the note „erklären" (explain) in the list.
- **„Entfernen"** (remove) — immediate, with „Rückgängig" (undo) right next
  to it.
- **Searching and sorting** — a search field above the list, plus sorting by
  name, player count, duration, difficulty or „Lange nicht gespielt" (long
  unplayed). The heading „Sortieren nach" (sort by) sits above the row — it
  looks like the filters but does something else.
- **„Sicherung & Umzug"** (backup & moving) — the whole collection as text, to
  keep, to add to („Dazu einspielen" — merge in) or to replace; also the way in
  for BGG data (see below).

### Typing in just the title

Next to the name field, the published page has a **„Daten vorschlagen"** (suggest
data) button. It asks Claude for player count, best player count, duration,
difficulty, mood and a sentence of notes, and puts it all into the form —
nothing is saved until you tap „Ins Regal stellen" (put on the shelf). So the
suggestion is always open to correction, and that is exactly how it is meant:

- Claude knows many games, but not all of them, and editions differ. If it does
  not know a game for certain, it says so instead of inventing numbers. Even so:
  **give the values a quick look before saving.**
- The title is set to the official spelling if it differs — the line under the
  field says so when that happens.
- The query runs on your Claude usage; the first time, the page asks for
  permission. A second click on the button cancels a running query.

The button only appears in the published page. A locally opened `index.html` has
no access to Claude and hides it.

### Taking a single game from BGG (no terminal needed)

For a single game you do not need a script:

1. Under „Sammlung bearbeiten", type the title into the name field.
2. **„Auf BGG nachschlagen ↗"** (look up on BGG) opens the BGG search for that
   title in a new tab. Click the game there.
3. The BGG page has all the numbers you need at the top right: *Players*,
   *Playing Time*, *Weight* — and in the *Community* box, under "Best", the
   player count it plays best at.
4. Transfer the numbers into the form. The *Weight* (1–5) becomes the
   difficulty: up to 1.5 easy, 1.5–2.6 medium, from 2.6 demanding — the
   conversion is also written under the difficulty buttons.
5. Pick a mood, write a note, „Ins Regal stellen".

The page cannot query BGG itself: published Artifact pages may not talk to
foreign servers, and the BGG XML API does not allow browser access from other
sites anyway. Hence the detour via the link and the form.

### Where the collection lives

The line above the form says it:

- **In the app and in the browser**, on that particular device. Moving to
  another device: via „Sicherung & Umzug".
- **As a published Claude page**, additionally in the account — then phone and
  laptop see the same collection.

In both cases it is written to the device as well, so that something is there
offline too.

If nothing is stored yet on first opening, the starting collection from
`DEFAULT_GAMES` in `index.html` applies. That list is only a starting point —
anyone who prefers working in the code can keep editing it there:

```js
{ name:"Scout", min:2, max:5, best:[3,5], dur:[15,25], weight:1.6,
  moods:["schnell","gruebeln"],
  note:"Kartenhand, die du nicht sortieren darfst. …" },
```

- `min`/`max` — player count as printed on the box
- `best` — the range in which it really shines
- `dur` — duration from/to, in minutes
- `weight` — 1 (filler) to 5 (heavy); the three pips follow from this
- `moods` — keys from the `MOODS` object above it

Careful: as soon as anything has been changed through the page, the stored
collection applies. Changes to `DEFAULT_GAMES` then only take effect via
„Sicherung & Umzug" → „Sammlung ersetzen".

## Versions

Numbering follows [Semantic Versioning](https://semver.org/): in **X**.y.z
something fundamental changes, in x.**Y**.z something is added, in x.y.**Z**
something is fixed. What happened in which version is in the
[changelog](CHANGELOG.md); every version also has its own
[release](../../releases) with the matching APK.

## Fonts

The two bundled fonts are under the SIL Open Font License 1.1; attribution is in
[`SCHRIFTEN.md`](SCHRIFTEN.md).

## Licence

This project is under the **GNU General Public License, version 3 or any later
version** — the full text is in [`LICENSE`](LICENSE).

In short: you may use, pass on and change the application. If you pass it on —
changed or not — it must stay under the same licence and the source has to come
with it. There is no warranty.

Excepted are the **two bundled fonts**: they keep their own licence, the SIL
Open Font License 1.1 (see above). The GPL does not change that.
