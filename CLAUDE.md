# BAC Calculator — Project Reference

> Drži kratko. Svaki token koji trošiš na čitanje je token koji ne možeš koristiti za pisanje.

---

## Project Overview

Mobile-first PWA za računanje promila alkohola u krvi u realnom vremenu.
Više korisničkih profila, baza alkohola, Widmark formula s vremenskim tracking-om.

**Stack:** HTML + CSS + Vanilla JS ES Modules (no bundler)
**Data:** localStorage
**Target:** Mobile-first PWA (instalabilna, radi offline)
**Live:** `https://silviogajdosik-ops.github.io/bac-calculator/`
**Repo:** `https://github.com/silviogajdosik-ops/bac-calculator.git`
**Language:** HR/EN (i18n toggle)

---

## File Structure

```
index.html          ← entry point, sve ekrane renderira dinamički
css/style.css       ← mobile-first CSS, dark theme
js/main.js          ← router, screen manager, event glue
js/bac.js           ← Widmark formula engine, realno-vremenski BAC
js/profiles.js      ← CRUD profili (ime, težina, spol, dob)
js/session.js       ← aktivna sesija pijenja (piće + timestamp)
js/drinks-db.js     ← baza alkohola (~30 pića, brendovi, %)
js/i18n.js          ← HR/EN prijevodi, language toggle
manifest.json       ← PWA manifest
sw.js               ← Service Worker (offline cache)
icons/              ← PWA ikone (SVG/PNG)
CLAUDE.md           ← ovaj fajl, uvijek auto-čita
save_version.py     ← backup arhiva
```

---

## Working Rules

### 1. Pisanje/editiranje fajlova

- **Write tool** (novi fajl): ✅ uvijek radi
- **Edit tool** (izmjena postojećeg, >~500 linija): ⚠️ rizik od tihog truncationa

**Sigurno rješenje za edit velikih fajlova** — Python u bash:
```python
path = "/sessions/kind-quirky-carson/mnt/BAC/js/file.js"
with open(path, 'r') as f: content = f.read()
old = "tekst koji mijenjamo"
new  = "novi tekst"
assert old in content, f"Pattern not found!"
content = content.replace(old, new, 1)
with open(path, 'w') as f: f.write(content)
print("Done:", len(content.splitlines()), "lines")
```

- Nakon svakog edita: `tail -5 file` da provjeriš kraj
- JS syntax check: `node --check /tmp/check.js`

### 2. Git — uvijek PowerShell, nikad bash sandbox

```powershell
Set-Location "C:\Users\silvi\Desktop\Claude Projekti\BAC"
git add .; git commit -m "vX.Y.Z — opis"
git push origin main
```

Bash sandbox ima permission greške na .git/config — potvrđeno iz D&D projekta!

### 3. Cache busting

```js
const CACHE_VERSION = 'bac-v1.0.0'; // bumpa pri svakoj CSS/JS promjeni
```

SW cache: fajlovi navedeni bez `?v=` query stringa.
ES moduli: `import { fn } from './module.js?v=X.Y'` — bump pri svakoj promjeni.

### 4. Zapisuj odmah

Svaki arhitekturalni nalaz, bug, ili odluka → piši u CLAUDE.md odmah.

---

## BAC Formula (Widmark)

```
BAC(t) = Σ max(0, (A_i / (r × W)) - β × (t - t_i))
```

- `A_i` = alkohol u gramima za piće i (vol_ml × abv × 0.789)
- `r` = 0.7 (muški) / 0.6 (ženski)
- `W` = tjelesna težina u kg
- `β` = 0.15 ‰/h (eliminacija, fiksno za v1)
- `t - t_i` = sati od konzumacije pića i

Svako piće računa se **neovisno** (jednostavni model, dovoljan za fun app).
Apsorpcija se ne modelira u v1 (konzervativnija procjena, safer).

**Driving thresholds (HR zakon):**
- 0.00 ‰ — vozači počet., motori, profesionalni: NE VOZI
- 0.50 ‰ — opća granica: NE VOZI
- 0.50–1.50 ‰ — prekršaj
- >1.50 ‰ — kazneno djelo

---

## Data Model (localStorage)

| Key | Sadržaj |
|-----|---------|
| `bac_profiles` | `Profile[]` — svi profili |
| `bac_active_profile` | `string` — ID aktivnog profila |
| `bac_session_{profileId}` | `DrinkEntry[]` — aktivna sesija |
| `bac_language` | `'hr' \| 'en'` |

```ts
Profile {
  id: string,        // uuid
  name: string,
  weight: number,    // kg
  height: number,    // cm
  gender: 'male'|'female',
  birthYear: number,
  createdAt: number  // timestamp
}

DrinkEntry {
  id: string,
  drinkId: string,   // iz drinks-db ili 'custom'
  name: string,
  abv: number,       // 0-1 (npr. 0.05 za 5%)
  volumeMl: number,
  timestamp: number  // ms epoch
}
```

---

## Current State

**Branch:** `main`
**Zadnji commit:** `v1.2.0 — info modal, proširena baza alkohola`
**APP_VERSION:** `v1.2.0`

---

## Verzijska historija

| Verzija | Feature |
|---------|---------|
| v1.2.0  | Info modal (Widmark objašnjenje), baza proširena na ~45 pića (Osječko, Pelinkovac...) |
| v1.1.0  | Profile tap=select, time picker pri dodavanju pića, version display |
| v1.0.0  | Initial release: profili, BAC engine, alkohol DB, PWA |

---

## Brzi debugging checklist

1. App se ne učitava → `tail -20 index.html` (truncation?)
2. CSS nema efekta → bump SW cache version
3. Git greška → koristiti PowerShell, ne bash sandbox
4. JS error → `node --check js/file.js`
5. ES modul ne učitava → provjeri `?v=` query string u svim importima
6. BAC ne pada → provjeri timestamp format (ms, ne sekunde)
