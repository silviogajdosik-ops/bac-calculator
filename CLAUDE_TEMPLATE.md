# [Project Name] — Project Reference

> Drži kratko. Svaki token koji trošiš na čitanje je token koji ne možeš koristiti za pisanje.

---

## Project Overview

[Kratki opis projekta — 1-2 rečenice. Tech stack, platform, deployment.]

**Stack:** HTML + CSS + Vanilla JS (ili specificirati: React, Node, itd.)  
**Data:** localStorage / REST API / [specificirati]  
**Target:** Mobile-first PWA / desktop / [specificirati]  
**Live:** `https://[username].github.io/[repo]/`  
**Repo:** `https://github.com/[username]/[repo].git`

---

## File Structure

```
index.html          ← entry point
css/style.css       ← styles
js/main.js          ← main module
js/[feature].js     ← feature modules
sw.js               ← Service Worker (ako PWA)
manifest.json       ← PWA manifest (ako PWA)
CLAUDE.md           ← this file, always auto-loaded
```

---

## Working Rules

### 1. Pisanje/editiranje fajlova

- **Write tool** (novi fajl): ✅ uvijek radi
- **Edit tool** (izmjena postojećeg, >~500 linija): ⚠️ rizik od tihog truncationa

**Sigurno rješenje za edit velikih fajlova** — piši Python skript u bash:
```python
path = "/sessions/.../mnt/[repo]/file.js"
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
# Bash sandbox ima permission greške na .git/config — potvrđeno!
Set-Location "C:\Users\silvi\Desktop\[repo]"
git add .; git commit -m "vX.Y.Z — opis"
git push origin [branch]
```

Pushati automatski nakon svakog commita osim ako korisnik ne kaže drugačije.

### 3. Naming konvencija

- Git branch: `vX.Y-kratki-opis`
- Commit: `vX.Y.Z — opis promjena`
- Fiksno ime fajla — git branches čuvaju historiju, ne trebamo `file-v2.html`

### 4. ES Moduli (ako se koriste)

- Cache-busting: `import { fn } from './module.js?v=X.Y'`
- Bump query string u **svim** import izjavama i u index.html pri svakoj promjeni
- Nema `onclick=""` u HTML-u — svi event listeneri via `addEventListener`

### 5. Service Worker cache (ako PWA)

```js
const CACHE_VERSION = 'app-v1.0'; // bumpa pri svakoj CSS/JS promjeni
```

SW cache files navedeni bez `?v=` query stringa.

### 6. Zapisuj odmah

Svaki arhitekturalni nalaz, bug, ili odluka → piši u CLAUDE.md odmah.  
Token limit prekida razgovor bez upozorenja. Sljedeća sesija ne zna ništa.

---

## Data Model

| localStorage key | Sadržaj |
|-----------------|---------|
| `app_[key]` | [opis] |

---

## Current State

**Branch:** `[aktivna grana]`  
**Zadnji commit:** `vX.Y.Z — opis`  
**APP_VERSION:** `vX.Y.Z`

---

## Verzijska historija

| Verzija | Feature |
|---------|---------|
| v1.0.0  | Initial release |

---

## Brzi debugging checklist

1. App se ne učitava → `tail -20 index.html` (truncation?)
2. CSS nema efekta → bump SW cache version
3. Git greška → koristiti PowerShell, ne bash sandbox
4. JS error → `node --check /tmp/check.js`
5. ES modul ne učitava → provjeri `?v=` query string u svim importima

---

## Mobile-First PWA checklist (ako relevantno)

- [ ] `viewport` meta tag s `maximum-scale=1.0, user-scalable=no`
- [ ] `theme-color` meta tag
- [ ] `apple-mobile-web-app-capable` meta tag
- [ ] manifest.json (icons, display: standalone)
- [ ] Service Worker registriran u main.js
- [ ] Offline fallback u SW fetch handler
- [ ] Touch-friendly tap targets (min 44×44px)
- [ ] `-webkit-tap-highlight-color: transparent` na btn elementima
