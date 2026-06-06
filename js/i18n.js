/**
 * i18n.js — internacionalizacija (HR/EN)
 */

export const TRANSLATIONS = {
  hr: {
    // App
    appName: 'Promilator',
    appTagline: 'Kalkulator promila alkohola',

    // Navigation
    navHome: 'Početna',
    navProfiles: 'Profili',
    navDrink: 'Dodaj piće',
    navHistory: 'Sesija',

    // Screens
    screenHome: 'Početna',
    screenProfiles: 'Profili',
    screenAddDrink: 'Dodaj piće',
    screenSession: 'Moja sesija',
    screenNewProfile: 'Novi profil',
    screenEditProfile: 'Uredi profil',

    // Profile form
    profileName: 'Ime',
    profileWeight: 'Težina (kg)',
    profileHeight: 'Visina (cm)',
    profileGender: 'Spol',
    profileBirthYear: 'Godina rođenja',
    genderMale: 'Muški',
    genderFemale: 'Ženski',
    btnSave: 'Spremi',
    btnCancel: 'Odustani',
    btnDelete: 'Obriši',
    btnEdit: 'Uredi',
    btnAdd: 'Dodaj',
    btnClose: 'Zatvori',
    btnClearSession: 'Očisti sesiju',
    btnAddProfile: 'Novi profil',
    btnNewProfile: '+ Novi profil',

    // Profile validation
    errNameRequired: 'Ime je obavezno',
    errWeightInvalid: 'Težina mora biti između 30 i 300 kg',
    errHeightInvalid: 'Visina mora biti između 100 i 250 cm',
    errBirthYearInvalid: 'Godina mora biti između 1920 i danas',

    // BAC display
    currentBAC: 'Trenutni promili',
    bacUnit: '‰',
    soberIn: 'Trijezan za',
    alreadySober: 'Trijezan/trijezna',
    canDrive: 'Možeš voziti',
    cannotDrive: 'NE VOZI',
    strictLimit: 'Stroga granica (0.00 ‰)',
    drinkCount: 'Pića',
    totalAlcohol: 'Ukupno alkohola',
    grams: 'g',

    // Driving status
    drivingOk: '✅ Možeš voziti',
    drivingWarning: '⚠️ Ispod granice, ali ne vozi!',
    drivingDanger: '🚫 NE VOZI — Prekršaj',
    drivingCrime: '🚫 NE VOZI — Kazneno djelo',

    // Drinks
    searchDrinks: 'Pretraži piće...',
    customDrink: 'Vlastito piće',
    drinkName: 'Naziv pića',
    drinkABV: 'Alkohol (%)',
    drinkVolume: 'Količina (ml)',
    btnAddDrink: 'Dodaj u sesiju',
    noDrinks: 'Nema pića u sesiji',
    justNow: 'Upravo sada',
    minutesAgo: 'min. ago',
    hoursAgo: 'h ago',

    // Categories
    catAll: 'Sve',
    catBeer: 'Pivo',
    catWine: 'Vino',
    catSpirits: 'Žestoko',
    catCocktail: 'Koktel',

    // Disclaimer
    disclaimerTitle: '⚠️ Upozorenje',
    disclaimerText: 'Ova aplikacija je isključivo za zabavu. Rezultati su procjena i mogu se značajno razlikovati od stvarnih vrijednosti. Nikada ne voziš ako si konzumirao/la alkohol. Za točne rezultate koristite alkomat. Aplikacija ne preuzima odgovornost za odluke korisnika.',
    disclaimerAccept: 'Razumijem',

    // Language toggle
    langToggle: 'EN',

    // Empty states
    noProfiles: 'Nema profila. Dodaj novi!',
    noSession: 'Nisi dodao/la nijedano piće.',

    // Confirm dialogs
    confirmDeleteProfile: 'Obrisati profil?',
    confirmClearSession: 'Očistiti sesiju?',
    confirmDeleteDrink: 'Ukloniti piće iz sesije?',
    yes: 'Da',
    no: 'Ne',

    // Time labels
    timeLabel: 'Dodano',
    activeProfile: 'Aktivan profil',
    switchProfile: 'Promijeni profil',
  },

  en: {
    // App
    appName: 'Promilator',
    appTagline: 'Blood Alcohol Calculator',

    // Navigation
    navHome: 'Home',
    navProfiles: 'Profiles',
    navDrink: 'Add Drink',
    navHistory: 'Session',

    // Screens
    screenHome: 'Home',
    screenProfiles: 'Profiles',
    screenAddDrink: 'Add Drink',
    screenSession: 'My Session',
    screenNewProfile: 'New Profile',
    screenEditProfile: 'Edit Profile',

    // Profile form
    profileName: 'Name',
    profileWeight: 'Weight (kg)',
    profileHeight: 'Height (cm)',
    profileGender: 'Gender',
    profileBirthYear: 'Year of Birth',
    genderMale: 'Male',
    genderFemale: 'Female',
    btnSave: 'Save',
    btnCancel: 'Cancel',
    btnDelete: 'Delete',
    btnEdit: 'Edit',
    btnAdd: 'Add',
    btnClose: 'Close',
    btnClearSession: 'Clear Session',
    btnAddProfile: 'New Profile',
    btnNewProfile: '+ New Profile',

    // Profile validation
    errNameRequired: 'Name is required',
    errWeightInvalid: 'Weight must be between 30 and 300 kg',
    errHeightInvalid: 'Height must be between 100 and 250 cm',
    errBirthYearInvalid: 'Year must be between 1920 and today',

    // BAC display
    currentBAC: 'Current BAC',
    bacUnit: '‰',
    soberIn: 'Sober in',
    alreadySober: 'Sober',
    canDrive: 'Safe to drive',
    cannotDrive: 'DO NOT DRIVE',
    strictLimit: 'Strict limit (0.00 ‰)',
    drinkCount: 'Drinks',
    totalAlcohol: 'Total alcohol',
    grams: 'g',

    // Driving status
    drivingOk: '✅ Safe to drive',
    drivingWarning: '⚠️ Under limit, but don\'t drive!',
    drivingDanger: '🚫 DO NOT DRIVE — Infraction',
    drivingCrime: '🚫 DO NOT DRIVE — Criminal offense',

    // Drinks
    searchDrinks: 'Search drinks...',
    customDrink: 'Custom drink',
    drinkName: 'Drink name',
    drinkABV: 'Alcohol (%)',
    drinkVolume: 'Volume (ml)',
    btnAddDrink: 'Add to session',
    noDrinks: 'No drinks in session',
    justNow: 'Just now',
    minutesAgo: 'min ago',
    hoursAgo: 'h ago',

    // Categories
    catAll: 'All',
    catBeer: 'Beer',
    catWine: 'Wine',
    catSpirits: 'Spirits',
    catCocktail: 'Cocktail',

    // Disclaimer
    disclaimerTitle: '⚠️ Disclaimer',
    disclaimerText: 'This app is for entertainment purposes only. Results are estimates and may differ significantly from actual values. Never drive after consuming alcohol. Use a breathalyzer for accurate results. This app assumes no responsibility for user decisions.',
    disclaimerAccept: 'I Understand',

    // Language toggle
    langToggle: 'HR',

    // Empty states
    noProfiles: 'No profiles. Add one!',
    noSession: 'You haven\'t added any drinks.',

    // Confirm dialogs
    confirmDeleteProfile: 'Delete profile?',
    confirmClearSession: 'Clear session?',
    confirmDeleteDrink: 'Remove drink from session?',
    yes: 'Yes',
    no: 'No',

    // Time labels
    timeLabel: 'Added',
    activeProfile: 'Active profile',
    switchProfile: 'Switch profile',
  },
};

/** Trenutni jezik — singleton */
let _lang = localStorage.getItem('bac_language') || 'hr';

/**
 * Dohvati prijevod po ključu
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  return TRANSLATIONS[_lang][key] ?? TRANSLATIONS['hr'][key] ?? key;
}

/**
 * Trenutni jezik
 * @returns {'hr'|'en'}
 */
export function getLang() {
  return _lang;
}

/**
 * Postavi jezik
 * @param {'hr'|'en'} lang
 */
export function setLang(lang) {
  if (lang !== 'hr' && lang !== 'en') return;
  _lang = lang;
  localStorage.setItem('bac_language', lang);
}

/**
 * Toggle između HR i EN
 * @returns {'hr'|'en'} novi jezik
 */
export function toggleLang() {
  setLang(_lang === 'hr' ? 'en' : 'hr');
  return _lang;
}
