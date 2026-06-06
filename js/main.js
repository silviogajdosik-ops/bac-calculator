/**
 * main.js — BAC Calculator entry point
 * Router, screen manager, event glue
 * v1.0.0
 */

import { t, getLang, toggleLang } from './i18n.js';
import { getProfiles, getActiveProfile, setActiveProfile, createProfile, updateProfile, deleteProfile, validateProfile } from './profiles.js';
import { getSessionDrinks, addDrinkToSession, removeDrinkFromSession, clearSession, pruneOldDrinks, totalAlcoholGrams, formatDrinkTime } from './session.js';
import { calcBAC, hoursUntilBAC, getDrivingStatus, formatBAC, formatSoberTime } from './bac.js';
import { DRINKS_DB, DRINK_CATEGORIES, getDrinksByCategory, searchDrinks } from './drinks-db.js';

// ─── State ────────────────────────────────────────────────────
let currentScreen = 'home';
let selectedDrink = null;       // piće odabrano u pickeru
let selectedVolume = null;      // ml za odabrano piće
let editingProfileId = null;    // ID profila koji uređujemo
let activeCat = 'all';          // aktivna kategorija u pickeru
let bacUpdateInterval = null;   // setInterval za live BAC

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
    </div>`;
  }).join('');

  // Click: select active OR edit
  list.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.profileId;
      setActiveProfile(id);
      openProfileForm(id);
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

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
