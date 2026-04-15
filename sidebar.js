(function () {

  // ── TRANSLATIONS ──
  const T = {
    en: {
      'nav.home':    'Home',
      'nav.work':    'Work',
      'nav.about':   'About',
      'nav.services':'Services',
      'nav.contact': 'Contact',
      'nav.all':     'All Projects →',

      'hero.sub':         'Product designer collaborating with teams to create digital products that solve real problems. 4 years across fintech, Web3, AI, healthcare, e-commerce.',
      'hero.cta.work':    '<span class="arr">→</span> View Work',
      'hero.cta.contact': '<span class="arr">→</span> Get in Touch',

      'work.eyebrow': 'Selected Works',
      'work.title':   'Projects',
      'work.count':   '10 Projects',
      'work.all':     'All Projects (10) →',

      'meta.category':     'Category',
      'meta.client':       'Client',
      'meta.type':         'Type',
      'meta.year':         'Year',
      'meta.duration':     'Duration',
      'meta.role':         'Role',
      'meta.deliverables': 'Deliverables',
      'nav.prev': '← Previous',
      'nav.next': 'Next →',
      'footer.copy.short': '© 2026 — Alejandro Arab',

      'about.eyebrow':  'About',
      'about.heading':  'Who I am',
      'about.p1': "I'm a Product Designer with 4 years of experience across healthcare, e-commerce, travel, AI, decentralized fintech, and Web3. I come from an uncommon background — gastronomy — which gave me a unique foundation in discipline, process, and working well under pressure.",
      'about.p2': 'I specialize in research, wireframes, high-fidelity prototypes, animations, and design systems. I enjoy collaborating from client briefs to final delivery, turning ideas into real products.',
      'about.tag.research':    'Research',
      'about.tag.wireframes':  'Wireframes',
      'about.tag.prototyping': 'Prototyping',
      'about.tag.ds':          'Design Systems',
      'about.tag.animation':   'Animation',
      'about.tag.art':         'Art Direction',

      'exp.eyebrow': 'Experience',
      'exp.title':   'Work History',
      'exp.lead':      'Design Lead',
      'exp.freelance': 'Freelance Designer',
      'exp.product':   'Product Designer',
      'exp.professor': 'Professor — UX/UI & Prototyping',

      'svc.eyebrow':  'Services',
      'svc.title':    'What I Do',
      'svc.1.title':  'Digital Design',
      'svc.1.desc':   'Crafting visually appealing and user-friendly interfaces that create intuitive and seamless experiences.',
      'svc.2.title':  'Framer Expert',
      'svc.2.desc':   'The most efficient platform to implement web solutions and publish websites with one click.',
      'svc.3.title':  'Product Strategy',
      'svc.3.desc':   'Defining product vision, strategizing the approach, and setting both short and long-term goals.',
      'svc.4.title':  'Art Direction',
      'svc.4.desc':   "Establishing a strong foundation to set the project's tone, providing a clear and organized starting point.",
      'svc.5.title':  'Web Design & Dev',
      'svc.5.desc':   'Crafting visually stunning and functionally robust websites with responsive design and custom development.',
      'svc.6.title':  'UI/UX Design',
      'svc.6.desc':   'Elevating user experience with interfaces that enhance engagement. Blending creativity with usability.',

      'contact.eyebrow':      'Contact',
      'contact.headline':     "Let's Build<br>Something<br><span class=\"am\">Together.</span>",
      'contact.sub':          "I'm currently available for new work. Let me know if you need a digital designer — I'd love to talk about the next big thing.",
      'contact.card.label':   '// Availability',
      'contact.status.k':     'Status',
      'contact.status.v':     'Open to work ●',
      'contact.response.k':   'Response',
      'contact.response.v':   '24–48 hrs',
      'contact.tz.k':         'Timezone',
      'contact.tz.v':         'GMT+0 London',
      'contact.pref.k':       'Preferred',
      'contact.pref.v':       'Email / LinkedIn',
      'contact.email':        'Send me an email',

      'footer.copy': '© 2026 — Alejandro Arab. All rights reserved.',
    },
    es: {
      'nav.home':    'Inicio',
      'nav.work':    'Trabajo',
      'nav.about':   'Sobre mí',
      'nav.services':'Servicios',
      'nav.contact': 'Contacto',
      'nav.all':     'Ver todos →',

      'hero.sub':         'Diseñador de producto colaborando con equipos para crear productos digitales que resuelven problemas reales. 4 años en fintech, Web3, IA, salud y e-commerce.',
      'hero.cta.work':    '<span class="arr">→</span> Ver trabajo',
      'hero.cta.contact': '<span class="arr">→</span> Hablemos',

      'work.eyebrow': 'Trabajos seleccionados',
      'work.title':   'Proyectos',
      'work.count':   '10 Proyectos',
      'work.all':     'Todos los proyectos (10) →',

      'meta.category':     'Categoría',
      'meta.client':       'Cliente',
      'meta.type':         'Tipo',
      'meta.year':         'Año',
      'meta.duration':     'Duración',
      'meta.role':         'Rol',
      'meta.deliverables': 'Entregables',
      'nav.prev': '← Anterior',
      'nav.next': 'Siguiente →',
      'footer.copy.short': '© 2026 — Alejandro Arab',

      'about.eyebrow':  'Sobre mí',
      'about.heading':  'Quién soy',
      'about.p1': 'Soy Diseñador de Producto con 4 años de experiencia en salud, e-commerce, viajes, IA, fintech descentralizado y Web3. Vengo de un entorno atípico — la gastronomía — que me dio una base única en disciplina, proceso y trabajo bajo presión.',
      'about.p2': 'Me especializo en investigación, wireframes, prototipos de alta fidelidad, animaciones y sistemas de diseño. Disfruto colaborar desde el brief del cliente hasta la entrega final, convirtiendo ideas en productos reales.',
      'about.tag.research':    'Investigación',
      'about.tag.wireframes':  'Wireframes',
      'about.tag.prototyping': 'Prototipado',
      'about.tag.ds':          'Sistemas de diseño',
      'about.tag.animation':   'Animación',
      'about.tag.art':         'Dirección de arte',

      'exp.eyebrow': 'Experiencia',
      'exp.title':   'Historial laboral',
      'exp.lead':      'Líder de Diseño',
      'exp.freelance': 'Diseñador Freelance',
      'exp.product':   'Diseñador de Producto',
      'exp.professor': 'Profesor — UX/UI y Prototipado',

      'svc.eyebrow':  'Servicios',
      'svc.title':    'Qué hago',
      'svc.1.title':  'Diseño Digital',
      'svc.1.desc':   'Interfaces visualmente atractivas y fáciles de usar que crean experiencias intuitivas y fluidas.',
      'svc.2.title':  'Experto en Framer',
      'svc.2.desc':   'La plataforma más eficiente para implementar soluciones web y publicar sitios con un solo clic.',
      'svc.3.title':  'Estrategia de Producto',
      'svc.3.desc':   'Definición de la visión del producto, estrategia y objetivos a corto y largo plazo.',
      'svc.4.title':  'Dirección de Arte',
      'svc.4.desc':   'Establecimiento de una base sólida para definir el tono del proyecto, con un punto de partida claro y organizado.',
      'svc.5.title':  'Diseño y Desarrollo Web',
      'svc.5.desc':   'Sitios web visualmente impactantes y robustos con diseño responsivo y desarrollo personalizado.',
      'svc.6.title':  'Diseño UI/UX',
      'svc.6.desc':   'Elevando la experiencia del usuario con interfaces que aumentan el engagement, combinando creatividad y usabilidad.',

      'contact.eyebrow':      'Contacto',
      'contact.headline':     "Construyamos<br>algo<br><span class=\"am\">juntos.</span>",
      'contact.sub':          'Estoy disponible para nuevos proyectos. Contáctame si necesitás un diseñador digital — me encantaría hablar sobre lo que viene.',
      'contact.card.label':   '// Disponibilidad',
      'contact.status.k':     'Estado',
      'contact.status.v':     'Disponible ●',
      'contact.response.k':   'Respuesta',
      'contact.response.v':   '24–48 hs',
      'contact.tz.k':         'Zona horaria',
      'contact.tz.v':         'GMT+0 Londres',
      'contact.pref.k':       'Preferido',
      'contact.pref.v':       'Email / LinkedIn',
      'contact.email':        'Enviarme un email',

      'footer.copy': '© 2026 — Alejandro Arab. Todos los derechos reservados.',
    }
  };

  // ── APPLY LANGUAGE ──
  function applyLang(lang) {
    const t = T[lang] || T.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    // Update <html lang> attribute
    document.documentElement.lang = lang;
  }

  const path     = window.location.pathname;
  const file     = path.split('/').pop() || 'index.html';
  const inWorks  = path.includes('/works/');
  const isContact  = file === 'contact.html';
  const isProjects = file === 'projects.html';
  const isIndex  = file === 'index.html' || file === '' || path === '/';
  const prefix   = inWorks ? '../' : '';

  // ── Sub-links — filled after projects.js loads ──
  const subLinks = '';

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

  // When already on home, use pure hash links so transition.js skips them (smooth scroll only).
  const sectionHref = (anchor) => isIndex ? `#${anchor}` : `${prefix}index.html#${anchor}`;

  const html = `<aside class="sidebar" id="sidebar">
  <div class="sidebar-cat">${catSVG}</div>
  <nav class="sidebar-nav">
    <a href="${sectionHref('hero')}" data-s="hero" data-i18n="nav.home">Home</a>
    <div class="sidebar-work-item">
      <a href="${sectionHref('work')}" data-s="work"${workActive ? ' class="active"' : ''} data-i18n="nav.work">Work</a>
      <div class="sidebar-sub" id="sidebarSub">
        ${subLinks}
        <a class="sidebar-sub-link sidebar-sub-all" href="${prefix}projects.html" data-i18n="nav.all">All Projects →</a>
      </div>
    </div>
    <a href="${sectionHref('about')}" data-s="about" data-i18n="nav.about">About</a>
    <a href="${sectionHref('services')}" data-s="services" data-i18n="nav.services">Services</a>
    <a href="${sectionHref('contact')}" data-s="contact" data-i18n="nav.contact">Contact</a>
  </nav>
</aside>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── Fill project sub-links from projects.js (loaded after sidebar.js) ──
  window.addEventListener('DOMContentLoaded', function () {
    const sub = document.getElementById('sidebarSub');
    if (!sub || typeof PROJECTS === 'undefined') return;
    const allLink = sub.querySelector('.sidebar-sub-all');
    PROJECTS.filter(p => !p.hidden).forEach(p => {
      const active = file === p.id + '.html';
      const a = document.createElement('a');
      a.className = 'sidebar-sub-link' + (active ? ' active' : '');
      a.href = prefix + 'works/' + p.id + '.html';
      a.textContent = p.title;
      sub.insertBefore(a, allLink);
    });
  });

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
      padding-left: 0;
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
      position: relative;
      transition: color 0.15s;
      padding: 4px 0;
      line-height: 1.35;
    }

    /* ── TREE CONNECTORS ── */
    /* Each project link gets its own independent curved hook — no shared trunk */
    .sidebar-sub-link:not(.sidebar-sub-all) {
      padding-left: 14px;
    }
    .sidebar-sub-link:not(.sidebar-sub-all)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 62%;
      width: 9px;
      border-left: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      border-bottom-left-radius: 5px;
    }

    /* "Ver todos" — no connector but slight indent to show it belongs to the submenu */
    .sidebar-sub-all {
      padding-left: 14px;
    }

    .sidebar-sub-link:hover,
    .sidebar-sub-link.active { color: var(--amber); }

    .sidebar-sub-all {
      margin-top: 12px;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    body > *:not(.sidebar):not(#cursor):not(#cursor-label):not(#custom-cursor):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
      margin-left: 180px;
    }

    /* ── TABLET + MOBILE (≤1024px): sidebar slides in, no persistent offset ── */
    @media (max-width: 1024px) {
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

      body > *:not(.sidebar):not(#cursor):not(#cursor-label):not(#custom-cursor):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
        margin-left: 0 !important;
        transform: translateX(0);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
      }

      body.sidebar-push > *:not(.sidebar):not(#cursor):not(#cursor-label):not(#custom-cursor):not(.mobile-menu):not(#pt-backdrop):not(#pt-overlay):not(#pt-label) {
        margin-left: 0 !important;
        transform: translateX(260px) !important;
      }
    }

    /* ── EASING TOKENS ── */
    :root {
      --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
      --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
    }

    /* ── GLOBAL THEME TRANSITION — all pages, all elements ── */
    *, *::before, *::after {
      transition:
        background-color 300ms ease-out,
        color            300ms ease-out,
        border-color     300ms ease-out,
        fill             300ms ease-out;
    }
    /* Keep hover/interactive transitions fast */
    a, button, .hero-cta, .contact-link, .social-link,
    .view-all, .footer-links a, .sidebar-link, .nav-lang-opt,
    .nav-theme-btn, .hamburger { transition-duration: 150ms !important; }

    /* ── PRESS FEEDBACK — all clickable elements ── */
    a, button {
      transition: transform 100ms ease-out, color 150ms ease-out,
                  background-color 150ms ease-out, opacity 150ms ease-out;
    }
    @media (hover: hover) and (pointer: fine) {
      a:active, button:active { transform: scale(0.97); }
    }

    /* ── SIDEBAR HOVER — only on real pointers ── */
    @media (hover: hover) and (pointer: fine) {
      .sidebar-nav > a:hover,
      .sidebar-nav > a.active,
      .sidebar-work-item > a:hover,
      .sidebar-work-item > a.active { color: var(--text); }
      .sidebar-sub-link:hover,
      .sidebar-sub-link.active { color: var(--amber); }
    }

    /* ── REDUCED MOTION ── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
      ::view-transition-new(root), ::view-transition-old(root) { animation: none !important; }
    }

    /* light mode: hero highlight uses mid-tone bg-card so word stays readable */
    html[data-theme="light"] .hero-title-line1 { background: var(--bg-card); }
    html[data-theme="light"] .hero-title-word  { color: var(--text); }
    html[data-theme="light"] .tw-cursor        { color: var(--text); }

    /* ── VIEW TRANSITIONS ── */
    @view-transition { navigation: auto; }

    @keyframes vt-enter {
      from { transform: translate(88px, 28px); opacity: 0; }
      to   { transform: translate(0, 0); opacity: 1; }
    }
    @keyframes vt-exit-project {
      from { transform: translate(0, 0); opacity: 1; }
      to   { transform: translate(88px, 28px); opacity: 0; }
    }
    @keyframes vt-reveal-back {
      from { opacity: 0.85; }
      to   { opacity: 1; }
    }

    /* Forward: entering a project page */
    html:not([data-nav-dir="back"]) ::view-transition-new(root) {
      animation: 500ms cubic-bezier(0.22, 1, 0.36, 1) both vt-enter;
      z-index: 2;
    }
    html:not([data-nav-dir="back"]) ::view-transition-old(root) {
      animation: none; z-index: 1;
    }

    /* Back: exiting a project page */
    html[data-nav-dir="back"] ::view-transition-old(root) {
      animation: 380ms cubic-bezier(0.4, 0, 1, 1) both vt-exit-project;
      z-index: 2;
    }
    html[data-nav-dir="back"] ::view-transition-new(root) {
      animation: 380ms cubic-bezier(0.22, 1, 0.36, 1) both vt-reveal-back;
      z-index: 1;
    }

    /* ── UNIVERSAL NAV — tablet & mobile ── */
    @media (max-width: 1024px) {
      nav, #topNav {
        left: 0 !important;
        padding: 18px 22px !important;
        justify-content: flex-start !important;
        gap: 14px !important;
        background: var(--bg) !important;
      }
      nav .nav-logo,
      #topNav .nav-logo,
      .nav-logo {
        min-width: unset !important;
        font-size: 13px !important;
        letter-spacing: 0.08em !important;
      }
    }

    /* Hamburger on tablet + mobile (≤1024px) */
    @media (max-width: 1024px) {
      nav .hamburger,
      #topNav .hamburger,
      .hamburger {
        display: flex !important;
        margin-right: 0 !important;
        order: -1 !important;
      }
    }

    /* No hamburger on desktop (>1024px) */
    @media (min-width: 1025px) {
      nav .hamburger,
      #topNav .hamburger,
      .hamburger {
        display: none !important;
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
    if (sub) {
      sub.classList.add('open');
    }
  }

  // Index: observe #work section
  if (isIndex) {
    window.addEventListener('DOMContentLoaded', () => {
      const workSection = document.getElementById('work');
      if (workSection && sub) {
        const workObs = new IntersectionObserver(entries => {
          sub.classList.toggle('open', entries[0].isIntersecting);
        }, { threshold: 0.05 });
        workObs.observe(workSection);
      }

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


  // ── MOBILE HAMBURGER TOGGLE ──
  function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-push');
      hamburger.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-push');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // pixel-art sun / moon SVGs
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
    <rect x="9" y="3" width="4" height="1" fill="var(--bg)"/>
    <rect x="9" y="4" width="3" height="7" fill="var(--bg)"/>
    <rect x="9" y="11" width="3" height="1" fill="var(--bg)"/>
    <rect x="8" y="12" width="4" height="1" fill="var(--bg)"/>
  </svg>`;

  // ── NAV CONTROLS (theme toggle + lang) — all pages ──
  function setupNavControls() {
    const nav = document.querySelector('#topNav') || document.querySelector('nav:not(.sidebar-nav)');
    if (!nav) return;

    const existing = nav.querySelector('.nav-controls');
    if (existing) existing.remove();

    // Auto-detect system theme on first visit, then respect localStorage
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = localStorage.getItem('aa-theme') || systemTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);

    // Auto-detect language from browser locale on first visit
    const browserLang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
    const activeLang = localStorage.getItem('aa-lang') || (browserLang.startsWith('es') ? 'es' : 'en');

    const ctrl = document.createElement('div');
    ctrl.className = 'nav-controls';
    ctrl.innerHTML = `
      <div class="nav-lang">
        <span class="nav-lang-opt${activeLang === 'en' ? ' active' : ''}" data-lang="en">EN</span>
        <span class="nav-lang-sep">/</span>
        <span class="nav-lang-opt${activeLang === 'es' ? ' active' : ''}" data-lang="es">ES</span>
      </div>
      <button class="nav-theme-btn" id="sidebarThemeBtn" aria-label="Toggle theme">${activeTheme === 'dark' ? SVG_MOON : SVG_SUN}</button>
    `;
    nav.appendChild(ctrl);

    // Apply detected/saved language on load
    applyLang(activeLang);

    // Theme toggle
    const btn = ctrl.querySelector('#sidebarThemeBtn');
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      btn.innerHTML = next === 'dark' ? SVG_MOON : SVG_SUN;
      localStorage.setItem('aa-theme', next); // persist so auto-detect only runs once
    });

    // Lang toggle
    ctrl.querySelectorAll('.nav-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        ctrl.querySelectorAll('.nav-lang-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const lang = opt.dataset.lang;
        localStorage.setItem('aa-lang', lang);
        applyLang(lang);
        // Notify works pages so they can re-render with new language
        window.dispatchEvent(new CustomEvent('aa:langchange', { detail: { lang } }));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setupHamburger(); setupNavControls(); });
  } else {
    setupHamburger();
    setupNavControls();
  }

  // ── pixel-reveal.js — disabled for now, re-enable by uncommenting ──
  // const _prScript = document.createElement('script');
  // _prScript.src = prefix + 'pixel-reveal.js';
  // document.head.appendChild(_prScript);

  // ── PAGE TRANSITIONS ──
  // Set direction in sessionStorage before navigating
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank') return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    const isOnProject = window.location.pathname.includes('/works/');
    const goingToProject = href.includes('works/');
    if (isOnProject && !goingToProject) {
      sessionStorage.setItem('aa-nav-dir', 'back');
    } else {
      sessionStorage.setItem('aa-nav-dir', 'forward');
    }
  });

  // Apply direction on new page load (before first paint)
  window.addEventListener('pagereveal', function() {
    const dir = sessionStorage.getItem('aa-nav-dir') || 'forward';
    sessionStorage.removeItem('aa-nav-dir');
    document.documentElement.setAttribute('data-nav-dir', dir);
  });

  // Intercept programmatic navigateTo (prev/next in project pages)
  const _origNavigate = window.navigateTo;
  window.navigateTo = function(url) {
    const isOnProject = window.location.pathname.includes('/works/');
    const goingToProject = (url || '').includes('works/');
    if (isOnProject && !goingToProject) {
      sessionStorage.setItem('aa-nav-dir', 'back');
    } else {
      sessionStorage.setItem('aa-nav-dir', 'forward');
    }
    if (_origNavigate) _origNavigate(url);
    else window.location.href = url;
  };

})();
