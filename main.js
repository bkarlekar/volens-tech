/* Volens — main.js (no dependencies, ~3 KB)
   1. Mobile navigation  2. Industry tabs  3. Impact calculator
   4. Lead form validation + submission  5. Lightweight event tracking hook */
(function () {
  'use strict';

  /* ---------- 5. Tracking hook (no analytics vendor bundled) ---------- */
  function track(name, data) {
    try {
      if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, data || {}));
      if (typeof window.plausible === 'function') window.plausible(name, { props: data || {} });
    } catch (e) { /* never block the UI on analytics */ }
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'));
  });

  /* ---------- 1. Mobile navigation ---------- */
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-btn');
  if (nav && menuBtn) {
    function setMenu(open) {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- 2. Accessible tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      if (focus) tab.focus();
      track('industry_tab', { industry: tab.id.replace('tab-', '') });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); activate(n, true); }
      });
    });
  });

  /* ---------- 3. Impact calculator ---------- */
  var calc = document.getElementById('calc');
  if (calc) {
    var $ = function (id) { return document.getElementById(id); };
    var vol = $('vol'), mins = $('mins'), rate = $('rate'), auto = $('auto');
    var fmt = function (n) { return Math.round(n).toLocaleString('en-IN'); };
    var inr = function (n) { return '₹' + fmt(n); };
    function update() {
      var v = +vol.value, m = +mins.value, r = +rate.value, a = +auto.value / 100;
      var hoursToday = v * m / 60;
      var saved = hoursToday * (a + (1 - a) * 0.6);
      var money = saved * r;
      $('vol-out').textContent = fmt(v);
      $('mins-out').textContent = m;
      $('rate-out').textContent = inr(r);
      $('auto-out').textContent = Math.round(a * 100) + '%';
      $('r-hours').textContent = fmt(saved);
      $('r-money').textContent = inr(money);
      $('r-fte').textContent = (saved / 160).toFixed(1) + ' FTE';
      $('r-bar').style.width = Math.min(100, Math.round(saved / hoursToday * 100)) + '%';
      $('r-annual').textContent = 'About ' + inr(money * 12) + ' per year from this one process, before error reduction, faster cycle times and audit savings.';
    }
    [vol, mins, rate, auto].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  /* ---------- 4. Lead form ---------- */
  var form = document.getElementById('lead');
  if (form) {
    /* Set FORM_ENDPOINT to your Formspree / Pageclip / own API URL.
       Leave empty and the form falls back to a pre-filled email draft. */
    var FORM_ENDPOINT = '';
    var status = document.getElementById('form-status');
    var started = false;
    form.addEventListener('input', function () { if (!started) { started = true; track('form_start'); } });

    function setError(id, show) {
      var field = document.getElementById(id);
      var err = document.getElementById(id + '-err');
      var wrap = field.closest('.field');
      err.hidden = !show;
      field.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (show) { field.setAttribute('aria-describedby', id + '-err'); wrap.setAttribute('data-invalid', ''); }
      else { field.removeAttribute('aria-describedby'); wrap.removeAttribute('data-invalid'); }
    }
    function validate() {
      var ok = true, first = null;
      var checks = [
        ['name', form.name.value.trim().length > 0],
        ['email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.value.trim())],
        ['company', form.company.value.trim().length > 0],
        ['consent', form.consent.checked]
      ];
      checks.forEach(function (c) {
        setError(c[0], !c[1]);
        if (!c[1]) { ok = false; if (!first) first = document.getElementById(c[0]); }
      });
      if (first) first.focus();
      return ok;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      if (!validate()) { status.className = 'form-status err'; status.textContent = 'Please fix the highlighted fields.'; return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.href;
      var btn = form.querySelector('button[type="submit"]');

      function success() {
        track('form_submit_success');
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Thank you. Your request is in. We will reply within two working days.';
      }
      function fallback() {
        /* No endpoint or network failure: open a pre-filled email so the enquiry is never lost. */
        var body = 'Name: ' + data.name + '\nCompany: ' + data.company + '\nEmail: ' + data.email +
          '\nAutomate first: ' + data.process + '\nNotes: ' + (data.notes || '-');
        location.href = 'mailto:hello@volens.tech?subject=' + encodeURIComponent('Discovery call request from ' + data.company) +
          '&body=' + encodeURIComponent(body);
        status.className = 'form-status ok';
        status.textContent = 'Your email app should open with the details filled in. If it does not, email hello@volens.tech.';
      }
      if (!FORM_ENDPOINT) { fallback(); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (r.ok) success(); else fallback(); })
        .catch(fallback)
        .finally(function () { btn.disabled = false; btn.textContent = 'Request a discovery call'; });
    });
  }
})();
