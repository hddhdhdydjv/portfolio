(function () {
  const PROJECTS = [
    { name: 'Fan Raise',     url: 'fan-raise.html' },
    { name: 'RockMap',       url: 'rockmap.html' },
    { name: 'Tickit Clubes', url: 'tickit-clubes.html' },
    { name: 'Tickit',        url: 'tickit.html' },
    { name: 'Thinknube.AI',  url: 'thinknube-ai.html' },
    { name: 'Brikka',        url: 'brikka.html' },
    { name: 'Car.la',        url: 'carla.html' },
    { name: 'Kordiis',       url: 'kordiis.html' },
    { name: 'Off the Grid',  url: 'off-the-grid.html' },
    { name: 'Whasi',         url: 'whasi.html' },
  ];

  const path     = window.location.pathname;
  const file     = path.split('/').pop() || 'index.html';
  const inWorks  = path.includes('/works/');
  const isContact  = file === 'contact.html';
  const isProjects = file === 'projects.html';
  const isIndex  = file === 'index.html' || file === '' || path === '/';
  const prefix   = inWorks ? '../' : '';

  // ── Sub-links ──
  const subLinks = PROJECTS.map(p => {
    const active = file === p.url;
    return `<a class="sidebar-sub-link${active ? ' active' : ''}" href="${prefix}works/${p.url}">${p.name}</a>`;
  }).join('');

  const catSVG = `<svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;width:64px;height:64px;">
    <rect x="2" y="1" width="2" height="2" class="cat-body"/>
    <rect x="12" y="1" width="2" height="2" class="cat-body"/>
    <rect x="3" y="2" width="1" height="1" class="cat-ear-inner"/>
    <rect x="12" y="2" width="1" height="1" class="cat-ear-inner"/>
    <rect x="2" y="3" width="12" height="7" class="cat-body"/>
    <rect x="4" y="5" width="2" height="2" class="cat-eye"/>
    <rect x="10" y="5" width="2" height="2" class="cat-eye"/>
    <rect x="7" y="7" width="2" height="1" class="cat-nose"/>
    <rect x="6" y="8" width="1" height="1" class="cat-body"/>
    <rect x="9" y="8" width="1" height="1" class="cat-body"/>
    <rect x="3" y="10" width="10" height="5" class="cat-body"/>
    <rect x="3" y="14" width="2" height="2" class="cat-body"/>
    <rect x="7" y="14" width="2" height="2" class="cat-body"/>
    <rect x="11" y="14" width="2" height="2" class="cat-body"/>
    <rect x="13" y="10" width="2" height="1" class="cat-body"/>
    <rect x="14" y="11" width="2" height="2" class="cat-body"/>
    <rect x="13" y="13" width="2" height="1" class="cat-body"/>
    <rect x="4" y="10" width="8" height="1" class="cat-collar"/>
    <rect x="7" y="11" width="2" height="1" class="cat-collar"/>
  </svg>`;

  const workActive    = inWorks || isProjects;
  const contactActive = isContact;

  // When already on home, use pure hash links so transition.js skips them (smooth scroll only).
  // From any other page, use full path so the page transition fires and navigates home.
  const sectionHref = (anchor) => isIndex ? `#${anchor}` : `${prefix}index.html#${anchor}`;

  const html = `<aside class="sidebar" id="sidebar">
  <div class="sidebar-cat">${catSVG}</div>
  <nav class="sidebar-nav">
    <a href="${sectionHref('hero')}" data-s="hero">Home</a>
    <div class="sidebar-work-item">
      <a href="${sectionHref('work')}" data-s="work"${workActive ? ' class="active"' : ''}>Work</a>
      <div class="sidebar-sub" id="sidebarSub">
        ${subLinks}
        <a class="sidebar-sub-link sidebar-sub-all" href="${prefix}projects.html">All Projects →</a>
      </div>
    </div>
    <a href="${sectionHref('about')}" data-s="about">About</a>
    <a href="${sectionHref('services')}" data-s="services">Services</a>
    <a href="${sectionHref('contact')}" data-s="contact">Contact</a>
  </nav>
</aside>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── CSS ──
  const style = document.createElement('style');
  style.textContent = `
    html, body { overflow-x: hidden; }

    .cat-body       { fill: var(--text); }
    .cat-ear-inner  { fill: var(--bg); }
    .cat-eye        { fill: var(--bg); }
    .cat-nose       { fill: var(--amber); }
    .cat-collar     { fill: var(--amber); opacity: 0.7; }

    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 180px; height: 100vh;
      background: var(--bg);
      border-right: 1px solid var(--border);
      z-index: 300;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 28px 22px 44px;
      overflow-y: auto;
    }

    .sidebar-cat svg { transition: opacity 0.3s; }
    .sidebar-cat svg:hover { opacity: 0.75; }

    .sidebar-nav {
      margin-top: 66px;
      position: static !important;
      inset: auto !important;
      width: auto !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      justify-content: flex-start !important;
      gap: 14px;
      padding: 0 !important;
      background: transparent !important;
      z-index: auto !important;
    }

    .sidebar-nav > a,
    .sidebar-work-item > a {
      font-size: 17px;
      color: var(--muted);
      letter-spacing: 0.04em;
      display: block;
      transition: color 0.15s;
    }

    .sidebar-nav > a:hover,
    .sidebar-nav > a.active,
    .sidebar-work-item > a:hover,
    .sidebar-work-item > a.active { color: var(--text); }

    .sidebar-work-item {
      display: flex;
      flex-direction: column;
    }

    .sidebar-sub {
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s, margin-top 0.3s;
      display: flex;
      flex-direction: column;
      padding-left: 12px;
      border-left: 1px solid var(--border);
      margin-top: 0;
    }

    .sidebar-sub.open {
      max-height: 600px;
      opacity: 1;
      margin-top: 10px;
    }

    .sidebar-sub-link {
      font-size: 14px;
      color: var(--muted);
      letter-spacing: 0.02em;
      display: block;
      transition: color 0.15s;
      padding: 4px 0;
      line-height: 1.35;
    }

    .sidebar-sub-link:hover,
    .sidebar-sub-link.active { color: var(--amber); }

    .sidebar-sub-all {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    body > *:not(.sidebar):not(#cursor):not(#cursor-label):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
      margin-left: 180px;
    }

    /* ── TABLET ── */
    @media (max-width: 1024px) {
      .sidebar { width: 160px; }
      body > *:not(.sidebar):not(#cursor):not(#cursor-label):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
        margin-left: 160px;
      }
    }

    /* ── MOBILE: sidebar slides in, pushes content ── */
    @media (max-width: 768px) {
      .sidebar {
        width: 260px;
        transform: translateX(-100%);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        z-index: 400;
        justify-content: space-between;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      body > *:not(.sidebar):not(#cursor):not(#cursor-label):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
        margin-left: 0 !important;
        transform: translateX(0);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
      }

      body.sidebar-push > *:not(.sidebar):not(#cursor):not(#cursor-label):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
        margin-left: 0 !important;
        transform: translateX(260px) !important;
      }
    }

    /* ── GLOBAL THEME TRANSITION — all pages, all elements ── */
    *, *::before, *::after {
      transition:
        background-color 1.2s cubic-bezier(0.4,0,0.2,1),
        color            1.2s cubic-bezier(0.4,0,0.2,1),
        border-color     1.2s cubic-bezier(0.4,0,0.2,1),
        fill             1.2s cubic-bezier(0.4,0,0.2,1);
    }
    /* Keep hover/interactive transitions fast */
    a, button, .hero-cta, .contact-link, .social-link,
    .view-all, .footer-links a, .sidebar-link, .nav-lang-opt,
    .nav-theme-btn, .hamburger { transition-duration: 0.15s !important; }

    /* ── GLOBAL THEME VARIABLES (light + dark) — applies to ALL pages ── */
    html[data-theme="light"] {
      --bg:       #e8e6de;
      --bg-panel: #d8d6cd;
      --bg-card:  #c8c49a;
      --bg-inv:   #1a1a14;
      --text:     #1a1a14;
      --text-inv: #e8e6de;
      --muted:    #716f55;
      --amber:    #d4900e;
      --border:   rgba(65,64,50,0.137);
    }
    html[data-theme="dark"] {
      --bg:       #16160f;
      --bg-panel: #1a1a14;
      --bg-card:  #3d3c2f;
      --bg-inv:   #e8e6de;
      --text:     #c8c49a;
      --text-inv: #16160f;
      --muted:    #716f55;
      --amber:    #d4900e;
      --border:   rgba(200,196,154,0.13);
    }

    /* light mode: hero highlight uses mid-tone bg-card so word stays readable */
    html[data-theme="light"] .hero-title-line1 { background: var(--bg-card); }
    html[data-theme="light"] .hero-title-word  { color: var(--text); }
    html[data-theme="light"] .tw-cursor        { color: var(--text); }

    /* ── UNIVERSAL NAV — tablet & mobile ── */
    @media (max-width: 1024px) {
      nav, #topNav {
        left: 0 !important;
        padding: 18px 22px !important;
        justify-content: flex-start !important;
        gap: 14px !important;
        background: var(--bg) !important;
      }
      nav .hamburger,
      #topNav .hamburger,
      .hamburger {
        display: flex !important;
        margin-right: 0 !important;
        order: -1 !important;
      }
      nav .nav-logo,
      #topNav .nav-logo,
      .nav-logo {
        min-width: unset !important;
        font-size: 13px !important;
        letter-spacing: 0.08em !important;
      }
    }

    /* ── NAV CONTROLS (theme + lang) ── */
    .nav-controls {
      display: flex; align-items: center; gap: 18px;
      margin-left: auto;
    }
    .nav-lang {
      display: flex; align-items: center;
      font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
      font-family: var(--font); color: var(--muted);
    }
    .nav-lang-opt {
      padding: 5px 9px; cursor: pointer;
      transition: color 0.15s;
    }
    .nav-lang-opt:hover { color: var(--text); }
    .nav-lang-opt.active { color: var(--amber); }
    .nav-lang-sep { color: var(--muted); opacity: 0.4; }
    .nav-theme-btn {
      background: none; border: none; cursor: pointer;
      padding: 5px; display: flex; align-items: center; justify-content: center;
      color: var(--muted); line-height: 1;
      transition: color 0.15s;
    }
    .nav-theme-btn:hover { color: var(--text); }
  `;
  document.head.appendChild(style);

  const sub = document.getElementById('sidebarSub');

  // Works / Projects pages: always open sub-menu
  if (inWorks || isProjects) {
    if (sub) sub.classList.add('open');
    // still need hamburger — fall through to setupHamburger below
  }

  // Index: observe #work section
  if (isIndex) {
    window.addEventListener('DOMContentLoaded', () => {
      // Subrama toggle
      const workSection = document.getElementById('work');
      if (workSection && sub) {
        const workObs = new IntersectionObserver(entries => {
          sub.classList.toggle('open', entries[0].isIntersecting);
        }, { threshold: 0.05 });
        workObs.observe(workSection);
      }

      // Sidebar link active state
      const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-s], .sidebar-work-item a[data-s]');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting)
            sidebarLinks.forEach(l => l.classList.toggle('active', l.dataset.s === e.target.id));
        });
      }, { threshold: 0.3 });
      document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    });
  }

  // ── MOBILE HAMBURGER TOGGLE (all pages) ──
  function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-push');
      hamburger.classList.toggle('open');

      // Prevent scroll when open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close sidebar when clicking a link
    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-push');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // pixel-art sun / moon SVGs (no emoji)
  const SVG_SUN  = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;display:block" aria-hidden="true">
    <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="7" y="2" width="2" height="3" fill="currentColor"/>
    <rect x="7" y="11" width="2" height="3" fill="currentColor"/>
    <rect x="2" y="7" width="3" height="2" fill="currentColor"/>
    <rect x="11" y="7" width="3" height="2" fill="currentColor"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor"/>
    <rect x="11" y="3" width="2" height="2" fill="currentColor"/>
    <rect x="3" y="11" width="2" height="2" fill="currentColor"/>
    <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
  </svg>`;

  const SVG_MOON = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;display:block" aria-hidden="true">
    <rect x="5" y="2" width="5" height="1" fill="currentColor"/>
    <rect x="3" y="3" width="7" height="1" fill="currentColor"/>
    <rect x="2" y="4" width="8" height="8" fill="currentColor"/>
    <rect x="3" y="12" width="7" height="1" fill="currentColor"/>
    <rect x="5" y="13" width="5" height="1" fill="currentColor"/>
    <rect x="8" y="2" width="4" height="3" fill="currentColor" opacity="0"/>
    <rect x="9" y="3" width="4" height="1" fill="var(--bg)"/>
    <rect x="9" y="4" width="3" height="7" fill="var(--bg)"/>
    <rect x="9" y="11" width="3" height="1" fill="var(--bg)"/>
    <rect x="8" y="12" width="4" height="1" fill="var(--bg)"/>
  </svg>`;

  // ── NAV CONTROLS (theme toggle + lang) — all pages ──
  function setupNavControls() {
    const nav = document.querySelector('#topNav') || document.querySelector('nav:not(.sidebar-nav)');
    if (!nav) return;

    // Remove any existing nav-controls to avoid duplicates
    const existing = nav.querySelector('.nav-controls');
    if (existing) existing.remove();

    // Apply saved theme immediately
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    const savedLang = localStorage.getItem('aa-lang') || 'en';

    const ctrl = document.createElement('div');
    ctrl.className = 'nav-controls';
    ctrl.innerHTML = `
      <div class="nav-lang">
        <span class="nav-lang-opt${savedLang === 'en' ? ' active' : ''}" data-lang="en">EN</span>
        <span class="nav-lang-sep">/</span>
        <span class="nav-lang-opt${savedLang === 'es' ? ' active' : ''}" data-lang="es">ES</span>
      </div>
      <button class="nav-theme-btn" id="sidebarThemeBtn" aria-label="Toggle theme">${saved === 'dark' ? SVG_MOON : SVG_SUN}</button>
    `;
    nav.appendChild(ctrl);

    // Theme toggle
    const btn = ctrl.querySelector('#sidebarThemeBtn');
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      btn.innerHTML = next === 'dark' ? SVG_MOON : SVG_SUN;
      localStorage.setItem('theme', next);
    });

    // Lang toggle
    ctrl.querySelectorAll('.nav-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        ctrl.querySelectorAll('.nav-lang-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        localStorage.setItem('aa-lang', opt.dataset.lang);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setupHamburger(); setupNavControls(); });
  } else {
    setupHamburger();
    setupNavControls();
  }
})();
