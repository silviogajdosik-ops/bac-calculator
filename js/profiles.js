/**
 * profiles.js — upravljanje korisničkim profilima
 * Persistence: localStorage ('bac_profiles', 'bac_active_profile')
 */

const PROFILES_KEY = 'bac_profiles';
const ACTIVE_KEY = 'bac_active_profile';

/** Generiraj jednostavan UUID */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Učitaj sve profile iz localStorage
 * @returns {object[]}
 */
export function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Spremi sve profile u localStorage
 * @param {object[]} profiles
 */
function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

/**
 * Dohvati profil po ID-u
 * @param {string} id
 * @returns {object|undefined}
 */
export function getProfileById(id) {
  return getProfiles().find(p => p.id === id);
}

/**
 * Dohvati aktivan profil
 * @returns {object|null}
 */
export function getActiveProfile() {
  const id = localStorage.getItem(ACTIVE_KEY);
  if (!id) return null;
  return getProfileById(id) || null;
}

/**
 * Postavi aktivan profil
 * @param {string} id
 */
export function setActiveProfile(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

/**
 * Kreiraj novi profil
 * @param {object} data — { name, weight, height, gender, birthYear }
 * @returns {object} kreirani profil
 */
export function createProfile(data) {
  const profiles = getProfiles();
  const profile = {
    id: generateId(),
    name: data.name.trim(),
    weight: Number(data.weight),
    height: Number(data.height),
    gender: data.gender,
    birthYear: Number(data.birthYear),
    createdAt: Date.now(),
  };
  profiles.push(profile);
  saveProfiles(profiles);

  // Automatski postavi kao aktivan ako je prvi
  if (profiles.length === 1) {
    setActiveProfile(profile.id);
  }

  return profile;
}

/**
 * Ažuriraj profil
 * @param {string} id
 * @param {object} data — parcijalni podaci
 * @returns {object|null} ažurirani profil ili null
 */
export function updateProfile(id, data) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) return null;

  profiles[idx] = {
    ...profiles[idx],
    name: data.name?.trim() ?? profiles[idx].name,
    weight: data.weight !== undefined ? Number(data.weight) : profiles[idx].weight,
    height: data.height !== undefined ? Number(data.height) : profiles[idx].height,
    gender: data.gender ?? profiles[idx].gender,
    birthYear: data.birthYear !== undefined ? Number(data.birthYear) : profiles[idx].birthYear,
    updatedAt: Date.now(),
  };

  saveProfiles(profiles);
  return profiles[idx];
}

/**
 * Obriši profil
 * @param {string} id
 * @returns {boolean}
 */
export function deleteProfile(id) {
  const profiles = getProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  if (filtered.length === profiles.length) return false;

  saveProfiles(filtered);

  // Ako smo obrisali aktivan profil, postavi prvog ili null
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    if (filtered.length > 0) {
      setActiveProfile(filtered[0].id);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }

  return true;
}

/**
 * Validiraj podatke profila
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateProfile(data) {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!data.name || !data.name.trim()) {
    errors.name = 'errNameRequired';
  }

  const weight = Number(data.weight);
  if (isNaN(weight) || weight < 30 || weight > 300) {
    errors.weight = 'errWeightInvalid';
  }

  const height = Number(data.height);
  if (isNaN(height) || height < 100 || height > 250) {
    errors.height = 'errHeightInvalid';
  }

  const year = Number(data.birthYear);
  if (isNaN(year) || year < 1920 || year > currentYear - 16) {
    errors.birthYear = 'errBirthYearInvalid';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
