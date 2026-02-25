/* ─────────────────────────────────────────────
   SAVR Health — App Logic (Vanilla JS)
───────────────────────────────────────────── */

/* ── Utility ── */
const $ = id => document.getElementById(id);
const show = el => el && el.classList.add('show');
const hide = el => el && el.classList.remove('show');

function setError(inputId, msg) {
  const input = $(inputId);
  const err   = $(`${inputId}-error`);
  if (!input) return;
  input.classList.toggle('error', !!msg);
  if (err) { err.textContent = msg; msg ? show(err) : hide(err); }
}
function clearError(inputId) { setError(inputId, ''); }

/* ── Validation ── */
const isEmail   = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isStrong  = v => v.length >= 8;

/* ── Session helpers (localStorage) ── */
const Session = {
  save(email) { localStorage.setItem('savr_user', JSON.stringify({ email, ts: Date.now() })); },
  get()       { try { return JSON.parse(localStorage.getItem('savr_user')); } catch { return null; } },
  clear()     { localStorage.removeItem('savr_user'); }
};

/* ── Password toggle ── */
function initPasswordToggle(inputId, btnId) {
  const input = $(inputId);
  const btn   = $(btnId);
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    btn.textContent = visible ? '👁' : '🙈';
    btn.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
  });
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
function initLogin() {
  const form    = $('login-form');
  if (!form) return;

  // Redirect if already logged in
  if (Session.get()) { window.location.href = 'index.html'; return; }

  initPasswordToggle('password', 'toggle-pw');

  // Clear errors on input
  ['email','password'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    hide($('alert'));

    const email = $('email').value.trim();
    const pwd   = $('password').value;
    let valid   = true;

    if (!email)        { setError('email', 'Email is required'); valid = false; }
    else if (!isEmail(email)) { setError('email', 'Enter a valid email address'); valid = false; }

    if (!pwd)          { setError('password', 'Password is required'); valid = false; }
    else if (!isStrong(pwd)) { setError('password', 'Password must be at least 8 characters'); valid = false; }

    if (!valid) return;

    // Simulate async login
    const btn = $('login-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    await delay(1400);

    btn.classList.remove('loading');
    btn.disabled = false;

    // Demo: any credentials work
    Session.save(email);
    window.location.href = 'index.html';
  });
}

/* ═══════════════════════════════════════════
   DASHBOARD / INDEX PAGE
═══════════════════════════════════════════ */
function initDashboard() {
  const dash = $('dashboard');
  if (!dash) return;

  const user = Session.get();
  if (!user) { window.location.href = 'login.html'; return; }

  const nameEl = $('user-email');
  if (nameEl) nameEl.textContent = user.email;

  const logoutBtn = $('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    Session.clear();
    window.location.href = 'login.html';
  });

  // Animate vitals cards
  animateVitals();
  setInterval(animateVitals, 4000);
}

/* Fake live vitals */
function animateVitals() {
  setValue('val-hr',   rand(62, 98));
  setValue('val-spo2', rand(96, 100));
  setValue('val-temp', (rand(366, 375) / 10).toFixed(1));
  setValue('val-hrv',  rand(28, 72));
}
function setValue(id, v) {
  const el = $(id);
  if (!el) return;
  el.style.transform = 'scale(1.12)';
  el.textContent = v;
  setTimeout(() => el.style.transform = 'scale(1)', 250);
}

/* ── Helpers ── */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initDashboard();
});
