# BAC Calculator — Project Reference

> Drži kratko. Svaki token koji trošiš na čitanje je token koji ne možeš koristiti za pisanje.

---

## Session Start Protokol

**Uvijek čitati na početku sesije:**
1. Ovaj fajl (CLAUDE.md) — auto-učitan
2. `bugovi.md` — otvoreni bugovi i WIP markeri
3. `CLAUDE_LESSONS_LEARNED.md` — samo pri pokretanju novog projekta ili nepoznatom tipu greške

**Pravilo pisanja odmah:** Svaki nalaz (bug, odluka, architectural note) → piši u fajl odmah pri otkrivanju. Token limit prekida razgovor bez upozorenja. Sljedeća sesija ne zna ništa osim što je zapisano.

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
js/drinks-db.js     ← baza alkohola (~45 pića, brendovi, %)
js/i18n.js          ← HR/EN prijevodi, language toggle
manifest.json       ← PWA manifest
sw.js               ← Service Worker (offline cache)
icons/              ← PWA ikone (SVG/PNG)
CLAUDE.md           ← ovaj fajl, uvijek auto-čita
bugovi.md           ← otvoreni bugovi + WIP markeri, čitaj na session start
CLAUDE_LESSONS_LEARNED.md ← lekcije iz prethodnih projekata (ne čitati automatski)
CLAUDE_TEMPLATE.md  ← template za novi projekt
save_version.py     ← backup arhiva
```

---

## Working Rules

### 1. Pisanje/editiranje fajlova

- **Write tool** (novi fajl): ✅ uvijek radi
- **Edit tool** (izmjena postojećeg, >~100 linija): ⚠️ rizik od tihog truncationa — KORISTITI PYTHON

**Sigurno rješenje za edit — Python u bash:**
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

### 2. JS validacija — NIKAD `node --check`, uvijek dynamic import

`node --check` laže — prolazi čak i na fajlovima sa syntax errorima (potvrđeno: i18n.js v1.2.0 imao literal newline u stringu, `node --check` rekao OK, browser pukao).

```bash
node --input-type=module << 'EOF'
import('/sessions/kind-quirky-carson/mnt/BAC/js/file.js')
  .then(() => console.log('OK'))
  .catch(e => { console.error('FAIL:', e.message); process.exit(1); });
EOF
```

### 3. Git — uvijek PowerShell, nikad bash sandbox

```powershell
Set-Location "C:\Users\silvi\Desktop\Claude Projekti\BAC"
git add .; git commit -m "vX.Y.Z — opis"
git push origin main
```

Bash sandbox ima permission greške na .git/config — potvrđeno!

### 4. Cache busting — OBAVEZNO pri svakom commitu

Svaka promjena JS/CSS zahtijeva bump na **3 mjesta**:

```js
// 1. sw.js
const CACHE_VERSION = 'bac-v1.2.2';

// 2. index.html
<script type="module" src="js/main.js?v=1.2.2"></script>

// 3. main.js — svi importi
import { t } from './i18n.js?v=1.2.2';
import { ... } from './profiles.js?v=1.2.2';
import { ... } from './session.js?v=1.2.2';
import { ... } from './bac.js?v=1.2.2';
import { ... } from './drinks-db.js?v=1.2.2';
```

Bez ovoga browser servira cached module iz prethodne verzije čak i nakon SW update-a.

### 5. Redoslijed implementacije (SLIJEDI OVO)

1. Napiši u `bugovi.md`: `🔧 IN PROGRESS: opis + fajlovi`
2. Implementiraj (uvijek Python, nikad Edit tool na >100L fajlovima)
3. Validiraj (dynamic import, ne `node --check`)
4. Briši WIP marker iz `bugovi.md`
5. Update CLAUDE.md current state
6. Git commit + push

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
  weight: number