/* Rohan Kumar — Portfolio · vanilla interactions */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  const yEl = $('#year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  // Initial theme was set by the inline bootstrap in <head> to avoid FOUC.
  // Here we only handle clicks + sync with OS changes when the user hasn't chosen.
  const toggle = $('#theme-toggle');
  const root = document.documentElement;
  const setTheme = (mode, persist = true) => {
    root.setAttribute('data-theme', mode);
    if (persist) {
      try { localStorage.setItem('theme', mode); } catch (e) {}
    }
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
  // OS-preference listener intentionally removed — light is the brand default;
  // the user opts into dark explicitly via the toggle, and that choice persists.

  /* ---------- Scroll progress + nav .scrolled ---------- */
  const progressEl = $('#scroll-progress');
  const navEl = $('#nav');
  const updateScrollUI = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progressEl) progressEl.style.width = pct + '%';
    if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 8);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  /* ---------- Active section in nav ---------- */
  const sectionIds = ['work', 'projects', 'contact'];
  const sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const linkMap = new Map(
    $$('#nav-links a').map((a) => [a.getAttribute('href').slice(1), a])
  );
  const updateActive = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sectionIds[0];
    for (const s of sectionEls) if (s.offsetTop <= y) current = s.id;
    linkMap.forEach((a, id) => a.classList.toggle('active', id === current));
  };
  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });

  /* ---------- Generic reveal observer ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$('.reveal').forEach((el) => revealObs.observe(el));

  /* ---------- Metric card observer (separate threshold) ---------- */
  const metricObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          metricObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  $$('.metric-card').forEach((el) => metricObs.observe(el));

  /* ---------- Cursor blob (skip on touch & reduced motion) ---------- */
  const blob = $('#cursor-blob');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (blob && !reducedMotion && !isTouch) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      blob.style.left = x + 'px';
      blob.style.top = y + 'px';
      requestAnimationFrame(tick);
    };
    tick();
  } else if (blob) {
    blob.style.display = 'none';
  }

  /* ---------- Pause headline swap when tab hidden ---------- */
  const swapEls = $$('.swap-word');
  document.addEventListener('visibilitychange', () => {
    const state = document.hidden ? 'paused' : 'running';
    swapEls.forEach((el) => { el.style.animationPlayState = state; });
  });
})();
