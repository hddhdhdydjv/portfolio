(function () {
  'use strict';

  var html = document.documentElement;

  // ── HELPERS ──────────────────────────────────────────────────
  function themeBg() {
    return html.getAttribute('data-theme') === 'dark' ? '#10100B' : '#fafafa';
  }

  // ── ENTER: fade the CSS overlay out after page renders ───────
  // The overlay (html::before via .aa-pt-enter) is already covering
  // the page — it was activated by the inline <head> script before
  // any CSS or JS loaded, so there's zero flash on entry.
  if (html.classList.contains('aa-pt-enter')) {
    // Double rAF: guarantees the browser has painted at least one
    // frame with the overlay before we start fading it out.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        html.classList.add('aa-pt-ready');
        setTimeout(function () {
          html.classList.remove('aa-pt-enter', 'aa-pt-ready');
        }, 320);
      });
    });
  }

  // ── EXIT: cover page before navigating ───────────────────────
  function navigateTo(href) {
    try { sessionStorage.setItem('aa-pt', '1'); } catch (e) {}

    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;pointer-events:all;' +
      'background:' + themeBg() + ';opacity:0;transition:opacity 160ms ease;';
    document.body.appendChild(overlay);

    // Double rAF so the transition from opacity:0 is visible
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        setTimeout(function () {
          window.location.href = href;
        }, 160);
      });
    });
  }

  // ── INTERCEPT CLICKS ─────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank') return;
    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return;
    // External links
    if (href.indexOf('http') === 0 && href.indexOf(location.hostname) === -1) return;
    e.preventDefault();
    navigateTo(href);
  });

  // ── PUBLIC: prev/next project buttons ────────────────────────
  window.navigateTo = navigateTo;

})();
