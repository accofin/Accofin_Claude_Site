// Accofin Consultancy — shared site script (theme, persona, reveal-on-scroll, hero/gate flow)

(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var meta = document.getElementById('theme-color-meta');
  var stored = null;
  try { stored = localStorage.getItem('accofin-theme'); } catch (e) {}
  function applyMeta(theme) {
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#ffffff');
  }
  var initial = stored === 'dark' ? 'dark' : 'light';
  root.setAttribute('data-theme', initial);
  applyMeta(initial);
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      applyMeta(next);
      try { localStorage.setItem('accofin-theme', next); } catch (e) {}
    });
  }
})();

(function () {
  // Persona state is shared across every page via localStorage, so switching
  // "Global" / "India" in the header sticks as you navigate the site.
  var body = document.body;
  var label = document.getElementById('persona-label');
  var labels = { global: 'Global Companies', india: 'Indian Businesses' };
  var storedPersona = null;
  try { storedPersona = localStorage.getItem('accofin-persona'); } catch (e) {}

  function setPersona(value, opts) {
    opts = opts || {};
    body.setAttribute('data-persona', value);
    if (label) label.textContent = labels[value] || labels.global;
    try { localStorage.setItem('accofin-persona', value); } catch (e) {}
    document.querySelectorAll('.persona-toggle button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === value ? 'true' : 'false');
    });
  }

  setPersona(storedPersona === 'india' ? 'india' : 'global');

  document.querySelectorAll('.persona-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () { setPersona(btn.getAttribute('data-value')); });
  });

  // ---- Homepage-only hero + gate flow ----
  var gate = document.getElementById('gate');
  var site = document.getElementById('site');
  var entered = false;

  function enterSite(value) {
    setPersona(value);
    if (!gate || !site || entered) return;
    entered = true;
    gate.classList.add('gate-exit');
    site.style.display = 'block';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { site.classList.add('in'); });
    });
    setTimeout(function () {
      gate.style.display = 'none';
      var heroSection = document.getElementById('persona-hero');
      if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 580);
  }

  if (gate) {
    document.querySelectorAll('.gate-card[data-persona]').forEach(function (el) {
      el.addEventListener('click', function () { enterSite(el.getAttribute('data-persona')); });
    });
  }

  var heroScrollBtn = document.getElementById('hero-scroll-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', function () {
      if (gate) { gate.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }
})();

(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
