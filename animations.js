/* ============================================================
   AA ANIMATIONS — Loader / Arrow swap / Scramble on scroll
   ============================================================
   Single file, zero dependencies.

   Edit CONFIG below to enable/disable each effect independently.
   To REMOVE all animations: delete this file + animations.css
   and remove the two tags from every HTML page.

   Load order: put <script src="animations.js"></script> RIGHT
   AFTER <body> opens so the loader can inject itself before
   the rest of the page paints.
   ============================================================ */

(function () {
  'use strict';

  // ── CONFIG ────────────────────────────────────────────────
  const CONFIG = {
    loader:   true,   // intro screen, once per session
    arrows:   true,   // animated → on CTAs and project cards
    scramble: true,   // section titles scramble when in view
  };

  // Loader copy + timings — tweak freely.
  // The loader replicates the navbar's scramble (index.html ~L1402).
  // We start by showing "hddhdhdydjv", briefly hold, then scramble to the
  // canonical name. Stored mixed-case here; CSS text-transform:uppercase
  // displays them uppercase, and the canvas snapshot is uppercased to match.
  const LOADER_FROM_TEXT      = 'hddhdhdydjv';
  const LOADER_TEXT           = 'Alejandro Arab';
  const LOADER_FROM_HOLD_MS   = 350;   // show FROM text before scramble starts
  const LOADER_TICK_MS        = 30;    // navbar uses 30ms — exact match
  const LOADER_TICKS_PER_CHAR = 7;     // navbar uses target.length * 7 ticks
  const LOADER_HOLD_MS        = 450;   // pause after reveal before dissolve
  const LOADER_DISSOLVE_MS    = 1500;  // pixel dissolve duration — matches VVD
  const LOADER_PIXEL_PERCENT  = 3.5;   // cell size = min(W,H) * this/100
  const SCRAMBLE_MS           = 650;   // section-title scramble duration

  // Exact char pool used by the navbar scramble in index.html.
  const LOADER_SCRAMBLE_CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================
  // 1. LOADER
  // ==========================================================
  // Apply the user's saved theme synchronously, BEFORE injecting the loader.
  // sidebar.js does this same logic later; we run it earlier so the loader's
  // first paint already uses the correct token values (no color flash).
  // Default is 'light' on first visit (no localStorage value yet).
  function applyThemeEarly() {
    try {
      const saved = localStorage.getItem('aa-theme');
      document.documentElement.setAttribute('data-theme', saved || 'light');
    } catch (_) { /* localStorage unavailable — keep HTML default */ }
  }

  // Session-scoped guard: the loader plays once per browser session. It
  // does NOT replay when the visitor navigates between pages (home →
  // projects → a work detail). Closing the tab and reopening clears the
  // flag and the loader plays again. Wipe via:
  //   sessionStorage.removeItem('aa-loader-shown')
  const LOADER_SESSION_KEY = 'aa-loader-shown';

  function initLoader() {
    if (reduceMotion) return;
    if (!document.body) return; // safety

    // Theme must be applied even when we skip the loader, otherwise pages
    // without sidebar.js running yet would flash dark.
    applyThemeEarly();

    try {
      if (sessionStorage.getItem(LOADER_SESSION_KEY) === '1') return;
      sessionStorage.setItem(LOADER_SESSION_KEY, '1');
    } catch (_) { /* sessionStorage unavailable — fall through, show loader */ }

    const loader = document.createElement('div');
    loader.className = 'aa-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
      '<div class="aa-loader-text">' +
        '<span class="aa-loader-body"></span>' +
      '</div>';

    document.body.prepend(loader);
    document.body.classList.add('aa-loading');

    const body = loader.querySelector('.aa-loader-body');

    // Pre-fill so the layout box is reserved at the right width while the
    // text is hidden. This prevents a width "snap" when we make it visible.
    body.textContent = LOADER_FROM_TEXT;

    // Reveal the text only once webfonts AND theme are settled. Without
    // this, the first frame can render with Courier-fallback metrics and
    // then visibly relayout when Departure Mono arrives.
    const fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();
    fontsReady
      .catch(() => {})
      .then(() => {
        // Two rAFs: first commits style/layout, second guarantees the
        // browser has painted with Departure Mono before we unhide.
        requestAnimationFrame(() => requestAnimationFrame(startSequence));
      });

    function startSequence() {
      loader.classList.add('aa-ready');
      // Brief hold on "hddhdhdydjv" so the source word is readable, then
      // start the navbar scramble.
      setTimeout(runScramble, LOADER_FROM_HOLD_MS);
    }

    // Run the navbar's scramble verbatim:
    //
    //    function scramble(el, target) {
    //      let iter = 0;
    //      const total = target.length * 7;
    //      const iv = setInterval(() => {
    //        el.textContent = target.split('').map((ch, i) => {
    //          if (i < Math.floor(iter / 7)) return ch;
    //          return ch === ' ' ? ' ' : CHARS[(Math.random()*CHARS.length)|0];
    //        }).join('');
    //        if (iter++ >= total) { clearInterval(iv); el.textContent = target; }
    //      }, 30);
    //    }
    //
    function runScramble() {
      let iter = 0;
      const total = LOADER_TEXT.length * LOADER_TICKS_PER_CHAR;
      const iv = setInterval(() => {
        const revealed = Math.floor(iter / LOADER_TICKS_PER_CHAR);
        body.textContent = LOADER_TEXT.split('').map((ch, i) => {
          if (i < revealed) return ch;
          if (ch === ' ') return ' ';
          return LOADER_SCRAMBLE_CHARS[(Math.random() * LOADER_SCRAMBLE_CHARS.length) | 0];
        }).join('');
        if (iter++ >= total) {
          clearInterval(iv);
          body.textContent = LOADER_TEXT;
          setTimeout(exit, LOADER_HOLD_MS);
        }
      }, LOADER_TICK_MS);
    }

    function exit() {
      // Wait until webfonts are ready so the canvas text matches the DOM.
      const fontsReady = (document.fonts && document.fonts.ready)
        ? document.fonts.ready
        : Promise.resolve();
      fontsReady.then(pixelDissolveExit).catch(pixelDissolveExit);
    }

    // --- Pixel dissolve exit ---------------------------------
    // Snapshot the loader into a canvas (bg + text), remove the DOM
    // loader, then erase random CELL×CELL blocks of the canvas over
    // LOADER_DISSOLVE_MS, revealing the page underneath.
    function pixelDissolveExit() {
      const bodyEl  = loader.querySelector('.aa-loader-body');
      const cs      = getComputedStyle(bodyEl);
      const loaderCS = getComputedStyle(loader);
      const bgColor   = loaderCS.backgroundColor;
      const textColor = cs.color;
      const fontSize  = parseFloat(cs.fontSize);
      const fontFam   = cs.fontFamily;
      const fontWt    = cs.fontWeight;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      const canvas = document.createElement('canvas');
      canvas.className = 'aa-loader-canvas';
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.cssText =
        'position:fixed;inset:0;width:100%;height:100%;' +
        'z-index:10001;pointer-events:none;image-rendering:pixelated;';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Paint background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Paint the text in EXACTLY the same pixel position as the DOM,
      // so swapping the loader for the canvas doesn't visibly shift the
      // glyphs by a pixel or two.
      //
      // Strategy:
      //   1. Use Range.getBoundingClientRect() on the text node — this is
      //      the actual rectangle the browser is painting the glyphs into,
      //      including CSS letter-spacing and uppercase transform effects.
      //   2. Set ctx.textBaseline = 'alphabetic' and derive baseline Y from
      //      rect.bottom - actualBoundingBoxDescent (works whether the rect
      //      is tight to glyphs OR equal to the line box — the formula
      //      reduces to "rect.top + ascent" in the line-box case).
      //   3. Draw each character left-to-right starting at rect.left, with
      //      the same letter-spacing the DOM applies (0.08em).
      ctx.fillStyle = textColor;
      ctx.font = fontWt + ' ' + fontSize + 'px ' + fontFam;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';

      const upper    = LOADER_TEXT.toUpperCase();
      const tracking = fontSize * 0.08; // matches CSS letter-spacing: 0.08em

      const range = document.createRange();
      range.selectNodeContents(bodyEl);
      const textRect = range.getBoundingClientRect();

      const probe   = ctx.measureText(upper);
      const descent = probe.actualBoundingBoxDescent || (fontSize * 0.22);
      const baselineY = textRect.bottom - descent;

      let x = textRect.left;
      for (let i = 0; i < upper.length; i++) {
        ctx.fillText(upper[i], x, baselineY);
        x += ctx.measureText(upper[i]).width + tracking;
      }

      // Swap the DOM loader for the canvas
      document.body.appendChild(canvas);
      loader.remove();
      document.body.classList.remove('aa-loading');

      // Cell size matches VVD: 3.5% of the smaller viewport dimension.
      // → 1080p screen: ~37.8px, 1440x900: ~31.5px. Always chunky.
      const CELL = Math.max(1, Math.round(Math.min(W, H) * LOADER_PIXEL_PERCENT / 100));
      const cols = Math.ceil(W / CELL);
      const rows = Math.ceil(H / CELL);
      const total = cols * rows;
      const order = buildDissolveOrder(cols, rows, total);

      let erased = 0;
      const startT = performance.now();

      function frame(now) {
        const t = Math.min(1, (now - startT) / LOADER_DISSOLVE_MS);
        // GSAP power1.out — ease out, matches VVD's master timeline easing.
        const eased = 1 - (1 - t) * (1 - t);
        const target = (eased * total) | 0;
        while (erased < target) {
          const idx = order[erased++];
          const cx = (idx % cols) * CELL;
          const cy = ((idx / cols) | 0) * CELL;
          ctx.clearRect(cx, cy, CELL, CELL);
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          canvas.remove();
        }
      }
      requestAnimationFrame(frame);
    }
  }

  // Return a Uint32Array of cell indices in the order they should be erased.
  //
  // ── EXACT REPLICA of VVD's PixelReveal algorithm ──
  // Source: vvd.griflan.com/_nuxt/<chunk>.js — `PixelReveal` Vue component.
  //
  //   1. Pick a random origin point (originRow, originCol).
  //   2. For every cell, compute:
  //        offset = sin(row * 0.4) * 0.8 + sin(col * 0.3) * 0.6
  //        dist   = hypot(row - originRow, col - originCol)
  //      The sine offset is the secret sauce: it perturbs the radial
  //      distance with a low-frequency wave so the dissolve front is
  //      "organically noisy" — not a clean circle, not pure random.
  //   3. Sort cells by (dist + offset) ascending. When two cells differ
  //      by less than 1.5 in this combined value, randomize their order
  //      (the "jittered tiebreak" — gives the pixelated edge).
  //
  // Debug override (set in console before reload):
  //   window.AA_DISSOLVE_ORIGIN = [xFrac, yFrac]   // 0..1
  function buildDissolveOrder(cols, rows, total) {
    const forcedOrigin = window.AA_DISSOLVE_ORIGIN;
    const oRow = Array.isArray(forcedOrigin)
      ? forcedOrigin[1] * rows
      : Math.random() * rows;
    const oCol = Array.isArray(forcedOrigin)
      ? forcedOrigin[0] * cols
      : Math.random() * cols;

    // Build cell array with VVD's exact weight formula.
    const cells = new Array(total);
    for (let idx = 0; idx < total; idx++) {
      const c = idx % cols;
      const r = (idx / cols) | 0;
      const offset = Math.sin(r * 0.4) * 0.8 + Math.sin(c * 0.3) * 0.6;
      const dr = r - oRow;
      const dc = c - oCol;
      const dist = Math.sqrt(dr * dr + dc * dc);
      cells[idx] = { idx: idx, w: dist + offset };
    }

    // VVD's sort: if weights are within 1.5, randomize the tiebreak.
    cells.sort((a, b) => {
      const diff = a.w - b.w;
      return Math.abs(diff) > 1.5 ? diff : Math.random() - 0.5;
    });

    const order = new Uint32Array(total);
    for (let k = 0; k < total; k++) order[k] = cells[k].idx;
    return order;
  }

  // ==========================================================
  // 2. ARROW SWAP
  // ==========================================================
  // Selectors of elements whose trailing → should get the swap.
  const ARROW_SELECTORS = [
    '.hero-cta',
    '.card-arrow',
    '.view-all',
  ];

  function initArrows() {
    document.querySelectorAll(ARROW_SELECTORS.join(',')).forEach(enhanceArrow);
  }

  function enhanceArrow(el) {
    if (el.dataset.aaArrow === '1') return;

    // Case 1: explicit <span class="arr">→</span> inside
    const arrEl = el.querySelector('.arr');
    if (arrEl && /[→←]/.test(arrEl.textContent)) {
      const ch = arrEl.textContent.trim();
      wrapArrow(arrEl, ch);
      el.classList.add('aa-arrow-trigger');
      el.dataset.aaArrow = '1';
      return;
    }

    // Case 2: element ends with a bare → / ← in its text — wrap it.
    // Find the last descendant text node.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let last = null;
    while (walker.nextNode()) last = walker.currentNode;
    if (!last) return;
    const m = last.nodeValue.match(/([→←])\s*$/);
    if (!m) return;

    const char = m[1];
    last.nodeValue = last.nodeValue.replace(/[→←]\s*$/, '');
    const host = document.createElement('span');
    host.className = 'arr';
    last.parentNode.appendChild(host);
    wrapArrow(host, char);
    el.classList.add('aa-arrow-trigger');
    el.dataset.aaArrow = '1';
  }

  function wrapArrow(host, char) {
    host.classList.add('aa-arrow');
    host.innerHTML =
      '<span>' + char + '</span>' +
      '<span class="aa-arrow-ghost">' + char + '</span>';
  }

  // Debounced rescan — used after dynamic DOM updates (lang change,
  // projects.html renderCards, etc.).
  let arrowPending = false;
  function scheduleArrowRescan() {
    if (arrowPending) return;
    arrowPending = true;
    requestAnimationFrame(() => {
      arrowPending = false;
      if (CONFIG.arrows) initArrows();
    });
  }

  // ==========================================================
  // 3. SCRAMBLE ON SCROLL
  // ==========================================================
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*';

  function scrambleEl(el, duration) {
    if (!el || el.dataset.aaScrambling === '1') return;
    const target = (el.textContent || '').replace(/\s+$/, '');
    if (!target.trim() || target.length > 80) return;

    el.dataset.aaScrambling = '1';
    el.classList.add('aa-scramble');

    const total    = Math.max(14, Math.round(target.length * 3));
    const interval = Math.max(22, Math.round((duration || SCRAMBLE_MS) / total));
    let iter = 0;

    const iv = setInterval(() => {
      const progress = iter / total;
      const revealed = Math.floor(progress * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (i < revealed || ch === ' ' || ch === '\n') {
          out += ch;
        } else {
          out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
        }
      }
      el.textContent = out;
      if (++iter > total) {
        clearInterval(iv);
        el.textContent = target;
        delete el.dataset.aaScrambling;
      }
    }, interval);
  }

  function initScramble() {
    if (reduceMotion) return;
    // .section-title → eg. "Work History", "What I Do"
    // .about-heading → "Who I Am", "Beyond the Professional"
    const targets = document.querySelectorAll('.section-title, .about-heading');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        scrambleEl(entry.target, SCRAMBLE_MS);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

    targets.forEach((el) => io.observe(el));
  }

  // ==========================================================
  // BOOT
  // ==========================================================
  // Loader runs immediately (script is loaded right after <body>).
  if (CONFIG.loader) initLoader();

  function bootRest() {
    // Slight delay so other DOMContentLoaded handlers (e.g.
    // projects.html renderCards) finish first.
    setTimeout(() => {
      if (CONFIG.arrows)   initArrows();
      if (CONFIG.scramble) initScramble();
    }, 0);

    if (CONFIG.arrows) {
      window.addEventListener('aa:langchange', scheduleArrowRescan);
      // Also rescan when likely UI triggers fire (theme/lang toggles
      // may re-render some labels).
      document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('#lang-toggle, .theme-toggle, .nav-link')) {
          setTimeout(scheduleArrowRescan, 120);
        }
      }, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootRest);
  } else {
    bootRest();
  }

  // Public handle — other scripts can call these after DOM updates.
  window.AAAnimations = {
    rescanArrows: scheduleArrowRescan,
    scramble: scrambleEl,
    config: CONFIG,
  };
})();
