/**
 * main.js — BAC Calculator entry point
 * Router, screen manager, event glue
 * v1.0.0
 */

import { t, getLang, toggleLang } from './i18n.js?v=1.4.0';
import { getProfiles, getActiveProfile, getProfileById, setActiveProfile, createProfile, updateProfile, deleteProfile, validateProfile } from './profiles.js?v=1.4.0';
import { getSessionDrinks, addDrinkToSession, removeDrinkFromSession, clearSession, pruneOldDrinks, totalAlcoholGrams, formatDrinkTime } from './session.js?v=1.4.0';
import { calcBAC, hoursUntilBAC, getDrivingStatus, formatBAC, formatSoberTime } from './bac.js?v=1.4.0';
import { DRINKS_DB, DRINK_CATEGORIES, getDrinksByCategory, searchDrinks } from './drinks-db.js?v=1.4.0';

const APP_VERSION = 'v1.4.0';

// EU BAC limits — izvor: ETSC 2025 + public sources
const EU_BAC_LIMITS = [
  {
    bac: '0.0 ‰',
    color: 'danger',
    hr: 'Bjelorusija, Češka, Mađarska, Rumunjska, Slovačka',
    en: 'Belarus, Czech Republic, Hungary, Romania, Slovakia',
  },
  {
    bac: '0.1 ‰',
    color: 'danger',
    hr: 'Albanija',
    en: 'Albania',
  },
  {
    bac: '0.2 ‰',
    color: 'warn',
    hr: 'Estonija, Norveška, Poljska, Švedska, Ukrajna',
    en: 'Estonia, Norway, Poland, Sweden, Ukraine',
  },
  {
    bac: '0.3 ‰',
    color: 'warn',
    hr: 'BiH, Crna Gora, Moldavija, Rusija, Srbija',
    en: 'Bosnia & Herz., Moldova, Montenegro, Russia, Serbia',
  },
  {
    bac: '0.4 ‰',
    color: 'warn',
    hr: 'Litva',
    en: 'Lithuania',
  },
  {
    bac: '0.5 ‰',
    color: 'ok',
    hr: 'Austrija, Belgija, Bugarska, Cipar, Danska, Finska, Francuska, Grčka, Hrvatska, Irska, Island, Italija, Kosovo, Latvija, Lihtenštajn, Luksemburg, Malta, Nj. Makedonija, Nizozemska, Njemačka, Portugal, Slovenija, Škotska, Španjolska, Švicarska, Turska',
    en: 'Austria, Belgium, Bulgaria, Croatia, Cyprus, Denmark, Finland, France, Germany, Greece, Iceland, Ireland, Italy, Kosovo, Latvia, Liechtenstein, Luxembourg, Malta, Netherlands, N. Macedonia, Portugal, Scotland, Slovenia, Spain, Switzerland, Turkey',
  },
  {
    bac: '0.8 ‰',
    color: 'ok',
    hr: 'UK (Engl., Wales, Sj. Irska)',
    en: 'UK (England, Wales, N. Ireland)',
  },
];

// Popis europskih zemalja s BAC granicama (ETSC 2025 + public sources)
const COUNTRIES = [
  { id: 'al', flag: '🇦🇱', hr: 'Albanija',        en: 'Albania',               bac: 0.1 },
  { id: 'at', flag: '🇦🇹', hr: 'Austrija',        en: 'Austria',               bac: 0.5 },
  { id: 'be', flag: '🇧🇪', hr: 'Belgija',         en: 'Belgium',               bac: 0.5 },
  { id: 'by', flag: '🇧🇾', hr: 'Bjelorusija',     en: 'Belarus',               bac: 0.0 },
  { id: 'ba', flag: '🇧🇦', hr: 'BiH',             en: 'Bosnia & Herz.',        bac: 0.3 },
  { id: 'bg', flag: '🇧🇬', hr: 'Bugarska',        en: 'Bulgaria',              bac: 0.5 },
  { id: 'cy', flag: '🇨🇾', hr: 'Cipar',           en: 'Cyprus',                bac: 0.5 },
  { id: 'me', flag: '🇲🇪', hr: 'Crna Gora',       en: 'Montenegro',            bac: 0.3 },
  { id: 'cz', flag: '🇨🇿', hr: 'Češka',           en: 'Czech Republic',        bac: 0.0 },
  { id: 'dk', flag: '🇩🇰', hr: 'Danska',          en: 'Denmark',               bac: 0.5 },
  { id: 'ee', flag: '🇪🇪', hr: 'Estonija',        en: 'Estonia',               bac: 0.2 },
  { id: 'fi', flag: '🇫🇮', hr: 'Finska',          en: 'Finland',               bac: 0.5 },
  { id: 'fr', flag: '🇫🇷', hr: 'Francuska',       en: 'France',                bac: 0.5 },
  { id: 'gr', flag: '🇬🇷', hr: 'Grčka',           en: 'Greece',                bac: 0.5 },
  { id: 'hr', flag: '🇭🇷', hr: 'Hrvatska',        en: 'Croatia',               bac: 0.5 },
  { id: 'ie', flag: '🇮🇪', hr: 'Irska',           en: 'Ireland',               bac: 0.5 },
  { id: 'is', flag: '🇮🇸', hr: 'Island',          en: 'Iceland',               bac: 0.5 },
  { id: 'it', flag: '🇮🇹', hr: 'Italija',         en: 'Italy',                 bac: 0.5 },
  { id: 'xk', flag: '🇽🇰', hr: 'Kosovo',          en: 'Kosovo',                bac: 0.5 },
  { id: 'lv', flag: '🇱🇻', hr: 'Latvija',         en: 'Latvia',                bac: 0.5 },
  { id: 'li', flag: '🇱🇮', hr: 'Lihtenštajn',    en: 'Liechtenstein',         bac: 0.5 },
  { id: 'lt', flag: '🇱🇹', hr: 'Litva',           en: 'Lithuania',             bac: 0.4 },
  { id: 'lu', flag: '🇱🇺', hr: 'Luksemburg',     en: 'Luxembourg',            bac: 0.5 },
  { id: 'hu', flag: '🇭🇺', hr: 'Mađarska',        en: 'Hungary',               bac: 0.0 },
  { id: 'mt', flag: '🇲🇹', hr: 'Malta',           en: 'Malta',                 bac: 0.5 },
  { id: 'md', flag: '🇲🇩', hr: 'Moldavija',       en: 'Moldova',               bac: 0.3 },
  { id: 'nl', flag: '🇳🇱', hr: 'Nizozemska',      en: 'Netherlands',           bac: 0.5 },
  { id: 'no', flag: '🇳🇴', hr: 'Norveška',        en: 'Norway',                bac: 0.2 },
  { id: 'de', flag: '🇩🇪', hr: 'Njemačka',        en: 'Germany',               bac: 0.5 },
  { id: 'pl', flag: '🇵🇱', hr: 'Poljska',         en: 'Poland',                bac: 0.2 },
  { id: 'pt', flag: '🇵🇹', hr: 'Portugal',        en: 'Portugal',              bac: 0.5 },
  { id: 'ro', flag: '🇷🇴', hr: 'Rumunjska',       en: 'Romania',               bac: 0.0 },
  { id: 'ru', flag: '🇷🇺', hr: 'Rusija',          en: 'Russia',                bac: 0.3 },
  { id: 'mk', flag: '🇲🇰', hr: 'Sj. Makedonija',  en: 'N. Macedonia',          bac: 0.5 },
  { id: 'sk', flag: '🇸🇰', hr: 'Slovačka',        en: 'Slovakia',              bac: 0.0 },
  { id: 'si', flag: '🇸🇮', hr: 'Slovenija',       en: 'Slovenia',              bac: 0.5 },
  { id: 'rs', flag: '🇷🇸', hr: 'Srbija',          en: 'Serbia',                bac: 0.3 },
  { id: 'es', flag: '🇪🇸', hr: 'Španjolska',      en: 'Spain',                 bac: 0.5 },
  { id: 'gb-sct', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', hr: 'Škotska', en: 'Scotland',          bac: 0.5 },
  { id: 'se', flag: '🇸🇪', hr: 'Švedska',         en: 'Sweden',                bac: 0.2 },
  { id: 'ch', flag: '🇨🇭', hr: 'Švicarska',       en: 'Switzerland',           bac: 0.5 },
  { id: 'tr', flag: '🇹🇷', hr: 'Turska',          en: 'Turkey',                bac: 0.5 },
  { id: 'ua', flag: '🇺🇦', hr: 'Ukrajna',         en: 'Ukraine',               bac: 0.2 },
  { id: 'gb', flag: '🇬🇧', hr: 'UK (Engl./Wales/S.Irska)', en: 'UK (Eng./Wales/N.I.)', bac: 0.8 },
];

function getActiveCountry() {
  return COUNTRIES.find(c => c.id === activeCountryId) || COUNTRIES.find(c => c.id === 'hr');
}

function setActiveCountry(id) {
  activeCountryId = id;
  localStorage.setItem('bac_country', id);
}

// ─── State ────────────────────────────────────────────────────
let currentScreen = 'home';
let selectedDrink = null;       // piće odabrano u pickeru
let selectedVolume = null;      // ml za odabrano piće
let editingProfileId = null;    // ID profila koji uređujemo
let activeCat = 'all';          // aktivna kategorija u pickeru
let bacUpdateInterval = null;   // setInterval za live BAC
let selectedTimestamp = null;   // timestamp za novo piće (null = now)
let activeCountryId = localStorage.getItem('bac_country') || 'hr'; // odabrana zemlja

// ─── DOM refs ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Disclaimer
  if (!localStorage.getItem('bac_disclaimer_accepted')) {
    $('disclaimer-overlay').style.display = 'flex';
  }

  $('btn-disclaimer-accept').addEventListener('click', () => {
    localStorage.setItem('bac_disclaimer_accepted', '1');
    $('disclaimer-overlay').style.display = 'none';
  });

  // Info modal
  $('btn-info').addEventListener('click', openInfoModal);
  $('btn-info-close').addEventListener('click', () => $('info-modal-overlay').classList.remove('open'));
  $('info-modal-overlay').addEventListener('click', e => {
    if (e.target === $('info-modal-overlay')) $('info-modal-overlay').classList.remove('open');
  });

  // Language toggle
  $('btn-lang').addEventListener('click', () => {
    toggleLang();
    renderAll();
  });

  // Nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.screen);
    });
  });

  // Profile screen
  $('btn-new-profile').addEventListener('click', () => openProfileForm());
  $('btn-profile-form-cancel').addEventListener('click', closeProfileForm);
  $('profile-form').addEventListener('submit', onProfileFormSubmit);
  $('btn-profile-delete').addEventListener('click', onProfileDelete);

  // Gender toggle
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      btn.dataset.value = btn.dataset.value; // trigger no-op, value stays
    });
  });

  // Add drink screen
  $('search-input').addEventListener('input', renderDrinkList);
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCat = tab.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDrinkList();
    });
  });

  // Custom drink form
  $('btn-show-custom').addEventListener('click', () => {
    $('custom-drink-form').classList.toggle('hidden');
  });
  $('btn-add-custom').addEventListener('click', onAddCustomDrink);

  // Drink detail modal
  $('modal-overlay').addEventListener('click', e => {
    if (e.target === $('modal-overlay')) closeModal();
  });
  $('btn-modal-close').addEventListener('click', closeModal);
  $('btn-modal-add').addEventListener('click', onModalAddDrink);

  // Session screen
  $('btn-clear-session').addEventListener('click', onClearSession);

  // Home — profile strip click → profiles screen
  document.addEventListener('click', e => {
    if (e.target.closest('#active-profile-strip')) {
      navigateTo('profiles');
    }
  });

  // Country strip + picker
  $('country-strip').addEventListener('click', openCountryPicker);
  $('btn-country-cancel').addEventListener('click', closeCountryPicker);
  $('country-picker-overlay').addEventListener('click', e => {
    if (e.target === $('country-picker-overlay')) closeCountryPicker();
  });
  $('country-search').addEventListener('input', e => renderCountryList(e.target.value));

  renderAll();
  navigateTo('home');
  startBACTimer();
});

// ─── Navigation ───────────────────────────────────────────────
function navigateTo(screen) {
  currentScreen = screen;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(`screen-${screen}`);
  if (el) el.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screen);
  });

  // Re-render screen-specific content
  if (screen === 'home')     renderHome();
  if (screen === 'profiles') renderProfiles();
  if (screen === 'drink')    renderDrinkScreen();
  if (screen === 'session')  renderSession();
}

// ─── Live BAC update timer ────────────────────────────────────
function startBACTimer() {
  if (bacUpdateInterval) clearInterval(bacUpdateInterval);
  bacUpdateInterval = setInterval(() => {
    if (currentScreen === 'home') renderBACMeter();
  }, 30_000); // svake 30 sekundi
}

// ─── Render All (after lang change etc.) ─────────────────────
function renderAll() {
  renderI18n();
  renderHome();
  if (currentScreen === 'profiles') renderProfiles();
  if (currentScreen === 'drink')    renderDrinkList();
  if (currentScreen === 'session')  renderSession();
}

function renderI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  $('btn-lang').textContent = t('langToggle');
  const verEl = $('app-version-display');
  if (verEl) verEl.textContent = APP_VERSION;
}

// ─── Home Screen ──────────────────────────────────────────────
function renderHome() {
  const profile = getActiveProfile();

  if (!profile) {
    $('home-no-profile').classList.remove('hidden');
    $('home-content').classList.add('hidden');
    return;
  }

  $('home-no-profile').classList.add('hidden');
  $('home-content').classList.remove('hidden');

  // Country strip
  renderCountryStrip();

  // Profile strip
  $('active-profile-name').textContent = profile.name;
  const age = new Date().getFullYear() - profile.birthYear;
  $('active-profile-meta').textContent =
    `${age} god. · ${profile.weight} kg · ${t(profile.gender === 'male' ? 'genderMale' : 'genderFemale')}`;

  renderBACMeter();
}

function renderBACMeter() {
  const profile = getActiveProfile();
  if (!profile) return;

  const drinks = pruneOldDrinks(profile.id, 24);
  const bac = calcBAC(profile, drinks);
  const status = getDrivingStatus(bac, profile);
  const lang = getLang();

  // BAC value
  const bacEl = $('bac-value');
  bacEl.textContent = bac.toFixed(2);
  bacEl.className = 'bac-meter__value';
  if (bac >= 1.5) bacEl.classList.add('danger');
  else if (bac >= 0.5) bacEl.classList.add('warn');
  else if (bac > 0) bacEl.classList.add('warn');

  // Progress bar (0–2.0 ‰ = full)
  const pct = Math.min(100, (bac / 2.0) * 100);
  const bar = $('bac-bar');
  bar.style.width = pct + '%';
  bar.className = 'bac-bar';
  if (bac >= 1.5) bar.classList.add('danger');
  else if (bac > 0) bar.classList.add('warn');

  // Driving badge
  const badge = $('driving-badge');
  badge.className = 'driving-badge';
  let badgeText;
  if (status.status === 'safe') {
    badge.classList.add('safe');
    badgeText = t('drivingOk');
  } else if (status.level === 1) {
    badge.classList.add('warning');
    badgeText = t('drivingWarning');
  } else if (status.level === 2) {
    badge.classList.add('danger');
    badgeText = t('drivingDanger');
  } else {
    badge.classList.add('danger');
    badgeText = t('drivingCrime');
  }
  badge.textContent = badgeText;

  // Sober time
  const hoursLeft = hoursUntilBAC(profile, drinks, 0);
  $('sober-time').innerHTML = hoursLeft > 0
    ? `<span class="text-dim">${t('soberIn')}:</span> <strong>${formatSoberTime(hoursLeft, lang)}</strong>`
    : `<strong>${t('alreadySober')}</strong>`;

  // Stats
  $('stat-drinks').textContent = drinks.length;
  const totalG = totalAlcoholGrams(drinks);
  $('stat-alcohol').textContent = totalG.toFixed(1) + ' ' + t('grams');
}

// ─── Profiles Screen ──────────────────────────────────────────
function renderProfiles() {
  const profiles = getProfiles();
  const active = getActiveProfile();
  const list = $('profiles-list');

  if (profiles.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-state__icon">👤</div>
      <p data-i18n="noProfiles">${t('noProfiles')}</p>
    </div>`;
    return;
  }

  list.innerHTML = profiles.map(p => {
    const age = new Date().getFullYear() - p.birthYear;
    const isActive = active && active.id === p.id;
    return `<div class="profile-card ${isActive ? 'active' : ''}" data-profile-id="${p.id}">
      <div class="profile-card__avatar">${p.gender === 'male' ? '👨' : '👩'}</div>
      <div class="profile-card__info">
        <div class="profile-card__name">${esc(p.name)}</div>
        <div class="profile-card__meta">${age} god. · ${p.weight} kg · ${p.height} cm</div>
      </div>
      ${isActive ? `<span class="profile-card__badge">${t('activeProfile')}</span>` : ''}
      <button class="btn btn--ghost btn--icon btn-edit-profile" data-profile-id="${p.id}" aria-label="Edit" style="font-size:1rem; margin-left:auto;">✏️</button>
    </div>`;
  }).join('');

  // Tap kartice → odaberi profil
  list.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-edit-profile')) return;
      const id = card.dataset.profileId;
      const p = getProfileById(id);
      setActiveProfile(id);
      renderProfiles();
      renderHome();
      showToast('👤 ' + esc(p?.name || '') + (getLang() === 'hr' ? ' aktivan' : ' active'));
    });
  });

  // Edit tipka → otvori formu
  list.querySelectorAll('.btn-edit-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProfileForm(btn.dataset.profileId);
    });
  });
}

// ─── Profile Form ─────────────────────────────────────────────
function openProfileForm(profileId = null) {
  editingProfileId = profileId;
  const form = $('profile-form-screen');
  form.classList.remove('hidden');

  $('profile-form-title').textContent = profileId ? t('screenEditProfile') : t('screenNewProfile');
  $('btn-profile-delete').classList.toggle('hidden', !profileId);

  // Reset form
  $('profile-form').reset();
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.form-error').forEach(e => e.textContent = '');

  if (profileId) {
    const p = getActiveProfile(); // we just set it
    if (p && p.id === profileId) {
      $('input-name').value = p.name;
      $('input-weight').value = p.weight;
      $('input-height').value = p.height;
      $('input-birthyear').value = p.birthYear;
      const genderBtn = document.querySelector(`.gender-btn[data-value="${p.gender}"]`);
      if (genderBtn) genderBtn.classList.add('selected');
    }
  } else {
    // Default gender: male selected
    document.querySelector('.gender-btn[data-value="male"]').classList.add('selected');
  }
}

function closeProfileForm() {
  $('profile-form-screen').classList.add('hidden');
  editingProfileId = null;
}

function onProfileFormSubmit(e) {
  e.preventDefault();

  const selectedGender = document.querySelector('.gender-btn.selected')?.dataset.value || 'male';
  const data = {
    name: $('input-name').value,
    weight: $('input-weight').value,
    height: $('input-height').value,
    gender: selectedGender,
    birthYear: $('input-birthyear').value,
  };

  const { valid, errors } = validateProfile(data);

  // Clear old errors
  document.querySelectorAll('.form-error').forEach(e => e.textContent = '');

  if (!valid) {
    if (errors.name)      $('err-name').textContent = t(errors.name);
    if (errors.weight)    $('err-weight').textContent = t(errors.weight);
    if (errors.height)    $('err-height').textContent = t(errors.height);
    if (errors.birthYear) $('err-birthyear').textContent = t(errors.birthYear);
    return;
  }

  if (editingProfileId) {
    updateProfile(editingProfileId, data);
    showToast('✅ ' + (getLang() === 'hr' ? 'Profil ažuriran' : 'Profile updated'));
  } else {
    createProfile(data);
    showToast('✅ ' + (getLang() === 'hr' ? 'Profil kreiran' : 'Profile created'));
  }

  closeProfileForm();
  renderProfiles();
  renderHome();
}

function onProfileDelete() {
  if (!editingProfileId) return;
  if (!confirm(t('confirmDeleteProfile'))) return;
  deleteProfile(editingProfileId);
  closeProfileForm();
  renderProfiles();
  renderHome();
}

// ─── Add Drink Screen ─────────────────────────────────────────
function renderDrinkScreen() {
  activeCat = 'all';
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.cat-tab[data-cat="all"]')?.classList.add('active');
  $('search-input').value = '';
  $('custom-drink-form').classList.add('hidden');
  renderDrinkList();
}

function renderDrinkList() {
  const query = $('search-input').value.trim();
  const lang = getLang();

  let drinks = query
    ? searchDrinks(query, lang)
    : getDrinksByCategory(activeCat);

  const list = $('drink-list');
  if (drinks.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding: 32px 0;">
      <div class="empty-state__icon">🔍</div>
      <p>${lang === 'hr' ? 'Nema rezultata' : 'No results'}</p>
    </div>`;
    return;
  }

  list.innerHTML = drinks.map(d => `
    <div class="drink-pick-item" data-drink-id="${d.id}">
      <div class="drink-pick-item__icon">${d.icon}</div>
      <div class="drink-pick-item__info">
        <div class="drink-pick-item__name">${d.name[lang]}</div>
        <div class="drink-pick-item__meta">${d.brand} · ${(d.abv * 100).toFixed(1)}% · ${d.servingMl} ml</div>
      </div>
      <span style="color: var(--clr-text-faint); font-size: 1.2rem;">›</span>
    </div>
  `).join('');

  list.querySelectorAll('.drink-pick-item').forEach(item => {
    item.addEventListener('click', () => {
      const drink = DRINKS_DB.find(d => d.id === item.dataset.drinkId);
      if (drink) openDrinkModal(drink);
    });
  });
}

// ─── Time Picker ──────────────────────────────────────────────
function renderTimePicker() {
  const lang = getLang();
  const options = [
    { label: lang === 'hr' ? 'Sad' : 'Now',    offset: 0  },
    { label: '5 min',  offset: 5  },
    { label: '10 min', offset: 10 },
    { label: '15 min', offset: 15 },
    { label: '30 min', offset: 30 },
    { label: '1h',     offset: 60 },
    { label: lang === 'hr' ? 'Vlastito' : 'Custom', offset: -1 },
  ];

  const wrap = $('modal-time-options');
  wrap.innerHTML = options.map(o =>
    `<button class="vol-btn ${o.offset === 0 ? 'selected' : ''}" data-offset="${o.offset}">${o.label}</button>`
  ).join('');

  selectedTimestamp = Date.now();
  $('modal-custom-time').classList.add('hidden');
  $('modal-time-label').textContent = lang === 'hr' ? 'Kada?' : 'When?';

  wrap.querySelectorAll('.vol-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.vol-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const offset = Number(btn.dataset.offset);
      if (offset === -1) {
        $('modal-custom-time').classList.remove('hidden');
        const now = new Date();
        $('modal-custom-time').value =
          String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        selectedTimestamp = null;
      } else {
        $('modal-custom-time').classList.add('hidden');
        selectedTimestamp = Date.now() - offset * 60_000;
      }
    });
  });

  $('modal-custom-time').addEventListener('change', () => {
    const val = $('modal-custom-time').value;
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (target > now) target.setDate(target.getDate() - 1);
    selectedTimestamp = target.getTime();
  });
}

// ─── Drink Modal ──────────────────────────────────────────────
function openDrinkModal(drink) {
  selectedDrink = drink;
  selectedVolume = drink.servingMl;

  const lang = getLang();
  $('modal-drink-icon').textContent = drink.icon;
  $('modal-drink-name').textContent = drink.name[lang];
  $('modal-drink-meta').textContent = `${drink.brand} · ${(drink.abv * 100).toFixed(1)}%`;

  // Volume options
  const volWrap = $('modal-volume-options');
  volWrap.innerHTML = drink.servingOptions.map(ml => `
    <button class="vol-btn ${ml === drink.servingMl ? 'selected' : ''}" data-ml="${ml}">${ml} ml</button>
  `).join('');

  volWrap.querySelectorAll('.vol-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedVolume = Number(btn.dataset.ml);
      volWrap.querySelectorAll('.vol-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      updateModalGrams();
    });
  });

  updateModalGrams();
  renderTimePicker();

  $('modal-overlay').classList.add('open');
}

function updateModalGrams() {
  if (!selectedDrink || !selectedVolume) return;
  const grams = (selectedVolume * selectedDrink.abv * 0.789).toFixed(1);
  $('modal-grams').textContent = `${selectedVolume} ml · ${grams} g ${getLang() === 'hr' ? 'alkohola' : 'alcohol'}`;
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
  selectedDrink = null;
  selectedVolume = null;
}

function onModalAddDrink() {
  const profile = getActiveProfile();
  if (!profile) {
    showToast('⚠️ ' + (getLang() === 'hr' ? 'Odaberi profil' : 'Select a profile'));
    closeModal();
    navigateTo('profiles');
    return;
  }

  const lang = getLang();
  addDrinkToSession(profile.id, {
    drinkId: selectedDrink.id,
    name: selectedDrink.name[lang],
    abv: selectedDrink.abv,
    volumeMl: selectedVolume,
    timestamp: selectedTimestamp || Date.now(),
  });

  closeModal();
  showToast('🍺 ' + (lang === 'hr' ? 'Piće dodano!' : 'Drink added!'));
  navigateTo('home');
}

// ─── Custom Drink ─────────────────────────────────────────────
function onAddCustomDrink() {
  const profile = getActiveProfile();
  if (!profile) {
    showToast('⚠️ ' + (getLang() === 'hr' ? 'Odaberi profil' : 'Select a profile'));
    navigateTo('profiles');
    return;
  }

  const name = $('custom-name').value.trim();
  const abvPct = parseFloat($('custom-abv').value);
  const volumeMl = parseFloat($('custom-volume').value);

  if (!name || isNaN(abvPct) || abvPct <= 0 || abvPct > 100 || isNaN(volumeMl) || volumeMl <= 0) {
    showToast('⚠️ ' + (getLang() === 'hr' ? 'Provjeri unos' : 'Check input'));
    return;
  }

  addDrinkToSession(profile.id, {
    drinkId: 'custom',
    name,
    abv: abvPct / 100,
    volumeMl,
  });

  $('custom-name').value = '';
  $('custom-abv').value = '';
  $('custom-volume').value = '';
  $('custom-drink-form').classList.add('hidden');

  showToast('✅ ' + (getLang() === 'hr' ? 'Piće dodano!' : 'Drink added!'));
  navigateTo('home');
}

// ─── Session Screen ───────────────────────────────────────────
function renderSession() {
  const profile = getActiveProfile();
  const list = $('session-list');
  const lang = getLang();

  if (!profile) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-state__icon">🧃</div>
      <p>${t('noProfiles')}</p>
    </div>`;
    return;
  }

  const drinks = pruneOldDrinks(profile.id, 24);

  if (drinks.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-state__icon">🧃</div>
      <p>${t('noSession')}</p>
    </div>`;
    return;
  }

  // Show newest first
  const sorted = [...drinks].sort((a, b) => b.timestamp - a.timestamp);

  list.innerHTML = sorted.map(d => `
    <div class="session-drink-item" data-entry-id="${d.id}">
      <div class="session-drink-item__icon">🍺</div>
      <div class="session-drink-item__info">
        <div class="session-drink-item__name">${esc(d.name)}</div>
        <div class="session-drink-item__meta">
          ${(d.abv * 100).toFixed(1)}% · ${d.volumeMl} ml ·
          <span style="color: var(--clr-primary)">${(d.volumeMl * d.abv * 0.789).toFixed(1)} g</span>
        </div>
        <div class="session-drink-item__time">${formatDrinkTime(d.timestamp, lang)}</div>
      </div>
      <button class="btn-remove" data-entry-id="${d.id}" aria-label="Remove">✕</button>
    </div>
  `).join('');

  list.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm(t('confirmDeleteDrink'))) return;
      removeDrinkFromSession(profile.id, btn.dataset.entryId);
      renderSession();
      if (currentScreen === 'home') renderBACMeter();
    });
  });
}

function onClearSession() {
  const profile = getActiveProfile();
  if (!profile) return;
  if (!confirm(t('confirmClearSession'))) return;
  clearSession(profile.id);
  renderSession();
  renderBACMeter();
  showToast('🧹 ' + (getLang() === 'hr' ? 'Sesija očišćena' : 'Session cleared'));
}

// ─── Utilities ────────────────────────────────────────────────
function showToast(msg) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Info Modal ───────────────────────────────────────────────
// ─── Country Strip & Picker ──────────────────────────────────
function renderCountryStrip() {
  const country = getActiveCountry();
  const lang = getLang();
  const bac = calcBAC(getActiveProfile(), pruneOldDrinks(getActiveProfile()?.id, 24));

  const overLimit = bac > 0 && bac >= country.bac;
  const underLimit = bac > 0 && bac < country.bac;
  const sober = bac === 0;

  $('country-flag').textContent  = country.flag;
  $('country-name-display').textContent = country[lang];
  const limitBadge = $('country-limit-badge');
  limitBadge.textContent = country.bac.toFixed(1) + ' ‰';
  limitBadge.className = 'country-limit-badge';
  if (sober || underLimit) limitBadge.classList.add('ok');
  if (overLimit) limitBadge.classList.add('over');
}

function openCountryPicker() {
  renderCountryList('');
  $('country-search').value = '';
  $('country-picker-overlay').classList.add('open');
  $('country-search').focus();
}

function closeCountryPicker() {
  $('country-picker-overlay').classList.remove('open');
}

function renderCountryList(query) {
  const lang = getLang();
  const q = query.toLowerCase().trim();
  const filtered = q
    ? COUNTRIES.filter(c => c[lang].toLowerCase().includes(q) || c.en.toLowerCase().includes(q))
    : COUNTRIES;

  $('country-list').innerHTML = filtered.map(country => {
    const active = country.id === activeCountryId ? ' active' : '';
    const bacColor = country.bac === 0 ? 'danger' : country.bac <= 0.2 ? 'warn' : country.bac <= 0.5 ? 'ok' : 'dim';
    return `<div class="country-item${active}" data-id="${country.id}">
      <span class="country-item__flag">${country.flag}</span>
      <span class="country-item__name">${esc(country[lang])}</span>
      <span class="country-item__bac bac-${bacColor}">${country.bac.toFixed(1)} ‰</span>
    </div>`;
  }).join('');

  // Event listeners
  $('country-list').querySelectorAll('.country-item').forEach(el => {
    el.addEventListener('click', () => {
      setActiveCountry(el.dataset.id);
      closeCountryPicker();
      renderCountryStrip();
      renderBACMeter();
    });
  });
}

function openInfoModal() {
  $('info-modal-title').textContent    = t('infoTitle');
  $('info-how-title').textContent      = t('infoHowTitle');
  $('info-how-text').textContent       = t('infoHowText');
  $('info-factors-title').textContent  = t('infoFactorsTitle');
  $('info-factors-text').textContent   = t('infoFactorsText');
  $('info-formula-title').textContent  = t('infoFormulaTitle');
  $('info-formula-text').textContent   = t('infoFormulaText');
  $('info-alc-grams-title').textContent = t('infoAlcGramsTitle');
  $('info-alc-grams-text').textContent  = t('infoAlcGramsText');
  $('info-limits-title').textContent   = t('infoLimitsTitle');
  $('btn-info-close').textContent      = t('infoClose');
  $('info-disclaimer-title').textContent = t('infoDisclaimerTitle');
  $('info-disclaimer-text').textContent  = t('infoDisclaimerText');

  // Limits — svaka linija kao zaseban div
  const limitsEl = $('info-limits-text');
  const lines = t('infoLimitsText').split('\n');
  limitsEl.innerHTML = lines.map(l => `<div>${esc(l)}</div>`).join('');

  // EU limits
  $('info-eu-title').textContent = t('infoEuTitle');
  $('info-eu-note').textContent  = t('infoEuNote');
  const lang = getLang();
  const euEl = $('info-eu-limits');
  euEl.innerHTML = EU_BAC_LIMITS.map(row => `
    <div class="eu-limit-row eu-limit-row--${row.color}">
      <span class="eu-limit-bac">${row.bac}</span>
      <span class="eu-limit-countries">${row[lang]}</span>
    </div>
  `).join('');

  $('info-modal-overlay').classList.add('open');
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
