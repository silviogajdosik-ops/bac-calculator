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
    catCider: 'Cider',

    // Disclaimer
    disclaimerTitle: '⚠️ Upozorenje',
    disclaimerText: 'Ova aplikacija je isključivo za zabavu. Rezultati su procjena i mogu se značajno razlikovati od stvarnih vrijednosti. Nikada ne voziš ako si konzumirao/la alkohol. Za točne rezultate koristite alkomat. Aplikacija ne preuzima odgovornost za odluke korisnika.',
    disclaimerAccept: 'Razumijem',

    // Language toggle
    langToggle: 'EN',

    // Info modal
    infoTitle: 'Kako funkcionira?',
    infoHowTitle: 'Widmark formula',
    infoHowText: 'Aplikacija koristi Widmark formulu — standardni medicinski model za procjenu promila alkohola u krvi (BAC). Za svako piće izračunava se količina čistog alkohola u gramima, a zatim se dijeli s tjelesnom težinom i distribucijskim faktorom (spol). Alkohol se eliminira brzinom ~0.15 ‰ na sat.',
    infoFactorsTitle: 'Što utječe na rezultat?',
    infoFactorsText: 'Tjelesna težina — teži ljudi imaju veći volumen krvi pa je BAC niži za isto piće. Spol — žene imaju manji udio vode u tijelu (faktor 0.6 vs 0.7). Vrijeme — alkohol se metabolizira tijekom vremena. Hrana, umor i lijekovi nisu modelirani.',
    infoFormulaTitle: 'Formula',
    infoFormulaText: 'BAC = (grame alkohola) ÷ (tjelesna težina × faktor spola) − (0.15 × sati)',
    infoAlcGramsTitle: 'Grame alkohola',
    infoAlcGramsText: 'ml pića × % alkohola × 0.789 (gustoća etanola)',
    infoLimitsTitle: 'Granice za vožnju (HR)',
    infoLimitsText: '0.00 ‰ — početnici, motori, profesionalni\n0.50 ‰ — opća granica\n0.50–1.50 ‰ — prekršaj (kazna + bodovi)\n>1.50 ‰ — kazneno djelo',
    infoDisclaimerTitle: '⚠️ Važno upozorenje',
    infoDisclaimerText: 'Rezultati su procjena. Stvarni BAC može se razlikovati ovisno o hrani, lijekovima, individualnom metabolizmu i drugim faktorima. Nikada ne voziš nakon konzumacije alkohola. Ova aplikacija nije zamjena za alkomat.',
    infoEuTitle: '🌍 Granice vožnje u Europi',
    infoEuNote: 'Izvor: ETSC 2025. Prikazane su standardne granice. Posebne kategorije (početnici, profesionalni vozači) mogu imati strože granice.',
    infoClose: 'Razumijem',

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
    countryLabel: 'Zemlja vožnje',
    countryPickerTitle: 'Odaberi zemlju',
    searchCountry: 'Pretraži zemlju...',
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
    catCider: 'Cider',

    // Disclaimer
    disclaimerTitle: '⚠️ Disclaimer',
    disclaimerText: 'This app is for entertainment purposes only. Results are estimates and may differ significantly from actual values. Never drive after consuming alcohol. Use a breathalyzer for accurate results. This app assumes no responsibility for user decisions.',
    disclaimerAccept: 'I Understand',

    // Language toggle
    langToggle: 'HR',

    // Info modal
    infoTitle: 'How does it work?',
    infoHowTitle: 'Widmark Formula',
    infoHowText: 'The app uses the Widmark formula — a standard medical model for estimating blood alcohol content (BAC). For each drink, the grams of pure alcohol are calculated, then divided by body weight and a gender distribution factor. Alcohol is eliminated at ~0.15 ‰ per hour.',
    infoFactorsTitle: 'What affects the result?',
    infoFactorsText: 'Body weight — heavier people have more blood volume, so BAC is lower for the same drink. Gender — women have a lower body water ratio (factor 0.6 vs 0.7). Time — alcohol metabolizes over time. Food, fatigue and medications are not modeled.',
    infoFormulaTitle: 'Formula',
    infoFormulaText: 'BAC = (grams of alcohol) ÷ (body weight × gender factor) − (0.15 × hours)',
    infoAlcGramsTitle: 'Grams of alcohol',
    infoAlcGramsText: 'ml of drink × alcohol % × 0.789 (ethanol density)',
    infoLimitsTitle: 'Driving limits (HR)',
    infoLimitsText: '0.00 ‰ — beginners, motorcycles, professional\n0.50 ‰ — general limit\n0.50–1.50 ‰ — infraction (fine + points)\n>1.50 ‰ — criminal offense',
    infoDisclaimerTitle: '⚠️ Important warning',
    infoDisclaimerText: 'Results are estimates. Actual BAC may differ depending on food, medications, individual metabolism and other factors. Never drive after consuming alcohol. This app is not a substitute for a breathalyzer.',
    infoEuTitle: '🌍 Driving Limits in Europe',
    infoEuNote: 'Source: ETSC 2025. Standard limits shown. Special categories (novice, professional drivers) may have stricter limits.',
    infoClose: 'Got it',

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
    countryLabel: 'Country (driving)',
    countryPickerTitle: 'Select country',
    searchCountry: 'Search country...',
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
