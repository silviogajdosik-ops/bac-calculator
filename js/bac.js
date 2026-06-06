/**
 * bac.js — BAC (Blood Alcohol Content) kalkulator
 *
 * Koristi Widmark formulu s vremenskim tracking-om:
 * BAC(t) = Σ max(0, (A_i / (r × W)) - β × (t - t_i))
 *
 * Svako piće računa se neovisno.
 * Alkohol u gramima: vol_ml × abv × 0.789 (gustoća etanola)
 */

/** Eliminacijska stopa alkohola (‰/h) */
export const ELIMINATION_RATE = 0.15;

/** Distribucijski faktor po spolu */
export const DISTRIBUTION_RATIO = {
  male: 0.70,
  female: 0.60,
};

/**
 * Izračunaj grame alkohola za jedno piće
 * @param {number} volumeMl
 * @param {number} abv — 0–1 (0.05 = 5%)
 * @returns {number} grama alkohola
 */
export function calcAlcoholGrams(volumeMl, abv) {
  return volumeMl * abv * 0.789;
}

/**
 * Izračunaj trenutni BAC (‰) za profil i listu pića
 *
 * @param {object} profile — { weight: number, gender: 'male'|'female' }
 * @param {Array}  drinks  — [{ abv, volumeMl, timestamp }]
 * @param {number} nowMs   — trenutno vrijeme u ms (default: Date.now())
 * @returns {number} BAC u ‰ (promile), zaokružen na 2 decimale
 */
export function calcBAC(profile, drinks, nowMs = Date.now()) {
  if (!profile || !drinks || drinks.length === 0) return 0;

  const r = DISTRIBUTION_RATIO[profile.gender] ?? 0.68;
  const W = profile.weight; // kg
  const nowH = nowMs / 3_600_000; // pretvori u sate

  let totalBAC = 0;

  for (const drink of drinks) {
    const drinkH = drink.timestamp / 3_600_000;
    const elapsed = nowH - drinkH; // sati od konzumacije

    if (elapsed < 0) continue; // piće u budućnosti, preskoči

    const A = calcAlcoholGrams(drink.volumeMl, drink.abv);
    const peakBAC = A / (r * W); // BAC odmah nakon apsorpcije (‰)
    const remaining = peakBAC - ELIMINATION_RATE * elapsed;

    if (remaining > 0) {
      totalBAC += remaining;
    }
  }

  return Math.max(0, Math.round(totalBAC * 100) / 100);
}

/**
 * Sati do BAC = 0 (ili do nekog praga)
 *
 * @param {object} profile
 * @param {Array}  drinks
 * @param {number} targetBAC — ‰, default 0
 * @param {number} nowMs
 * @returns {number} sati do cilja (0 ako je već ispod)
 */
export function hoursUntilBAC(profile, drinks, targetBAC = 0, nowMs = Date.now()) {
  const current = calcBAC(profile, drinks, nowMs);
  if (current <= targetBAC) return 0;

  // Linearna aproksimacija: (current - target) / elimination_rate
  // Nije egzaktna jer svako piće ima vlastitu krivulju, ali dovoljno točna za prikaz
  const hoursRaw = (current - targetBAC) / ELIMINATION_RATE;
  return Math.ceil(hoursRaw * 10) / 10; // zaokruži gore na 1 decimalu
}

/**
 * Vozačka procjena za Hrvatsku
 *
 * HR zakon:
 * - 0.00 ‰ — početnici, vozači motora, profesionalni
 * - 0.50 ‰ — opća granica
 *
 * @param {number} bac — u ‰
 * @param {object} profile — { birthYear? } (za mlađe vozače)
 * @returns {{ status: 'safe'|'warning'|'danger', level: number }}
 */
export function getDrivingStatus(bac, profile = {}) {
  // Mlađi od 24 g. ili "početnik" → strožija granica 0.0
  // Za sad bez provjere staža, samo po godinama
  const age = profile.birthYear ? new Date().getFullYear() - profile.birthYear : null;
  const strictLimit = age !== null && age < 24;

  if (bac === 0) {
    return { status: 'safe', level: 0 };
  }

  if (strictLimit) {
    // Bilo koji BAC > 0 nije OK
    return { status: 'danger', level: bac < 0.5 ? 1 : bac < 1.5 ? 2 : 3 };
  }

  if (bac < 0.5) {
    return { status: 'warning', level: 1 }; // ispod opće granice, ali nije 0
  }

  if (bac < 1.5) {
    return { status: 'danger', level: 2 }; // prekršaj
  }

  return { status: 'danger', level: 3 }; // kazneno djelo
}

/**
 * Formate BAC za prikaz
 * @param {number} bac
 * @returns {string} npr. "0.85 ‰"
 */
export function formatBAC(bac) {
  return bac.toFixed(2) + ' ‰';
}

/**
 * Formate sate do trijeznosti za prikaz
 * @param {number} hours
 * @param {string} lang
 * @returns {string}
 */
export function formatSoberTime(hours, lang = 'hr') {
  if (hours <= 0) return lang === 'hr' ? 'Trijezan/trijezna' : 'Sober';

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (lang === 'hr') {
    if (h === 0) return `još ${m} min`;
    if (m === 0) return `još ${h} h`;
    return `još ${h} h ${m} min`;
  } else {
    if (h === 0) return `${m} min left`;
    if (m === 0) return `${h} h left`;
    return `${h} h ${m} min left`;
  }
}
