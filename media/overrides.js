/* Overrides post-hidratación para el sitio Framer.
   Framer reconstruye el DOM al cargar, así que estos cambios se aplican
   después y se re-aplican ante cambios del DOM (MutationObserver). */
(function () {
  var BEACH = '/media/beach-sunset.webp';

  function swapFooterVideo() {
    document.querySelectorAll('video').forEach(function (v) {
      var s = v.currentSrc || v.getAttribute('src') || '';
      if (s.indexOf('BImdSqnu') === -1) return; // solo el video del footer
      var img = document.createElement('img');
      img.src = BEACH;
      img.alt = 'Beach at sunset';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('data-override', 'beach');
      img.style.cssText = (v.getAttribute('style') || '')
        .replace(/object-fit:\s*fill/i, 'object-fit:cover');
      if (!/object-fit/i.test(img.style.cssText)) img.style.objectFit = 'cover';
      if (!/width/i.test(img.style.cssText)) { img.style.width = '100%'; img.style.height = '100%'; }
      v.replaceWith(img);
    });
  }

  function apply() { swapFooterVideo(); }

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  // Re-aplicar durante la ventana de hidratación de Framer.
  var obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); apply(); }, 10000);
})();
