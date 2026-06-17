/* ============================================================
   Box Box — JavaScript global
   - Menu mobile
   - Animations au scroll (IntersectionObserver)
   - Filtre catalogue (luxe.html)
   - Filtres marketplace
   - Simulateur de financement
   - Gestion des formulaires (feedback)
   ============================================================ */

(function () {
  'use strict';

  /* -------- 1. Navigation mobile -------- */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      const open = nav.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Fermer le menu au clic sur un lien
    nav.querySelectorAll('.nav__menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
      });
    });

    // Marquer le lien actif selon la page courante
    const here = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav__menu a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === here) a.classList.add('is-active');
    });
  }

  /* -------- 2. Animations au scroll -------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------- 3. Filtre catalogue (luxe.html) + résultats marketplace -------- */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      const target = group.getAttribute('data-filter-group');
      const items = document.querySelectorAll('[data-filter-target="' + target + '"] [data-cat]');
      const countEl = document.querySelector('[data-filter-count="' + target + '"]');

      function apply(value) {
        let visible = 0;
        items.forEach(function (item) {
          const cats = (item.getAttribute('data-cat') || '').split('|');
          const show = value === 'all' || cats.indexOf(value) !== -1;
          item.classList.toggle('is-hidden', !show);
          if (show) visible++;
        });
        if (countEl) countEl.textContent = visible;
      }

      group.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          group.querySelectorAll('.chip').forEach(function (c) {
            c.classList.remove('is-active');
          });
          chip.classList.add('is-active');
          apply(chip.getAttribute('data-value'));
        });
      });
    });
  }

  /* -------- 4. Simulateur de financement -------- */
  function initSimulator() {
    const sim = document.querySelector('[data-sim]');
    if (!sim) return;

    const amount = sim.querySelector('#sim-amount');
    const months = sim.querySelector('#sim-months');
    const deposit = sim.querySelector('#sim-deposit');

    const amountOut  = sim.querySelector('#out-amount');
    const monthsOut  = sim.querySelector('#out-months');
    const depositOut = sim.querySelector('#out-deposit');
    const result     = sim.querySelector('#sim-result');
    const totalOut   = sim.querySelector('#sim-total');

    const TAEG = 0.0490; // taux indicatif annuel

    function fmt(n) {
      return Math.round(n).toLocaleString('fr-FR');
    }

    function compute() {
      const principalTotal = Number(amount.value);
      const n = Number(months.value);
      const depPct = Number(deposit.value);

      const depositValue = principalTotal * (depPct / 100);
      const financed = principalTotal - depositValue;

      const r = TAEG / 12;
      let monthly;
      if (r === 0) {
        monthly = financed / n;
      } else {
        monthly = financed * r / (1 - Math.pow(1 + r, -n));
      }

      amountOut.textContent  = fmt(principalTotal) + ' €';
      monthsOut.textContent  = n + ' mois';
      depositOut.textContent = depPct + ' % · ' + fmt(depositValue) + ' €';
      result.textContent     = fmt(monthly);
      if (totalOut) totalOut.textContent = fmt(monthly * n + depositValue) + ' €';
    }

    [amount, months, deposit].forEach(function (el) {
      if (el) el.addEventListener('input', compute);
    });
    compute();
  }

  /* -------- 5. Formulaires (feedback sans backend) -------- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const msg = form.querySelector('.form-msg');
        if (msg) {
          msg.classList.add('is-visible');
          msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        // Réinitialiser les valeurs simulées si présentes
      });
    });
  }

  /* -------- 6. Recherche comparateur (scroll vers résultats) -------- */
  function initSearch() {
    const search = document.querySelector('[data-search]');
    if (!search) return;
    search.addEventListener('submit', function (e) {
      e.preventDefault();
      const results = document.querySelector('#results');
      if (results) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* -------- Init -------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initFilters();
    initSimulator();
    initForms();
    initSearch();

    // Dates par défaut sur le comparateur
    const start = document.querySelector('#date-start');
    const end = document.querySelector('#date-end');
    if (start && end) {
      const today = new Date();
      const t3 = new Date(today.getTime() + 3 * 86400000);
      start.value = today.toISOString().slice(0, 10);
      end.value = t3.toISOString().slice(0, 10);
    }
  });
})();
