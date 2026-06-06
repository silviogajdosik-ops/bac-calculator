# bugovi.md — BAC Calculator

> Čitaj na početku svake sesije. Briši WIP markere tek kad je validate clean + pushed.

---

## ✅ Riješeno

- **v1.2.1** — `i18n.js` imao literal newline unutar single-quote stringa u `infoLimitsText` (HR i EN). `node --check` nije uhvatio, browser odbacio cijeli modul → app prikazivao samo header+nav, bez sadržaja. Fix: `\n` escape sekvence umjesto literal newline.

---

## 🔧 IN PROGRESS

*Nema otvorenih WIP zadataka.*

---

## 📋 Backlog / Ideje

*Još nema.*
