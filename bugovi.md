# bugovi.md — BAC Calculator

> Čitaj na početku svake sesije. Briši WIP markere tek kad je validate clean + pushed.

---

## ✅ Riješeno

- **v1.2.1** — `i18n.js` imao literal newline unutar single-quote stringa u `infoLimitsText` (HR i EN). `node --check` nije uhvatio, browser odbacio cijeli modul → app prikazivao samo header+nav, bez sadržaja. Fix: `\n` escape sekvence umjesto literal newline.

- **v1.4.1** — SW version mismatch bug: stari SW (bac-v1.3.0) servirao stari cached `index.html` (s referencom `main.js?v=1.3.0`), ali SW cache miss → network fetch vraćao novi v1.4.0 kod → crash jer v1.4.0 tražio DOM elemente koji ne postoje u starom HTML-u (`country-strip` itd.).
  Fix:
  1. Null-safe event listeneri: `if ($('country-strip')) { ... }`
  2. Null guard u `renderCountryStrip()`: `if (!$('country-flag')) return;`
  3. SW: `ignoreSearch: true` kao fallback u fetch handleru
  4. SW ASSETS: verzioniranje s `?v=1.4.1` query stringom
  Lekcija: svaki novi DOM element koji dobija event listener mora biti null-checked u DOMContentLoaded.

---

## 🔧 IN PROGRESS

*Nema otvorenih WIP zadataka.*

---

## 📋 Backlog / Ideje

*Još nema.*
