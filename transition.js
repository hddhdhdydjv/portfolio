// ── PAGE TRANSITION ──
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*─░▓◈';
  const NAMES = ['Alejandro Arab', 'hddhdhdydjv'];

  const COL_COLORS = [
    '#0a0a07', '#16160f', '#1e1e14', '#252518', '#2e2e20',
    '#3a3a28', '#4a4a35', '#5a5a42', '#6b6a52', '#c8c49a',
  ];
  const COLS    = COL_COLORS.length;
  const STAGGER = 55;

  let isAnimating = false;
  let loadFired   = false;

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Step 1: solid backdrop — always on, covers everything */
    #pt-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99990;
      background: #16160f;
      pointer-events: none;
      opacity: 0;
    }

    /* Step 2: columns sit above backdrop */
    #pt-overlay {
      position: fixed;
      inset: 0;
      z-index: 99995;
      pointer-events: none;
      display: grid;
      grid-template-columns: repeat(${COLS}, 1fr);
    }

    .pt-col {
      height: 100%;
      position: relative;
      transform: scaleY(0);
      transform-origin: bottom;
      will-change: transform;
      overflow: hidden;
    }

    .pt-col-bar {
      position: absolute;
      left: -1px; right: -1px;
      height: 3px;
      background: #d4900e;
      opacity: 0;
    }

    .pt-col-bar2 {
      position: absolute;
      left: -1px; right: -1px;
      height: 1px;
      background: #c8c49a;
      opacity: 0;
    }

    .pt-term {
      position: absolute;
      top: 20px; left: 8px;
      font-family: 'Departure Mono', 'Courier New', monospace;
      font-size: 9px;
      color: #3a3a28;
      line-height: 1.7;
      letter-spacing: 0.06em;
      white-space: nowrap;
      opacity: 0;
    }

    /* Label above everything */
    #pt-label {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      pointer-events: none;
      opacity: 0;
    }

    #pt-name {
      font-family: 'Departure Mono', 'Courier New', monospace;
      font-size: clamp(20px, 3.5vw, 44px);
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #c8c49a;
      white-space: nowrap;
    }

    #pt-bar-wrap {
      width: 160px; height: 1px;
      background: #2e2e1e;
      overflow: hidden; position: relative;
    }

    #pt-bar {
      position: absolute;
      top: 0; left: 0;
      height: 100%; width: 0;
      background: #d4900e;
    }

    #pt-sub {
      font-family: 'Departure Mono', 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #716f55;
    }
  `;
  document.head.appendChild(style);

  /* ── DOM ── */
  const backdrop = document.createElement('div');
  backdrop.id = 'pt-backdrop';
  document.body.appendChild(backdrop);

  const overlay = document.createElement('div');
  overlay.id = 'pt-overlay';
  COL_COLORS.forEach((color, i) => {
    const col = document.createElement('div');
    col.className = 'pt-col';
    col.style.background = color;

    const bar = document.createElement('div');
    bar.className = 'pt-col-bar';
    col.appendChild(bar);

    const bar2 = document.createElement('div');
    bar2.className = 'pt-col-bar2';
    col.appendChild(bar2);

    if (i === 0) {
      const term = document.createElement('div');
      term.className = 'pt-term';
      term.innerHTML = '$ ME v2.0 --boot<br>&gt; system OK<br>&gt; audio OK<br>&gt; |';
      col.appendChild(term);
    }

    overlay.appendChild(col);
  });
  document.body.appendChild(overlay);

  const label = document.createElement('div');
  label.id = 'pt-label';
  label.innerHTML = `
    <div id="pt-name">Alejandro Arab</div>
    <div id="pt-bar-wrap"><div id="pt-bar"></div></div>
    <div id="pt-sub">Loading</div>
  `;
  document.body.appendChild(label);

  const ptName   = document.getElementById('pt-name');
  const ptBar    = document.getElementById('pt-bar');
  const cols     = Array.from(overlay.querySelectorAll('.pt-col'));
  const colBars  = Array.from(overlay.querySelectorAll('.pt-col-bar'));
  const colBars2 = Array.from(overlay.querySelectorAll('.pt-col-bar2'));
  const termEl   = overlay.querySelector('.pt-term');

  let scrambleIv = null;
  let nameIdx    = 0;

  function scrambleTo(el, target, onDone) {
    clearInterval(scrambleIv);
    let iter = 0;
    const total = target.length * 6;
    scrambleIv = setInterval(() => {
      el.textContent = target.split('').map((ch, i) => {
        if (i < Math.floor(iter / 6)) return ch;
        return ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      if (iter++ >= total) {
        clearInterval(scrambleIv);
        el.textContent = target;
        if (onDone) onDone();
      }
    }, 28);
  }

  function cycleScramble() {
    nameIdx = (nameIdx + 1) % NAMES.length;
    scrambleTo(ptName, NAMES[nameIdx], () => setTimeout(cycleScramble, 350));
  }

  function randomizeBars() {
    colBars.forEach(b  => { b.style.opacity = '0'; b.style.top = (15 + Math.random() * 55) + '%'; });
    colBars2.forEach(b => { b.style.opacity = '0'; b.style.top = (35 + Math.random() * 45) + '%'; });
  }

  /* ── SHOW: backdrop + label, no columns yet ── */
  function showBackdrop(onDone) {
    // Snap backdrop on
    backdrop.style.transition = 'none';
    backdrop.style.opacity    = '1';
    backdrop.style.pointerEvents = 'all';

    // Reset cols hidden
    cols.forEach(col => {
      col.style.transition = 'none';
      col.style.transformOrigin = 'bottom';
      col.style.transform = 'scaleY(0)';
    });
    randomizeBars();

    // Reset label
    label.style.transition = 'none';
    label.style.opacity = '0';
    ptBar.style.transition = 'none';
    ptBar.style.width = '0';
    if (termEl) termEl.style.opacity = '0';

    overlay.getBoundingClientRect(); // flush

    // Show label with scramble
    label.style.transition = 'opacity 0.3s ease';
    label.style.opacity = '1';
    scrambleTo(ptName, 'Alejandro Arab', () => {
      // Start cycling after first resolve
      setTimeout(cycleScramble, 200);
    });
    ptBar.style.transition = 'width 0.8s ease';
    ptBar.style.width = '100%';

    if (onDone) onDone();
  }

  /* ── COLUMNS UP: rise over backdrop ── */
  function colsUp(onDone) {
    cols.forEach((col, i) => {
      setTimeout(() => {
        col.style.transition = `transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)`;
        col.style.transform  = 'scaleY(1)';
        setTimeout(() => {
          colBars[i].style.transition  = 'opacity 0.15s ease';
          colBars2[i].style.transition = 'opacity 0.15s ease';
          colBars[i].style.opacity     = '1';
          colBars2[i].style.opacity    = '0.4';
          if (i === 0 && termEl) termEl.style.opacity = '1';
        }, 280);
      }, i * STAGGER);
    });

    setTimeout(() => {
      if (onDone) onDone();
    }, COLS * STAGGER + 600);
  }

  /* ── COLUMNS DOWN: fall and disappear ── */
  function colsDown(onDone) {
    // Hide label as cols start falling
    label.style.transition = 'opacity 0.2s ease';
    label.style.opacity = '0';
    clearInterval(scrambleIv);
    if (termEl) termEl.style.opacity = '0';
    colBars.forEach(b  => { b.style.opacity = '0'; });
    colBars2.forEach(b => { b.style.opacity = '0'; });

    // Right to left fall
    const reversed = [...cols].reverse();
    reversed.forEach((col, i) => {
      setTimeout(() => {
        col.style.transition = `transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)`;
        col.style.transformOrigin = 'top';
        col.style.transform = 'scaleY(0)';
      }, i * STAGGER);
    });

    setTimeout(() => {
      if (onDone) onDone();
    }, COLS * STAGGER + 550);
  }

  /* ── HIDE backdrop ── */
  function hideBackdrop(onDone) {
    backdrop.style.transition = 'opacity 0.35s ease';
    backdrop.style.opacity = '0';
    setTimeout(() => {
      backdrop.style.pointerEvents = 'none';
      ptBar.style.transition = 'none';
      ptBar.style.width = '0';
      isAnimating = false;
      if (onDone) onDone();
    }, 370);
  }

  /* ── Full sequence: OUT (leaving page) ── */
  // backdrop → logo scramble → cols up → navigate
  function runOut(url) {
    showBackdrop(() => {
      // Wait for logo to scramble once then raise columns
      setTimeout(() => {
        colsUp(() => {
          window.location.href = url;
        });
      }, 700);
    });
  }

  /* ── Full sequence: IN (entering page) ── */
  // backdrop + cols already up → cols down → hide backdrop
  function runIn() {
    // Snap everything visible
    backdrop.style.transition = 'none';
    backdrop.style.opacity = '1';
    backdrop.style.pointerEvents = 'all';

    cols.forEach(col => {
      col.style.transition = 'none';
      col.style.transformOrigin = 'bottom';
      col.style.transform = 'scaleY(1)';
    });
    colBars.forEach(b  => { b.style.opacity = '1'; b.style.top = (15 + Math.random() * 55) + '%'; });
    colBars2.forEach(b => { b.style.opacity = '0.4'; b.style.top = (35 + Math.random() * 45) + '%'; });
    if (termEl) termEl.style.opacity = '1';

    label.style.transition = 'none';
    label.style.opacity = '1';
    ptName.textContent = 'Alejandro Arab';
    ptBar.style.transition = 'none';
    ptBar.style.width = '100%';

    overlay.getBoundingClientRect();

    // Hold briefly so user sees the covered state
    setTimeout(() => {
      colsDown(() => {
        hideBackdrop(() => {});
      });
    }, 400);
  }

  /* ── Navigate ── */
  window.navigateTo = function (url) {
    if (isAnimating) return;
    isAnimating = true;
    runOut(url);
  };

  /* ── Intercept links ── */
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    e.preventDefault();
    window.navigateTo(href);
  });

  /* ── On page load ── */
  window.addEventListener('load', () => {
    if (loadFired) return;
    loadFired = true;
    runIn();
  });

})();
