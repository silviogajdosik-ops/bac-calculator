/**
 * session.js — upravljanje aktivnom sesijom pijenja
 * Svaki profil ima svoju sesiju u localStorage.
 */

const SESSION_KEY_PREFIX = 'bac_session_';

/** Generiraj jednostavan ID */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Ključ za sesiju određenog profila
 * @param {string} profileId
 * @returns {string}
 */
function sessionKey(profileId) {
  return SESSION_KEY_PREFIX + profileId;
}

/**
 * Dohvati sve unose pića za profil
 * @param {string} profileId
 * @returns {object[]} lista DrinkEntry objekata
 */
export function getSessionDrinks(profileId) {
  try {
    return JSON.parse(localStorage.getItem(sessionKey(profileId))) || [];
  } catch {
    return [];
  }
}

/**
 * Spremi sesiju u localStorage
 * @param {string} profileId
 * @param {object[]} drinks
 */
function saveSession(profileId, drinks) {
  localStorage.setItem(sessionKey(profileId), JSON.stringify(drinks));
}

/**
 * Dodaj piće u sesiju
 *
 * @param {string} profileId
 * @param {object} drinkData — {
 *   drinkId: string,   // iz baze ili 'custom'
 *   name: string,
 *   abv: number,       // 0–1
 *   volumeMl: number,
 *   timestamp?: number // ms, default: Date.now()
 * }
 * @returns {object} dodani unos
 */
export function addDrinkToSession(profileId, drinkData) {
  const drinks = getSessionDrinks(profileId);

  const entry = {
    id: generateId(),
    drinkId: drinkData.drinkId || 'custom',
    name: drinkData.name,
    abv: Number(drinkData.abv),
    volumeMl: Number(drinkData.volumeMl),
    timestamp: drinkData.timestamp || Date.now(),
  };

  drinks.push(entry);
  saveSession(profileId, drinks);
  return entry;
}

/**
 * Ukloni piće iz sesije po ID-u
 * @param {string} profileId
 * @param {string} entryId
 * @returns {boolean}
 */
export function removeDrinkFromSession(profileId, entryId) {
  const drinks = getSessionDrinks(profileId);
  const filtered = drinks.filter(d => d.id !== entryId);
  if (filtered.length === drinks.length) return false;
  saveSession(profileId, filtered);
  return true;
}

/**
 * Očisti cijelu sesiju profila
 * @param {string} profileId
 */
export function clearSession(profileId) {
  localStorage.removeItem(sessionKey(profileId));
}

/**
 * Automatski očisti stara pića iz sesije (starija od maxHours)
 * Pozivati pri učitavanju sesije da se ne nakupljaju stari unosi.
 *
 * @param {string} profileId
 * @param {number} maxHours — default 24h
 */
export function pruneOldDrinks(profileId, maxHours = 24) {
  const drinks = getSessionDrinks(profileId);
  const cutoff = Date.now() - maxHours * 3_600_000;
  const fresh = drinks.filter(d => d.timestamp >= cutoff);
  if (fresh.length !== drinks.length) {
    saveSession(profileId, fresh);
  }
  return fresh;
}

/**
 * Ukupno grama alkohola u sesiji
 * @param {object[]} drinks
 * @returns {number}
 */
export function totalAlcoholGrams(drinks) {
  return drinks.reduce((sum, d) => sum + d.volumeMl * d.abv * 0.789, 0);
}

/**
 * Formatiraj vremensku razliku za prikaz
 * @param {number} timestamp — ms
 * @param {string} lang
 * @returns {string}
 */
export function formatDrinkTime(timestamp, lang = 'hr') {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);

  if (diffMin < 1) return lang === 'hr' ? 'Upravo sada' : 'Just now';
  if (diffMin < 60) return `${diffMin} ${lang === 'hr' ? 'min.' : 'min'} ago`;
  return `${diffH} h ago`;
}
